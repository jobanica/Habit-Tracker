# Deployment Guide

End-to-end setup for the Habit Tracker sales site: Supabase, Xendit, Resend, and
Vercel. Follow top to bottom.

---

## 1. Supabase — database + storage

### 1a. Create the `purchases` table

Run the migration in [`supabase/migrations/0001_purchases.sql`](supabase/migrations/0001_purchases.sql):

- **Dashboard:** Supabase → SQL Editor → paste the file contents → **Run**.
- **CLI:** `supabase db push` (if you use the Supabase CLI with this repo linked).

This creates the table, indexes, the atomic `decrement_download` function, and
enables **RLS with no policies** (so only the service-role key can access it).

### 1b. Create the private Storage bucket and upload the ZIP

Create a **private** bucket named `product` (Dashboard → Storage → New bucket →
uncheck "Public").

Upload your ZIP so its name matches `productFilename` in `lib/config.ts`
(default `habit-tracker.zip`):

- **Dashboard:** Storage → `product` bucket → **Upload file** → select your ZIP.
- **CLI:**
  ```bash
  supabase storage cp ./habit-tracker.zip ss:///product/habit-tracker.zip
  ```

### 1c. Grab your Supabase credentials

Project Settings → API:

- `SUPABASE_URL` = Project URL
- `SUPABASE_SERVICE_ROLE_KEY` = **service_role** secret key (never expose client-side)

---

## 2. Resend — delivery email

1. Create an API key at <https://resend.com/api-keys> → `RESEND_API_KEY`.
2. Verify your sending domain (Resend → Domains). Until verified you can only
   send from `onboarding@resend.dev` to your own address (fine for testing).
3. Set `RESEND_FROM_EMAIL`, e.g. `Habit Tracker <hello@yourdomain.com>`.

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
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | Verified sender, e.g. `Habit Tracker <hello@you.com>` |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase **service_role** key |
| `NEXT_PUBLIC_APP_URL` | Your public URL, e.g. `https://you.com` (no trailing slash) |

> `NEXT_PUBLIC_APP_URL` must be the real deployed URL — it's used for the Xendit
> success/failure redirects and the download links in the email.

Deploy. Then go back to **Xendit → Webhooks** and make sure the callback URL
uses your final domain.

---

## 5. End-to-end test (with Xendit test keys)

1. Ensure Vercel has the **test** `XENDIT_SECRET_KEY` and the matching
   `XENDIT_CALLBACK_TOKEN`, and the webhook URL is registered.
2. Open the site → enter your email → **Buy Now**.
3. You're redirected to Xendit's hosted checkout. Complete payment using a
   **test payment channel** (Xendit's test-mode invoice page lets you simulate a
   successful payment — e.g. the "Simulate payment" option, or test card/e-wallet
   flows shown in test mode).
4. Xendit fires the `PAID` webhook → `/api/webhooks/xendit`:
   - the `purchases` row flips to `paid`,
   - a `download_token` is generated (7-day expiry, 5 downloads),
   - the delivery email is sent via Resend.
5. You land on `/thank-you?order=order_...`, which **re-verifies** the invoice
   with Xendit and shows the **Download** button + masked email.
6. Click **Download** → `/download/<token>/deliver` decrements the counter and
   redirects to a 60-second signed URL for the ZIP.
7. Check your inbox for the same download link from Resend.

### Quick checks if something's off

- **Stuck on "Finalizing…"** → the webhook hasn't landed. Verify the callback URL
  and that `XENDIT_CALLBACK_TOKEN` matches the dashboard token. Check the
  function logs in Vercel.
- **401 from the webhook** → `x-callback-token` mismatch (`XENDIT_CALLBACK_TOKEN`).
- **Download link invalid** → confirm the ZIP filename in the bucket matches
  `productFilename` in `lib/config.ts`, and the bucket is named `product`.
- **No email** → check `RESEND_FROM_EMAIL` is a verified sender; the download
  still works from the thank-you page regardless.

---

## 6. Go live

- Swap `XENDIT_SECRET_KEY` to the **live** key and update
  `XENDIT_CALLBACK_TOKEN` if your live webhook token differs.
- Confirm `RESEND_FROM_EMAIL` uses a verified domain.
- Redeploy.

**Do not** run a deploy command from this repo automatically — deploy from the
Vercel dashboard / your own CI when you're ready.
