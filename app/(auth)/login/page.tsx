
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  reload,
} from "firebase/auth";

import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { auth } from "@/lib/firebase";
import { createUserProfile } from "@/lib/referral";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputClass =
    "input input-bordered w-full rounded-xl bg-white border-[#e2e9d6] focus:border-[#669b35] focus:outline-none text-[#203c2a]";

  function getErrorMessage(error: unknown) {
    const code =
      typeof error === "object" &&
      error !== null &&
      "code" in error
        ? String(error.code)
        : "";

    const errors: Record<string, string> = {
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/invalid-credential": "Incorrect email or password.",
      "auth/user-not-found": "No account found with this email.",
      "auth/wrong-password": "Incorrect password.",
      "auth/too-many-requests":
        "Too many attempts. Please try again later.",
      "auth/popup-closed-by-user": "Google login was cancelled.",
      "auth/popup-blocked": "Your browser blocked the Google popup.",
      "auth/network-request-failed":
        "Network error. Check your connection.",
    };

    return errors[code] || "Something went wrong. Please try again.";
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // Refresh Firebase user to get the latest verification status.
      await reload(result.user);

      const currentUser = auth.currentUser!;

      // Ensure an existing account has its Firestore profile.
      await createUserProfile(currentUser);

      if (!currentUser.emailVerified) {
        router.replace("/verify-email");
        return;
      }

      router.replace("/dashboard");
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setSuccess("");
    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);

      await reload(result.user);

      const currentUser = auth.currentUser!;

      // Create profile for first-time Google users.
      // Existing profiles and referral codes are preserved.
      await createUserProfile(currentUser);

      if (!currentUser.emailVerified) {
        router.replace("/verify-email");
        return;
      }

      router.replace("/dashboard");
    } catch (err) {
      console.error("GOOGLE LOGIN ERROR:", err);
      setError(getErrorMessage(err));
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleForgotPassword() {
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }

    setResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, email.trim());

      setSuccess("Password reset link sent! Check your email.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7faef] flex items-center justify-center p-5">

      <section className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-green-900/5 border border-[#e5edd9] p-7 sm:p-10">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-9">
          <div className="w-11 h-11 rounded-xl bg-[#4f862d] text-white flex items-center justify-center">
            <GraduationCap size={26} />
          </div>

          <span className="text-2xl font-black text-[#214d32]">
            Maya<span className="text-[#76a92e]">.</span>
          </span>
        </Link>

        {/* Heading */}
        <div className="mb-7">
          <span className="text-sm font-semibold text-[#669b35]">
            Welcome back 🍋
          </span>

          <h1 className="text-3xl font-black text-[#214d32] mt-2">
            Welcome back!
          </h1>

          <p className="text-[#7b8977] mt-2">
            Log in to continue your learning journey.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm mb-4">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 text-sm mb-4">
            {success}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="label-text font-semibold">
              Email address
            </label>

            <div className="relative mt-2">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="label-text font-semibold">
                Password
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resetLoading}
                className="text-xs font-bold text-[#63983b] hover:underline"
              >
                {resetLoading ? "Sending..." : "Forgot password?"}
              </button>
            </div>

            <div className="relative mt-2">
              <LockKeyhole
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                required
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`${inputClass} pl-10 pr-12`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="btn w-full bg-[#4f862d] hover:bg-[#3c7020] text-white border-0 rounded-xl"
          >
            {loading ? (
              <LoaderCircle className="animate-spin" size={19} />
            ) : (
              <>
                Log in
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="divider text-gray-400 text-xs my-6">
          OR CONTINUE WITH
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
          className="btn btn-outline w-full rounded-xl border-[#dce5d2] normal-case"
        >
          {googleLoading ? (
            <LoaderCircle className="animate-spin" size={19} />
          ) : (
            <>
              <svg viewBox="0 0 48 48" width="20" height="20">
                <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11c-.5 2.5-1.9 4.6-4.1 6v5h6.6c3.9-3.6 6.1-8.8 6.1-14.7Z"/>
                <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5c-1.8 1.2-4.1 1.9-6.9 1.9-5.3 0-9.8-3.6-11.4-8.4l-6.8 5.2C7.3 39.4 15.1 44 24 44Z"/>
                <path fill="#FBBC05" d="M12.6 27.7a12 12 0 0 1 0-7.4l-6.8-5.2a20 20 0 0 0 0 17.8l6.8-5.2Z"/>
                <path fill="#EA4335" d="M24 11.9c3 0 5.7 1 7.8 3l5.8-5.8C34.1 5.9 29.5 4 24 4 15.1 4 7.3 8.6 3.8 15.1l6.8 5.2c1.6-4.8 6.1-8.4 11.4-8.4Z"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        {/* Signup link */}
        <p className="text-center text-sm text-gray-500 mt-7">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-bold text-[#4f862d] hover:underline"
          >
            Sign up
          </Link>
        </p>

      </section>
    </main>
  );
}
