"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { MobileMenu } from "./MobileMenu";
import { useAuth } from "@/lib/auth-context";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isLoggedIn, role, user, logout } = useAuth();

  // "Elan yerləşdir" hara aparsın?
  const listingHref = isLoggedIn
    ? "/account/supplier/products/create"
    : "/login";

  // Rol əsaslı link filtrləmə — harada olursa olsun işləyir
  const filteredLinks = useMemo(() => {
    const isSupplier = role === "supplier";
    const isRestaurant = role === "restaurant";

    return NAV_LINKS.filter((link) => {
      // Təchizatçı rolunda: Təchizatçılar, Restoranlar üçün, Təchizatçılar üçün gizlə
      if (isSupplier) {
        if (link.href === "/suppliers") return false;
        if (link.href === "/for-restaurants") return false;
        if (link.href === "/for-suppliers") return false;
      }
      // Restoran rolunda: Restoranlar üçün, Təchizatçılar üçün gizlə
      if (isRestaurant) {
        if (link.href === "/for-restaurants") return false;
        if (link.href === "/for-suppliers") return false;
      }
      return true;
    });
  }, [role]);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 glass-header bg-background/80 border-b border-white/10 h-20 shadow-sm">
        <div className="flex justify-between items-center w-full px-4 lg:px-8 max-w-[var(--spacing-container)] mx-auto h-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="material-symbols-outlined text-[#243786] text-3xl">hub</span>
              <span className="text-xl font-black text-on-background tracking-tight group-hover:text-primary transition-colors">
                {SITE.name}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 ml-8">
              {filteredLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {role === "supplier" && (
                  <Link
                    href={listingHref}
                    className="hidden md:inline-flex bg-[#D47092] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">add_circle</span>
                    Elan yerləşdir
                  </Link>
                )}

                <Link
                  href={role === "supplier" ? "/account/supplier" : "/account/restaurant"}
                  className="hidden md:flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-medium px-2 py-1"
                >
                  <span className="material-symbols-outlined text-[20px]">account_circle</span>
                  <span className="hidden lg:inline">{user?.fullName || "Kabinet"}</span>
                </Link>

                <button
                  onClick={logout}
                  className="hidden md:inline-flex text-on-surface-variant hover:text-error transition-colors text-sm font-medium px-2 py-1"
                  title="Çıxış"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden md:inline-flex text-on-surface-variant hover:text-primary transition-colors text-sm font-medium px-3 py-2"
                >
                  Daxil ol
                </Link>
                <Link
                  href="/register"
                  className="hidden md:inline-flex bg-[#243786] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#141647] transition-colors"
                >
                  Qeydiyyat
                </Link>
                <Link
                  href={listingHref}
                  className="hidden md:inline-flex bg-[#D47092] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  Elan yerləşdir
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 text-on-surface-variant hover:text-primary transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Menyunu aç"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
