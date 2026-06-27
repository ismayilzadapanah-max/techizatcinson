"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggedIn, role } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const justLoggedIn = useRef(false);

  // Login uğurlu olduqdan sonra yönləndir
  useEffect(() => {
    if (isLoggedIn && justLoggedIn.current) {
      justLoggedIn.current = false;
      if (role === "admin") {
        router.push("/admin");
      } else if (role === "supplier") {
        router.push("/account/supplier");
      } else if (role === "restaurant") {
        router.push("/account/restaurant");
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
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary text-3xl">hub</span>
            <h1 className="text-2xl font-black text-on-background tracking-tight">{SITE.name}</h1>
          </div>
          <p className="text-sm text-on-surface-variant text-center">Təchizatçılar və restoranlar üçün B2B ekosistem</p>
        </div>

        {/* Auth Card */}
        <div className="glass-card rounded-xl p-8 shadow-2xl">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-on-background mb-1">Xoş gəlmisiniz</h2>
            <p className="text-xs text-on-surface-variant">Davam etmək üçün hesabınıza daxil olun</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">E-poçt</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">mail</span>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nümunə@shirket.az" className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-colors placeholder:text-outline" required />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label htmlFor="password" className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Şifrə</label>
                <Link href="/forgot-password" className="text-xs text-primary hover:text-secondary transition-colors">Şifrəni unutmusunuz?</Link>
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
            <button type="submit" disabled={loading} className="w-full py-3 bg-[#141647] text-white rounded-lg font-semibold text-sm hover:bg-[#243786] transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? "Gözləyin..." : "Daxil ol"}
              <span className="material-symbols-outlined text-[18px]">{loading ? "sync" : "login"}</span>
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-on-surface-variant">
            Hesabınız yoxdur?{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">Qeydiyyatdan keç</Link>
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="flex justify-center gap-4 text-xs text-on-surface-variant">
            <Link href="/help" className="hover:text-on-surface transition-colors">Dəstək</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-on-surface transition-colors">Məxfilik</Link>
            <span>•</span>
            <span>AZ</span>
          </div>
          <div className="h-px w-16 bg-outline-variant" />
          <Link href="/admin/login" className="text-[10px] text-on-surface-variant hover:text-primary transition-colors font-medium uppercase tracking-wider">Admin Panelinə Daxil Ol</Link>
        </div>
      </main>
    </div>
  );
}
