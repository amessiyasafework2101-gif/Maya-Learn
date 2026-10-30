
"use client";

import { useState } from "react";

import RouteGuard from "@/components/RouteGuard";
import Sidebar from "@/components/layout/Sidebar";
import MobileDock from "@/components/layout/MobileDock";
import Header from "@/components/layout/Header";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <RouteGuard mode="protected">
      <div className="min-h-screen bg-[#f7faef]">

        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <div
          className={`min-h-screen transition-all duration-300 ${
            collapsed ? "lg:ml-[88px]" : "lg:ml-[260px]"
          }`}
        >
          <Header onMobileMenuClick={() => {}} />

          <main className="p-4 sm:p-6 lg:p-8 pb-28 lg:pb-8 max-w-[1600px] mx-auto">
            {children}
          </main>
        </div>

        <MobileDock />

      </div>
    </RouteGuard>
  );
}
