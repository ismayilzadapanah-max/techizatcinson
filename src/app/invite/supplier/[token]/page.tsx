"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getInvitationByToken, acceptInvitation } from "@/lib/team";
import { TeamRoleBadge } from "@/components/team/TeamRoleBadge";
import { TEAM_ROLES, SITE } from "@/lib/constants";
import type { SupplierInvitation } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

export default function InviteAcceptPage() {
  const params  = useParams();
  const router  = useRouter();
  const token   = params?.token as string;

  const { user, isLoggedIn, loading: authLoading } = useAuth();

  const [invitation, setInvitation]   = useState<SupplierInvitation | null>(null);
  const [loadingInv, setLoadingInv]   = useState(true);
  const [accepting, setAccepting]     = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState(false);

  // Register form state (for new users)
  const [registerMode, setRegisterMode] = useState(false);
  const [fullName, setFullName]         = useState("");
  const [password, setPassword]         = useState("");
  const [regLoading, setRegLoading]     = useState(false);
  const [regError, setRegError]         = useState("");

  useEffect(() => {
    if (!token) return;
    setLoadingInv(true);
    getInvitationByToken(token).then((inv) => {
      setInvitation(inv);
      setLoadingInv(false);
    });
  }, [token]);

  // Auto-fill email in register mode
  useEffect(() => {
    if (invitation?.fullName) setFullName(invitation.fullName);
  }, [invitation]);

  const handleAccept = async () => {
    setAccepting(true);
    setError("");
    const result = await acceptInvitation(token);
    setAccepting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push("/account/supplier"), 2500);
  };

  const handleRegisterAndAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitation?.email || !password) return;
    setRegLoading(true);
    setRegError("");

    const supabase = createClient();
    if (!supabase) { setRegError("Xidmət əlçatan deyil"); setRegLoading(false); return; }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: invitation.email,
      password,
      options: {
        data: {
          full_name: fullName.trim() || invitation.fullName || "",
          role: "supplier_staff",
        },
      },
    });

    if (signUpError) {
      const lower = signUpError.message.toLowerCase();
      if (lower.includes("already registered") || lower.includes("already exists")) {
        setRegError("Bu email artıq qeydiyyatdan keçib. Zəhmət olmasa daxil olun.");
      } else {
        setRegError(signUpError.message);
      }
      setRegLoading(false);
      return;
    }

    if (data?.user) {
      // Try to accept invitation directly (user might need email confirmation first)
      const result = await acceptInvitation(token);
      if (result.error && result.error !== "Daxil olmamısınız") {
        setRegError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/account/supplier"), 3000);
      }
    } else {
      // Email confirmation required
      setSuccess(true);
    }
    setRegLoading(false);
  };

  // ─── Loading ──────────────────────────────────────────
  if (loadingInv || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F9]">
        <span className="material-symbols-outlined text-4xl text-[#243786] animate-spin">sync</span>
      </div>
    );
  }

  // ─── Invalid / expired ───────────────────────────────
  if (!invitation || invitation.status !== "pending" || new Date(invitation.expiresAt) < new Date()) {
    const isExpired = invitation && new Date(invitation.expiresAt) < new Date();
    const isUsed    = invitation && invitation.status === "accepted";
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F9] p-4">
        <div className="bg-white rounded-2xl border border-[#E9E8EE] shadow-lg p-8 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-3xl text-red-400">
              {isUsed ? "check_circle" : "link_off"}
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#141647]">
            {isUsed ? "Dəvət artıq istifadə edilib" : isExpired ? "Dəvətin müddəti bitib" : "Dəvət tapılmadı"}
          </h2>
          <p className="text-sm text-[#5D608B]">
            {isUsed
              ? "Bu dəvət linki artıq qəbul edilib."
              : isExpired
              ? "Bu dəvət linki 7 gün ərzindən artıq müddət keçib. Şirkətdən yeni dəvət istəyin."
              : "Bu link yanlışdır. Dəvət emailinizi yenidən yoxlayın."}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#141647] text-white rounded-lg text-sm font-semibold hover:bg-[#243786] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            Ana səhifəyə qayıt
          </Link>
        </div>
      </div>
    );
  }

  // ─── Success ─────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F9] p-4">
        <div className="bg-white rounded-2xl border border-[#E9E8EE] shadow-lg p-8 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-3xl text-green-500">check_circle</span>
          </div>
          <h2 className="text-xl font-bold text-[#141647]">Dəvət qəbul edildi!</h2>
          <p className="text-sm text-[#5D608B]">
            {!isLoggedIn
              ? "E-poçtunuzu təsdiqləyin, daha sonra sistem panelinə daxil ola bilərsiniz."
              : "Yönləndirilirsiniz..."}
          </p>
          {isLoggedIn && (
            <div className="w-8 h-8 border-2 border-[#243786] border-t-transparent rounded-full animate-spin mx-auto" />
          )}
        </div>
      </div>
    );
  }

  // ─── Main invite page ────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F5F9] p-4">
      <div className="bg-white rounded-2xl border border-[#E9E8EE] shadow-lg p-8 max-w-md w-full space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#243786] text-2xl">hub</span>
          <span className="font-black text-[#141647] text-lg tracking-tight">{SITE.name}</span>
        </div>

        {/* Invite banner */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#5D608B] text-sm">
            <span className="material-symbols-outlined text-[18px]">mail</span>
            Sizə komanda dəvəti gönderildi
          </div>
          <h1 className="text-xl font-bold text-[#141647]">
            Şirkətin komanda üzvü olmağa dəvət edildiniz
          </h1>
        </div>

        {/* Details card */}
        <div className="bg-[#F4F5F9] rounded-xl border border-[#E9E8EE] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5D608B] font-medium">Dəvət edilən:</span>
            <span className="text-sm font-semibold text-[#141647]">{invitation.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5D608B] font-medium">Rol:</span>
            <TeamRoleBadge role={invitation.role} size="md" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5D608B] font-medium">İcazələr:</span>
            <span className="text-xs text-[#141647]">{TEAM_ROLES[invitation.role]?.description}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5D608B] font-medium">Son tarix:</span>
            <span className="text-xs text-[#141647]">
              {new Date(invitation.expiresAt).toLocaleDateString("az-AZ")}
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
            <span className="material-symbols-outlined text-[18px] flex-shrink-0">error</span>
            {error}
          </div>
        )}

        {/* ── Logged in ── */}
        {isLoggedIn && user ? (
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
              <span className="font-semibold">{user.email}</span> hesabı ilə daxilsiniz.
              {user.email?.toLowerCase() !== invitation.email.toLowerCase() && (
                <p className="text-xs mt-1 text-red-600 font-medium">
                  ⚠ Bu dəvət <strong>{invitation.email}</strong> üçündür. Fərqli hesab ilə daxil olun.
                </p>
              )}
            </div>
            <button
              onClick={handleAccept}
              disabled={accepting || user.email?.toLowerCase() !== invitation.email.toLowerCase()}
              className="w-full py-3 bg-[#141647] text-white rounded-xl font-semibold text-sm hover:bg-[#243786] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {accepting
                ? <><span className="material-symbols-outlined text-[18px] animate-spin">sync</span> Qəbul edilir...</>
                : <><span className="material-symbols-outlined text-[18px]">group_add</span> Dəvəti qəbul et</>
              }
            </button>
          </div>
        ) : registerMode ? (
          /* ── Register form ── */
          <form onSubmit={handleRegisterAndAccept} className="space-y-4">
            <h3 className="text-base font-semibold text-[#141647]">Qeydiyyatdan keç</h3>
            <div>
              <label className="text-xs font-semibold text-[#5D608B] uppercase tracking-wider block mb-1">Ad Soyad</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Adınız Soyadınız"
                className="w-full px-3 py-2.5 rounded-lg border border-[#E9E8EE] bg-[#F3F2F7] text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#5D608B] uppercase tracking-wider block mb-1">E-poçt</label>
              <input
                type="email"
                value={invitation.email}
                readOnly
                className="w-full px-3 py-2.5 rounded-lg border border-[#E9E8EE] bg-[#E9E8EE]/60 text-sm text-[#5D608B] outline-none cursor-not-allowed"
              />
              <p className="text-[11px] text-[#9DB1CA] mt-1">Dəvət edilmiş email — dəyişdirilə bilməz</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#5D608B] uppercase tracking-wider block mb-1">Şifrə</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 simvol"
                required
                minLength={6}
                className="w-full px-3 py-2.5 rounded-lg border border-[#E9E8EE] bg-[#F3F2F7] text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors"
              />
            </div>
            {regError && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
                <span className="material-symbols-outlined text-[18px] flex-shrink-0">error</span>
                {regError}
              </div>
            )}
            <button
              type="submit"
              disabled={regLoading}
              className="w-full py-3 bg-[#141647] text-white rounded-xl font-semibold text-sm hover:bg-[#243786] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {regLoading
                ? <><span className="material-symbols-outlined text-[18px] animate-spin">sync</span> Qeydiyyat...</>
                : <><span className="material-symbols-outlined text-[18px]">person_add</span> Qeydiyyat & Qəbul et</>
              }
            </button>
            <button
              type="button"
              onClick={() => setRegisterMode(false)}
              className="w-full text-sm text-[#5D608B] hover:text-[#141647] transition-colors"
            >
              ← Geri
            </button>
          </form>
        ) : (
          /* ── Not logged in — choose action ── */
          <div className="space-y-3">
            <button
              onClick={() => setRegisterMode(true)}
              className="w-full py-3 bg-[#141647] text-white rounded-xl font-semibold text-sm hover:bg-[#243786] transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              Hesab yarat və qəbul et
            </button>
            <Link
              href={`/login?redirect=/invite/supplier/${token}`}
              className="w-full py-3 border border-[#E9E8EE] bg-white text-[#141647] rounded-xl font-semibold text-sm hover:bg-[#F4F5F9] transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              Mövcud hesabla daxil ol
            </Link>
            <p className="text-[11px] text-[#9DB1CA] text-center">
              Dəvəti qəbul etmək üçün <strong>{invitation.email}</strong> email-i ilə hesab açın
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
