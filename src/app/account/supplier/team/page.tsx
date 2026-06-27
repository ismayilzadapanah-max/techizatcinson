"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { useTeamPermissions } from "@/lib/use-team-permissions";
import {
  getTeamMembers, getInvitations, cancelInvitation,
  updateMemberRole, toggleMemberStatus, removeMember, logActivity,
} from "@/lib/team";
import { InviteForm } from "@/components/team/InviteForm";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import { TeamMemberTable } from "@/components/team/TeamMemberTable";
import { TeamRoleBadge } from "@/components/team/TeamRoleBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { TEAM_ROLES } from "@/lib/constants";
import type { TeamMember, SupplierInvitation, TeamRole } from "@/lib/types";

function CopyLinkButton({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);
  const link = `${typeof window !== "undefined" ? window.location.origin : ""}/invite/supplier/${token}`;

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#243786] bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors"
    >
      <span className="material-symbols-outlined text-[15px]">
        {copied ? "check" : "content_copy"}
      </span>
      {copied ? "Kopyalandı!" : "Linki kopyala"}
    </button>
  );
}

export default function SupplierTeamPage() {
  const { user } = useAuth();
  const { supplierId, teamRole, loading: permLoading, isOwnerOrManager, can } = useTeamPermissions();

  const [members, setMembers]         = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<SupplierInvitation[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab]     = useState<"members" | "invitations">("members");
  const [showInviteForm, setShowInviteForm] = useState(false);

  const loadData = useCallback(async () => {
    if (!supplierId) return;
    setLoadingData(true);
    const [ms, invs] = await Promise.all([
      getTeamMembers(supplierId),
      getInvitations(supplierId),
    ]);
    setMembers(ms);
    setInvitations(invs);
    setLoadingData(false);
  }, [supplierId]);

  useEffect(() => {
    if (supplierId) loadData();
  }, [supplierId, loadData]);

  const handleRoleChange = async (memberId: string, newRole: Exclude<TeamRole, "owner">) => {
    const res = await updateMemberRole(memberId, newRole);
    if (!res.error && user && supplierId) {
      await logActivity({
        supplierId,
        userId: user.id,
        action: "rol_dəyişdirildi",
        entityType: "team_member",
        entityId: memberId,
        details: { new_role: newRole },
      });
      setMembers((prev) =>
        prev.map((m) => m.id === memberId ? { ...m, role: newRole } : m)
      );
    }
  };

  const handleToggleStatus = async (memberId: string, isActive: boolean) => {
    const res = await toggleMemberStatus(memberId, isActive);
    if (!res.error && user && supplierId) {
      await logActivity({
        supplierId,
        userId: user.id,
        action: isActive ? "işçi_aktivləşdirildi" : "işçi_deaktiv_edildi",
        entityType: "team_member",
        entityId: memberId,
      });
      setMembers((prev) =>
        prev.map((m) => m.id === memberId ? { ...m, isActive } : m)
      );
    }
  };

  const handleRemove = async (memberId: string) => {
    const res = await removeMember(memberId);
    if (!res.error && user && supplierId) {
      await logActivity({
        supplierId,
        userId: user.id,
        action: "işçi_silindi",
        entityType: "team_member",
        entityId: memberId,
      });
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    }
  };

  const handleCancelInvitation = async (invId: string) => {
    const res = await cancelInvitation(invId);
    if (!res.error) {
      setInvitations((prev) =>
        prev.map((i) => i.id === invId ? { ...i, status: "cancelled" as const } : i)
      );
    }
  };

  if (permLoading || loadingData) {
    return (
      <div className="flex items-center justify-center py-24">
        <span className="material-symbols-outlined text-4xl text-[#243786] animate-spin">sync</span>
      </div>
    );
  }

  if (!supplierId) {
    return (
      <div className="bg-white rounded-xl border border-[#E9E8EE] p-12">
        <EmptyState
          icon="group_off"
          title="Komanda məlumatı tapılmadı"
          description="Komanda idarəsi üçün təchizatçı hesabınız olmalıdır."
        />
      </div>
    );
  }

  if (!can("view")) {
    return (
      <div className="bg-white rounded-xl border border-[#E9E8EE] p-12">
        <EmptyState
          icon="lock"
          title="Bu əməliyyat üçün icazəniz yoxdur"
          description="Komanda səhifəsinə yalnız müvafiq icazəsi olan üzvlər daxil ola bilər."
        />
      </div>
    );
  }

  const pendingInvites = invitations.filter((i) => i.status === "pending");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#141647]">Komanda</h2>
          <p className="text-sm text-[#5D608B] mt-0.5">
            {members.length} üzv · {pendingInvites.length} gözləyən dəvət
          </p>
        </div>
        {can("team") && (
          <button
            onClick={() => setShowInviteForm((v) => !v)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#141647] text-white rounded-lg text-sm font-semibold hover:bg-[#243786] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              {showInviteForm ? "close" : "person_add"}
            </span>
            {showInviteForm ? "Ləğv et" : "İşçi dəvət et"}
          </button>
        )}
      </div>

      {/* Invite form */}
      {showInviteForm && can("team") && user && (
        <div className="bg-white rounded-xl border border-[#E9E8EE] p-6">
          <h3 className="text-base font-semibold text-[#141647] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#243786]">person_add</span>
            Yeni işçi dəvəti
          </h3>
          <InviteForm
            supplierId={supplierId}
            currentUserId={user.id}
            onSuccess={(inv) => {
              setInvitations((prev) => [inv, ...prev]);
              setShowInviteForm(false);
              setActiveTab("invitations");
            }}
          />
        </div>
      )}

      {/* Role overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {Object.entries(TEAM_ROLES).map(([key, cfg]) => {
          const count = members.filter((m) => m.role === key).length;
          return (
            <div key={key} className="bg-white rounded-xl border border-[#E9E8EE] p-3 text-center">
              <p className="text-xl font-bold text-[#141647]">{count}</p>
              <p className="text-[10px] text-[#5D608B] mt-0.5 leading-tight">{cfg.label}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#F3F2F7] rounded-lg w-fit">
        {([
          { key: "members", label: "Üzvlər", count: members.length },
          { key: "invitations", label: "Dəvətlər", count: pendingInvites.length },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-white text-[#141647] shadow-sm"
                : "text-[#5D608B] hover:text-[#141647]"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key
                  ? "bg-[#141647] text-white"
                  : "bg-[#E9E8EE] text-[#5D608B]"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Members Tab */}
      {activeTab === "members" && (
        <>
          {members.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E9E8EE] p-12">
              <EmptyState
                icon="group"
                title="Komanda üzvü yoxdur"
                description="İşçiləri dəvət etmək üçün yuxarıdakı düyməni istifadə edin."
              />
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block bg-white rounded-xl border border-[#E9E8EE] p-6">
                <TeamMemberTable
                  members={members}
                  currentUserRole={teamRole!}
                  currentUserId={user?.id || ""}
                  onRoleChange={handleRoleChange}
                  onToggleStatus={handleToggleStatus}
                  onRemove={handleRemove}
                />
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {members.map((m) => (
                  <TeamMemberCard
                    key={m.id}
                    member={m}
                    currentUserRole={teamRole!}
                    currentUserId={user?.id || ""}
                    onRoleChange={handleRoleChange}
                    onToggleStatus={handleToggleStatus}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Invitations Tab */}
      {activeTab === "invitations" && (
        <div className="space-y-3">
          {invitations.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E9E8EE] p-12">
              <EmptyState
                icon="mail"
                title="Dəvət yoxdur"
                description="Hələ heç bir işçiyə dəvət göndərilməyib."
              />
            </div>
          ) : (
            invitations.map((inv) => (
              <div
                key={inv.id}
                className="bg-white rounded-xl border border-[#E9E8EE] p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#F3F2F7] border border-[#E9E8EE] flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[18px] text-[#9DB1CA]">mail</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#141647]">
                        {inv.fullName || inv.email}
                      </p>
                      <p className="text-xs text-[#5D608B]">{inv.email}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <TeamRoleBadge role={inv.role} />
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          inv.status === "pending"
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : inv.status === "accepted"
                            ? "bg-green-50 text-green-700 border-green-100"
                            : "bg-gray-50 text-gray-500 border-gray-100"
                        }`}>
                          {inv.status === "pending" ? "Gözləyir"
                            : inv.status === "accepted" ? "Qəbul edildi"
                            : inv.status === "cancelled" ? "Ləğv edildi"
                            : "Müddəti bitdi"}
                        </span>
                        <span className="text-[11px] text-[#9DB1CA]">
                          {new Date(inv.expiresAt).toLocaleDateString("az-AZ")} tarixinə qədər
                        </span>
                      </div>
                    </div>
                  </div>

                  {inv.status === "pending" && can("team") && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <CopyLinkButton token={inv.token} />
                      <button
                        onClick={() => handleCancelInvitation(inv.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[15px]">close</span>
                        Ləğv et
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
