"use client";

import { useMemo } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";
import { useAuth } from "@/lib/auth-context";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { isLoggedIn, role, user, logout } = useAuth();

  if (!open) return null;

  const listingHref = isLoggedIn
    ? "/account/supplier/products/create"
    : "/login";

  const handleLogout = () => {
    logout();
    onClose();
  };

  // Rol əsaslı link filtrləmə — harada olursa olsun işləyir
  const filteredLinks = useMemo(() => {
    const isSupplier = role === "supplier";
    const isRestaurant = role === "restaurant";

    return NAV_LINKS.filter((link) => {
      if (isSupplier) {
        if (link.href === "/suppliers") return false;
        if (link.href === "/for-restaurants") return false;
        if (link.href === "/for-suppliers") return false;
      }
      if (isRestaurant) {
        if (link.href === "/for-restaurants") return false;
        if (link.href === "/for-suppliers") return false;
      }
      return true;
    });
  }, [role]);

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-[280px] bg-surface-container-lowest border-l border-white/10 shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span className="text-lg font-bold text-on-background">Menyu</span>
          <button
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:text-primary transition-colors"
            aria-label="Menyunu bağla"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {/* Elan yerləşdir — yalnız təchizatçılar və ya giriş etməyənlər görsün */}
          {(!isLoggedIn || role === "supplier") && (
            <>
              <Link
                href={listingHref}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 bg-[#D47092] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all"
              >
                <span className="material-symbols-outlined">add_circle</span>
                Elan yerləşdir
              </Link>
              <hr className="border-white/10 my-2" />
            </>
          )}

          {filteredLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container hover:text-primary rounded-lg transition-all text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}

          <hr className="border-white/10 my-4" />

          {isLoggedIn ? (
            <>
              <Link
                href={role === "supplier" ? "/account/supplier" : "/account/restaurant"}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container hover:text-primary rounded-lg transition-all text-sm font-medium"
              >
                <span className="material-symbols-outlined">account_circle</span>
                {user?.fullName || "Kabinetim"}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error/5 rounded-lg transition-all text-sm font-medium"
              >
                <span className="material-symbols-outlined">logout</span>
                Çıxış
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container hover:text-primary rounded-lg transition-all text-sm font-medium"
              >
                <span className="material-symbols-outlined">login</span>
                Daxil ol
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 bg-[#243786] text-white rounded-lg text-sm font-semibold hover:bg-[#141647] transition-colors justify-center mt-2"
              >
                Qeydiyyatdan keç
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}
