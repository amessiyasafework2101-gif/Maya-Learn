
"use client";

import { Menu, Bell, ShieldCheck } from "lucide-react";

interface AdminHeaderProps {
  onMenuClick: () => void;
  email?: string | null;
  onLogout: () => void;
}

export default function AdminHeader({
  onMenuClick,
  email,
  onLogout,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#e6edda] bg-white/95 px-4 backdrop-blur sm:px-7">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-xl p-2 text-[#214d32] hover:bg-[#edf5e2] lg:hidden"
        >
          <Menu size={23} />
        </button>

        <div>
          <h2 className="text-base font-bold text-[#214d32] sm:text-lg">
            Administration
          </h2>
          <p className="hidden text-xs text-gray-500 sm:block">
            Manage Maya Learning Platform
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden items-center gap-2 rounded-full bg-[#edf5e2] px-3 py-2 sm:flex">
          <ShieldCheck size={16} className="text-[#4f862d]" />
          <span className="text-xs font-semibold text-[#4f862d]">
            Administrator
          </span>
        </div>

        <button
          type="button"
          aria-label="Notifications"
          title="Notifications"
          className="rounded-xl p-2 text-gray-500 hover:bg-[#f7faef]"
        >
          <Bell size={20} />
        </button>

        <div className="hidden max-w-44 text-right md:block">
          <p className="truncate text-xs font-semibold text-[#214d32]">
            {email || "Administrator"}
          </p>
          <p className="text-[11px] text-gray-400">
            Admin account
          </p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="rounded-xl border border-[#e6edda] px-3 py-2 text-xs font-semibold text-[#4f862d] transition hover:bg-[#edf5e2]"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
