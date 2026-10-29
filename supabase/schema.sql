-- SBC Affiliate schema matching the project's user_id-based Supabase tables.
-- Profiles use auth.users.id as the UUID; the demo UI IDs such as ID100 are not auth UUIDs.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  user_code text unique,
  full_name text not null default '',
  email text,
  role text not null default 'user' check (role in ('user','admin')),
  balance numeric(14,2) not null default 0 check (balance >= 0),
  tasks_done integer not null default 0 check (tasks_done between 0 and 25),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.task_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  task_number integer not null check (task_number between 1 and 25),
  marketplace text not null check (marketplace in ('Amazon','Alibaba','AliExpress','adidas')),
  is_combo boolean not null default false,
  products jsonb not null default '[]'::jsonb,
  status text not null default 'assigned' check (status in ('assigned','completed','disabled')),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique (user_id, task_number)
);

create table if not exists public.wallet_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('deposit','withdrawal')),
  network text not null check (network in ('TRC20','BTC','ETH')),
  amount numeric(14,2) not null check (amount > 0),
  wallet_address text,
  proof_path text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.balance_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_type text not null check (event_type in ('commission','deposit','withdrawal','admin_adjustment')),
  amount numeric(14,2) not null,
  description text not null default '',
  task_assignment_id uuid references public.task_assignments(id),
  wallet_request_id uuid references public.wallet_requests(id),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'); $$;

alter table public.profiles enable row level security;
alter table public.app_settings enable row level security;
alter table public.task_assignments enable row level security;
alter table public.wallet_requests enable row level security;
alter table public.balance_ledger enable row level security;

drop policy if exists "profiles read own or admin" on public.profiles;
create policy "profiles read own or admin" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
drop policy if exists "profiles admin manages" on public.profiles;
create policy "profiles admin manages" on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "settings read authenticated" on public.app_settings;
create policy "settings read authenticated" on public.app_settings for select to authenticated using (true);
drop policy if exists "settings admin manages" on public.app_settings;
create policy "settings admin manages" on public.app_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "tasks own or admin read" on public.task_assignments;
create policy "tasks own or admin read" on public.task_assignments for select to authenticated using (user_id = auth.uid() or public.is_admin());
drop policy if exists "tasks admin manages" on public.task_assignments;
create policy "tasks admin manages" on public.task_assignments for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "wallet own or admin read" on public.wallet_requests;
create policy "wallet own or admin read" on public.wallet_requests for select to authenticated using (user_id = auth.uid() or public.is_admin());
drop policy if exists "wallet own pending insert" on public.wallet_requests;
create policy "wallet own pending insert" on public.wallet_requests for insert to authenticated with check (user_id = auth.uid() and status = 'pending');
drop policy if exists "wallet admin updates" on public.wallet_requests;
create policy "wallet admin updates" on public.wallet_requests for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "ledger own or admin read" on public.balance_ledger;
create policy "ledger own or admin read" on public.balance_ledger for select to authenticated using (user_id = auth.uid() or public.is_admin());
drop policy if exists "ledger admin inserts" on public.balance_ledger;
create policy "ledger admin inserts" on public.balance_ledger for insert to authenticated with check (public.is_admin());

-- Existing deployments: do not blindly rerun this file over a live schema.
-- Admin balance changes should use the SECURITY DEFINER admin_adjust_balance RPC
-- from sync-functions.sql, which writes both profiles.balance and balance_ledger atomically.
