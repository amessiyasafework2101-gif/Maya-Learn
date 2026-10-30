
import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

type ReviewStatus = "approved" | "rejected";

function addMonths(date: Date, months: number) {
  const result = new Date(date);
  const originalDay = result.getUTCDate();

  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);

  const lastDay = new Date(
    Date.UTC(
      result.getUTCFullYear(),
      result.getUTCMonth() + 1,
      0
    )
  ).getUTCDate();

  result.setUTCDate(Math.min(originalDay, lastDay));

  return result;
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate the caller.
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const idToken = authorization.slice(7);
    const adminAuth = getAdminAuth();
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Only users with the admin custom claim can review payments.
    if (decodedToken.admin !== true) {
      return NextResponse.json(
        { error: "You are not authorized to review payments." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const status = body.status as ReviewStatus;

    if (status !== "approved" && status !== "rejected") {
      return NextResponse.json(
        { error: "Status must be approved or rejected." },
        { status: 400 }
      );
    }

    const { id } = await context.params;

    if (!id || id.length > 150) {
      return NextResponse.json(
        { error: "Invalid payment request ID." },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const paymentRef = db.collection("paymentRequests").doc(id);

    const result = await db.runTransaction(async (transaction) => {
      const paymentSnapshot = await transaction.get(paymentRef);

      if (!paymentSnapshot.exists) {
        throw new Error("PAYMENT_NOT_FOUND");
      }

      const payment = paymentSnapshot.data()!;

      if (payment.status !== "pending") {
        throw new Error("PAYMENT_ALREADY_REVIEWED");
      }

      if (
        typeof payment.uid !== "string" ||
        !["natural", "social"].includes(payment.stream) ||
        !["cbe", "telebirr", "ebirr"].includes(payment.paymentMethod) ||
        payment.amount !== 100 ||
        payment.currency !== "ETB"
      ) {
        throw new Error("INVALID_PAYMENT_DATA");
      }

      const now = new Date();
      const reviewedAt = Timestamp.fromDate(now);

      if (status === "rejected") {
        transaction.update(paymentRef, {
          status: "rejected",
          reviewedAt,
          reviewedBy: decodedToken.uid,
        });

        return { status: "rejected" as const };
      }

      const subscriptionRef = db
        .collection("subscriptions")
        .doc(payment.uid);

      const subscriptionSnapshot = await transaction.get(
        subscriptionRef
      );

      // Do not silently overwrite an existing active subscription.
      if (subscriptionSnapshot.exists) {
        const existing = subscriptionSnapshot.data()!;
        const existingExpiry = existing.expiresAt?.toDate?.();

        if (
          existing.status === "active" &&
          existingExpiry &&
          existingExpiry.getTime() > now.getTime()
        ) {
          throw new Error("ACTIVE_SUBSCRIPTION_EXISTS");
        }
      }

      const expiresAt = addMonths(now, 12);

      transaction.update(paymentRef, {
        status: "approved",
        reviewedAt,
        reviewedBy: decodedToken.uid,
      });

      transaction.set(subscriptionRef, {
        uid: payment.uid,
        plan: "premium",
        status: "active",
        stream: payment.stream,
        amount: 100,
        currency: "ETB",
        paymentRequestId: id,
        paymentMethod: payment.paymentMethod,
        startedAt: reviewedAt,
        expiresAt: Timestamp.fromDate(expiresAt),
        updatedAt: reviewedAt,
      });

      return {
        status: "approved" as const,
        stream: payment.stream,
        expiresAt: expiresAt.toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      message:
        result.status === "approved"
          ? "Payment approved and Premium activated."
          : "Payment rejected.",
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "UNKNOWN_ERROR";

    const knownErrors: Record<string, { status: number; message: string }> = {
      PAYMENT_NOT_FOUND: {
        status: 404,
        message: "Payment request not found.",
      },
      PAYMENT_ALREADY_REVIEWED: {
        status: 409,
        message: "This payment has already been reviewed.",
      },
      INVALID_PAYMENT_DATA: {
        status: 400,
        message: "Payment request data is invalid.",
      },
      ACTIVE_SUBSCRIPTION_EXISTS: {
        status: 409,
        message:
          "This student already has an active Premium subscription.",
      },
    };

    if (knownErrors[message]) {
      const known = knownErrors[message];

      return NextResponse.json(
        { error: known.message },
        { status: known.status }
      );
    }

    console.error("Payment review error:", error);

    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
