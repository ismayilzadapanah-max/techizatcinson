import Link from "next/link";
import { SITE, FOOTER_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-background border-t border-outline-variant pt-12 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 lg:px-8 py-8 max-w-[var(--spacing-container)] mx-auto">
        {/* Brand */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#243786] text-2xl">hub</span>
            <span className="text-lg font-black text-on-background">{SITE.name}</span>
          </Link>
          <p className="text-sm text-on-surface-variant opacity-80 max-w-xs">
            {SITE.description}
          </p>
          <div className="flex gap-3">
            {["public", "alternate_email", "share"].map((icon) => (
              <div
                key={icon}
                className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant hover:text-brand-accent cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-sm">{icon}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
            Platforma
          </h4>
          <ul className="space-y-2">
            {FOOTER_LINKS.platform.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
            Dəstək
          </h4>
          <ul className="space-y-2">
            {FOOTER_LINKS.support.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
            Abunə ol
          </h4>
          <p className="text-sm text-on-surface-variant opacity-80">
            Yeniliklərdən xəbərdar olmaq üçün bülletenə qoşulun.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="E-poçt ünvanı"
              className="bg-surface-container border border-white/10 rounded-lg px-4 py-2.5 text-sm flex-1 outline-none focus:border-primary/50 transition-colors text-on-surface placeholder:text-outline"
            />
            <button className="bg-[#243786] text-white p-2.5 rounded-lg hover:bg-[#141647] transition-colors">
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[var(--spacing-container)] mx-auto px-6 lg:px-8 py-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-on-surface-variant opacity-60">
          &copy; {new Date().getFullYear()} {SITE.name}. Bütün hüquqlar qorunur.
        </p>
        <div className="flex gap-6">
          <Link href="/privacy" className="text-xs text-on-surface-variant hover:text-secondary transition-colors opacity-80">
            Məxfilik siyasəti
          </Link>
          <Link href="/terms" className="text-xs text-on-surface-variant hover:text-secondary transition-colors opacity-80">
            İstifadə şərtləri
          </Link>
          <Link href="/help" className="text-xs text-on-surface-variant hover:text-secondary transition-colors opacity-80">
            Yardım mərkəzi
          </Link>
        </div>
      </div>
    </footer>
  );
}
