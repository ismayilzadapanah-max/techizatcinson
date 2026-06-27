import { createClient } from '@/lib/supabase/client';
import type {
  TeamMember, SupplierInvitation, ActivityLog,
  TeamRole, CreateInvitationPayload,
} from '@/lib/types';

// ─── Mappers ──────────────────────────────────────────────────

function mapMember(row: Record<string, unknown>): TeamMember {
  return {
    id:         row.id as string,
    supplierId: row.supplier_id as string,
    userId:     row.user_id as string,
    role:       row.role as TeamRole,
    isActive:   row.is_active as boolean,
    invitedBy:  row.invited_by as string | undefined,
    joinedAt:   row.joined_at as string,
    createdAt:  row.created_at as string,
    updatedAt:  row.updated_at as string,
    fullName:   (row.full_name as string) || undefined,
    email:      (row.email as string) || undefined,
    phone:      (row.phone as string) || undefined,
  };
}

function mapInvitation(row: Record<string, unknown>): SupplierInvitation {
  return {
    id:             row.id as string,
    supplierId:     row.supplier_id as string,
    invitedBy:      row.invited_by as string | undefined,
    email:          row.email as string,
    fullName:       row.full_name as string | undefined,
    phone:          row.phone as string | undefined,
    role:           row.role as TeamRole,
    token:          row.token as string,
    status:         row.status as SupplierInvitation['status'],
    expiresAt:      row.expires_at as string,
    acceptedAt:     row.accepted_at as string | undefined,
    createdAt:      row.created_at as string,
    invitedByName:  (row.invited_by_name as string) || undefined,
    supplierName:   (row.supplier_name as string) || undefined,
  };
}

function mapLog(row: Record<string, unknown>): ActivityLog {
  return {
    id:          row.id as string,
    supplierId:  row.supplier_id as string,
    userId:      row.user_id as string | undefined,
    action:      row.action as string,
    entityType:  row.entity_type as string | undefined,
    entityId:    row.entity_id as string | undefined,
    details:     row.details as Record<string, unknown> | undefined,
    createdAt:   row.created_at as string,
    userName:    (row.user_name as string) || undefined,
  };
}

function generateToken(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ─── Supplier Context ─────────────────────────────────────────

export async function getSupplierContext(
  userId: string
): Promise<{ supplierId: string; teamRole: TeamRole } | null> {
  const supabase = createClient();
  if (!supabase) return null;

  // Try team membership first (works for both owner and staff)
  const { data: member } = await supabase
    .from('supplier_team_members')
    .select('supplier_id, role')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  if (member) {
    return {
      supplierId: member.supplier_id as string,
      teamRole: member.role as TeamRole,
    };
  }

  // Fallback: legacy supplier who hasn't run the migration yet
  const { data: sp } = await supabase
    .from('supplier_profiles')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (sp) {
    return { supplierId: sp.id as string, teamRole: 'owner' };
  }

  return null;
}

// ─── Team Members ─────────────────────────────────────────────

export async function getTeamMembers(supplierId: string): Promise<TeamMember[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('supplier_team_members')
    .select('*')
    .eq('supplier_id', supplierId)
    .order('created_at', { ascending: true });

  if (error || !data) return [];

  // Fetch user info separately to get emails/names
  const userIds = (data as Record<string, unknown>[]).map((r) => r.user_id as string);

  // We can't directly query auth.users from client, so we get what we can
  // The full_name comes from the team member row if stored, otherwise user metadata
  return (data as Record<string, unknown>[]).map(mapMember);
}

export async function updateMemberRole(
  memberId: string,
  newRole: Exclude<TeamRole, 'owner'>
): Promise<{ error?: string }> {
  const supabase = createClient();
  if (!supabase) return { error: 'Xidmət əlçatan deyil' };

  const { error } = await supabase
    .from('supplier_team_members')
    .update({ role: newRole })
    .eq('id', memberId);

  return error ? { error: error.message } : {};
}

export async function toggleMemberStatus(
  memberId: string,
  isActive: boolean
): Promise<{ error?: string }> {
  const supabase = createClient();
  if (!supabase) return { error: 'Xidmət əlçatan deyil' };

  const { error } = await supabase
    .from('supplier_team_members')
    .update({ is_active: isActive })
    .eq('id', memberId);

  return error ? { error: error.message } : {};
}

export async function removeMember(memberId: string): Promise<{ error?: string }> {
  const supabase = createClient();
  if (!supabase) return { error: 'Xidmət əlçatan deyil' };

  const { error } = await supabase
    .from('supplier_team_members')
    .delete()
    .eq('id', memberId);

  return error ? { error: error.message } : {};
}

// ─── Invitations ──────────────────────────────────────────────

export async function getInvitations(supplierId: string): Promise<SupplierInvitation[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('supplier_invitations')
    .select('*')
    .eq('supplier_id', supplierId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return (data as Record<string, unknown>[]).map(mapInvitation);
}

export async function createInvitation(
  payload: CreateInvitationPayload
): Promise<{ data?: SupplierInvitation; error?: string }> {
  const supabase = createClient();
  if (!supabase) return { error: 'Xidmət əlçatan deyil' };

  // Check for existing pending invitation with same email for this supplier
  const { data: existing } = await supabase
    .from('supplier_invitations')
    .select('id')
    .eq('supplier_id', payload.supplierId)
    .eq('email', payload.email.toLowerCase())
    .eq('status', 'pending')
    .maybeSingle();

  if (existing) {
    return { error: 'Bu email üçün artıq aktiv dəvət mövcuddur.' };
  }

  const token = generateToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

  const { data, error } = await supabase
    .from('supplier_invitations')
    .insert({
      supplier_id: payload.supplierId,
      invited_by:  payload.invitedBy,
      email:        payload.email.toLowerCase(),
      full_name:    payload.fullName || null,
      phone:        payload.phone || null,
      role:         payload.role,
      token,
      status:       'pending',
      expires_at:   expiresAt,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  return { data: mapInvitation(data as Record<string, unknown>) };
}

export async function cancelInvitation(invitationId: string): Promise<{ error?: string }> {
  const supabase = createClient();
  if (!supabase) return { error: 'Xidmət əlçatan deyil' };

  const { error } = await supabase
    .from('supplier_invitations')
    .update({ status: 'cancelled' })
    .eq('id', invitationId);

  return error ? { error: error.message } : {};
}

export async function getInvitationByToken(
  token: string
): Promise<SupplierInvitation | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('supplier_invitations')
    .select('*')
    .eq('token', token)
    .single();

  if (error || !data) return null;
  return mapInvitation(data as Record<string, unknown>);
}

export async function acceptInvitation(token: string): Promise<{
  data?: { supplierId: string; role: string };
  error?: string;
}> {
  const supabase = createClient();
  if (!supabase) return { error: 'Xidmət əlçatan deyil' };

  const { data, error } = await supabase.rpc('accept_team_invitation', {
    p_token: token,
  });

  if (error) return { error: error.message };

  const result = data as Record<string, unknown>;
  if (result.error) {
    const errMap: Record<string, string> = {
      not_authenticated:  'Daxil olmamısınız',
      invitation_invalid: 'Dəvət tapılmadı, müddəti bitib və ya artıq istifadə edilib',
      email_mismatch:     'Bu dəvət sizin email-iniz üçün deyil. Dəvət edilmiş email ilə daxil olun',
      already_member:     'Siz artıq bu komandanın üzvüsünüz',
    };
    return { error: errMap[result.error as string] || 'Xəta baş verdi' };
  }

  return {
    data: {
      supplierId: result.supplier_id as string,
      role:       result.role as string,
    },
  };
}

// ─── Activity Logs ────────────────────────────────────────────

export async function getActivityLogs(
  supplierId: string,
  limit = 50
): Promise<ActivityLog[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('supplier_id', supplierId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return (data as Record<string, unknown>[]).map(mapLog);
}

export async function logActivity(params: {
  supplierId: string;
  userId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, unknown>;
}): Promise<void> {
  const supabase = createClient();
  if (!supabase) return;

  await supabase.from('activity_logs').insert({
    supplier_id:  params.supplierId,
    user_id:      params.userId,
    action:       params.action,
    entity_type:  params.entityType || null,
    entity_id:    params.entityId || null,
    details:      params.details || null,
  });
}
