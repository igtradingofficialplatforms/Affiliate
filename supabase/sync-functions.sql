-- SBC Affiliate shared-data functions for the user_id / role='user' schema.
-- Run only after the base schema and the admin_review_deposit/admin_adjust_balance
-- functions from the earlier setup are installed.

create extension if not exists pgcrypto;


-- Admin-only balance adjustment for the real user_id-based schema.
-- This updates profiles.balance and records balance_ledger in one transaction.
create or replace function public.admin_adjust_balance(p_user_id uuid, p_amount numeric, p_description text default 'Admin balance adjustment')
returns numeric
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_balance numeric(14,2);
begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  if p_amount is null or p_amount = 0 then raise exception 'Adjustment amount must not be zero'; end if;
  update public.profiles
     set balance = round(balance + p_amount, 2), updated_at = now()
   where id = p_user_id and balance + p_amount >= 0
   returning balance into updated_balance;
  if updated_balance is null then
    if exists (select 1 from public.profiles where id = p_user_id) then
      raise exception 'Adjustment would make balance negative';
    else
      raise exception 'User profile not found';
    end if;
  end if;
  insert into public.balance_ledger(user_id, event_type, amount, description, created_by)
  values(p_user_id, 'admin_adjustment', p_amount, coalesce(nullif(trim(p_description), ''), 'Admin balance adjustment'), auth.uid());
  return updated_balance;
end;
$$;

revoke all on function public.admin_adjust_balance(uuid, numeric, text) from public, anon;
grant execute on function public.admin_adjust_balance(uuid, numeric, text) to authenticated;


alter table public.profiles add column if not exists email text;
update public.profiles p set email = u.email
from auth.users u where u.id = p.id and p.email is distinct from u.email;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, user_code, full_name, email, role, balance, tasks_done)
  values (
    new.id,
    'SBC-' || upper(substr(replace(new.id::text, '-', ''), 1, 8)),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    'user',
    0,
    0
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = case when public.profiles.full_name = '' then excluded.full_name else public.profiles.full_name end;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.admin_review_withdrawal(p_request_id uuid, p_approve boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  req public.wallet_requests%rowtype;
  current_balance numeric(14,2);
begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  select * into req from public.wallet_requests where id = p_request_id and kind = 'withdrawal' for update;
  if not found then raise exception 'Withdrawal request not found'; end if;
  if req.status <> 'pending' then raise exception 'Request has already been reviewed'; end if;

  if p_approve then
    select balance into current_balance from public.profiles where id = req.user_id for update;
    if current_balance is null or current_balance < req.amount then
      update public.wallet_requests set status = 'rejected' where id = req.id;
      raise exception 'Insufficient balance; withdrawal rejected';
    end if;
    update public.profiles set balance = round(balance - req.amount, 2) where id = req.user_id;
    insert into public.balance_ledger(user_id, event_type, amount, description)
    values(req.user_id, 'withdrawal', -req.amount, 'Admin-approved withdrawal');
    update public.wallet_requests set status = 'approved' where id = req.id;
  else
    update public.wallet_requests set status = 'rejected' where id = req.id;
  end if;
end;
$$;

create or replace function public.complete_task(p_task_number integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  profile_row public.profiles%rowtype;
  task_row public.task_assignments%rowtype;
  total_price numeric(14,2);
  commission_rate numeric(5,2);
  commission_amount numeric(14,2);
begin
  if uid is null then raise exception 'Sign in required'; end if;
  select * into profile_row from public.profiles where id = uid for update;
  if not found then raise exception 'User profile not found'; end if;
  if profile_row.role = 'admin' then raise exception 'Admin accounts cannot complete student tasks'; end if;
  if profile_row.tasks_done >= 25 then raise exception 'All 25 tasks are already completed'; end if;
  if p_task_number <> profile_row.tasks_done + 1 then raise exception 'Complete tasks in order'; end if;

  select * into task_row from public.task_assignments
  where user_id = uid and task_number = p_task_number and status = 'assigned'
  for update;
  if not found then raise exception 'This task has not been assigned by Admin'; end if;

  select coalesce(sum((item->>'price')::numeric), 0) into total_price
  from jsonb_array_elements(task_row.products) item;
  if total_price <= 0 then raise exception 'Assigned task has no valid product prices'; end if;
  if profile_row.balance < total_price then raise exception 'Insufficient balance for this task'; end if;

  commission_rate := case lower(task_row.marketplace)
    when 'amazon' then 4
    when 'alibaba' then 8
    when 'aliexpress' then 12
    when 'adidas' then 4
    else 0
  end;
  if commission_rate <= 0 then raise exception 'Unsupported marketplace'; end if;
  commission_amount := round(total_price * commission_rate / 100, 2);

  update public.profiles set balance = round(balance + commission_amount, 2), tasks_done = tasks_done + 1 where id = uid;
  update public.task_assignments set status = 'completed' where id = task_row.id;
  insert into public.balance_ledger(user_id, event_type, amount, description)
  values(uid, 'commission', commission_amount, initcap(task_row.marketplace) || ' task ' || p_task_number || ' commission');
end;
$$;

revoke all on function public.admin_review_withdrawal(uuid, boolean) from public, anon;
revoke all on function public.complete_task(integer) from public, anon;
grant execute on function public.admin_review_withdrawal(uuid, boolean) to authenticated;
grant execute on function public.complete_task(integer) to authenticated;

-- Allow signed-in users to read the public deposit-address setting; only Admin can write it.
alter table public.app_settings enable row level security;
drop policy if exists "Authenticated reads app settings" on public.app_settings;
create policy "Authenticated reads app settings" on public.app_settings
for select to authenticated using (true);
drop policy if exists "Admin manages app settings" on public.app_settings;
create policy "Admin manages app settings" on public.app_settings
for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Give each existing normal user a complete 25-task cycle if tasks are missing.
-- Admin can replace any assigned task from the Admin Panel afterward.
insert into public.task_assignments (user_id, task_number, marketplace, products, status)
select p.id, n, 'Amazon',
       jsonb_build_array(jsonb_build_object(
         'name', 'Marketplace product ' || n,
         'price', 5,
         'image', 'https://placehold.co/120x120/eee/555?text=Product'
       )),
       'assigned'
from public.profiles p
cross join generate_series(1,25) as n
where p.role = 'user'
on conflict (user_id, task_number) do nothing;

-- Future registrations receive the same default task cycle from the profile trigger.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, user_code, full_name, email, role, balance, tasks_done)
  values (
    new.id,
    'SBC-' || upper(substr(replace(new.id::text, '-', ''), 1, 8)),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    'user',
    0,
    0
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = case when public.profiles.full_name = '' then excluded.full_name else public.profiles.full_name end;

  insert into public.task_assignments (user_id, task_number, marketplace, products, status)
  select new.id, n, 'Amazon',
         jsonb_build_array(jsonb_build_object(
           'name', 'Marketplace product ' || n,
           'price', 5,
           'image', 'https://placehold.co/120x120/eee/555?text=Product'
         )),
         'assigned'
  from generate_series(1,25) as n
  on conflict (user_id, task_number) do nothing;
  return new;
end;
$$;
