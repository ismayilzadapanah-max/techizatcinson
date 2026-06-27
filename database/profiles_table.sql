-- profiles cədvəli — admin tərəfindən yaradılan bütün istifadəçilər üçün
-- Supabase Dashboard → SQL Editor-da icra et

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null check (role in ('admin', 'supplier', 'supplier_staff', 'restaurant')),
  full_name   text,
  email       text,
  phone       text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- RLS siyasəti
alter table public.profiles enable row level security;

-- Admin hər şeyi oxuya bilər
create policy "Admin can read all profiles"
  on public.profiles for select
  using (
    (select auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Admin insert edə bilər (server-side service_role ilə)
create policy "Service role can insert profiles"
  on public.profiles for insert
  with check (true);

-- Admin update edə bilər
create policy "Service role can update profiles"
  on public.profiles for update
  using (true);
