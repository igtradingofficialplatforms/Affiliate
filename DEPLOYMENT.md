# SBC Affiliate demo — shared state setup

This build keeps the existing UI and adds a Supabase shared-state bridge so changes made in Demo Admin can appear in other browser sessions/devices.

## 1. Configure environment

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_PUBLISHABLE_KEY
```

Use the project's publishable key (or legacy anon public key). Never use a `service_role` or secret key in browser code.

## 2. Create the shared-state table

Open Supabase Dashboard → SQL Editor and run `supabase/shared-state.sql`.

This SQL is deliberately labelled DEMO-ONLY: it allows public clients to read and write one shared JSON document. Anyone with the public key can alter the demo data. Use only fictional/demo data. Do not store real passwords, personal information, real wallet addresses, deposits, withdrawals, or funds.

## 3. Run and publish

```bash
npm install
npm run dev
```

For hosting, set the same two environment variables in the hosting provider and build with `npm run build`.

## Important production limitation

This bridge fixes cross-device synchronization for the existing demo UI, not production-grade authentication or financial processing. The current demo login and admin password are client-side. Before a real public launch, replace demo login with Supabase Auth, migrate each student to their own `profiles` row, apply strict RLS policies, and perform balance/task/wallet operations through validated server-side RPC functions. Do not use this demo bridge with real money or real user information.
