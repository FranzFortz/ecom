-- =============================================================================
-- M-Zone Gadgets — schema for Supabase SQL Editor
--
-- Run FIRST, then seed.sql.
-- App: Next.js + Supabase Auth, orders (payment_method: gcash | cash | card),
--      order status: pending | processing | shipped | delivered | cancelled,
--      customer notifications (Realtime), admin_notifications (API + polling).
--
-- Re-running: most statements are idempotent. Realtime block skips tables already
-- in publication. If a CHECK constraint fails, fix legacy row data and re-run.
-- =============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- categories  (optional; app falls back to distinct products.category)
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null
);

comment on table public.categories is 'Storefront category list; seed aligns with products.category slug.';

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  price numeric(10, 2) not null,
  compare_price numeric(10, 2),
  sku text unique not null,
  stock integer not null default 0,
  category text,
  images text[],
  variants jsonb,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.products add column if not exists description text;
alter table public.products add column if not exists compare_price numeric(10, 2);
alter table public.products add column if not exists category text;
alter table public.products add column if not exists images text[];
alter table public.products add column if not exists variants jsonb;
alter table public.products add column if not exists is_featured boolean not null default false;

create index if not exists products_category_idx on public.products (category);
create index if not exists products_is_featured_idx on public.products (is_featured)
  where is_featured = true;

-- ---------------------------------------------------------------------------
-- profiles  (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  phone text,
  address jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  status text not null default 'pending',
  total numeric(10, 2) not null,
  shipping_info jsonb not null default '{}'::jsonb,
  items jsonb not null default '[]'::jsonb,
  payment_method text,
  created_at timestamptz not null default now()
);

alter table public.orders drop constraint if exists orders_payment_method_check;
alter table public.orders add constraint orders_payment_method_check check (
  payment_method is null
  or payment_method in ('gcash', 'cash', 'card')
);

alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check check (
  status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')
);

create index if not exists orders_user_id_created_at_idx
  on public.orders (user_id, created_at desc);

comment on table public.orders is 'Checkout orders; status updated from admin UI; matches src/shared/constants/order-status.ts.';

-- ---------------------------------------------------------------------------
-- notifications  (customer inbox; INSERT via service role from API only)
-- kind examples: order_placed, order_status
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null,
  title text not null,
  body text,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_created_idx
  on public.notifications (user_id, created_at desc);

create index if not exists notifications_user_unread_idx
  on public.notifications (user_id)
  where read_at is null;

comment on table public.notifications is 'Per-customer alerts; Realtime INSERT for bell UI; RLS select/update own.';

-- ---------------------------------------------------------------------------
-- admin_notifications  (control center inbox; service role only)
-- kind examples: customer_order
-- ---------------------------------------------------------------------------
create table if not exists public.admin_notifications (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  title text not null,
  body text,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists admin_notifications_created_idx
  on public.admin_notifications (created_at desc);

create index if not exists admin_notifications_unread_idx
  on public.admin_notifications (created_at desc)
  where read_at is null;

comment on table public.admin_notifications is 'Admin-only queue; no RLS policies for JWT roles; read/write via service_role API.';

-- ---------------------------------------------------------------------------
-- wishlist
-- ---------------------------------------------------------------------------
create table if not exists public.wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create index if not exists wishlist_user_id_idx on public.wishlist (user_id);

-- ---------------------------------------------------------------------------
-- site_settings  (homepage copy; id = default)
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  id text primary key default 'default',
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.site_settings enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.notifications enable row level security;
alter table public.admin_notifications enable row level security;
alter table public.wishlist enable row level security;

drop policy if exists "products_select_public" on public.products;
create policy "products_select_public"
  on public.products for select
  using (true);

drop policy if exists "categories_select_public" on public.categories;
create policy "categories_select_public"
  on public.categories for select
  using (true);

drop policy if exists "site_settings_select_public" on public.site_settings;
create policy "site_settings_select_public"
  on public.site_settings for select
  using (true);

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own"
  on public.orders for select
  using (auth.uid() = user_id);

drop policy if exists "orders_insert_own" on public.orders;
create policy "orders_insert_own"
  on public.orders for insert
  with check (auth.uid() = user_id);

drop policy if exists "orders_delete_own" on public.orders;
create policy "orders_delete_own"
  on public.orders for delete
  using (auth.uid() = user_id);

drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own"
  on public.notifications for select
  using (auth.uid() = user_id);

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own"
  on public.notifications for update
  using (auth.uid() = user_id);

-- admin_notifications: RLS enabled, no policies → anon/authenticated denied;
-- service_role bypasses RLS for server API routes.

drop policy if exists "wishlist_select_own" on public.wishlist;
create policy "wishlist_select_own"
  on public.wishlist for select
  using (auth.uid() = user_id);

drop policy if exists "wishlist_insert_own" on public.wishlist;
create policy "wishlist_insert_own"
  on public.wishlist for insert
  with check (auth.uid() = user_id);

drop policy if exists "wishlist_delete_own" on public.wishlist;
create policy "wishlist_delete_own"
  on public.wishlist for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Grants (Supabase: table access + RLS for row-level control)
-- ---------------------------------------------------------------------------
revoke all on table public.notifications from anon;
grant select, update on table public.notifications to authenticated;
grant all on table public.notifications to service_role;

grant delete on table public.orders to authenticated;

revoke all on table public.admin_notifications from anon;
revoke all on table public.admin_notifications from authenticated;
grant all on table public.admin_notifications to service_role;

-- ---------------------------------------------------------------------------
-- Auth: new user → profile
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      split_part(coalesce(new.email, ''), '@', 1)
    ),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Realtime: add tables to supabase_realtime publication (idempotent)
-- Enables: admin product catalog stream; customer order row updates; notification bell.
-- ---------------------------------------------------------------------------
do $realtime$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'products'
  ) then
    execute 'alter publication supabase_realtime add table public.products';
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'orders'
  ) then
    execute 'alter publication supabase_realtime add table public.orders';
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'notifications'
  ) then
    execute 'alter publication supabase_realtime add table public.notifications';
  end if;
end
$realtime$;
