
"use client";

import { auth, db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { useState } from "react";
import {
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Crown,
  GraduationCap,
  ShieldCheck,
  Clock,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

type Stream = "natural" | "social";
type PaymentMethod = "cbe" | "telebirr" | "ebirr";

const paymentMethods = [
  {
    id: "cbe" as const,
    name: "Commercial Bank of Ethiopia",
    shortName: "CBE",
    accountName: "Biruk Alem",
    accountNumber: "1000122554761",
  },
  {
    id: "telebirr" as const,
    name: "Telebirr",
    shortName: "Telebirr",
    accountName: "Biruk Alem",
    accountNumber: "0910000000",
  },
  {
    id: "ebirr" as const,
    name: "eBirr",
    shortName: "eBirr",
    accountName: "Biruk Alem",
    accountNumber: "0910000000",
  },
];

export default function PremiumPage() {
  const [stream, setStream] = useState<Stream | "">("");
  const [method, setMethod] = useState<PaymentMethod>("cbe");
  const [transactionReference, setTransactionReference] = useState("");
  const [senderName, setSenderName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const selectedMethod = paymentMethods.find(
    (item) => item.id === method
  )!;

  async function copyAccountNumber() {
    try {
      await navigator.clipboard.writeText(
        selectedMethod.accountNumber
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Could not copy the account number. Please copy it manually.");
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
    ) {
    event.preventDefault();
    setError("");

    if (!auth.currentUser) {
        setError("Please sign in again before submitting.");
        return;
    }

    if (!stream) {
        setError("Please select your study stream.");
        return;
    }

    if (transactionReference.trim().length < 4) {
        setError("Please enter a valid transaction reference.");
        return;
    }

    if (senderName.trim().length < 2) {
        setError("Please enter the sender's name.");
        return;
    }

    try {
        const paymentDoc = await addDoc(
        collection(db, "paymentRequests"),
        {
            uid: auth.currentUser.uid,
            email: auth.currentUser.email ?? "",
            stream,
            paymentMethod: method,
            transactionReference: transactionReference.trim(),
            senderName: senderName.trim(),
            amount: 100,
            currency: "ETB",
            status: "pending",
            createdAt: serverTimestamp(),
        }
        );

        setRequestId(paymentDoc.id);
        setSubmitted(true);
    } catch (error) {
        console.error("Payment submission failed:", error);

        setError(
        error instanceof Error
            ? error.message
            : "Could not submit your payment request. Please try again."
        );
    }
    }

  function resetForm() {
    setSubmitted(false);
    setStream("");
    setMethod("cbe");
    setTransactionReference("");
    setSenderName("");
    setRequestId("");
    setError("");
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 pb-12">
        <div className="rounded-3xl border border-[#e5ecdf] bg-white p-7 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <Clock size={38} />
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-wider text-amber-700">
            Demo submission
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#214d32] sm:text-3xl">
            Payment request submitted!
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
            Your demo request is marked as pending. In the live version,
            an admin will verify your transaction before Premium access
            is activated.
          </p>

          <div className="mt-7 rounded-2xl bg-[#f7faef] p-5 text-left">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-500">
                Request reference
              </span>
              <span className="font-bold text-[#214d32]">
                {requestId}
              </span>
            </div>

            <div className="my-4 h-px bg-[#e5ecdf]" />

            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-500">Plan</span>
              <span className="font-semibold text-[#214d32]">
                Premium · 12 months
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-sm text-gray-500">Stream</span>
              <span className="font-semibold capitalize text-[#214d32]">
                {stream} Science
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-sm text-gray-500">Payment method</span>
              <span className="font-semibold text-[#214d32]">
                {selectedMethod.shortName}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-sm text-gray-500">Amount</span>
              <span className="font-bold text-[#214d32]">
                100 ETB
              </span>
            </div>

            <div className="mt-4 border-t border-[#e5ecdf] pt-4">
              <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800">
                Pending verification · Demo
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-left">
            <AlertCircle
              size={19}
              className="mt-0.5 shrink-0 text-amber-700"
            />
            <p className="text-xs leading-5 text-amber-800">
              This is a development-only submission. No real payment
              request was saved, and your Premium subscription has not
              been activated.
            </p>
          </div>

          <button
            onClick={resetForm}
            className="mt-7 w-full rounded-xl bg-[#4f862d] px-5 py-3.5 font-bold text-white transition hover:bg-[#3e7021]"
          >
            Back to Premium page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-7 pb-12">
      {/* Heading */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-[#6d8a64]">
          <span>Student</span>
          <span>/</span>
          <span className="font-semibold text-[#315c35]">
            Premium
          </span>
        </div>

        <h1 className="text-2xl font-bold text-[#214d32] sm:text-3xl">
          Upgrade to Premium
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Unlock the courses and learning resources for your selected stream.
        </p>
      </div>

      {/* Development notice */}
      <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <AlertCircle
          size={20}
          className="mt-0.5 shrink-0 text-amber-700"
        />
        <div>
          <p className="font-bold text-amber-900">
            Development preview
          </p>
          <p className="mt-1 text-sm leading-6 text-amber-800">
            You can test the Premium request form, but submissions are
            temporary demo records. Do not send money for this test.
          </p>
        </div>
      </div>

      {/* Premium plan */}
      <section className="overflow-hidden rounded-3xl border border-[#dce9cf] bg-white shadow-sm">
        <div className="relative overflow-hidden bg-[#214d32] p-6 text-white sm:p-8">
          <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full border-[30px] border-white/5" />
          <div className="absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-white/5" />

          <div className="relative">
            <div className="flex items-center gap-2 text-[#d6efb9]">
              <Crown size={21} />
              <span className="text-sm font-bold uppercase tracking-wider">
                Maya Premium
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-end gap-2">
              <h2 className="text-4xl font-extrabold sm:text-5xl">
                100 ETB
              </h2>
              <span className="pb-1 text-sm text-white/70">
                / 12 months
              </span>
            </div>

            <p className="mt-3 max-w-lg text-sm leading-6 text-white/75">
              One yearly payment gives you Premium access to the
              Natural or Social Science stream you choose.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
              <span className="rounded-full bg-white/10 px-3 py-2">
                <Check size={13} className="mr-1 inline" />
                12-month access
              </span>
              <span className="rounded-full bg-white/10 px-3 py-2">
                <Check size={13} className="mr-1 inline" />
                One selected stream
              </span>
              <span className="rounded-full bg-white/10 px-3 py-2">
                <Check size={13} className="mr-1 inline" />
                Admin-verified payment
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
          <Feature
            icon={<GraduationCap size={20} />}
            title="Stream-specific courses"
            description="Access learning materials for your selected stream."
          />
          <Feature
            icon={<ShieldCheck size={20} />}
            title="Verified access"
            description="Your Premium access begins after admin approval."
          />
          <Feature
            icon={<Clock size={20} />}
            title="One full year"
            description="Your subscription lasts 12 months from approval."
          />
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Stream selection */}
        <section className="rounded-2xl border border-[#e5ecdf] bg-white p-5 shadow-sm sm:p-7">
          <SectionHeading
            number="01"
            title="Choose your study stream"
            description="Select one stream. Your Premium course access will be limited to this stream."
          />

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <StreamCard
              selected={stream === "natural"}
              onClick={() => setStream("natural")}
              title="Natural Science"
              description="For students following the Natural Science stream."
              icon={<GraduationCap size={25} />}
            />

            <StreamCard
              selected={stream === "social"}
              onClick={() => setStream("social")}
              title="Social Science"
              description="For students following the Social Science stream."
              icon={<UsersIcon />}
            />
          </div>
        </section>

        {/* Payment method */}
        <section className="rounded-2xl border border-[#e5ecdf] bg-white p-5 shadow-sm sm:p-7">
          <SectionHeading
            number="02"
            title="Choose your payment method"
            description="Select where you will send the 100 ETB payment."
          />

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {paymentMethods.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMethod(item.id)}
                className={`rounded-xl border p-4 text-left transition ${
                  method === item.id
                    ? "border-[#4f862d] bg-[#f3f8ec] ring-2 ring-[#4f862d]/10"
                    : "border-gray-200 hover:border-[#a7c48e]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#214d32]">
                    {item.shortName}
                  </span>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      method === item.id
                        ? "border-[#4f862d] bg-[#4f862d] text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {method === item.id && <Check size={13} />}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-gray-500">
                  {item.name}
                </p>
              </button>
            ))}
          </div>

          {/* Account details */}
          <div className="mt-5 rounded-2xl bg-[#f7faef] p-5">
            <div className="flex items-center gap-2 text-[#315c35]">
              <CreditCard size={19} />
              <h3 className="font-bold">Payment account details</h3>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm text-gray-500">
                  Payment provider
                </span>
                <span className="text-right text-sm font-bold text-[#214d32]">
                  {selectedMethod.name}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm text-gray-500">
                  Account name
                </span>
                <span className="text-sm font-bold text-[#214d32]">
                  {selectedMethod.accountName}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-gray-500">
                  Account number
                </span>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-[#214d32]">
                    {selectedMethod.accountNumber}
                  </span>

                  <button
                    type="button"
                    onClick={copyAccountNumber}
                    className="rounded-lg border border-[#dce9cf] bg-white p-2 text-[#4f862d] hover:bg-[#edf5e2]"
                    title="Copy account number"
                  >
                    {copied ? (
                      <Check size={15} />
                    ) : (
                      <Copy size={15} />
                    )}
                  </button>
                </div>
              </div>

              <div className="border-t border-[#e5ecdf] pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#315c35]">
                    Amount to send
                  </span>
                  <span className="text-lg font-extrabold text-[#214d32]">
                    100 ETB
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-gray-500">
            In the live system, confirm the recipient and account
            information before sending money. This development page is
            for interface testing only.
          </p>
        </section>

        {/* Transaction information */}
        <section className="rounded-2xl border border-[#e5ecdf] bg-white p-5 shadow-sm sm:p-7">
          <SectionHeading
            number="03"
            title="Enter your transaction information"
            description="After making a payment in the live system, you will provide these details for verification."
          />

          <div className="mt-5 space-y-5">
            <div>
              <label
                htmlFor="senderName"
                className="mb-2 block text-sm font-semibold text-[#315c35]"
              >
                Sender's full name
              </label>
              <input
                id="senderName"
                value={senderName}
                onChange={(event) => setSenderName(event.target.value)}
                placeholder="Name used to send the payment"
                maxLength={100}
                className="w-full rounded-xl border border-gray-200 bg-[#fbfcf8] px-4 py-3 text-sm outline-none transition focus:border-[#76a92e] focus:ring-2 focus:ring-[#76a92e]/10"
              />
            </div>

            <div>
              <label
                htmlFor="transactionReference"
                className="mb-2 block text-sm font-semibold text-[#315c35]"
              >
                Transaction reference / ID
              </label>
              <input
                id="transactionReference"
                value={transactionReference}
                onChange={(event) =>
                  setTransactionReference(event.target.value)
                }
                placeholder="Enter your transaction reference"
                maxLength={100}
                className="w-full rounded-xl border border-gray-200 bg-[#fbfcf8] px-4 py-3 text-sm outline-none transition focus:border-[#76a92e] focus:ring-2 focus:ring-[#76a92e]/10"
              />
              <p className="mt-2 text-xs text-gray-400">
                Enter the transaction ID shown by your payment provider.
              </p>
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="rounded-2xl border border-[#dce9cf] bg-[#f7faef] p-5 sm:p-7">
          <h3 className="font-bold text-[#214d32]">Your order summary</h3>

          <div className="mt-4 space-y-3 text-sm">
            <SummaryRow
              label="Premium duration"
              value="12 months"
            />
            <SummaryRow
              label="Selected stream"
              value={
                stream
                  ? stream === "natural"
                    ? "Natural Science"
                    : "Social Science"
                  : "Not selected"
              }
            />
            <SummaryRow
              label="Payment method"
              value={selectedMethod.shortName}
            />
            <div className="border-t border-[#dce9cf] pt-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#214d32]">
                  Total
                </span>
                <span className="text-xl font-extrabold text-[#214d32]">
                  100 ETB
                </span>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4f862d] px-5 py-4 font-bold text-white shadow-sm transition hover:bg-[#3e7021]"
        >
          Submit demo payment request
          <ArrowRight size={18} />
        </button>

        <p className="text-center text-xs leading-5 text-gray-400">
          Development preview only. No payment is processed and no
          subscription is activated.
        </p>
      </form>
    </div>
  );
}

function SectionHeading({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#edf5e2] text-sm font-extrabold text-[#4f862d]">
        {number}
      </div>
      <div>
        <h2 className="font-bold text-[#214d32]">{title}</h2>
        <p className="mt-1 text-sm leading-5 text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function StreamCard({
  selected,
  onClick,
  title,
  description,
  icon,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-5 text-left transition ${
        selected
          ? "border-[#4f862d] bg-[#f3f8ec] ring-2 ring-[#4f862d]/10"
          : "border-gray-200 hover:border-[#a7c48e]"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-[#edf5e2] p-3 text-[#4f862d]">
          {icon}
        </div>

        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full border ${
            selected
              ? "border-[#4f862d] bg-[#4f862d] text-white"
              : "border-gray-300"
          }`}
        >
          {selected && <Check size={14} />}
        </div>
      </div>

      <h3 className="mt-4 font-bold text-[#214d32]">{title}</h3>
      <p className="mt-2 text-xs leading-5 text-gray-500">
        {description}
      </p>
    </button>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="h-fit rounded-xl bg-[#edf5e2] p-3 text-[#4f862d]">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-bold text-[#214d32]">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-semibold text-[#315c35]">
        {value}
      </span>
    </div>
  );
}

function UsersIcon() {
  return <GraduationCap size={25} />;
}
