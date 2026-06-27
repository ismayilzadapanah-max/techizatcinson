-- ============================================================
-- Supplier Team Management System
-- Techizatcin.com — run this in Supabase SQL Editor
-- ============================================================

-- ───────────────────────────────────────────────
-- 1. TABLES
-- ───────────────────────────────────────────────

create table if not exists public.supplier_team_members (
  id          uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.supplier_profiles(id) on delete cascade,
  user_id     uuid not null,
  role        text not null check (role in (
    'owner', 'manager', 'orders_manager',
    'stock_manager', 'product_manager', 'finance_manager', 'viewer'
  )),
  is_active   boolean not null default true,
  invited_by  uuid,
  joined_at   timestamptz not null default now(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (supplier_id, user_id)
);

create table if not exists public.supplier_invitations (
  id          uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.supplier_profiles(id) on delete cascade,
  invited_by  uuid,
  email       text not null,
  full_name   text,
  phone       text,
  role        text not null check (role in (
    'manager', 'orders_manager', 'stock_manager',
    'product_manager', 'finance_manager', 'viewer'
  )),
  token       text unique not null,
  status      text not null default 'pending' check (status in (
    'pending', 'accepted', 'expired', 'cancelled'
  )),
  expires_at  timestamptz not null,
  accepted_at timestamptz,
  created_at  timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id          uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.supplier_profiles(id) on delete cascade,
  user_id     uuid,
  action      text not null,
  entity_type text,
  entity_id   text,
  details     jsonb,
  created_at  timestamptz not null default now()
);

-- ───────────────────────────────────────────────
-- 2. UPDATED_AT TRIGGER
-- ───────────────────────────────────────────────

create or replace function public.set_team_member_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists team_members_updated_at on public.supplier_team_members;
create trigger team_members_updated_at
  before update on public.supplier_team_members
  for each row execute function public.set_team_member_updated_at();

-- ───────────────────────────────────────────────
-- 3. HELPER FUNCTIONS (security definer — bypass RLS)
-- ───────────────────────────────────────────────

create or replace function public.get_team_role(p_supplier_id uuid)
returns text
language sql security definer stable
as $$
  select role
  from public.supplier_team_members
  where supplier_id = p_supplier_id
    and user_id = auth.uid()
    and is_active = true
  limit 1
$$;

create or replace function public.is_active_team_member(p_supplier_id uuid)
returns boolean
language sql security definer stable
as $$
  select exists (
    select 1 from public.supplier_team_members
    where supplier_id = p_supplier_id
      and user_id = auth.uid()
      and is_active = true
  )
$$;

create or replace function public.is_team_owner_or_manager(p_supplier_id uuid)
returns boolean
language sql security definer stable
as $$
  select exists (
    select 1 from public.supplier_team_members
    where supplier_id = p_supplier_id
      and user_id = auth.uid()
      and is_active = true
      and role in ('owner', 'manager')
  )
$$;

create or replace function public.get_my_supplier_id()
returns uuid
language sql security definer stable
as $$
  select supplier_id
  from public.supplier_team_members
  where user_id = auth.uid()
    and is_active = true
  limit 1
$$;

-- ───────────────────────────────────────────────
-- 4. INVITATION ACCEPTANCE (security definer)
-- ───────────────────────────────────────────────

create or replace function public.accept_team_invitation(p_token text)
returns jsonb
language plpgsql security definer
as $$
declare
  v_invitation record;
  v_user_id    uuid;
  v_user_email text;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    return jsonb_build_object('error', 'not_authenticated');
  end if;

  select email into v_user_email from auth.users where id = v_user_id;

  select * into v_invitation
  from public.supplier_invitations
  where token = p_token
    and status = 'pending'
    and expires_at > now();

  if not found then
    return jsonb_build_object('error', 'invitation_invalid');
  end if;

  if lower(v_invitation.email) != lower(v_user_email) then
    return jsonb_build_object(
      'error', 'email_mismatch',
      'expected', v_invitation.email
    );
  end if;

  -- Already a member: just accept invitation
  if exists (
    select 1 from public.supplier_team_members
    where supplier_id = v_invitation.supplier_id and user_id = v_user_id
  ) then
    update public.supplier_invitations
    set status = 'accepted', accepted_at = now()
    where id = v_invitation.id;
    return jsonb_build_object(
      'success', true,
      'supplier_id', v_invitation.supplier_id,
      'already_member', true
    );
  end if;

  insert into public.supplier_team_members
    (supplier_id, user_id, role, invited_by, is_active)
  values
    (v_invitation.supplier_id, v_user_id, v_invitation.role,
     v_invitation.invited_by, true);

  update public.supplier_invitations
  set status = 'accepted', accepted_at = now()
  where id = v_invitation.id;

  insert into public.activity_logs
    (supplier_id, user_id, action, entity_type, entity_id, details)
  values
    (v_invitation.supplier_id, v_user_id, 'işçi_dəvəti_qəbul_edildi',
     'team_member', v_user_id::text,
     jsonb_build_object('email', v_user_email, 'role', v_invitation.role));

  return jsonb_build_object(
    'success', true,
    'supplier_id', v_invitation.supplier_id,
    'role', v_invitation.role
  );
end;
$$;

-- ───────────────────────────────────────────────
-- 5. RLS POLICIES
-- ───────────────────────────────────────────────

alter table public.supplier_team_members enable row level security;
alter table public.supplier_invitations  enable row level security;
alter table public.activity_logs         enable row level security;

-- supplier_team_members
drop policy if exists "team_members_select"              on public.supplier_team_members;
drop policy if exists "team_members_insert_owner_manager" on public.supplier_team_members;
drop policy if exists "team_members_insert_self_owner"   on public.supplier_team_members;
drop policy if exists "team_members_update"              on public.supplier_team_members;
drop policy if exists "team_members_delete"              on public.supplier_team_members;

create policy "team_members_select"
  on public.supplier_team_members for select to authenticated
  using (
    public.is_admin()
    or public.is_active_team_member(supplier_id)
  );

-- owner/manager can add members
create policy "team_members_insert_owner_manager"
  on public.supplier_team_members for insert to authenticated
  with check (
    public.is_admin()
    or public.is_team_owner_or_manager(supplier_id)
  );

-- supplier can add themselves as owner during registration
create policy "team_members_insert_self_owner"
  on public.supplier_team_members for insert to authenticated
  with check (
    role = 'owner'
    and user_id = auth.uid()
    and exists (
      select 1 from public.supplier_profiles
      where id = supplier_team_members.supplier_id
        and user_id = auth.uid()
    )
  );

create policy "team_members_update"
  on public.supplier_team_members for update to authenticated
  using  (public.is_admin() or public.is_team_owner_or_manager(supplier_id))
  with check (public.is_admin() or public.is_team_owner_or_manager(supplier_id));

create policy "team_members_delete"
  on public.supplier_team_members for delete to authenticated
  using (
    public.is_admin()
    or public.get_team_role(supplier_id) = 'owner'
  );

-- supplier_invitations
drop policy if exists "invitations_select"  on public.supplier_invitations;
drop policy if exists "invitations_insert"  on public.supplier_invitations;
drop policy if exists "invitations_update"  on public.supplier_invitations;

create policy "invitations_select"
  on public.supplier_invitations for select
  to authenticated, anon
  using (true);

create policy "invitations_insert"
  on public.supplier_invitations for insert to authenticated
  with check (
    public.is_admin()
    or public.is_team_owner_or_manager(supplier_id)
  );

create policy "invitations_update"
  on public.supplier_invitations for update to authenticated
  using (
    public.is_admin()
    or public.is_team_owner_or_manager(supplier_id)
  );

-- activity_logs
drop policy if exists "activity_logs_select" on public.activity_logs;
drop policy if exists "activity_logs_insert" on public.activity_logs;

create policy "activity_logs_select"
  on public.activity_logs for select to authenticated
  using (
    public.is_admin()
    or public.is_active_team_member(supplier_id)
  );

create policy "activity_logs_insert"
  on public.activity_logs for insert to authenticated
  with check (
    public.is_admin()
    or public.is_active_team_member(supplier_id)
  );

-- ───────────────────────────────────────────────
-- 6. INDEXES
-- ───────────────────────────────────────────────

create index if not exists idx_team_members_supplier_id
  on public.supplier_team_members (supplier_id);
create index if not exists idx_team_members_user_id
  on public.supplier_team_members (user_id);
create index if not exists idx_invitations_supplier_id
  on public.supplier_invitations (supplier_id);
create index if not exists idx_invitations_token
  on public.supplier_invitations (token);
create index if not exists idx_invitations_email
  on public.supplier_invitations (lower(email));
create index if not exists idx_activity_logs_supplier_id
  on public.activity_logs (supplier_id);
create index if not exists idx_activity_logs_created_at
  on public.activity_logs (created_at desc);

-- ───────────────────────────────────────────────
-- 7. MIGRATE EXISTING SUPPLIERS → owner entries
-- ───────────────────────────────────────────────

insert into public.supplier_team_members
  (supplier_id, user_id, role, invited_by, is_active)
select sp.id, sp.user_id, 'owner', sp.user_id, true
from public.supplier_profiles sp
where not exists (
  select 1 from public.supplier_team_members tm
  where tm.supplier_id = sp.id and tm.user_id = sp.user_id
)
on conflict (supplier_id, user_id) do nothing;

-- Reload schema cache
notify pgrst, 'reload schema';
