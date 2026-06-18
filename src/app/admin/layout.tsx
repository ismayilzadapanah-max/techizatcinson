import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="ml-[280px] flex-1 flex flex-col min-h-screen bg-[#F4F5F9]">
        {/* Topbar */}
        <header className="h-16 sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#E9E8EE] flex items-center justify-between px-6">
          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-brand-soft-blue text-sm">search</span>
            <input type="text" placeholder="Axtarış..." className="w-full pl-10 pr-4 py-2 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors" />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-brand-muted hover:text-[#141647] transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#D47092] rounded-full" />
            </button>
            <button className="p-2 text-brand-muted hover:text-[#141647] transition-colors">
              <span className="material-symbols-outlined">mail</span>
            </button>
            <div className="h-8 w-px bg-[#E9E8EE]" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#E9E8EE] flex items-center justify-center">
                <span className="material-symbols-outlined text-brand-muted text-sm">person</span>
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-semibold text-[#141647]">Admin</p>
                <p className="text-[10px] text-brand-muted uppercase">Super Admin</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
