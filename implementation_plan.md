# Implementation Plan — Habit Tracker One-Product Sales Site

A single-product checkout site. No accounts, no login, no dashboard. Sells one
digital product (a Habit Tracker ZIP) via Xendit hosted checkout, delivers a
secure tokenized download link on the success page and by email.

**Stack:** Next.js 15 (App Router) + React 19 + Tailwind CSS v4, TypeScript.
Supabase (Postgres `purchases` table + private Storage bucket `product`).
Resend for delivery email. Xendit **Invoice API** for payment.
Deploy target: Vercel.

---

## Verified API facts (checked against current docs, not memory)

- **Xendit create invoice** — `POST https://api.xendit.co/v2/invoices`,
  HTTP Basic auth (secret key as username, empty password). Body (snake_case):
  `external_id`, `amount`, `payer_email`, `currency` (`PHP`), `description`,
  `invoice_duration` (seconds), `success_redirect_url`, `failure_redirect_url`.
  Response includes `id`, `invoice_url`, `status`.
- **Xendit get invoice** — `GET https://api.xendit.co/v2/invoices/{id}`,
  same Basic auth. `status` ∈ `PENDING | PAID | SETTLED | EXPIRED`.
- **Xendit webhook** — Xendit POSTs the invoice object to our callback URL with
  header `x-callback-token`. We compare it to `XENDIT_CALLBACK_TOKEN` and reject
  on mismatch. On `status === "PAID"` (or `SETTLED`) we fulfil. Body carries
  `id`, `external_id`, `status`, `paid_at`, `payer_email`, `amount`.
- **Resend** — `new Resend(key)` then `resend.emails.send({ from, to, subject, html })`.
- **Supabase signed URL** — `supabase.storage.from('product').createSignedUrl(path, 60)`
  from a private bucket, using the service-role key server-side only.

I will use a thin `fetch`-based wrapper for Xendit (no SDK version churn) and the
official `resend` and `@supabase/supabase-js` packages.

---

## File-by-file plan

### Project scaffolding / config
- `package.json` — deps: `next`, `react`, `react-dom`, `@supabase/supabase-js`,
  `resend`; devDeps: `typescript`, `@types/*`, `tailwindcss`, `@tailwindcss/postcss`,
  `postcss`, `eslint`, `eslint-config-next`. Scripts: `dev`, `build`, `start`, `lint`.
- `tsconfig.json` — Next.js strict TS config with `@/*` path alias.
- `next.config.ts` — minimal; `images` remotePatterns if needed (placeholders are local).
- `postcss.config.mjs` — Tailwind v4 plugin.
- `tailwind` — Tailwind v4 uses `app/globals.css` with `@import "tailwindcss"`
  (no `tailwind.config.js` needed).
- `.eslintrc` via `eslint.config.mjs` (flat config, next lint).
- `.gitignore` — `node_modules`, `.next`, `.env*` (never commit secrets), etc.
- `.env.example` — documents every var, **no real values**:
  `XENDIT_SECRET_KEY`, `XENDIT_CALLBACK_TOKEN`, `RESEND_API_KEY`,
  `RESEND_FROM_EMAIL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
  `NEXT_PUBLIC_APP_URL`.

### Shared config & libs
- `lib/config.ts` — single source of truth: product name, tagline, **price ₱149**
  (`PRICE_AMOUNT = 149`, `CURRENCY = "PHP"`), `PRODUCT_FILENAME` (ZIP name in
  Storage), download token TTL (7 days), max downloads (5), support/contact email.
- `lib/xendit.ts` — server-only. `createInvoice({ externalId, email })` and
  `getInvoice(id)` using Basic auth + `fetch`. Never imported by client code.
- `lib/supabaseAdmin.ts` — server-only Supabase client built from
  `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (service role; bypasses RLS).
- `lib/resend.ts` — server-only Resend client + `sendDeliveryEmail({ to, downloadUrl })`.
- `lib/purchases.ts` — server-only data helpers over the `purchases` table:
  `insertPending`, `findByExternalId`, `findByToken`, `markPaidWithToken`,
  `decrementDownloads`. Centralises all DB access.
- `lib/format.ts` — small helpers: `maskEmail()`, `formatPrice()`, `shortId()`
  (crypto-strong), `generateToken()` (crypto-strong url-safe token).

### App shell & landing page
- `app/layout.tsx` — root layout, fonts, global metadata + OpenGraph/Twitter tags.
- `app/globals.css` — Tailwind v4 import + base styles (no layout shift).
- `app/page.tsx` — the single landing/sales page composing the sections below.
- `components/Hero.tsx` — headline, subheadline, price, primary **Buy Now**
  button (scrolls to `#buy`), product mockup `<Image>` in a phone frame.
- `components/WhatYouGet.tsx` — bullet list of contents (placeholder copy).
- `components/Screenshots.tsx` — 2–3 replaceable `<Image>` placeholders.
- `components/PriceBlock.tsx` — big one-time price pulled from `lib/config.ts`.
- `components/Faq.tsx` — payment methods, delivery, refund placeholder, "no account".
- `components/BuySection.tsx` — **client component**: email input (client-side
  format validation) + Buy Now button → `POST /api/checkout` → redirect to
  `invoice_url`. Handles loading/error states.
- `components/Footer.tsx` — contact email, Terms/Privacy links.
- `public/` — placeholder images: `mockup.png`, `screenshot-1..3.png`, `og.png`
  (I will generate simple lightweight SVG/PNG placeholders that are easy to swap).

### API routes (all server-side only)
- `app/api/checkout/route.ts` — `POST`. Validate email → `shortId` →
  `external_id = order_{shortId}` → `createInvoice` → insert `pending` purchase
  row → return `{ url: invoice_url }`. Client redirects.
- `app/api/webhooks/xendit/route.ts` — `POST`. Verify `x-callback-token` header
  against `XENDIT_CALLBACK_TOKEN` (reject 401 otherwise). On `PAID`/`SETTLED`:
  idempotently mark row `paid`, generate `download_token`, set `token_expires_at`
  (+7d) and `downloads_remaining` (5), set `paid_at`, send delivery email via
  Resend. If already `paid`, no-op. Always return `200` fast.

### Secure delivery + success pages
- `app/download/[token]/page.tsx` — **server component**. Look up token via
  `findByToken`; require `paid`, not expired, `downloads_remaining > 0`. On valid:
  route to a server action / route handler that decrements and redirects to a 60s
  signed URL. On invalid/expired: friendly support page with contact email.
  (Decrement + signed-URL generation done in `app/download/[token]/deliver/route.ts`
  `GET` handler so the counter only drops on an actual download click.)
- `app/download/[token]/deliver/route.ts` — `GET`. Re-validate token, decrement
  `downloads_remaining`, create 60s signed URL for `PRODUCT_FILENAME`, redirect.
- `app/thank-you/page.tsx` — **server component**. Reads `?order=` → look up row →
  **verify invoice status directly with Xendit `getInvoice`** (don't trust the
  redirect). If paid + token present → show download button + "we also emailed it
  to {maskedEmail}". If webhook not landed yet → "Processing…" with a small
  client auto-refresh component.
- `components/ProcessingRefresh.tsx` — **client component**: auto-refreshes the
  thank-you page every few seconds until the token appears.
- `app/payment-failed/page.tsx` — friendly failure page with retry + support link.
- `app/terms/page.tsx`, `app/privacy/page.tsx` — placeholder legal pages.

### Email template
- `emails/DeliveryEmail.tsx` (or inline HTML in `lib/resend.ts`) — thank-you +
  download button linking to `${APP_URL}/download/{token}`. I'll use a simple
  inline-HTML string to avoid extra render deps unless you prefer React Email.

### Database
- `supabase/migrations/0001_purchases.sql` — creates `purchases`:
  `id uuid pk default gen_random_uuid()`, `external_id text unique not null`,
  `email text not null`, `xendit_invoice_id text`, `status text` check in
  `('pending','paid')` default `'pending'`, `download_token text unique`,
  `token_expires_at timestamptz`, `downloads_remaining int`,
  `created_at timestamptz default now()`, `paid_at timestamptz`.
  Indexes on `external_id` and `download_token`. **RLS enabled with NO policies**
  → zero public/anon access; only the service-role key (used server-side) reaches it.

### Docs
- `README.md` — what this is, local dev, project structure.
- `DEPLOY.md` — Vercel env vars, Xendit webhook URL to register
  (`https://<domain>/api/webhooks/xendit`), Storage upload command for the ZIP
  (`supabase storage cp ./habit-tracker.zip ss:///product/habit-tracker.zip`
  or dashboard steps), and end-to-end test steps using Xendit **test keys** and
  test payment channels.
- `task.md` — execution checklist (created after approval).

---

## Design decisions I'm defaulting on (tell me if you disagree)

1. **Xendit via `fetch` wrapper**, not the SDK — avoids SDK version drift; shapes
   are the documented REST ones.
2. **Download counter decrements on the deliver click**, not on page view, so a
   buyer refreshing the download page doesn't burn their 5 downloads.
3. **Delivery email is inline HTML** (no React Email dep) unless you want React Email.
4. **Tailwind v4** (current stable) with CSS-first config, no `tailwind.config.js`.
5. Placeholder images are lightweight generated SVG/PNG, clearly swappable.
6. I will **create the Supabase project / bucket and run the migration via MCP
   only if you ask** — by default I just write the SQL + instructions and you run
   it. (I have Supabase MCP tools available; say the word to provision.)

---

## Verification before "done"
- `npm run build` passes cleanly.
- No secrets committed; `.env.example` only.
- All Xendit/Resend/Supabase calls confined to server code.

**STOPPING HERE for your approval.** Reply to approve, or tell me what to change.
