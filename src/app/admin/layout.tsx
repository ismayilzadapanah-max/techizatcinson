"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Login səhifəsi auth yoxlamasından kənar olmalıdır
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !isLoginPage) {
      if (!isLoggedIn || user?.role !== "admin") {
        router.replace("/admin/login");
      }
    }
  }, [user, loading, isLoggedIn, router, isLoginPage]);

  // Login səhifəsini birbaşa render et
  if (isLoginPage) return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F9]">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-4xl text-[#243786] animate-spin">sync</span>
          <p className="text-sm text-[#5D608B]">Yüklənir...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || user?.role !== "admin") return null;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen bg-[#F4F5F9] lg:ml-[280px]">
        {/* Topbar */}
        <header className="h-16 sticky top-0 z-40 bg-white border-b border-[#E9E8EE] flex items-center justify-between px-4 lg:px-6 gap-3">
          <button
            className="lg:hidden p-2 text-[#5D608B] hover:text-[#141647] transition-colors flex-shrink-0"
            onClick={() => setSidebarOpen(true)}
            aria-label="Menyunu aç"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>

          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9DB1CA] text-sm">search</span>
            <input
              type="text"
              placeholder="Axtarış..."
              className="w-full pl-10 pr-4 py-2 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button className="p-2 text-[#5D608B] hover:text-[#141647] transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="h-8 w-px bg-[#E9E8EE]" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#141647] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-white text-sm">admin_panel_settings</span>
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-semibold text-[#141647]">{user?.fullName || "Admin"}</p>
                <p className="text-[10px] text-[#5D608B] uppercase">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
