
import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

const VALID_STREAMS = ["natural", "social"];
const VALID_METHODS = ["cbe", "telebirr", "ebirr"];

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Please sign in before submitting a payment." },
        { status: 401 }
      );
    }

    const idToken = authorization.slice(7);
    const decodedToken = await getAdminAuth().verifyIdToken(idToken);

    const body = await request.json();

    const stream =
      typeof body.stream === "string" ? body.stream : "";

    const paymentMethod =
      typeof body.paymentMethod === "string"
        ? body.paymentMethod
        : "";

    const transactionReference =
      typeof body.transactionReference === "string"
        ? body.transactionReference.trim()
        : "";

    const senderName =
      typeof body.senderName === "string"
        ? body.senderName.trim()
        : "";

    if (!VALID_STREAMS.includes(stream)) {
      return NextResponse.json(
        { error: "Please select a valid study stream." },
        { status: 400 }
      );
    }

    if (!VALID_METHODS.includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Please select a valid payment method." },
        { status: 400 }
      );
    }

    if (
      transactionReference.length < 4 ||
      transactionReference.length > 100
    ) {
      return NextResponse.json(
        { error: "Enter a valid transaction reference." },
        { status: 400 }
      );
    }

    if (senderName.length < 2 || senderName.length > 100) {
      return NextResponse.json(
        { error: "Enter the name of the person who sent the payment." },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const paymentRequests = db.collection("paymentRequests");

    // Prevent the same transaction reference from being submitted twice.
    const duplicate = await paymentRequests
      .where("transactionReference", "==", transactionReference)
      .limit(1)
      .get();

    if (!duplicate.empty) {
      return NextResponse.json(
        {
          error:
            "This transaction reference has already been submitted.",
        },
        { status: 409 }
      );
    }

    const paymentRef = await paymentRequests.add({
      uid: decodedToken.uid,
      email: decodedToken.email ?? null,
      stream,
      paymentMethod,
      transactionReference,
      senderName,
      amount: 100,
      currency: "ETB",
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      {
        success: true,
        paymentRequestId: paymentRef.id,
        message:
          "Your payment request has been submitted for admin verification.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Payment request submission error:", error);

    return NextResponse.json(
      { error: "Could not submit your payment request." },
      { status: 500 }
    );
  }
}
