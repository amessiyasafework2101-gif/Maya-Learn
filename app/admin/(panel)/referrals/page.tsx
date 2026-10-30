
"use client";

import { useMemo, useState } from "react";
import {
  Users,
  Gift,
  Trophy,
  Bell,
  Search,
  Copy,
  Check,
  X,
  ArrowUpRight,
} from "lucide-react";

type Referrer = {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  totalSignups: number;
  premiumReferrals: number;
  reachedMilestone: boolean;
};

const demoReferrers: Referrer[] = [
  {
    id: "REF-001",
    name: "Abebe Kebede",
    email: "abebe@example.com",
    referralCode: "ABEBE2026",
    totalSignups: 42,
    premiumReferrals: 30,
    reachedMilestone: true,
  },
  {
    id: "REF-002",
    name: "Hana Bekele",
    email: "hana@example.com",
    referralCode: "HANA2026",
    totalSignups: 25,
    premiumReferrals: 18,
    reachedMilestone: false,
  },
  {
    id: "REF-003",
    name: "Dawit Tadesse",
    email: "dawit@example.com",
    referralCode: "DAWIT2026",
    totalSignups: 13,
    premiumReferrals: 7,
    reachedMilestone: false,
  },
  {
    id: "REF-004",
    name: "Sara Mohammed",
    email: "sara@example.com",
    referralCode: "SARA2026",
    totalSignups: 9,
    premiumReferrals: 3,
    reachedMilestone: false,
  },
];

export default function ReferralTrackingPage() {
  const [referrers] = useState(demoReferrers);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

  const totalPremiumReferrals = referrers.reduce(
    (total, user) => total + user.premiumReferrals,
    0
  );

  const milestoneUsers = referrers.filter(
    (user) => user.reachedMilestone
  );

  const filteredReferrers = useMemo(() => {
    const query = search.toLowerCase();

    return referrers
      .filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.referralCode.toLowerCase().includes(query)
      )
      .sort((a, b) => b.premiumReferrals - a.premiumReferrals);
  }, [referrers, search]);

  async function copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setNotice("Referral code copied.");
    } catch {
      setNotice("Could not copy the code. Please copy it manually.");
    }
  }

  return (
    <div className="space-y-7 pb-10">
      {/* Heading */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-[#6d8a64]">
          <span>Admin</span>
          <span>/</span>
          <span className="font-semibold text-[#315c35]">
            Referral Tracking
          </span>
        </div>

        <h1 className="text-2xl font-bold text-[#214d32] sm:text-3xl">
          Referral Tracking
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Track students who bring new verified Premium members to Maya.
        </p>
      </div>

      {/* Demo notice */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        <strong>Development preview:</strong> These are sample records.
        Live referral counts and notifications will be connected to
        Firestore through the secure payment approval API.
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          title="Verified Premium referrals"
          value={totalPremiumReferrals}
          icon={<Users size={21} />}
          description="Across all referrers"
        />

        <SummaryCard
          title="Milestones reached"
          value={milestoneUsers.length}
          icon={<Trophy size={21} />}
          description="Referrers with 30 or more"
        />

        <SummaryCard
          title="Referral target"
          value="30"
          icon={<Gift size={21} />}
          description="Verified Premium users per referrer"
        />
      </div>

      {/* Milestone notifications */}
      <section className="rounded-2xl border border-[#e5ecdf] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
            <Bell size={21} />
          </div>

          <div>
            <h2 className="font-bold text-[#214d32]">
              Referral milestone notifications
            </h2>
            <p className="text-sm text-gray-500">
              Referrers who have reached the 30 Premium referral target.
            </p>
          </div>
        </div>

        {milestoneUsers.length === 0 ? (
          <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
            No referral milestones have been reached yet.
          </p>
        ) : (
          <div className="space-y-3">
            {milestoneUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col gap-3 rounded-xl border border-amber-100 bg-amber-50/60 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-bold text-[#214d32]">
                    {user.name} reached the referral target!
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Code: {user.referralCode} ·{" "}
                    {user.premiumReferrals} verified Premium referrals
                  </p>
                </div>

                <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                  Milestone reached
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Search */}
      <section className="overflow-hidden rounded-2xl border border-[#e5ecdf] bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-[#214d32]">
                Student referral performance
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Ranked by verified Premium referrals.
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name or referral code..."
                className="w-full rounded-xl border border-gray-200 bg-[#fbfcf8] py-3 pl-10 pr-3 text-sm outline-none focus:border-[#76a92e]"
              />
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredReferrers.map((user, index) => {
            const progress = Math.min(
              (user.premiumReferrals / 30) * 100,
              100
            );

            return (
              <div key={user.id} className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf5e2] font-bold text-[#4f862d]">
                      {index + 1}
                    </div>

                    <div className="min-w-0">
                      <p className="font-bold text-[#214d32]">
                        {user.name}
                      </p>
                      <p className="break-all text-sm text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-5">
                    <div>
                      <p className="text-xs text-gray-400">
                        Referral signups
                      </p>
                      <p className="mt-1 font-bold text-gray-700">
                        {user.totalSignups}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Premium referrals
                      </p>
                      <p className="mt-1 text-lg font-bold text-[#4f862d]">
                        {user.premiumReferrals}
                        <span className="text-sm font-medium text-gray-400">
                          {" "}/ 30
                        </span>
                      </p>
                    </div>

                    <button
                      onClick={() => copyCode(user.referralCode)}
                      className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                    >
                      <Copy size={14} />
                      {user.referralCode}
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="font-medium text-gray-500">
                      Progress to 30 Premium referrals
                    </span>
                    <span className="font-bold text-[#4f862d]">
                      {Math.round(progress)}%
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-[#edf2e8]">
                    <div
                      className="h-full rounded-full bg-[#76a92e] transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    {Math.max(30 - user.premiumReferrals, 0)} more verified
                    Premium referrals to reach the target.
                  </p>
                </div>
              </div>
            );
          })}

          {filteredReferrers.length === 0 && (
            <div className="p-12 text-center text-sm text-gray-500">
              No matching referrers found.
            </div>
          )}
        </div>
      </section>

      {/* Information */}
      <div className="flex gap-3 rounded-2xl border border-[#e5ecdf] bg-[#f5f9ef] p-4">
        <ArrowUpRight
          size={20}
          className="mt-0.5 shrink-0 text-[#4f862d]"
        />
        <div>
          <p className="font-semibold text-[#315c35]">
            How referral counting works
          </p>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            A referral is counted only after the referred student's
            payment is approved by an admin. Signup-only referrals do
            not count toward the 30 Premium referral target.
          </p>
        </div>
      </div>

      {notice && (
        <div className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-xl bg-[#214d32] px-5 py-4 text-sm text-white shadow-xl">
          <Check size={17} />
          <span>{notice}</span>
          <button onClick={() => setNotice("")}>
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e5ecdf] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="rounded-xl bg-[#edf5e2] p-3 text-[#4f862d]">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-3xl font-bold text-[#214d32]">{value}</p>
      <p className="mt-1 text-xs text-gray-400">{description}</p>
    </div>
  );
}
