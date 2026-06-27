"use client";

import { useState } from 'react';
import { TeamRoleBadge } from './TeamRoleBadge';
import { INVITABLE_ROLES, TEAM_ROLES } from '@/lib/constants';
import type { TeamMember, TeamRole } from '@/lib/types';

interface Props {
  members: TeamMember[];
  currentUserRole: TeamRole;
  currentUserId: string;
  onRoleChange: (memberId: string, role: Exclude<TeamRole, 'owner'>) => Promise<void>;
  onToggleStatus: (memberId: string, isActive: boolean) => Promise<void>;
  onRemove: (memberId: string) => Promise<void>;
}

export function TeamMemberTable({
  members, currentUserRole, currentUserId,
  onRoleChange, onToggleStatus, onRemove,
}: Props) {
  const [editingId, setEditingId]       = useState<string | null>(null);
  const [editingRole, setEditingRole]   = useState<Exclude<TeamRole, 'owner'>>('viewer');
  const [loadingId, setLoadingId]       = useState<string | null>(null);

  const canManage = (m: TeamMember) =>
    (currentUserRole === 'owner' || currentUserRole === 'manager')
    && m.userId !== currentUserId
    && m.role !== 'owner';

  const startEdit = (m: TeamMember) => {
    setEditingId(m.id);
    setEditingRole(
      m.role === 'owner' ? 'manager' : m.role as Exclude<TeamRole, 'owner'>
    );
  };

  const saveRole = async (memberId: string) => {
    setLoadingId(memberId);
    await onRoleChange(memberId, editingRole);
    setLoadingId(null);
    setEditingId(null);
  };

  const handleToggle = async (m: TeamMember) => {
    setLoadingId(m.id);
    await onToggleStatus(m.id, !m.isActive);
    setLoadingId(null);
  };

  const handleRemove = async (m: TeamMember) => {
    if (!confirm(`${m.fullName || m.email} adlı işçini silmək istədiyinizə əminsiniz?`)) return;
    setLoadingId(m.id);
    await onRemove(m.id);
    setLoadingId(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E9E8EE]">
            {['İşçi', 'Rol', 'Status', 'Qatıldı', 'Əməliyyat'].map((h) => (
              <th key={h} className="text-left text-[11px] font-semibold text-[#5D608B] uppercase tracking-wider py-3 px-4 first:pl-0 last:pr-0">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F3F2F7]">
          {members.map((m) => {
            const initials = (m.fullName || m.email || '?')
              .split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
            const busy = loadingId === m.id;

            return (
              <tr key={m.id} className={`transition-colors hover:bg-[#F4F5F9]/50 ${!m.isActive ? 'opacity-60' : ''}`}>
                {/* İşçi */}
                <td className="py-3 pl-0 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#141647] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{initials}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[#141647] truncate">
                        {m.fullName || 'İsimsiz'}
                        {m.userId === currentUserId && (
                          <span className="ml-1 text-[10px] text-[#9DB1CA]">(siz)</span>
                        )}
                      </p>
                      <p className="text-[11px] text-[#5D608B] truncate">{m.email || '—'}</p>
                    </div>
                  </div>
                </td>

                {/* Rol */}
                <td className="py-3 px-4">
                  {editingId === m.id ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={editingRole}
                        onChange={(e) => setEditingRole(e.target.value as Exclude<TeamRole, 'owner'>)}
                        className="text-xs px-2 py-1 rounded border border-[#E9E8EE] bg-[#F3F2F7] text-[#141647] outline-none"
                      >
                        {INVITABLE_ROLES.map((r) => (
                          <option key={r} value={r}>{TEAM_ROLES[r]?.label}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => saveRole(m.id)}
                        disabled={busy}
                        className="text-[11px] px-2 py-1 bg-[#141647] text-white rounded font-semibold disabled:opacity-50"
                      >
                        {busy ? '...' : 'Saxla'}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-[11px] text-[#5D608B] px-1"
                      >
                        Ləğv
                      </button>
                    </div>
                  ) : (
                    <TeamRoleBadge role={m.role} />
                  )}
                </td>

                {/* Status */}
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                    m.isActive
                      ? 'bg-green-50 text-green-700 border-green-100'
                      : 'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full inline-block bg-current" />
                    {m.isActive ? 'Aktiv' : 'Deaktiv'}
                  </span>
                </td>

                {/* Tarix */}
                <td className="py-3 px-4">
                  <span className="text-[#5D608B] text-xs">
                    {new Date(m.joinedAt).toLocaleDateString('az-AZ')}
                  </span>
                </td>

                {/* Əməliyyatlar */}
                <td className="py-3 pl-4 pr-0">
                  {canManage(m) && editingId !== m.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        title="Rol dəyiş"
                        onClick={() => startEdit(m)}
                        className="p-1.5 text-[#243786] hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                      </button>
                      <button
                        title={m.isActive ? 'Deaktiv et' : 'Aktivləşdir'}
                        onClick={() => handleToggle(m)}
                        disabled={busy}
                        className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {m.isActive ? 'person_off' : 'person'}
                        </span>
                      </button>
                      {currentUserRole === 'owner' && (
                        <button
                          title="Sil"
                          onClick={() => handleRemove(m)}
                          disabled={busy}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-[#9DB1CA] text-xs">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
