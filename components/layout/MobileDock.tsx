
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  MessageCircle,
  ClipboardCheck,
  UserRound,
} from "lucide-react";

const navigation = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "AI", href: "/questions", icon: MessageCircle },
  { name: "Practice", href: "/practice", icon: ClipboardCheck },
  { name: "Profile", href: "/profile", icon: UserRound },
];

export default function MobileDock() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
      <div className="flex items-center justify-around bg-white/95 backdrop-blur-xl border border-[#e5ecd9] shadow-[0_8px_35px_rgba(40,70,30,0.13)] rounded-2xl px-2 py-2">
        {navigation.map((item) => {
          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.name}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-1 min-w-0 flex-1 py-2 rounded-xl transition-all
                ${
                  active
                    ? "text-[#4f862d] bg-[#edf5e2]"
                    : "text-[#94a08e] hover:text-[#4f862d]"
                }`}
            >
              <Icon size={21} strokeWidth={active ? 2.6 : 2} />

              <span className="text-[10px] font-semibold truncate">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
