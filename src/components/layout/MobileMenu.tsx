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
      <div className="absolute right-0 top-0 h-full w-[280px] bg-[#0B0E3B] border-l border-[#243786]/40 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#243786]/30">
          <span className="text-base font-bold text-white">Menyu</span>
          <button
            onClick={onClose}
            className="p-2 text-[#9DB1CA] hover:text-white transition-colors rounded-lg hover:bg-white/10"
            aria-label="Menyunu bağla"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {/* Elan yerləşdir */}
          {(!isLoggedIn || role === "supplier") && (
            <>
              <Link
                href={listingHref}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 bg-[#D47092] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                Elan yerləşdir
              </Link>
              <div className="h-px bg-[#243786]/30 my-2" />
            </>
          )}

          {/* Nav links */}
          {filteredLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 bg-[#243786] border border-[#243786] text-white rounded-xl text-sm font-medium transition-all hover:bg-[#1A1D60] hover:border-[#1A1D60]"
            >
              {link.label}
            </Link>
          ))}

          <div className="h-px bg-[#243786]/30 my-2" />

          {/* Auth links */}
          {isLoggedIn ? (
            <>
              <Link
                href={role === "supplier" ? "/account/supplier" : "/account/restaurant"}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 bg-[#243786] border border-[#243786] text-white rounded-xl text-sm font-medium transition-all hover:bg-[#1A1D60] hover:border-[#1A1D60]"
              >
                <span className="material-symbols-outlined text-[20px]">account_circle</span>
                {user?.fullName || "Kabinetim"}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 bg-[#93000a]/20 border border-[#93000a]/40 text-[#ffb4ab] rounded-xl text-sm font-medium transition-all hover:bg-[#93000a]/30 hover:border-[#93000a]/60"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                Çıxış
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 bg-[#243786] border border-[#243786] text-white rounded-xl text-sm font-medium transition-all hover:bg-[#1A1D60] hover:border-[#1A1D60]"
              >
                <span className="material-symbols-outlined text-[20px]">login</span>
                Daxil ol
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="flex items-center gap-3 justify-center px-4 py-3 bg-[#243786] border border-[#243786] text-white rounded-xl text-sm font-semibold transition-all hover:bg-[#141647] hover:border-[#141647] mt-1"
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
