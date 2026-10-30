
"use client";

import Link from "next/link";
import {
  CreditCard,
  Users,
  CheckCircle2,
  Clock3,
  ArrowUpRight,
  ShieldCheck,
  Wallet,
  GraduationCap,
} from "lucide-react";

const stats = [
  {
    title: "Pending Payments",
    value: "—",
    description: "Awaiting verification",
    icon: Clock3,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    title: "Approved Payments",
    value: "—",
    description: "Successfully verified",
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    title: "Active Premium",
    value: "—",
    description: "Current subscriptions",
    icon: Wallet,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Registered Students",
    value: "—",
    description: "Total student accounts",
    icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-3xl bg-[#214d32] p-6 text-white sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-green-100">
            <ShieldCheck size={15} />
            Maya Administration
          </div>

          <h1 className="text-2xl font-bold sm:text-3xl">
            Welcome to the Admin Dashboard
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-green-100">
            Manage student Premium subscriptions, verify payments,
            and oversee the Maya learning platform from one place.
          </p>

          <Link
            href="/admin/payments"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#76a92e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#659526]"
          >
            Review Payments
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <GraduationCap
          size={190}
          className="absolute -bottom-10 -right-5 hidden rotate-12 text-white/10 sm:block"
        />
      </section>

      {/* Statistics */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-[#214d32]">
            Platform Overview
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            A summary of Maya's subscription activity.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-[#e6edda] bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}
                  >
                    <Icon size={22} />
                  </div>

                  <span className="text-xs text-gray-400">
                    Overview
                  </span>
                </div>

                <p className="mt-5 text-sm font-medium text-gray-500">
                  {stat.title}
                </p>

                <h3 className="mt-1 text-3xl font-bold text-[#214d32]">
                  {stat.value}
                </h3>

                <p className="mt-2 text-xs text-gray-400">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main actions */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Link
          href="/admin/payments"
          className="group flex items-start gap-4 rounded-2xl border border-[#e6edda] bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#edf5e2] text-[#4f862d]">
            <CreditCard size={24} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-[#214d32]">
              Payment Verification
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Review student transaction references and verify
              manual Premium payments.
            </p>

            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#4f862d]">
              Open payment requests
              <ArrowUpRight
                size={16}
                className="transition group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </span>
          </div>
        </Link>

        <div className="flex items-start gap-4 rounded-2xl border border-[#e6edda] bg-white p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Users size={24} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-[#214d32]">
              Student Management
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              View student accounts and their Premium subscription
              information.
            </p>

            <span className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-gray-400">
              Coming soon
            </span>
          </div>
        </div>
      </section>

      {/* Notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-[#e6edda] bg-white p-4">
        <ShieldCheck
          size={20}
          className="mt-0.5 shrink-0 text-[#4f862d]"
        />
        <div>
          <p className="text-sm font-semibold text-[#214d32]">
            Administrator security
          </p>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            Payment approvals and subscription changes will be
            processed through secure server-side operations.
          </p>
        </div>
      </div>
    </div>
  );
}
