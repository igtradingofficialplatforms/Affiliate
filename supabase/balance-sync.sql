-- SBC Affiliate demo balance mirror.
-- Uses user_id and balance; intentionally does NOT use student_id.
-- Here user_id is the demo UI account ID (ID100, ID101, ...), not auth.users UUID.
-- DEMO ONLY: policies are open for anon/authenticated because this project currently uses demo login.
-- Do not use for real money or production accounts.
create table if not exists public.sbc_demo_balances (
  user_id text primary key,
  balance numeric(14,2) not null default 0 check (balance >= 0),
  updated_at timestamptz not null default now()
);

alter table public.sbc_demo_balances enable row level security;
drop policy if exists "demo users read balances" on public.sbc_demo_balances;
drop policy if exists "demo clients manage balances" on public.sbc_demo_balances;
create policy "demo users read balances" on public.sbc_demo_balances
  for select to anon, authenticated using (true);
create policy "demo clients manage balances" on public.sbc_demo_balances
  for all to anon, authenticated using (true) with check (true);
grant select, insert, update on public.sbc_demo_balances to anon, authenticated;

do $$ begin
  alter publication supabase_realtime add table public.sbc_demo_balances;
exception when duplicate_object then null; when undefined_object then null; end $$;
