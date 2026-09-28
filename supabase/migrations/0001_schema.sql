-- ════════════════════════════════════════════════════════════
-- Zingwangwa Street Foods — Schema
-- Good Food. Great Vibes. 🔥
-- Run in the Supabase SQL editor or via `supabase db push`.
-- ════════════════════════════════════════════════════════════

-- ── profiles (extends auth.users) ────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Auto-create a profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'avatar_url')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── categories ──────────────────────────────────────────────
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0,
  icon text
);

-- ── menu_items ──────────────────────────────────────────────
create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete cascade,
  name text not null,
  description text not null default '',
  price_zmw integer not null check (price_zmw >= 0),
  image_url text,
  tags text[] not null default '{}',
  is_available boolean not null default true,
  is_featured boolean not null default false,
  spice_level text not null default 'none'
    check (spice_level in ('none','mild','medium','hot','zing')),
  prep_time_mins int not null default 10,
  popularity int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists menu_items_category_idx on public.menu_items (category_id);
create index if not exists menu_items_featured_idx on public.menu_items (is_featured) where is_featured;

-- ── orders ──────────────────────────────────────────────────
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  stripe_session_id text unique,
  status text not null default 'received'
    check (status in ('received','cooking','ready','delivered','cancelled')),
  payment_method text not null default 'cod' check (payment_method in ('stripe','cod')),
  subtotal integer not null check (subtotal >= 0),
  delivery_fee integer not null default 0 check (delivery_fee >= 0),
  total integer not null check (total >= 0),
  delivery_address text,
  phone text not null,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists orders_user_idx on public.orders (user_id, created_at desc);
create index if not exists orders_status_idx on public.orders (status) where status <> 'delivered';

-- ── order_items ─────────────────────────────────────────────
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  menu_item_id uuid references public.menu_items (id) on delete set null,
  qty int not null check (qty > 0),
  unit_price integer not null check (unit_price >= 0),
  name_snapshot text not null
);
create index if not exists order_items_order_idx on public.order_items (order_id);

-- ── favorites ───────────────────────────────────────────────
create table if not exists public.favorites (
  user_id uuid not null references public.profiles (id) on delete cascade,
  menu_item_id uuid not null references public.menu_items (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, menu_item_id)
);

-- ── cart_snapshots (cart sync across devices) ───────────────
create table if not exists public.cart_snapshots (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  items jsonb not null default '[]',
  updated_at timestamptz not null default now()
);

-- ════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.favorites enable row level security;
alter table public.cart_snapshots enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select coalesce((select is_admin from public.profiles where id = auth.uid()), false) $$;

-- profiles: read/update own; admins read all
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

-- menu: public read; admin write
create policy "categories_read_all" on public.categories for select using (true);
create policy "categories_admin_write" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "menu_read_all" on public.menu_items for select using (true);
create policy "menu_admin_write" on public.menu_items for all using (public.is_admin()) with check (public.is_admin());

-- orders: user reads own; insert own or guest checkout via service role; admin manages
create policy "orders_select_own" on public.orders for select using (auth.uid() = user_id or public.is_admin());
create policy "orders_insert_own" on public.orders for insert with check (auth.uid() = user_id);
create policy "orders_admin_update" on public.orders for update using (public.is_admin());

create policy "order_items_select_own" on public.order_items for select
  using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())));
create policy "order_items_insert_own" on public.order_items for insert
  with check (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

create policy "favorites_own" on public.favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "cart_own" on public.cart_snapshots for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ════════════════════════════════════════════════════════════
-- STORAGE: menu-images bucket — public read, admin write
-- ════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do nothing;

create policy "menu_images_public_read" on storage.objects for select
  using (bucket_id = 'menu-images');
create policy "menu_images_admin_write" on storage.objects for insert
  with check (bucket_id = 'menu-images' and public.is_admin());
create policy "menu_images_admin_update" on storage.objects for update
  using (bucket_id = 'menu-images' and public.is_admin());
create policy "menu_images_admin_delete" on storage.objects for delete
  using (bucket_id = 'menu-images' and public.is_admin());

-- ── Realtime: live order status + availability ──────────────
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.menu_items;
