"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email) {
      setError("E-poçt ünvanı daxil edin");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      if (!supabase) {
        setError("Xidmət hazır deyil. Zəhmət olmasa sonra cəhd edin.");
        setLoading(false);
        return;
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/reset-password`,
      });

      if (resetError) {
        setError(
          resetError.message === "User not found"
            ? "Bu e-poçt ünvanı sistemdə tapılmadı"
            : "Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin."
        );
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      setError("Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F9] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-[#E9E8EE] p-8">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <span className="material-symbols-outlined text-[#243786] text-3xl">hub</span>
            <span className="text-lg font-black text-[#141647]">Techizatcin</span>
          </Link>

          {!submitted ? (
            <>
              <h1 className="text-2xl font-bold text-[#141647] text-center mb-2">
                Şifrəni Sıfırla
              </h1>
              <p className="text-sm text-[#5D608B] text-center mb-6">
                Qeydiyyatlı e-poçt ünvanınızı daxil edin, şifrə sıfırlama bağlantısı göndərəcəyik.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#141647] mb-2">
                    E-poçt Ünvanı
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@domain.az"
                    className="w-full px-4 py-3 rounded-lg border border-[#E9E8EE] focus:outline-none focus:border-[#243786] transition-colors text-[#141647]"
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#243786] text-white py-3 rounded-lg font-semibold hover:bg-[#141647] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Göndərilir..." : "Sıfırlama Bağlantısı Göndər"}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-[#E9E8EE] text-center">
                <p className="text-sm text-[#5D608B] mb-2">Şifrənizi xatırlayırsınız?</p>
                <Link href="/login" className="text-[#243786] hover:underline font-semibold text-sm">
                  Daxil olun
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-green-600">
                    check_circle
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#141647] text-center mb-2">
                Bağlantı Göndərildi
              </h2>
              <p className="text-sm text-[#5D608B] text-center mb-6">
                Şifrə sıfırlama bağlantısı <strong>{email}</strong> ünvanına göndərildi. Zəhmət olmasa
                e-poçt qutunuzu yoxlayın.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-700">
                <p className="mb-2 font-semibold">💡 İp:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Spam qutunuzu da yoxlayın</li>
                  <li>Bağlantı 1 saat müddətində işləyəcək</li>
                </ul>
              </div>

              <Link
                href="/login"
                className="block w-full bg-[#243786] text-white text-center py-3 rounded-lg font-semibold hover:bg-[#141647] transition-colors"
              >
                Daxil Olunuş Səhifəsinə Qayıt
              </Link>
            </>
          )}
        </div>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-[#243786] hover:underline font-semibold text-sm">
            ← Əsas səhifəyə qayıt
          </Link>
        </div>
      </div>
    </div>
  );
}
