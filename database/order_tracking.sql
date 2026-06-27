-- ============================================================
-- Sifariş İzləmə Sistemi — Order Tracking System
-- Techizatcin.com B2B Marketplace
-- ============================================================

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),

  restaurant_id uuid references public.restaurant_profiles(id) on delete set null,
  supplier_id uuid references public.supplier_profiles(id) on delete set null,
  ordered_by uuid references public.profiles(id) on delete set null,

  order_number text unique,
  status text default 'pending' check (
    status in (
      'pending',
      'accepted',
      'preparing',
      'on_delivery',
      'delivered',
      'completed',
      'cancelled',
      'rejected'
    )
  ),

  delivery_address text,
  delivery_date date,
  note text,

  total_amount numeric default 0,

  quality_rating integer check (quality_rating >= 1 and quality_rating <= 5),
  satisfaction_score integer check (satisfaction_score >= 1 and satisfaction_score <= 10),
  satisfaction_note text,

  delivered_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),

  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,

  product_name text,
  quantity numeric not null default 1,
  unit text,
  unit_price numeric,
  total_price numeric,

  created_at timestamptz default now()
);

create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),

  order_id uuid references public.orders(id) on delete cascade,

  old_status text,
  new_status text not null,

  changed_by uuid references public.profiles(id) on delete set null,
  note text,

  created_at timestamptz default now()
);

create table if not exists public.order_reviews (
  id uuid primary key default gen_random_uuid(),

  order_id uuid references public.orders(id) on delete cascade,
  restaurant_id uuid references public.restaurant_profiles(id) on delete set null,
  supplier_id uuid references public.supplier_profiles(id) on delete set null,

  rating integer not null check (rating >= 1 and rating <= 5),
  quality_note text,
  delivery_note text,
  satisfaction_score integer check (satisfaction_score >= 1 and satisfaction_score <= 10),

  created_at timestamptz default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_orders_updated_at on public.orders;

create trigger set_orders_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.order_reviews enable row level security;

drop policy if exists "orders_select_policy" on public.orders;
drop policy if exists "orders_insert_policy" on public.orders;
drop policy if exists "orders_update_policy" on public.orders;
drop policy if exists "orders_delete_policy" on public.orders;

drop policy if exists "order_items_select_policy" on public.order_items;
drop policy if exists "order_items_insert_policy" on public.order_items;
drop policy if exists "order_items_update_policy" on public.order_items;
drop policy if exists "order_items_delete_policy" on public.order_items;

drop policy if exists "order_status_history_select_policy" on public.order_status_history;
drop policy if exists "order_status_history_insert_policy" on public.order_status_history;

drop policy if exists "order_reviews_select_policy" on public.order_reviews;
drop policy if exists "order_reviews_insert_policy" on public.order_reviews;
drop policy if exists "order_reviews_update_policy" on public.order_reviews;
drop policy if exists "order_reviews_delete_policy" on public.order_reviews;

create policy "orders_select_policy"
on public.orders
for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.restaurant_profiles rp
    where rp.id = orders.restaurant_id
      and rp.user_id = auth.uid()
  )
  or exists (
    select 1
    from public.supplier_profiles sp
    where sp.id = orders.supplier_id
      and sp.user_id = auth.uid()
  )
);

create policy "orders_insert_policy"
on public.orders
for insert
to authenticated
with check (
  public.is_admin()
  or exists (
    select 1
    from public.restaurant_profiles rp
    where rp.id = orders.restaurant_id
      and rp.user_id = auth.uid()
  )
);

create policy "orders_update_policy"
on public.orders
for update
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.restaurant_profiles rp
    where rp.id = orders.restaurant_id
      and rp.user_id = auth.uid()
  )
  or exists (
    select 1
    from public.supplier_profiles sp
    where sp.id = orders.supplier_id
      and sp.user_id = auth.uid()
  )
)
with check (
  public.is_admin()
  or exists (
    select 1
    from public.restaurant_profiles rp
    where rp.id = orders.restaurant_id
      and rp.user_id = auth.uid()
  )
  or exists (
    select 1
    from public.supplier_profiles sp
    where sp.id = orders.supplier_id
      and sp.user_id = auth.uid()
  )
);

create policy "orders_delete_policy"
on public.orders
for delete
to authenticated
using (
  public.is_admin()
);

create policy "order_items_select_policy"
on public.order_items
for select
to authenticated
using (
  exists (
    select 1
    from public.orders o
    where o.id = order_items.order_id
      and (
        public.is_admin()
        or exists (
          select 1
          from public.restaurant_profiles rp
          where rp.id = o.restaurant_id
            and rp.user_id = auth.uid()
        )
        or exists (
          select 1
          from public.supplier_profiles sp
          where sp.id = o.supplier_id
            and sp.user_id = auth.uid()
        )
      )
  )
);

create policy "order_items_insert_policy"
on public.order_items
for insert
to authenticated
with check (
  exists (
    select 1
    from public.orders o
    join public.restaurant_profiles rp on rp.id = o.restaurant_id
    where o.id = order_items.order_id
      and (
        public.is_admin()
        or rp.user_id = auth.uid()
      )
  )
);

create policy "order_items_update_policy"
on public.order_items
for update
to authenticated
using (
  public.is_admin()
)
with check (
  public.is_admin()
);

create policy "order_items_delete_policy"
on public.order_items
for delete
to authenticated
using (
  public.is_admin()
);

create policy "order_status_history_select_policy"
on public.order_status_history
for select
to authenticated
using (
  exists (
    select 1
    from public.orders o
    where o.id = order_status_history.order_id
      and (
        public.is_admin()
        or exists (
          select 1
          from public.restaurant_profiles rp
          where rp.id = o.restaurant_id
            and rp.user_id = auth.uid()
        )
        or exists (
          select 1
          from public.supplier_profiles sp
          where sp.id = o.supplier_id
            and sp.user_id = auth.uid()
        )
      )
  )
);

create policy "order_status_history_insert_policy"
on public.order_status_history
for insert
to authenticated
with check (
  public.is_admin()
  or changed_by = auth.uid()
);

create policy "order_reviews_select_policy"
on public.order_reviews
for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.restaurant_profiles rp
    where rp.id = order_reviews.restaurant_id
      and rp.user_id = auth.uid()
  )
  or exists (
    select 1
    from public.supplier_profiles sp
    where sp.id = order_reviews.supplier_id
      and sp.user_id = auth.uid()
  )
);

create policy "order_reviews_insert_policy"
on public.order_reviews
for insert
to authenticated
with check (
  public.is_admin()
  or exists (
    select 1
    from public.restaurant_profiles rp
    where rp.id = order_reviews.restaurant_id
      and rp.user_id = auth.uid()
  )
);

create policy "order_reviews_update_policy"
on public.order_reviews
for update
to authenticated
using (
  public.is_admin()
)
with check (
  public.is_admin()
);

create policy "order_reviews_delete_policy"
on public.order_reviews
for delete
to authenticated
using (
  public.is_admin()
);

create index if not exists idx_orders_restaurant_id on public.orders(restaurant_id);
create index if not exists idx_orders_supplier_id on public.orders(supplier_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_status_history_order_id on public.order_status_history(order_id);
create index if not exists idx_order_reviews_order_id on public.order_reviews(order_id);

notify pgrst, 'reload schema';
