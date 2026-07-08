-- Purchases table for the Habit Tracker sales site.
-- RLS is enabled with NO policies: no anon/public access at all.
-- Only the service-role key (used exclusively server-side) can read/write.

create extension if not exists "pgcrypto";

create table if not exists public.purchases (
  id                  uuid primary key default gen_random_uuid(),
  external_id         text not null unique,
  email               text not null,
  xendit_invoice_id   text,
  status              text not null default 'pending'
                        check (status in ('pending', 'paid')),
  download_token      text unique,
  token_expires_at    timestamptz,
  downloads_remaining integer,
  created_at          timestamptz not null default now(),
  paid_at             timestamptz
);

create index if not exists purchases_external_id_idx
  on public.purchases (external_id);
create index if not exists purchases_download_token_idx
  on public.purchases (download_token);

-- Lock the table down. RLS on + zero policies = deny all for anon/authenticated.
-- The service role bypasses RLS, so server-side code still has full access.
alter table public.purchases enable row level security;

-- Atomically consume one download for a valid token.
-- Returns true only if the row is paid, unexpired and had downloads left.
-- SECURITY DEFINER so it runs with the owner's rights; callable by service role.
create or replace function public.decrement_download(p_token text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_count integer;
begin
  update public.purchases
     set downloads_remaining = downloads_remaining - 1
   where download_token = p_token
     and status = 'paid'
     and downloads_remaining > 0
     and (token_expires_at is null or token_expires_at > now());
  get diagnostics updated_count = row_count;
  return updated_count > 0;
end;
$$;

-- Do not expose the function to anon/authenticated roles.
revoke all on function public.decrement_download(text) from public;
revoke all on function public.decrement_download(text) from anon;
revoke all on function public.decrement_download(text) from authenticated;
