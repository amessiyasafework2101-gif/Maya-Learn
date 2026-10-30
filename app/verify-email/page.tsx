
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  reload,
  sendEmailVerification,
} from "firebase/auth";

import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  LoaderCircle,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/stores/auth-store";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const email = user?.email || searchParams.get("email") || "";

  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  async function checkVerification() {
    setError("");
    setSuccess("");

    const currentUser = auth.currentUser;

    if (!currentUser) {
      router.replace("/login");
      return;
    }

    setChecking(true);

    try {
      await reload(currentUser);

      // Read the refreshed Firebase user.
      const refreshedUser = auth.currentUser;

      if (refreshedUser?.emailVerified) {
        setUser(refreshedUser);

        setSuccess("Your email has been verified!");

        router.replace("/dashboard");
        return;
      }

      setError(
        "We haven't received your verification yet. Please check your inbox and try again."
      );
    } catch (err) {
      console.error("Verification check failed:", err);
      setError("Unable to check verification. Please try again.");
    } finally {
      setChecking(false);
    }
  }

  async function resendVerification() {
    setError("");
    setSuccess("");

    const currentUser = auth.currentUser;

    if (!currentUser) {
      router.replace("/login");
      return;
    }

    if (cooldown > 0) return;

    setResending(true);

    try {
      await sendEmailVerification(currentUser);

      setSuccess("A new verification email has been sent!");

      setCooldown(60);

      const interval = setInterval(() => {
        setCooldown((previous) => {
          if (previous <= 1) {
            clearInterval(interval);
            return 0;
          }

          return previous - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Resend verification failed:", err);

      setError(
        "Unable to send verification email. Please try again later."
      );
    } finally {
      setResending(false);
    }
  }

  async function handleSignOut() {
    await auth.signOut();
    router.replace("/login");
  }

  return (
    <main className="min-h-screen bg-[#f7faef] flex items-center justify-center p-5">

      <section className="w-full max-w-md bg-white border border-[#e5edd9] rounded-3xl shadow-xl shadow-green-900/5 p-7 sm:p-10">

        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 bg-[#4f862d] rounded-2xl flex items-center justify-center text-white">
            <ShieldCheck size={27} />
          </div>

          <span className="text-2xl font-black text-[#214d32] ml-3">
            Maya<span className="text-[#76a92e]">.</span>
          </span>
        </div>

        {/* Email illustration */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-[#eef6df] rounded-full flex items-center justify-center relative">
            <Mail size={43} className="text-[#63983b]" />

            <div className="absolute -right-1 -bottom-1 w-9 h-9 bg-[#d7ebaa] rounded-full flex items-center justify-center">
              <CheckCircle2 size={21} className="text-[#4f862d]" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-7">
          <span className="text-sm font-bold text-[#76a92e]">
            ONE LAST STEP
          </span>

          <h1 className="text-3xl font-black text-[#214d32] mt-2">
            Verify your email
          </h1>

          <p className="text-[#829080] mt-3 leading-relaxed">
            We've sent a verification link to your email address.
            Verify your account to start your learning journey with Maya.
          </p>
        </div>

        {/* Email address */}
        <div className="bg-[#f5f8ef] border border-[#e4ecd8] rounded-2xl p-4 flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <Mail size={19} className="text-[#67943e]" />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-[#879282]">
              Verification email sent to
            </p>

            <p className="text-sm font-bold text-[#315a39] break-all">
              {email}
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4 mb-7">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#eef5df] text-[#63983b] flex items-center justify-center shrink-0 font-bold">
              1
            </div>

            <p className="text-sm text-[#718071] pt-1">
              Open your email inbox.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#eef5df] text-[#63983b] flex items-center justify-center shrink-0 font-bold">
              2
            </div>

            <p className="text-sm text-[#718071] pt-1">
              Find the verification email from Maya.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#eef5df] text-[#63983b] flex items-center justify-center shrink-0 font-bold">
              3
            </div>

            <p className="text-sm text-[#718071] pt-1">
              Click the verification link and return here.
            </p>
          </div>
        </div>

        {/* Messages */}
        {success && (
          <div className="bg-green-50 text-green-700 border border-green-200 rounded-xl p-3 text-sm mb-4 flex gap-2">
            <CheckCircle2 size={18} />
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-3 text-sm mb-4">
            {error}
          </div>
        )}

        {/* Check verification */}
        <button
          onClick={checkVerification}
          disabled={checking}
          className="btn w-full bg-[#4f862d] hover:bg-[#3c7020] text-white border-0 rounded-xl h-13"
        >
          {checking ? (
            <LoaderCircle className="animate-spin" size={19} />
          ) : (
            <>
              <CheckCircle2 size={19} />
              I've verified my email
            </>
          )}
        </button>

        {/* Resend email */}
        <button
          onClick={resendVerification}
          disabled={resending || cooldown > 0}
          className="btn btn-ghost w-full text-[#5b853d] mt-3 rounded-xl"
        >
          {resending ? (
            <LoaderCircle className="animate-spin" size={18} />
          ) : (
            <RefreshCw size={17} />
          )}

          {cooldown > 0
            ? `Resend email in ${cooldown}s`
            : "Resend verification email"}
        </button>

        <div className="border-t border-[#edf0e8] mt-6 pt-5 text-center">
          <button
            onClick={handleSignOut}
            className="text-sm text-[#879282] hover:text-[#4f862d] flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft size={16} />
            Sign in with another account
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-[#9aa594]">
          <Clock size={14} />
          Don't forget to check your spam folder.
        </div>

      </section>
    </main>
  );
}
