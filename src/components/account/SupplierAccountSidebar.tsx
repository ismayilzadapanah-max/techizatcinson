"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/constants";

const MENU_ITEMS = [
  { label: "İcmal", href: "/account/supplier", icon: "dashboard" },
  { label: "Profilim", href: "/account/supplier/profile", icon: "business" },
  { label: "Komanda", href: "/account/supplier/team", icon: "group" },
  { label: "Gələn sifarişlər", href: "/account/supplier/orders", icon: "inbox" },
  { label: "Məhsullarım", href: "/account/supplier/products", icon: "inventory_2" },
  { label: "Yeni məhsul əlavə et", href: "/account/supplier/products/create", icon: "add_circle" },
  { label: "Məhsul çeşidləri", href: "/account/supplier/product-varieties", icon: "style" },
  { label: "Əlaqə məlumatları", href: "/account/supplier/contact", icon: "contacts" },
  { label: "Qiymət sorğuları", href: "/account/supplier/rfq", icon: "request_quote" },
  { label: "Rəylər", href: "/account/supplier/reviews", icon: "star" },
  { label: "Ayarlar", href: "/account/supplier/settings", icon: "settings" },
];

interface SupplierAccountSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function SupplierAccountSidebar({ open = false, onClose }: SupplierAccountSidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <aside className="flex flex-col h-full w-[280px] bg-[#050735] py-6 border-r border-white/5">
      <div className="px-6 mb-8">
        <Link href="/" className="flex items-center gap-3" onClick={onClose}>
          <div className="w-10 h-10 bg-[#243786] rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-xl">hub</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-on-background">{SITE.name}</h1>
            <p className="text-[10px] text-on-surface-variant opacity-70">Təchizatçı Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all border ${
                isActive
                  ? "bg-[#2d315d] text-white border-[#D47092]/50 border-l-[3px] border-l-[#D47092]"
                  : "text-[#C5C5D3] border-transparent hover:bg-[#171b47] hover:border-[#243786]/40 hover:text-white"
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isActive ? "text-[#B9C3FF]" : "text-[#9DB1CA]"}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pt-4 border-t border-white/5 space-y-0.5">
        <Link
          href="/login"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-error hover:bg-error-container/10 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>Çıxış</span>
        </Link>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop: always visible fixed sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen w-[280px] z-50">
        {sidebarContent}
      </div>

      {/* Mobile: overlay drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={onClose}
        />
        {/* Drawer */}
        <div
          className={`absolute left-0 top-0 h-full transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarContent}
        </div>
      </div>
    </>
  );
}
