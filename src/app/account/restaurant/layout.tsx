import { RestaurantAccountSidebar } from "@/components/account/RestaurantAccountSidebar";

export default function RestaurantAccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <RestaurantAccountSidebar />
      <div className="ml-[280px] flex-1 flex flex-col min-h-screen bg-[#F4F5F9]">
        <header className="h-16 sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#E9E8EE] flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold text-[#141647]">Restoran Paneli</h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-brand-muted hover:text-[#141647] transition-colors"><span className="material-symbols-outlined">notifications</span></button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#E9E8EE] flex items-center justify-center">
                <span className="material-symbols-outlined text-brand-muted text-sm">person</span>
              </div>
              <span className="text-xs font-semibold text-[#141647] hidden lg:block">Restoran</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
