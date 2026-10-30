
"use client";

import { useMemo, useState } from "react";
import {
  Check,
  X,
  Clock,
  Search,
  CreditCard,
  ArrowLeft,
  ShieldCheck,
  User,
  CalendarDays,
  Copy,
  AlertTriangle,
} from "lucide-react";

type PaymentStatus = "pending" | "approved" | "rejected";

type Payment = {
  id: string;
  studentName: string;
  email: string;
  stream: "natural" | "social";
  method: "cbe" | "telebirr" | "ebirr";
  transactionReference: string;
  senderName: string;
  amount: number;
  submittedAt: string;
  status: PaymentStatus;
};

const initialPayments: Payment[] = [
  {
    id: "PAY-1001",
    studentName: "Abebe Kebede",
    email: "abebe@example.com",
    stream: "natural",
    method: "cbe",
    transactionReference: "CBE123456789",
    senderName: "Abebe Kebede",
    amount: 100,
    submittedAt: "2026-10-29",
    status: "pending",
  },
  {
    id: "PAY-1002",
    studentName: "Hana Bekele",
    email: "hana@example.com",
    stream: "social",
    method: "telebirr",
    transactionReference: "TB987654321",
    senderName: "Hana Bekele",
    amount: 100,
    submittedAt: "2026-10-28",
    status: "pending",
  },
  {
    id: "PAY-1003",
    studentName: "Dawit Tadesse",
    email: "dawit@example.com",
    stream: "natural",
    method: "ebirr",
    transactionReference: "EB456789123",
    senderName: "Dawit Tadesse",
    amount: 100,
    submittedAt: "2026-10-27",
    status: "approved",
  },
  {
    id: "PAY-1004",
    studentName: "Sara Mohammed",
    email: "sara@example.com",
    stream: "social",
    method: "cbe",
    transactionReference: "CBE7654321",
    senderName: "Sara Mohammed",
    amount: 100,
    submittedAt: "2026-10-26",
    status: "rejected",
  },
];

const methodNames: Record<Payment["method"], string> = {
  cbe: "Commercial Bank of Ethiopia",
  telebirr: "Telebirr",
  ebirr: "eBirr",
};

const statusStyles: Record<PaymentStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-700",
};

export default function PaymentVerificationPage() {
  const [payments, setPayments] = useState(initialPayments);
  const [activeFilter, setActiveFilter] = useState<
    "all" | PaymentStatus
  >("all");
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] =
    useState<Payment | null>(null);
  const [pendingAction, setPendingAction] =
    useState<"approved" | "rejected" | null>(null);
  const [notice, setNotice] = useState("");

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesFilter =
        activeFilter === "all" ||
        payment.status === activeFilter;

      const searchText = search.toLowerCase();

      const matchesSearch =
        payment.studentName.toLowerCase().includes(searchText) ||
        payment.email.toLowerCase().includes(searchText) ||
        payment.transactionReference.toLowerCase().includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [payments, activeFilter, search]);

  const pendingCount = payments.filter(
    (payment) => payment.status === "pending"
  ).length;

  const approvedCount = payments.filter(
    (payment) => payment.status === "approved"
  ).length;

  const rejectedCount = payments.filter(
    (payment) => payment.status === "rejected"
  ).length;

  function openConfirmation(
    payment: Payment,
    action: "approved" | "rejected"
  ) {
    setSelectedPayment(payment);
    setPendingAction(action);
  }

  function confirmAction() {
    if (!selectedPayment || !pendingAction) return;

    setPayments((current) =>
      current.map((payment) =>
        payment.id === selectedPayment.id
          ? { ...payment, status: pendingAction }
          : payment
      )
    );

    setNotice(
      `Demo: payment ${selectedPayment.id} marked ${pendingAction}. No Firestore data was changed.`
    );

    setSelectedPayment(null);
    setPendingAction(null);
  }

  async function copyReference(reference: string) {
    try {
      await navigator.clipboard.writeText(reference);
      setNotice("Transaction reference copied.");
    } catch {
      setNotice("Could not copy the reference. Please copy it manually.");
    }
  }

  return (
    <div className="space-y-7 pb-10">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-[#6d8a64]">
            <span>Admin</span>
            <span>/</span>
            <span className="font-semibold text-[#315c35]">
              Payment Verification
            </span>
          </div>

          <h1 className="text-2xl font-bold text-[#214d32] sm:text-3xl">
            Payment Verification
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Review student payments and manage Premium access.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800">
          <AlertTriangle size={17} />
          Demo data only
        </div>
      </div>

      {/* Demo warning */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex gap-3">
          <AlertTriangle
            className="mt-0.5 shrink-0 text-amber-700"
            size={20}
          />
          <div>
            <p className="font-semibold text-amber-900">
              Development preview
            </p>
            <p className="mt-1 text-sm leading-6 text-amber-800">
              These are sample payment records. Approving or rejecting
              a payment here only changes the temporary page state.
              It does not verify a real transfer or activate a Premium
              subscription.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Pending payments"
          value={pendingCount}
          icon={<Clock size={21} />}
          color="amber"
        />
        <StatCard
          title="Approved payments"
          value={approvedCount}
          icon={<Check size={21} />}
          color="green"
        />
        <StatCard
          title="Rejected payments"
          value={rejectedCount}
          icon={<X size={21} />}
          color="red"
        />
      </div>

      {/* Search and filters */}
      <div className="rounded-2xl border border-[#e5ecdD] bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search student or transaction ID..."
              className="w-full rounded-xl border border-gray-200 bg-[#fbfcf8] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#76a92e] focus:ring-2 focus:ring-[#76a92e]/10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              ["all", "pending", "approved", "rejected"] as const
            ).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold capitalize transition ${
                  activeFilter === filter
                    ? "bg-[#4f862d] text-white shadow-sm"
                    : "bg-[#f2f6ed] text-[#55724b] hover:bg-[#e7efdf]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Payment list */}
      <div className="overflow-hidden rounded-2xl border border-[#e5ecdf] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="font-bold text-[#214d32]">
              Payment requests
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              {filteredPayments.length} records found
            </p>
          </div>
          <CreditCard className="text-[#6e9c4d]" size={22} />
        </div>

        {filteredPayments.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <CreditCard
              size={35}
              className="mx-auto mb-3 text-gray-300"
            />
            <p className="font-semibold text-gray-600">
              No payment requests found
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Try another search or filter.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="p-5 transition hover:bg-[#fcfdf9]"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  {/* Student information */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#edf5e2] text-[#4f862d]">
                        <User size={20} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold text-[#214d32]">
                          {payment.studentName}
                        </h3>
                        <p className="break-all text-sm text-gray-500">
                          {payment.email}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                          statusStyles[payment.status]
                        }`}
                      >
                        {payment.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 xl:grid-cols-3">
                      <InfoItem
                        label="Selected stream"
                        value={
                          payment.stream === "natural"
                            ? "Natural Science"
                            : "Social Science"
                        }
                      />

                      <InfoItem
                        label="Payment method"
                        value={methodNames[payment.method]}
                      />

                      <InfoItem
                        label="Amount"
                        value={`${payment.amount} ETB`}
                      />

                      <div>
                        <p className="mb-1 text-xs text-gray-400">
                          Transaction reference
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="break-all font-semibold text-gray-700">
                            {payment.transactionReference}
                          </span>
                          <button
                            onClick={() =>
                              copyReference(payment.transactionReference)
                            }
                            title="Copy reference"
                            className="shrink-0 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-[#4f862d]"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>

                      <InfoItem
                        label="Sender name"
                        value={payment.senderName}
                      />

                      <div>
                        <p className="mb-1 text-xs text-gray-400">
                          Submission date
                        </p>
                        <p className="flex items-center gap-2 font-medium text-gray-700">
                          <CalendarDays
                            size={14}
                            className="text-gray-400"
                          />
                          {payment.submittedAt}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 flex-wrap gap-2 xl:w-44 xl:flex-col">
                    {payment.status === "pending" ? (
                      <>
                        <button
                          onClick={() =>
                            openConfirmation(payment, "approved")
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#4f862d] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#3e7021] xl:w-full"
                        >
                          <Check size={17} />
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            openConfirmation(payment, "rejected")
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 xl:w-full"
                        >
                          <X size={17} />
                          Reject
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center justify-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-500">
                        <ShieldCheck size={17} />
                        Reviewed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation dialog */}
      {selectedPayment && pendingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
                pendingAction === "approved"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {pendingAction === "approved" ? (
                <Check size={24} />
              ) : (
                <X size={24} />
              )}
            </div>

            <h2 className="text-xl font-bold text-[#214d32]">
              {pendingAction === "approved"
                ? "Approve this payment?"
                : "Reject this payment?"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              You are about to mark the payment from{" "}
              <strong>{selectedPayment.studentName}</strong> as{" "}
              <strong>{pendingAction}</strong>.
            </p>

            {pendingAction === "approved" && (
              <p className="mt-3 rounded-xl bg-green-50 p-3 text-sm text-green-800">
                In the live system, approval will activate a 12-month
                Premium subscription for the{" "}
                <strong>{selectedPayment.stream}</strong> stream after
                server-side verification.
              </p>
            )}

            <p className="mt-3 text-xs text-amber-700">
              This is only a local demo action. No real payment will
              be verified or subscription activated.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setSelectedPayment(null);
                  setPendingAction(null);
                }}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={confirmAction}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold text-white ${
                  pendingAction === "approved"
                    ? "bg-[#4f862d] hover:bg-[#3e7021]"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notice */}
      {notice && (
        <div className="fixed bottom-5 right-5 z-[60] max-w-sm rounded-xl bg-[#214d32] px-5 py-4 text-sm font-medium text-white shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <span>{notice}</span>
            <button
              onClick={() => setNotice("")}
              className="shrink-0 text-white/70 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "amber" | "green" | "red";
}) {
  const colors = {
    amber: "bg-amber-50 text-amber-700",
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
  };

  return (
    <div className="rounded-2xl border border-[#e5ecdf] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className={`rounded-xl p-3 ${colors[color]}`}>
          {icon}
        </div>
      </div>
      <p className="mt-4 text-3xl font-bold text-[#214d32]">{value}</p>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="mb-1 text-xs text-gray-400">{label}</p>
      <p className="font-medium text-gray-700">{value}</p>
    </div>
  );
}
