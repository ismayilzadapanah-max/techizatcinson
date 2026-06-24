"use client";

import { useState } from "react";
import { RestaurantAccountSidebar } from "@/components/account/RestaurantAccountSidebar";

export default function RestaurantAccountLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <RestaurantAccountSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen bg-[#F4F5F9] lg:ml-[280px]">
        <header className="h-16 sticky top-0 z-40 bg-white border-b border-[#E9E8EE] flex items-center justify-between px-4 lg:px-6 gap-3">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-[#5D608B] hover:text-[#141647] transition-colors flex-shrink-0"
            onClick={() => setSidebarOpen(true)}
            aria-label="Menyunu aç"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>

          <h2 className="text-base lg:text-lg font-semibold text-[#141647] truncate">Restoran Paneli</h2>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button className="p-2 text-[#5D608B] hover:text-[#141647] transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#E9E8EE] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[#9DB1CA] text-sm">person</span>
              </div>
              <span className="text-xs font-semibold text-[#141647] hidden lg:block">Restoran</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
