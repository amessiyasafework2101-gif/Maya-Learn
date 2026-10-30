
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  getIdTokenResult,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  ShieldCheck,
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  GraduationCap,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // Refresh the ID token to retrieve the latest custom claims.
      const tokenResult = await getIdTokenResult(
        credential.user,
        true
      );

      if (tokenResult.claims.admin !== true) {
        await signOut(auth);
        setError(
          "This account does not have administrator permission."
        );
        return;
      }

      router.replace("/admin");
    } catch (err: unknown) {
      console.error("Admin login error:", err);

      setError(
        "Unable to sign in. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7faef] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#4f862d] text-white shadow-lg shadow-green-900/10 mb-4">
            <GraduationCap size={34} />
          </div>

          <h1 className="text-3xl font-bold text-[#214d32]">
            Maya Admin
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Administration and payment management
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl border border-[#e6edda] shadow-xl shadow-green-900/5 p-7 sm:p-9">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-11 h-11 rounded-xl bg-[#edf5e2] flex items-center justify-center text-[#4f862d]">
              <ShieldCheck size={23} />
            </div>

            <div>
              <h2 className="font-bold text-xl text-[#214d32]">
                Administrator Login
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Sign in with your authorized account
              </p>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 mb-5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-sm font-semibold text-[#214d32] mb-2"
              >
                Administrator Email
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  placeholder="Enter your admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input input-bordered w-full pl-11 bg-[#fafcf7] border-[#e3eadb] focus:border-[#76a92e] focus:outline-none rounded-xl h-13"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-semibold text-[#214d32] mb-2"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input input-bordered w-full pl-11 pr-12 bg-[#fafcf7] border-[#e3eadb] focus:border-[#76a92e] focus:outline-none rounded-xl h-13"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4f862d]"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email.trim() || !password}
              className="btn w-full bg-[#4f862d] hover:bg-[#3e6e22] text-white border-none rounded-xl h-13 min-h-13 normal-case text-base font-semibold disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Verifying account...
                </>
              ) : (
                <>
                  Sign In to Admin Panel
                  <ArrowRight size={19} />
                </>
              )}
            </button>
          </form>

          <div className="divider my-6 text-gray-300 text-xs">
            SECURE ADMIN ACCESS
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <ShieldCheck size={15} className="text-[#4f862d]" />
            Access is restricted to authorized administrators.
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-7">
            © 2026 Maya Learning Platform
        </p>
      </div>
    </main>
  );
}
