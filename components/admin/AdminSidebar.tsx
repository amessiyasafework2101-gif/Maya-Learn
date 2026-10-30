
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  ShieldCheck,
  GraduationCap,
  X,
  Gift,
} from "lucide-react";

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  {
    label: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Payment Verification",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    label: "Track Referrals",
    href: "/admin/referrals",
    icon: Gift,
  },
];

export default function AdminSidebar({
  open,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#e6edda] bg-white transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-20 items-center justify-between border-b border-[#edf1e7] px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#4f862d] text-white">
              <GraduationCap size={25} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#214d32]">
                Maya
              </h1>
              <p className="text-xs font-medium text-[#76a92e]">
                ADMIN PANEL
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-7">
          <p className="mb-4 px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Administration
          </p>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-[#edf5e2] text-[#4f862d]"
                      : "text-gray-600 hover:bg-[#f7faef] hover:text-[#214d32]"
                  }`}
                >
                  <Icon size={19} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Security information */}
        <div className="border-t border-[#edf1e7] p-5">
          <div className="flex items-start gap-3 rounded-xl bg-[#f7faef] p-3">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-[#4f862d]"
            />
            <div>
              <p className="text-xs font-bold text-[#214d32]">
                Secure Admin Area
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
                Authorized administrators only.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
