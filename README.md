# SBC Affiliate — updated UI prototype

Responsive React + Vite prototype with black/gold styling, a wide animated brand showcase for Amazon, Alibaba, AliExpress and adidas, catalog product cards, demo activity feed, levels, record/tasks, profile, history, a separate `/admin` entry route, task assignment UI (normal and 3/4/5-item combos), demo deposit/withdrawal requests, optional deposit screenshot upload, copyable configured deposit addresses, and an SBC favicon.

## Run on Windows PowerShell
1. Install Node.js LTS.
2. Open this folder in VS Code.
3. Run `npm.cmd install`.
4. Run `npm.cmd run dev`.
5. Open the localhost URL Vite prints. If port 5173 is occupied, use the alternate port Vite prints (often 5174).

## Supabase sync status — read before use
The demo UI synchronizes its illustrative demo state through `public.sbc_shared_state`. The Admin balance adjustment now waits for the Supabase write and reads the row back to verify that the selected demo student's balance was saved. If the write or verification fails, the UI shows `Cloud save failed` and does not claim success. When loading shared demo state, duplicate email entries are normalized to the first matching student so the same email does not silently select a second demo ID.

**Important:** `sbc_shared_state` is a demo-only shared JSON bridge. It is not the same as your real user tables. The `supabase/schema.sql` and `supabase/sync-functions.sql` files use the real schema convention with `user_id` columns for `task_assignments`, `wallet_requests`, and `balance_ledger`; profiles use `profiles.id` as the UUID and `profiles.balance` as the balance. Demo IDs like `ID100` are local demo IDs, not Supabase Auth UUIDs, so the real `admin_adjust_balance(p_user_id uuid, ...)` RPC cannot adjust an `ID100` record until the app is migrated to authenticated profiles. Review RLS before deployment. Never store real passwords, personal data, wallet addresses, or funds in the demo shared-state table, whose policy is intentionally permissive for this demo. Do not deploy this version as a real-money or real-crypto service.

The sign-in shown in this prototype uses illustrative demo credentials. Never use these demo credentials for a public admin account. Deposit/withdrawal requests are simulated; no blockchain transfer occurs. Uploaded screenshot files are stored in local browser state in this prototype, not securely uploaded to Supabase Storage.

Marketplace banners display brand names/logos via a public icon CDN and demo catalog images. The catalog is illustrative, not a verified live product feed; real marketplace feeds require approved API credentials and permissions. The banner's earnings and sales/activity are explicitly demo examples, not real sales.

The language selector currently translates selected navigation/headings; full translation of every label, validation message and admin control remains to be completed before claiming complete multilingual support.

## Added project/deployment files
- `vite.config.js`: Vite React configuration.
- `vercel.json`: SPA fallback while leaving `/api/*` serverless routes available.
- `api/health.js`: simple demo health endpoint (`/api/health`). It does not connect to Supabase.
- `public/`: public favicon, PWA manifest and minimal service worker.
- `src/customerService.js`: Telegram customer-service link helper; import it where the support link is rendered.
- `.gitignore`: excludes build output, dependencies and local secrets.
- `.env.local.example`: template only. Copy to `.env.local` and fill in your own Supabase URL/public anon key. The actual `.env.local` is intentionally not included so your credentials are not exposed.

The service worker is minimal and does not cache API, Supabase, account or payment data. The customer service helper is provided, but the existing UI must import/use it to display a link. `/api/health` is only a health check and is not a backend for deposits, withdrawals, tasks, or authentication.

## Balance SQL sync (demo only)

For the Admin-to-Student demo balance sync, open Supabase SQL Editor and run `supabase/balance-sync.sql` (or rerun `supabase/shared-state.sql`, which includes the same table). The app writes one row per demo account to `public.sbc_demo_balances` using `user_id` and `balance`; it does not use `student_id`. Example check:

```sql
select user_id, balance, updated_at
from public.sbc_demo_balances
order by user_id;
```

This project still uses demo IDs such as `ID100`, not Supabase Auth UUIDs. The open demo policies are not safe for a real-money production app.
