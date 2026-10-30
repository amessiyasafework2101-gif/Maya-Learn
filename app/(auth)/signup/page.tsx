
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  LoaderCircle,
  Mail,
  LockKeyhole,
  UserRound,
} from "lucide-react";

import { auth } from "@/lib/firebase";
import { createUserProfile } from "@/lib/referral";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const [acceptedTerms, setAcceptedTerms] = useState(false);

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
      "auth/email-already-in-use":
        "This email is already registered.",
      "auth/invalid-email":
        "Please enter a valid email.",
      "auth/weak-password":
        "Your password must be stronger.",
      "auth/popup-closed-by-user":
        "Google sign-in was cancelled.",
      "auth/popup-blocked":
        "Your browser blocked the Google popup.",
      "auth/network-request-failed":
        "Network error. Please try again.",
      "permission-denied":
        "Unable to save your profile. Check Firestore rules.",
    };

    return errors[code] || "Something went wrong. Please try again.";
  }

  async function handleSignup(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setError("");

    if (!acceptedTerms) {
      setError("Please accept the Terms and Privacy Policy.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await updateProfile(result.user, {
        displayName: fullName.trim(),
      });

      // Create profile and unique referral code.
      await createUserProfile(result.user);

      // Send verification email.
      await sendEmailVerification(result.user);

      router.replace(
        `/verify-email?email=${encodeURIComponent(email.trim())}`
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    setError("");

    if (!acceptedTerms) {
      setError("Please accept the Terms and Privacy Policy.");
      return;
    }

    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);

      // Create profile only if this is a new user.
      console.log("Creating Firestore profile...");

const profile = await createUserProfile(result.user);

console.log("Firestore profile created successfully:", profile);

      router.replace("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7faef] flex items-center justify-center p-5">
      <section className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-green-900/5 border border-[#e5edd9] p-7 sm:p-10">

        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-11 h-11 rounded-xl bg-[#4f862d] text-white flex items-center justify-center">
            <GraduationCap size={26} />
          </div>

          <span className="text-2xl font-black text-[#214d32]">
            Maya<span className="text-[#76a92e]">.</span>
          </span>
        </Link>

        <div className="mb-6">
          <span className="text-sm font-semibold text-[#669b35]">
            Start your journey 🍋
          </span>

          <h1 className="text-3xl font-black text-[#214d32] mt-2">
            Create account
          </h1>

          <p className="text-[#7b8977] mt-2">
            Join Maya and make your freshman year count.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">

          <div>
            <label className="label-text font-semibold">
              Full name
            </label>

            <div className="relative mt-2">
              <UserRound className="z-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

              <input
                required
                minLength={2}
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className="label-text font-semibold">
              Email address
            </label>

            <div className="relative mt-2">
              <Mail className="z-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

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
            <label className="label-text font-semibold">
              Password
            </label>

            <div className="relative mt-2">
              <LockKeyhole className="z-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

              <input
                required
                minLength={8}
                autoComplete="new-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className={`${inputClass} pl-10 pr-12`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="label-text font-semibold">
              Confirm password
            </label>

            <input
              required
              minLength={8}
              autoComplete="new-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className={`${inputClass} mt-2`}
            />
          </div>

          <label className="flex gap-3 items-start text-sm text-gray-500">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="checkbox checkbox-success checkbox-sm mt-1"
            />
            <span>
              I agree to the Terms of Service and Privacy Policy.
            </span>
          </label>

          <button
            disabled={loading || googleLoading}
            className="btn w-full bg-[#4f862d] hover:bg-[#3c7020] text-white border-0 rounded-xl"
          >
            {loading ? (
              <LoaderCircle className="animate-spin" size={19} />
            ) : (
              <>
                Create account <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="divider text-gray-400 text-xs">
          OR CONTINUE WITH
        </div>

        <button
          onClick={handleGoogleSignup}
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

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#4f862d]">
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
