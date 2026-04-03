-- supabase/schema.sql — run in Supabase SQL editor
-- BayanMart e-commerce (NextAuth + service role; RLS for direct Supabase clients)

create extension if not exists "pgcrypto";

-- Categories (optional catalog dimension; products.category stores slug text)
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null
);

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  price numeric(10,2) not null,
  compare_price numeric(10,2),
  sku text unique not null,
  stock integer not null default 0,
  category text,
  images text[],
  variants jsonb,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- Profiles (mirrors auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  phone text,
  address jsonb,
  created_at timestamptz not null default now()
);

-- Orders (Philippines payments — no Stripe)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  status text not null default 'pending',
  total numeric(10,2) not null,
  shipping_info jsonb not null default '{}',
  items jsonb not null default '[]',
  payment_method text,
  created_at timestamptz not null default now()
);

-- Wishlist
create table if not exists public.wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

-- RLS
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.wishlist enable row level security;

create policy "products_select_public" on public.products for select using (true);
create policy "categories_select_public" on public.categories for select using (true);

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Direct client access to orders/wishlist denied; app uses service role from API routes.
