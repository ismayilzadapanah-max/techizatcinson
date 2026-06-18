"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { useAuth } from "@/lib/auth-context";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isLoggedIn, role } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const justLoggedIn = useRef(false);

  // Giriş uğurlu olduqdan sonra admin paneline yönləndir
  useEffect(() => {
    if (isLoggedIn && justLoggedIn.current) {
      justLoggedIn.current = false;
      if (role === "admin") {
        router.push("/admin");
      } else {
        setError("Bu sahəyə yalnız admin istifadəçilər daxil ola bilərlər");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    }
  }, [isLoggedIn, role, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return;
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      justLoggedIn.current = true;
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center p-4 overflow-hidden relative bg-background">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-4 px-4 py-2 bg-[#D47092]/10 rounded-lg w-fit">
            <span className="material-symbols-outlined text-[#D47092] text-lg">admin_panel_settings</span>
            <span className="text-xs font-semibold text-[#D47092] uppercase tracking-wider">Admin Girişi</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary text-3xl">hub</span>
            <h1 className="text-2xl font-black text-on-background tracking-tight">{SITE.name}</h1>
          </div>
          <p className="text-sm text-on-surface-variant text-center">Admin Panel</p>
        </div>

        {/* Auth Card */}
        <div className="glass-card rounded-xl p-8 shadow-2xl border border-[#E9E8EE]/20">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-on-background mb-1">Admin Paneline Daxol</h2>
            <p className="text-xs text-on-surface-variant">Admin kredensialları ilə giriş edin</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">E-poçt</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">mail</span>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@techizatcin.az" className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-colors placeholder:text-outline" required />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label htmlFor="password" className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Şifrə</label>
                <Link href="/admin/forgot-password" className="text-xs text-primary hover:text-secondary transition-colors">Şifrəni unutmusunuz?</Link>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">lock</span>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-colors" required />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading} className="w-full py-3 bg-[#D47092] text-white rounded-lg font-semibold text-sm hover:bg-[#c25878] transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? "Gözləyin..." : "Admin Paneline Daxol"}
              <span className="material-symbols-outlined text-[18px]">{loading ? "sync" : "login"}</span>
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-on-surface-variant">
            <Link href="/login" className="text-primary font-semibold hover:underline">Adi istifadəçi girişinə qayıt</Link>
          </p>
        </div>

        <div className="mt-6 text-center text-xs text-on-surface-variant">
          <p className="text-[10px]">Bu sahə yalnız sistem administratorları üçün nəzərdə tutulmuşdur.</p>
        </div>
      </main>
    </div>
  );
}
