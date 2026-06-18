import Link from "next/link";
import { SITE } from "@/lib/constants";

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-5xl z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Biznesinizi bizimlə böyüdün</h1>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-sm">Azərbaycanın ən böyük təchizat şəbəkəsinə qoşulun. Ehtiyaclarınıza uyğun hesabı seçin.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Supplier Card */}
          <Link href="/register/supplier" className="glass-card rounded-xl p-8 flex flex-col group hover:border-primary/30 transition-all hover:-translate-y-1">
            <div className="mb-6">
              <div className="w-14 h-14 rounded-lg bg-[#243786] flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-3xl">local_shipping</span>
              </div>
              <h2 className="text-xl font-bold text-on-background mb-2">Təchizatçı kimi qeydiyyat</h2>
              <p className="text-xs text-on-surface-variant">Məhsullarınızı minlərlə restorana satın, satışlarınızı avtomatlaşdırın.</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {["Limitsiz məhsul kataloqu", "Geniş restoran şəbəkəsinə çıxış", "Analitik hesabatlar", "Avtomatlaşdırılmış sifarişlər"].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                  <span className="text-on-surface">{item}</span>
                </li>
              ))}
            </ul>
            <span className="w-full py-3 bg-primary text-on-primary rounded-lg font-semibold text-sm text-center hover:brightness-110 transition-all">
              Satışa başla
            </span>
          </Link>

          {/* Restaurant Card */}
          <Link href="/register/restaurant" className="glass-card rounded-xl p-8 flex flex-col group hover:border-secondary/30 transition-all hover:-translate-y-1">
            <div className="mb-6">
              <div className="w-14 h-14 rounded-lg bg-[#7e2b4b] flex items-center justify-center text-secondary mb-4 shadow-lg shadow-secondary/10">
                <span className="material-symbols-outlined text-3xl">restaurant</span>
              </div>
              <h2 className="text-xl font-bold text-on-background mb-2">Restoran kimi qeydiyyat</h2>
              <p className="text-xs text-on-surface-variant">Ən yaxşı təchizatçıları tapın, qiymətləri müqayisə edin, sifariş verin.</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {["Bütün təchizatçılara giriş", "Eyni anda bir neçə sifariş", "Xərclərin izlənməsi", "Keyfiyyətə nəzarət"].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                  <span className="text-on-surface">{item}</span>
                </li>
              ))}
            </ul>
            <span className="w-full py-3 bg-on-background text-background rounded-lg font-semibold text-sm text-center hover:bg-white transition-all">
              Sifarişə başla
            </span>
          </Link>
        </div>

        <p className="text-center mt-8 text-xs text-on-surface-variant">
          Artıq hesabınız var? <Link href="/login" className="text-primary font-semibold hover:underline">Daxil ol</Link>
        </p>
      </div>
    </div>
  );
}
