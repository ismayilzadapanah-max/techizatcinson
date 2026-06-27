"use client";

import { useState } from 'react';
import { TeamRoleBadge } from './TeamRoleBadge';
import { INVITABLE_ROLES, TEAM_ROLES } from '@/lib/constants';
import type { TeamMember, TeamRole } from '@/lib/types';

interface Props {
  member: TeamMember;
  currentUserRole: TeamRole;
  currentUserId: string;
  onRoleChange: (memberId: string, role: Exclude<TeamRole, 'owner'>) => Promise<void>;
  onToggleStatus: (memberId: string, isActive: boolean) => Promise<void>;
  onRemove: (memberId: string) => Promise<void>;
}

export function TeamMemberCard({
  member, currentUserRole, currentUserId,
  onRoleChange, onToggleStatus, onRemove,
}: Props) {
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [selectedRole, setSelectedRole]     = useState<Exclude<TeamRole, 'owner'>>(
    member.role === 'owner' ? 'manager' : member.role as Exclude<TeamRole, 'owner'>
  );
  const [loading, setLoading] = useState<string | null>(null);

  const canManage = (currentUserRole === 'owner' || currentUserRole === 'manager')
    && member.userId !== currentUserId
    && member.role !== 'owner';

  const handleRoleChange = async () => {
    setLoading('role');
    await onRoleChange(member.id, selectedRole);
    setLoading(null);
    setShowRoleSelect(false);
  };

  const handleToggle = async () => {
    setLoading('toggle');
    await onToggleStatus(member.id, !member.isActive);
    setLoading(null);
  };

  const handleRemove = async () => {
    if (!confirm('Bu işçini komandadan silmək istədiyinizə əminsiniz?')) return;
    setLoading('remove');
    await onRemove(member.id);
    setLoading(null);
  };

  const initials = (member.fullName || member.email || '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={`bg-white rounded-xl border p-4 space-y-3 ${member.isActive ? 'border-[#E9E8EE]' : 'border-[#E9E8EE] opacity-60'}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#141647] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#141647] truncate">
              {member.fullName || 'İsimsiz işçi'}
              {member.userId === currentUserId && (
                <span className="ml-1 text-[10px] text-[#9DB1CA]">(siz)</span>
              )}
            </p>
            <p className="text-xs text-[#5D608B] truncate">{member.email || '—'}</p>
          </div>
        </div>
        <span
          className={`flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
            member.isActive
              ? 'bg-green-50 text-green-700 border-green-100'
              : 'bg-red-50 text-red-600 border-red-100'
          }`}
        >
          {member.isActive ? 'Aktiv' : 'Deaktiv'}
        </span>
      </div>

      {/* Role + phone */}
      <div className="flex items-center justify-between">
        <TeamRoleBadge role={member.role} size="sm" />
        {member.phone && (
          <span className="text-[11px] text-[#9DB1CA]">{member.phone}</span>
        )}
      </div>

      <p className="text-[11px] text-[#9DB1CA]">
        Qatıldı: {new Date(member.joinedAt).toLocaleDateString('az-AZ')}
      </p>

      {/* Actions */}
      {canManage && (
        <div className="pt-2 border-t border-[#F3F2F7] space-y-2">
          {showRoleSelect ? (
            <div className="flex gap-2">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as Exclude<TeamRole, 'owner'>)}
                className="flex-1 text-xs px-2 py-1.5 rounded-lg border border-[#E9E8EE] bg-[#F3F2F7] text-[#141647] outline-none"
              >
                {INVITABLE_ROLES.map((r) => (
                  <option key={r} value={r}>{TEAM_ROLES[r]?.label}</option>
                ))}
              </select>
              <button
                onClick={handleRoleChange}
                disabled={loading === 'role'}
                className="px-3 py-1.5 bg-[#141647] text-white rounded-lg text-xs font-semibold disabled:opacity-50"
              >
                {loading === 'role' ? '...' : 'Saxla'}
              </button>
              <button
                onClick={() => setShowRoleSelect(false)}
                className="px-2 py-1.5 text-[#5D608B] text-xs"
              >
                Ləğv
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowRoleSelect(true)}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-[#243786] bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">manage_accounts</span>
                Rol dəyiş
              </button>
              <button
                onClick={handleToggle}
                disabled={loading === 'toggle'}
                className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-colors disabled:opacity-50 ${
                  member.isActive
                    ? 'text-amber-700 bg-amber-50 border-amber-100 hover:bg-amber-100'
                    : 'text-green-700 bg-green-50 border-green-100 hover:bg-green-100'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {member.isActive ? 'person_off' : 'person'}
                </span>
                {member.isActive ? 'Deaktiv et' : 'Aktivləşdir'}
              </button>
              {currentUserRole === 'owner' && (
                <button
                  onClick={handleRemove}
                  disabled={loading === 'remove'}
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[14px]">delete</span>
                  Sil
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
