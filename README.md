# Habit Tracker — One-Product Sales Site

A single-page site that sells one digital product (the Habit Tracker, delivered
via a Google Drive download link). No accounts, no login, no dashboard.

**Flow:** landing page → enter email → Xendit hosted checkout (GCash / Maya /
card / bank) → success page that reveals the Google Drive download the moment
payment is confirmed.

## Stack

- **Next.js 15** (App Router) + **React 19** + **Tailwind CSS v4**, TypeScript
- **Supabase** — a `purchases` table (order tracking + paid-gating)
- **Xendit Invoice API** — payment
- **Google Drive** — hosts the product file; the share link is revealed after payment
- Deploys on **Vercel**

## Local development

```bash
npm install
cp .env.example .env.local   # fill in real values (see DEPLOY.md)
npm run dev                  # http://localhost:3000
```

`npm run build` must pass before deploying.

## Project structure

```
app/
  page.tsx                       Landing/sales page
  layout.tsx                     Root layout + metadata/OG
  opengraph-image.tsx            Generated OG image
  thank-you/page.tsx             Success page (verifies status with Xendit)
  payment-failed/page.tsx        Failure page
  download/[token]/page.tsx      Private, paid-gated page revealing the Drive link
  terms/, privacy/               Placeholder legal pages
  api/checkout/route.ts          Creates the Xendit invoice
  api/webhooks/xendit/route.ts   Fulfils PAID invoices (idempotent)
components/                      Landing sections + client widgets
lib/
  config.ts                      Product name, price (₱149), Google Drive URL — edit here
  xendit.ts                      Invoice API wrapper (server-only)
  supabaseAdmin.ts               Service-role client (server-only)
  purchases.ts                   All DB access (server-only)
  format.ts                      Token/id/email helpers
supabase/migrations/             SQL for the purchases table + RLS
```

## Editing copy, pricing & the download link

All product copy, price, and the **Google Drive link** (`googleDriveUrl`) live
in [`lib/config.ts`](lib/config.ts). Swap the placeholder images in
[`public/`](public/) (`mockup.svg`, `screenshot-1..3.svg`) with your own.

## How delivery works

1. On payment, Xendit calls the webhook, which marks the order `paid` and
   attaches a random 256-bit `download_token`.
2. The thank-you page (and a private `/download/{token}` page) reveal the Google
   Drive link **only** for a payment-verified order — the link never appears on
   any public page.

## Security notes

- All Xendit / Supabase calls are **server-side only**.
- The `purchases` table has RLS enabled with **no policies** — only the
  service-role key (server-side) can touch it.
- The thank-you page re-verifies payment **directly with the Xendit API** before
  revealing the download — it never trusts the redirect alone.
- Trade-off: a Google Drive "anyone with the link" URL is inherently shareable
  once a buyer has it. Keeping it off public pages is the mitigation; for
  stricter control, restrict the Drive file to specific Google accounts.

See [`DEPLOY.md`](DEPLOY.md) for environment variables, the Supabase setup, the
Xendit webhook registration, and end-to-end testing.
