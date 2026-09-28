# 🔥 Zingwangwa Street Foods

**Good Food. Great Vibes.** — a sizzling marketing + e-commerce web app for a street-food vendor at Zingwangwa Market.

Stack: **Next.js 14 (App Router, TypeScript) · Supabase (auth, DB, storage, realtime) · Stripe Checkout · Framer Motion + GSAP · Tailwind CSS · Zustand · PWA**

Brand: burnt sienna `#BF4C00` · honeycomb `#FFBE00` · cacao `#7C2B00`. See [`MOTION.md`](MOTION.md) for the full animation spec.

## Local dev

```bash
npm install
cp .env.example .env.local   # fill in your keys (or skip — demo mode still renders)
npm run dev
```

> **Demo mode:** with no env vars the site renders fully from bundled seed data (`lib/menu-data.ts`) — menu, cart and checkout UI all work; orders/checkout just remind you to connect Supabase.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com), copy the URL + anon key + service-role key into `.env.local`.
2. Run the SQL in [`supabase/migrations/0001_schema.sql`](supabase/migrations/0001_schema.sql) in the SQL editor (creates tables, RLS policies, `menu-images` bucket, realtime publication).
3. Run [`supabase/seed.sql`](supabase/seed.sql) to load the real menu (wraps, grilled chicken, loaded chips, snacks, cupcakes).
4. Enable auth providers: **Email** and **Google** under Authentication → Providers.
5. Make an admin: `update profiles set is_admin = true where id = '<your-user-uuid>';`

## Stripe setup

1. Add test keys (`pk_test_…`, `sk_test_…`) to `.env.local`. ZMW is used as the currency.
2. Forward webhooks while developing:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   # copy the printed whsec_… into STRIPE_WEBHOOK_SECRET
   ```
3. Test a payment with card `4242 4242 4242 4242`, any future expiry/CVC.
4. Cash-on-delivery is always available as an alternate method for the local market.

## Deploy (Vercel)

```bash
vercel --prod
```
Set all env vars in the Vercel project, then add a production webhook endpoint in the Stripe dashboard pointing at `https://<your-domain>/api/stripe/webhook` with the `checkout.session.completed` event.

## Structure

```
app/
  (marketing)/  landing, about, gallery        (shop)/  menu, cart, checkout, order-confirmation
  (account)/    login, profile, order history  admin/   dashboard · orders kanban · menu CRUD
  api/          stripe/checkout, stripe/webhook, menu
components/     ui, motion, sections, menu, cart, layout, account, admin
lib/            supabase clients, stripe, orders, cart store, motion presets
supabase/       migration + seed SQL
```

- **Security:** prices are always re-read server-side from the DB (never trusted from the client); the Stripe webhook verifies signatures; RLS protects all user-scoped tables; the service-role key is server-only.
- **PWA:** installable, service worker (`public/sw.js`) caches the menu offline, realtime pushes keep order status and availability live.
- **Quality:**ISR menu (60s), `next/image` with blur placeholders, error boundaries, brand-matched skeletons, `prefers-reduced-motion` fallbacks everywhere.

## Scripts

| command | what |
|---|---|
| `npm run dev` | dev server |
| `npm run build` / `start` | production build / serve |
| `npm run typecheck` | strict TS check |
| `npm run lint` / `format` | ESLint / Prettier |
