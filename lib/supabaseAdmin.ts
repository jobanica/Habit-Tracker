import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. Bypasses RLS — server-side only.
 * The `purchases` table has RLS enabled with no policies, so ONLY this
 * client (using the service role key) can read/write it.
 */

let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  // .trim() strips stray whitespace AND Unicode line/paragraph separators
  // (U+2028/U+2029) that can sneak in when pasting keys into a dashboard —
  // those characters are invalid in HTTP headers and would crash every request.
  const url = process.env.SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set",
    );
  }

  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
