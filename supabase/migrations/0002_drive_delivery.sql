-- Switch delivery from Supabase Storage + email to a Google Drive link.
-- Drops the download-counter / expiry machinery and the private file bucket.
-- The `purchases` table keeps `download_token` as a private, paid-gated URL.

drop function if exists public.decrement_download(text);

alter table public.purchases
  drop column if exists token_expires_at,
  drop column if exists downloads_remaining;

-- The product ZIP now lives on Google Drive, so the private Storage bucket is
-- no longer needed. Storage tables can't be deleted via SQL — remove the
-- `product` bucket from the Supabase Dashboard (Storage → product → Delete)
-- if it was created. It's harmless to leave in place otherwise.
