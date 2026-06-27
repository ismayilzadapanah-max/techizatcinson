"use client";

import { useState } from 'react';
import { createInvitation, logActivity } from '@/lib/team';
import { INVITABLE_ROLES, TEAM_ROLES } from '@/lib/constants';
import type { SupplierInvitation, TeamRole } from '@/lib/types';

interface Props {
  supplierId: string;
  currentUserId: string;
  onSuccess: (invitation: SupplierInvitation) => void;
}

export function InviteForm({ supplierId, currentUserId, onSuccess }: Props) {
  const [email, setEmail]       = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone]       = useState('');
  const [role, setRole]         = useState<Exclude<TeamRole, 'owner'>>('viewer');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('E-poçt tələb olunur'); return; }

    setLoading(true);
    const result = await createInvitation({
      supplierId,
      invitedBy: currentUserId,
      email: email.trim(),
      fullName: fullName.trim() || undefined,
      phone: phone.trim() || undefined,
      role,
    });
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.data) {
      await logActivity({
        supplierId,
        userId: currentUserId,
        action: 'işçi_dəvət_edildi',
        entityType: 'invitation',
        entityId: result.data.id,
        details: { email: email.trim(), role },
      });
      setEmail(''); setFullName(''); setPhone(''); setRole('viewer');
      onSuccess(result.data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-[#5D608B] uppercase tracking-wider block mb-1">
            Ad Soyad
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Əli Həsənov"
            className="w-full px-3 py-2.5 rounded-lg border border-[#E9E8EE] bg-[#F3F2F7] text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-[#5D608B] uppercase tracking-wider block mb-1">
            E-poçt <span className="text-[#D47092]">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="isci@shirket.az"
            required
            className="w-full px-3 py-2.5 rounded-lg border border-[#E9E8EE] bg-[#F3F2F7] text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-[#5D608B] uppercase tracking-wider block mb-1">
            Telefon
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+994 50 000 00 00"
            className="w-full px-3 py-2.5 rounded-lg border border-[#E9E8EE] bg-[#F3F2F7] text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-[#5D608B] uppercase tracking-wider block mb-1">
            Rol seç <span className="text-[#D47092]">*</span>
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Exclude<TeamRole, 'owner'>)}
            className="w-full px-3 py-2.5 rounded-lg border border-[#E9E8EE] bg-[#F3F2F7] text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors"
          >
            {INVITABLE_ROLES.map((r) => (
              <option key={r} value={r}>
                {TEAM_ROLES[r]?.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Role description */}
      <div className="px-3 py-2 bg-[#F4F5F9] rounded-lg border border-[#E9E8EE]">
        <p className="text-xs text-[#5D608B]">
          <span className="font-semibold text-[#141647]">{TEAM_ROLES[role]?.label}:</span>{' '}
          {TEAM_ROLES[role]?.description}
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#141647] text-white rounded-lg text-sm font-semibold hover:bg-[#243786] transition-colors disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-[18px]">
          {loading ? 'sync' : 'send'}
        </span>
        {loading ? 'Göndərilir...' : 'Dəvət göndər'}
      </button>
    </form>
  );
}
