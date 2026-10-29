-- DEMO ONLY. This intentionally uses a public demo state table and is not production wallet security.
-- Never store real passwords, personal information, wallet secrets or real money in this demo schema.
create table if not exists public.sbc_shared_state (
  id text primary key check (id = 'main'),
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.sbc_shared_state enable row level security;
drop policy if exists "demo clients read shared state" on public.sbc_shared_state;
drop policy if exists "demo clients write shared state" on public.sbc_shared_state;
create policy "demo clients read shared state" on public.sbc_shared_state for select to anon, authenticated using (true);
create policy "demo clients write shared state" on public.sbc_shared_state for all to anon, authenticated using (true) with check (true);
grant select, insert, update on public.sbc_shared_state to anon, authenticated;

-- Balance mirror: the key is user_id, matching the app's demo account ID (ID100, ID101, ...).
-- This is separate from production profiles.id/user_id UUID relationships.
create table if not exists public.sbc_demo_balances (
  user_id text primary key,
  balance numeric(14,2) not null default 0 check (balance >= 0),
  updated_at timestamptz not null default now()
);
alter table public.sbc_demo_balances enable row level security;
drop policy if exists "demo users read balances" on public.sbc_demo_balances;
drop policy if exists "demo clients manage balances" on public.sbc_demo_balances;
create policy "demo users read balances" on public.sbc_demo_balances for select to anon, authenticated using (true);
create policy "demo clients manage balances" on public.sbc_demo_balances for all to anon, authenticated using (true) with check (true);
grant select, insert, update on public.sbc_demo_balances to anon, authenticated;

-- Realtime delivers balance changes to the student browser.
do $$ begin
  alter publication supabase_realtime add table public.sbc_shared_state;
exception when duplicate_object then null; when undefined_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.sbc_demo_balances;
exception when duplicate_object then null; when undefined_object then null; end $$;
