
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { useAuthStore } from "@/stores/auth-store";

type GuardMode = "guest" | "protected" | "verification";

interface RouteGuardProps {
  children: React.ReactNode;
  mode: GuardMode;
}

export default function RouteGuard({
  children,
  mode,
}: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  const isAuthenticated = !!user;
  const isVerified = !!user?.emailVerified;

  useEffect(() => {
    if (loading) return;

    if (mode === "guest" && isAuthenticated) {
      router.replace(
        isVerified ? "/dashboard" : "/verify-email"
      );
      return;
    }

    if (mode === "protected" && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (mode === "protected" && !isVerified) {
      router.replace("/verify-email");
      return;
    }

    if (mode === "verification" && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (mode === "verification" && isVerified) {
      router.replace("/dashboard");
    }
  }, [
    loading,
    mode,
    isAuthenticated,
    isVerified,
    pathname,
    router,
  ]);

  const shouldRedirect =
    !loading &&
    (
      (mode === "guest" && isAuthenticated) ||
      (mode === "protected" && (!isAuthenticated || !isVerified)) ||
      (mode === "verification" && (!isAuthenticated || isVerified))
    );

  if (loading || shouldRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7faef]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[#eaf4d6] flex items-center justify-center">
            <LoaderCircle className="w-7 h-7 text-[#4f862d] animate-spin" />
          </div>

          <p className="text-sm font-medium text-[#718071]">
            Preparing your Maya experience...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
