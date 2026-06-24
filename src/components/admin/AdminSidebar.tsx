"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/constants";

const MENU_ITEMS = [
  { label: "İcmal", href: "/admin", icon: "dashboard" },
  { label: "İstifadəçilər", href: "/admin/users", icon: "people" },
  { label: "Təchizatçılar", href: "/admin/suppliers", icon: "local_shipping" },
  { label: "Restoranlar", href: "/admin/restaurants", icon: "restaurant" },
  { label: "Məhsul elanları", href: "/admin/products", icon: "inventory_2" },
  { label: "Kateqoriyalar", href: "/admin/categories", icon: "category" },
  { label: "Bölgələr", href: "/admin/regions", icon: "location_on" },
  { label: "Qiymət sorğuları", href: "/admin/rfq", icon: "request_quote" },
  { label: "Rəylər", href: "/admin/reviews", icon: "star" },
  { label: "Şikayətlər", href: "/admin/complaints", icon: "report" },
  { label: "Paketlər", href: "/admin/packages", icon: "package_2" },
  { label: "Sayt səhifələri", href: "/admin/pages", icon: "description" },
  { label: "Sayt ayarları", href: "/admin/settings", icon: "settings" },
];

interface AdminSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ open = false, onClose }: AdminSidebarProps) {
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
            <p className="text-[10px] text-on-surface-variant opacity-70 uppercase tracking-wider">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? "bg-surface-container-highest text-on-surface border-l-[3px] border-[#D47092]"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isActive ? "text-primary" : "group-hover:text-primary"}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pt-4 border-t border-white/5 space-y-0.5">
        <Link
          href="/account"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">account_circle</span>
          <span>Profil</span>
        </Link>
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
