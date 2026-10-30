
"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, Menu } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/courses": "My Courses",
  "/questions": "AI Questions",
  "/practice": "Weekly Practice",
  "/profile": "My Profile",
};

interface HeaderProps {
  onMobileMenuClick: () => void;
}

export default function Header({
  onMobileMenuClick,
}: HeaderProps) {
  const pathname = usePathname();

  const title =
    Object.entries(pageTitles).find(
      ([path]) =>
        pathname === path || pathname.startsWith(path + "/")
    )?.[1] || "Maya";

  return (
    <header className="h-[85px] bg-white/90 backdrop-blur-lg border-b border-[#e8eedf] flex items-center justify-between px-4 sm:px-7 lg:px-9 sticky top-0 z-30">

      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden btn btn-ghost btn-square text-[#4f862d]"
          aria-label="Open navigation"
        >
          <Menu size={23} />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#214d32]">
            {title}
          </h1>
          <p className="hidden sm:block text-xs text-[#9aa594] mt-1">
            Welcome to your learning space.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          aria-label="Search"
          className="btn btn-ghost btn-circle text-[#829080] hover:bg-[#f1f6e9]"
        >
          <Search size={20} />
        </button>

        <button
          aria-label="Notifications"
          className="btn btn-ghost btn-circle relative text-[#829080] hover:bg-[#f1f6e9]"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#e9a63b] border-2 border-white" />
        </button>

        <div className="w-10 h-10 rounded-full bg-[#e7f0d9] border border-[#dce8cf] flex items-center justify-center text-[#4f862d]">
          <span className="font-bold">M</span>
        </div>
      </div>
    </header>
  );
}
