
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  MessageCircle,
  ClipboardCheck,
  UserRound,
  GraduationCap,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Crown,
  ChevronRight,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Courses", href: "/courses", icon: BookOpen },
  { name: "AI Questions", href: "/questions", icon: MessageCircle },
  { name: "Weekly Practice", href: "/practice", icon: ClipboardCheck },
  { name: "My Profile", href: "/profile", icon: UserRound },
  { name: "Premium", href: "/premium", icon: Crown },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

export default function Sidebar({
  collapsed,
  setCollapsed,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await signOut(auth);
    router.replace("/login");
  }

  return (
    <aside
      className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen
      bg-white border-r border-[#e8eedf] z-40
      transition-all duration-300
      ${collapsed ? "w-[88px]" : "w-[260px]"}`}
    >
      {/* Logo */}
      <div className="h-[85px] flex items-center justify-between px-6 border-b border-[#eef1e9]">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4f862d] rounded-xl flex items-center justify-center text-white shrink-0">
            <GraduationCap size={25} />
          </div>

          {!collapsed && (
            <span className="text-2xl font-black text-[#214d32]">
              Maya<span className="text-[#86b83f]">.</span>
            </span>
          )}
        </Link>
      </div>

      {/* Collapse button */}
      <div className={`flex py-5 ${collapsed ? "justify-center" : "justify-end px-5"}`}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="btn btn-ghost btn-sm btn-square text-[#718071] hover:bg-[#f1f6e9]"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3">
        {!collapsed && (
          <p className="text-[11px] font-bold tracking-widest text-[#a0aa98] px-4 mb-3">
            MENU
          </p>
        )}

        <nav className="space-y-2">
          {navigation.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.name : undefined}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all
                  ${
                    active
                      ? "bg-[#edf5e2] text-[#4f862d] font-bold"
                      : "text-[#788675] hover:bg-[#f7f9f3] hover:text-[#4f862d]"
                  }
                  ${collapsed ? "justify-center px-0" : ""}`}
              >
                <Icon size={21} strokeWidth={active ? 2.5 : 2} />

                {!collapsed && (
                  <>
                    <span className="text-sm flex-1">{item.name}</span>
                    {active && <ChevronRight size={16} />}
                  </>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom account section */}
      <div className="p-4 border-t border-[#eef1e9]">
        {!collapsed && (
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-[#e7f0d9] flex items-center justify-center text-[#4f862d]">
              <UserRound size={20} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-bold text-[#315239] truncate">
                My Account
              </p>
              <p className="text-xs text-[#9aa594]">Student</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          title={collapsed ? "Log out" : undefined}
          className={`flex items-center gap-3 w-full rounded-xl px-4 py-3 text-[#a16b63] hover:bg-red-50 transition
            ${collapsed ? "justify-center px-0" : ""}`}
        >
          <LogOut size={20} />
          {!collapsed && <span className="text-sm font-semibold">Log out</span>}
        </button>
      </div>
    </aside>
  );
}
