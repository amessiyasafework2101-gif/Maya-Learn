
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  BookOpen,
  Gift,
  Crown,
  CreditCard,
  Settings,
  ShieldCheck,
  Camera,
  Copy,
  Check,
  ChevronRight,
  LogOut,
  CalendarDays,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";


import { useAuthStore } from "@/stores/auth-store";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";


// const student = {
//   name: "Maya Student",
//   email: "student@example.com",
//   referralCode: "MAYA2026",
//   joined: "October 2026",
//   university: "Your University",
//   department: "Computer Science",
//   year: "1st Year",
//   avatar: "",
// };

// const paymentHistory = [
//   {
//     id: "PAY-001",
//     description: "Maya Premium",
//     date: "Not yet purchased",
//     amount: "—",
//     status: "No payment",
//   },
// ];


export default function ProfilePage() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  

    const { user } = useAuthStore();
    const router = useRouter();

    

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(student.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Could not copy the referral code. Please copy it manually.");
    }
  };

const reset = useAuthStore((state) => state.reset);

const [profile, setProfile] = useState<Record<string, unknown>>({});
const [profileLoading, setProfileLoading] = useState(true);

useEffect(() => {
  if (!user) {
    setProfileLoading(false);
    return;
  }

  const loadProfile = async () => {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setProfile(userSnap.data());
      }
    } catch (error) {
      console.error("Could not load student profile:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  loadProfile();
}, [user]);

const student = {
  name:
    user?.displayName ||
    profile.fullName as string ||
    profile.name as string ||
    "Maya Student",

  email: user?.email || "No email available",

  photo: user?.photoURL || "",

  university:
    (profile.university as string) || "Not added yet",

  department:
    (profile.department as string) || "Not added yet",

  year:
    (profile.year as string) ||
    (profile.studyYear as string) ||
    "Not added yet",

  referralCode:
    (profile.referralCode as string) ||
    (profile.referral_code as string) ||
    "Not available",

  joined: user?.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString()
    : "Recently",
};

  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-10">
      {/* Page heading */}
      <div>
        <p className="text-sm font-medium text-[#6c963f]">Your account</p>
        <h1 className="mt-1 text-2xl font-bold text-[#214d32] sm:text-3xl">
          My Profile
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage your personal information, membership, and account settings.
        </p>
      </div>

      {/* Profile overview */}
      <section className="overflow-hidden rounded-3xl border border-[#e5eddc] bg-white shadow-sm">
        <div className="h-28 bg-gradient-to-r from-[#dcebc8] via-[#edf5e2] to-[#d5e9b9] sm:h-36" />

        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-[#edf5e2] text-[#4f862d] shadow-sm sm:h-28 sm:w-28">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-[#edf5e2] text-[#4f862d] shadow-sm sm:h-28 sm:w-28">
                    {student.photo ? (
                        <img
                        src={student.photo}
                        alt="Profile picture"
                        className="h-full w-full object-cover"
                        />
                    ) : (
                        <User size={45} />
                    )}
                </div>
              </div>

              <div className="pb-1">
                <h2 className="text-xl font-bold text-[#214d32]">
                  {student.name}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {student.department} · {student.year}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("settings")}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#dce8d2] px-4 py-2.5 text-sm font-semibold text-[#4f862d] transition hover:bg-[#f4f8ef]"
            >
              <Settings size={16} />
              Edit profile
            </button>
          </div>

          <div className="mt-7 grid gap-4 border-t border-[#edf1e9] pt-6 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#edf5e2] p-2.5 text-[#4f862d]">
                <Mail size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400">Email address</p>
                <p className="truncate text-sm font-medium text-gray-700">
                  {student.email}
                </p>
              </div>
            </div>

           
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#edf5e2] p-2.5 text-[#4f862d]">
                <CalendarDays size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Member since</p>
                <p className="text-sm font-medium text-gray-700">
                  {student.joined}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Referral card */}
      <section className="flex flex-col justify-between gap-5 rounded-3xl bg-[#214d32] p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <div>
          <div className="flex items-center gap-2 text-[#d5edb9]">
            <Gift size={20} />
            <span className="text-sm font-semibold">Invite your friends</span>
          </div>
          <h2 className="mt-3 text-xl font-bold sm:text-2xl">
            Share Maya with your classmates
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-6 text-white/70">
            Invite friends to join Maya using your referral code. Referral
            rewards can be added when the referral program is configured.
          </p>
        </div>

        <div className="min-w-0 rounded-2xl bg-white/10 p-4 sm:min-w-64">
          <p className="text-xs text-white/60">Your referral code</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-xl font-bold tracking-widest">
              {student.referralCode}
            </span>
            <button
              onClick={copyReferralCode}
              className="rounded-lg bg-white/15 p-2 transition hover:bg-white/25"
              aria-label="Copy referral code"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
          <p className="mt-2 text-xs text-white/50">
            {copied ? "Copied!" : "Share this code with your friends"}
          </p>
        </div>
      </section>

      {/* Membership */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-[#214d32]">
            Membership
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Choose the learning experience that works for you.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Free plan */}
          <div className="rounded-3xl border border-[#e5eddc] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Current plan
                </p>
                <h3 className="mt-1 text-2xl font-bold text-[#214d32]">
                  Free
                </h3>
              </div>
              <div className="rounded-2xl bg-[#edf5e2] p-3 text-[#4f862d]">
                <ShieldCheck size={25} />
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-500">
              Your current Maya learning plan.
            </p>

            <div className="my-5 border-t border-[#edf1e9]" />

            <ul className="space-y-3 text-sm text-gray-600">
              {[
                "Access to your study dashboard",
                "Course browsing",
                "Basic weekly practice",
                "Limited AI study assistance",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-[#6c963f]" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-xl bg-[#f4f8ef] px-4 py-3 text-sm font-semibold text-[#4f862d]">
              You are currently on this plan
            </div>
          </div>

          {/* Premium plan */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-[#76a92e] bg-gradient-to-br from-[#f7faef] to-[#e8f3d9] p-6 shadow-sm">
            <div className="absolute right-0 top-0 rounded-bl-2xl bg-[#76a92e] px-4 py-2 text-xs font-bold text-white">
              PREMIUM
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#76a92e] p-3 text-white">
                <Crown size={25} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#6c963f]">
                  Upgrade your learning
                </p>
                <h3 className="text-2xl font-bold text-[#214d32]">
                  Maya Premium
                </h3>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-600">
              Get more tools to help you study smarter and prepare for exams.
            </p>

            <div className="my-5 border-t border-[#dce8d2]" />

            <ul className="space-y-3 text-sm text-gray-700">
              {[
                "More AI study assistance",
                "Detailed practice explanations",
                "Personalized study recommendations",
                "Advanced progress insights",
                "Premium learning resources",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Sparkles size={17} className="text-[#6c963f]" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href="/premium"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#4f862d] px-5 py-3 font-semibold text-white transition hover:bg-[#3d6d22]"
            >
              <Crown size={18} />
              Upgrade to Premium
              <ChevronRight size={17} />
            </Link>

          </div>
        </div>
      </section>

    

      {/* Account actions */}
      <section className="rounded-3xl border border-[#f0dfdc] bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-bold text-[#214d32]">Account actions</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your Maya account.
        </p>

        <button
          onClick={() => {
            // Use the existing sign-out action in your sidebar.
            window.location.href = "/login";
          }}
          className="mt-5 flex w-full items-center justify-between rounded-xl border border-red-100 px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          <span className="flex items-center gap-2">
            <LogOut size={18} />
            Sign out
          </span>
          <ChevronRight size={17} />
        </button>
      </section>
    </div>
  );
}
