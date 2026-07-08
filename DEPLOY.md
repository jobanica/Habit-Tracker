# Deployment Guide

End-to-end setup for the Habit Tracker sales site: Supabase, Google Drive,
Xendit, and Vercel. Follow top to bottom.

---

## 1. Supabase — database

### 1a. Create the `purchases` table

Run the migrations in [`supabase/migrations/`](supabase/migrations/) in order
(`0001_purchases.sql`, then `0002_drive_delivery.sql`):

- **Dashboard:** Supabase → SQL Editor → paste each file's contents → **Run**.
- **CLI:** `supabase db push` (if you use the Supabase CLI with this repo linked).

This creates the `purchases` table and indexes and enables **RLS with no
policies** (so only the service-role key can access it). Delivery is via Google
Drive, so no Storage bucket is needed.

> Already provisioned for the existing **Habit-Tracker** Supabase project
> (`aruhwsxccssdrrhaamtf`).

### 1b. Grab your Supabase credentials

Project Settings → API:

- `SUPABASE_URL` = Project URL (`https://aruhwsxccssdrrhaamtf.supabase.co`)
- `SUPABASE_SERVICE_ROLE_KEY` = **service_role** secret key (never expose client-side)

---

## 2. Google Drive — the product file

1. Upload your product file (ZIP or folder) to Google Drive.
2. Right-click it → **Share** → set **"Anyone with the link"** = **Viewer** →
   **Copy link**.
3. Paste that link into `googleDriveUrl` in [`lib/config.ts`](lib/config.ts),
   commit, and push (triggers a redeploy).

> The link is only ever shown on a payment-verified page, never on a public one.
> Because it's an "anyone with the link" URL it is still shareable once a buyer
> has it — if you need stricter control, restrict the Drive file to specific
> Google accounts instead.

---

## 3. Xendit — payments

1. **API key:** Dashboard → Settings → Developers → API Keys. Use a
   **development/test** secret key (`xnd_development_...`) while testing;
   switch to the live key for production. → `XENDIT_SECRET_KEY`.
2. **Webhook / callback token:** Dashboard → Settings → Webhooks.
   - Copy your **Webhook Verification Token** → `XENDIT_CALLBACK_TOKEN`.
   - Register the **Invoices paid** callback URL:
     ```
     https://<your-domain>/api/webhooks/xendit
     ```
   - You can test the webhook from the same page ("Test" button) once deployed.

---

## 4. Vercel — deploy

Import the repo into Vercel and set these **Environment Variables** (Project
Settings → Environment Variables), for Production (and Preview if you want):

| Variable | Value |
| --- | --- |
| `XENDIT_SECRET_KEY` | Xendit secret key (test or live) |
| `XENDIT_CALLBACK_TOKEN` | Xendit webhook verification token |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase **service_role** key |
| `NEXT_PUBLIC_APP_URL` | Your public URL, e.g. `https://you.com` (no trailing slash) |

> `NEXT_PUBLIC_APP_URL` must be the real deployed URL — it's used for the Xendit
> success/failure redirects. Set it after the first deploy, then redeploy.

Deploy. Then go back to **Xendit → Webhooks** and make sure the callback URL
uses your final domain.

---

## 5. End-to-end test (with Xendit test keys)

1. Ensure Vercel has the **test** `XENDIT_SECRET_KEY` and the matching
   `XENDIT_CALLBACK_TOKEN`, and the webhook URL is registered.
2. Set `googleDriveUrl` in `lib/config.ts` to a real (test) Drive link.
3. Open the site → enter your email → **Buy Now**.
4. You're redirected to Xendit's hosted checkout. Complete payment using a
   **test payment channel** (Xendit's test-mode invoice page lets you simulate a
   successful payment — e.g. the "Simulate payment" option, or test card/e-wallet
   flows shown in test mode).
5. Xendit fires the `PAID` webhook → `/api/webhooks/xendit`:
   - the `purchases` row flips to `paid`,
   - a random `download_token` is attached.
6. You land on `/thank-you?order=order_...`, which **re-verifies** the invoice
   with Xendit and shows the **Open on Google Drive** button.
7. Clicking it opens your Drive link. The private `/download/<token>` link works
   the same way and can be bookmarked for repeat access.

### Quick checks if something's off

- **Stuck on "Finalizing…"** → the webhook hasn't landed. Verify the callback URL
  and that `XENDIT_CALLBACK_TOKEN` matches the dashboard token. Check the
  function logs in Vercel.
- **401 from the webhook** → `x-callback-token` mismatch (`XENDIT_CALLBACK_TOKEN`).
- **Drive button goes nowhere / access denied** → confirm `googleDriveUrl` in
  `lib/config.ts` is set and the Drive file is shared as "Anyone with the link".

---

## 6. Go live

- Swap `XENDIT_SECRET_KEY` to the **live** key and update
  `XENDIT_CALLBACK_TOKEN` if your live webhook token differs.
- Confirm `googleDriveUrl` points at the final product file.
- Redeploy.

**Do not** run a deploy command from this repo automatically — deploy from the
Vercel dashboard / your own CI when you're ready.
