-- ============================================================
-- Supplier Team — FIX: drop & full recreate
-- Supabase SQL Editor-da icra edin
-- ============================================================

-- 1. Köhnə cədvəlləri tam sil
drop table if exists public.activity_logs         cascade;
drop table if exists public.supplier_invitations  cascade;
drop table if exists public.supplier_team_members cascade;

-- Köhnə funksiyaları sil
drop function if exists public.accept_team_invitation(text);
drop function if exists public.get_my_supplier_id();
drop function if exists public.is_team_owner_or_manager(uuid);
drop function if exists public.is_active_team_member(uuid);
drop function if exists public.get_team_role(uuid);
drop function if exists public.set_team_member_updated_at();

-- ============================================================
-- 2. TABLES
-- ============================================================

create table public.supplier_team_members (
  id          uuid        primary key default gen_random_uuid(),
  supplier_id uuid        not null references public.supplier_profiles(id) on delete cascade,
  user_id     uuid        not null,
  role        text        not null check (role in (
                'owner','manager','orders_manager',
                'stock_manager','product_manager','finance_manager','viewer')),
  is_active   boolean     not null default true,
  invited_by  uuid,
  joined_at   timestamptz not null default now(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (supplier_id, user_id)
);

create table public.supplier_invitations (
  id          uuid        primary key default gen_random_uuid(),
  supplier_id uuid        not null references public.supplier_profiles(id) on delete cascade,
  invited_by  uuid,
  email       text        not null,
  full_name   text,
  phone       text,
  role        text        not null check (role in (
                'manager','orders_manager','stock_manager',
                'product_manager','finance_manager','viewer')),
  token       text        unique not null,
  status      text        not null default 'pending' check (status in (
                'pending','accepted','expired','cancelled')),
  expires_at  timestamptz not null,
  accepted_at timestamptz,
  created_at  timestamptz not null default now()
);

create table public.activity_logs (
  id          uuid        primary key default gen_random_uuid(),
  supplier_id uuid        not null references public.supplier_profiles(id) on delete cascade,
  user_id     uuid,
  action      text        not null,
  entity_type text,
  entity_id   text,
  details     jsonb,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- 3. TRIGGER
-- ============================================================

create function public.set_team_member_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger team_members_updated_at
  before update on public.supplier_team_members
  for each row execute function public.set_team_member_updated_at();

-- ============================================================
-- 4. HELPER FUNCTIONS (security definer)
-- ============================================================

create function public.get_team_role(p_supplier_id uuid)
returns text language sql security definer stable as $$
  select role from public.supplier_team_members
  where supplier_id = p_supplier_id and user_id = auth.uid() and is_active = true
  limit 1
$$;

create function public.is_active_team_member(p_supplier_id uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.supplier_team_members
    where supplier_id = p_supplier_id and user_id = auth.uid() and is_active = true
  )
$$;

create function public.is_team_owner_or_manager(p_supplier_id uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.supplier_team_members
    where supplier_id = p_supplier_id and user_id = auth.uid()
      and is_active = true and role in ('owner','manager')
  )
$$;

create function public.get_my_supplier_id()
returns uuid language sql security definer stable as $$
  select supplier_id from public.supplier_team_members
  where user_id = auth.uid() and is_active = true
  limit 1
$$;

-- ============================================================
-- 5. INVITATION ACCEPTANCE
-- ============================================================

create function public.accept_team_invitation(p_token text)
returns jsonb language plpgsql security definer as $$
declare
  v_inv    record;
  v_uid    uuid;
  v_email  text;
begin
  v_uid := auth.uid();
  if v_uid is null then
    return jsonb_build_object('error','not_authenticated');
  end if;

  select email into v_email from auth.users where id = v_uid;

  select * into v_inv
  from public.supplier_invitations
  where token = p_token and status = 'pending' and expires_at > now();

  if not found then
    return jsonb_build_object('error','invitation_invalid');
  end if;

  if lower(v_inv.email) != lower(v_email) then
    return jsonb_build_object('error','email_mismatch','expected',v_inv.email);
  end if;

  if exists (
    select 1 from public.supplier_team_members
    where supplier_id = v_inv.supplier_id and user_id = v_uid
  ) then
    update public.supplier_invitations
    set status = 'accepted', accepted_at = now()
    where id = v_inv.id;
    return jsonb_build_object('success',true,'supplier_id',v_inv.supplier_id,'already_member',true);
  end if;

  insert into public.supplier_team_members (supplier_id, user_id, role, invited_by, is_active)
  values (v_inv.supplier_id, v_uid, v_inv.role, v_inv.invited_by, true);

  update public.supplier_invitations
  set status = 'accepted', accepted_at = now()
  where id = v_inv.id;

  insert into public.activity_logs (supplier_id, user_id, action, entity_type, entity_id, details)
  values (v_inv.supplier_id, v_uid, 'işçi_dəvəti_qəbul_edildi', 'team_member', v_uid::text,
          jsonb_build_object('email', v_email, 'role', v_inv.role));

  return jsonb_build_object('success',true,'supplier_id',v_inv.supplier_id,'role',v_inv.role);
end;
$$;

-- ============================================================
-- 6. RLS
-- ============================================================

alter table public.supplier_team_members enable row level security;
alter table public.supplier_invitations  enable row level security;
alter table public.activity_logs         enable row level security;

-- supplier_team_members
create policy "stm_select"
  on public.supplier_team_members for select to authenticated
  using (public.is_admin() or public.is_active_team_member(supplier_id));

create policy "stm_insert_manager"
  on public.supplier_team_members for insert to authenticated
  with check (public.is_admin() or public.is_team_owner_or_manager(supplier_id));

create policy "stm_insert_self_owner"
  on public.supplier_team_members for insert to authenticated
  with check (
    role = 'owner' and user_id = auth.uid()
    and exists (
      select 1 from public.supplier_profiles
      where id = supplier_team_members.supplier_id and user_id = auth.uid()
    )
  );

create policy "stm_update"
  on public.supplier_team_members for update to authenticated
  using  (public.is_admin() or public.is_team_owner_or_manager(supplier_id))
  with check (public.is_admin() or public.is_team_owner_or_manager(supplier_id));

create policy "stm_delete"
  on public.supplier_team_members for delete to authenticated
  using (public.is_admin() or public.get_team_role(supplier_id) = 'owner');

-- supplier_invitations
create policy "si_select"
  on public.supplier_invitations for select to authenticated, anon
  using (true);

create policy "si_insert"
  on public.supplier_invitations for insert to authenticated
  with check (public.is_admin() or public.is_team_owner_or_manager(supplier_id));

create policy "si_update"
  on public.supplier_invitations for update to authenticated
  using (public.is_admin() or public.is_team_owner_or_manager(supplier_id));

-- activity_logs
create policy "al_select"
  on public.activity_logs for select to authenticated
  using (public.is_admin() or public.is_active_team_member(supplier_id));

create policy "al_insert"
  on public.activity_logs for insert to authenticated
  with check (public.is_admin() or public.is_active_team_member(supplier_id));

-- ============================================================
-- 7. INDEXES
-- ============================================================

create index idx_stm_supplier on public.supplier_team_members (supplier_id);
create index idx_stm_user     on public.supplier_team_members (user_id);
create index idx_si_supplier  on public.supplier_invitations  (supplier_id);
create index idx_si_token     on public.supplier_invitations  (token);
create index idx_si_email     on public.supplier_invitations  (lower(email));
create index idx_al_supplier  on public.activity_logs         (supplier_id);
create index idx_al_created   on public.activity_logs         (created_at desc);

-- ============================================================
-- 8. MIGRATE: mövcud supplier-ları owner kimi əlavə et
-- ============================================================

insert into public.supplier_team_members (supplier_id, user_id, role, invited_by, is_active)
select sp.id, sp.user_id, 'owner', sp.user_id, true
from public.supplier_profiles sp
where not exists (
  select 1 from public.supplier_team_members tm
  where tm.supplier_id = sp.id and tm.user_id = sp.user_id
)
on conflict (supplier_id, user_id) do nothing;

-- Schema cache yenilə
notify pgrst, 'reload schema';
