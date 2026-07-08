# Habit Tracker — One-Product Sales Site

A single-page site that sells one digital product (the Habit Tracker, delivered
as a downloadable ZIP). No accounts, no login, no dashboard.

**Flow:** landing page → enter email → Xendit hosted checkout (GCash / Maya /
card / bank) → success page with a secure download link, same link emailed via
Resend.

## Stack

- **Next.js 15** (App Router) + **React 19** + **Tailwind CSS v4**, TypeScript
- **Supabase** — a `purchases` table + a private Storage bucket (`product`) for the ZIP
- **Resend** — delivery email
- **Xendit Invoice API** — payment
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
  download/[token]/page.tsx      Secure download landing
  download/[token]/deliver/route.ts  Decrements + signed-URL redirect
  terms/, privacy/               Placeholder legal pages
  api/checkout/route.ts          Creates the Xendit invoice
  api/webhooks/xendit/route.ts   Fulfils PAID invoices (idempotent)
components/                      Landing sections + client widgets
lib/
  config.ts                      Product name, price (₱149), limits — edit here
  xendit.ts                      Invoice API wrapper (server-only)
  supabaseAdmin.ts               Service-role client (server-only)
  resend.ts                      Delivery email (server-only)
  purchases.ts                   All DB access (server-only)
  format.ts                      Token/id/email helpers
supabase/migrations/             SQL for the purchases table + RLS
```

## Editing copy & pricing

All product copy, price, and limits live in [`lib/config.ts`](lib/config.ts).
Swap the placeholder images in [`public/`](public/) (`mockup.svg`,
`screenshot-1..3.svg`) with your own.

## Security notes

- All Xendit / Resend / Supabase calls are **server-side only**.
- The `purchases` table has RLS enabled with **no policies** — only the
  service-role key (server-side) can touch it.
- Download links are tokenized (256-bit), expiring (7 days) and limited (5
  downloads). Files are served via 60-second signed URLs from a **private**
  bucket, never a public URL.

See [`DEPLOY.md`](DEPLOY.md) for environment variables, the Supabase setup, the
Xendit webhook registration, and end-to-end testing.
