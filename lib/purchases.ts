import "server-only";
import { getSupabaseAdmin } from "./supabaseAdmin";

/**
 * All access to the `purchases` table lives here.
 * Uses the service-role client (RLS-bypassing), server-side only.
 */

export interface Purchase {
  id: string;
  external_id: string;
  email: string;
  xendit_invoice_id: string | null;
  status: "pending" | "paid";
  download_token: string | null;
  token_expires_at: string | null;
  downloads_remaining: number | null;
  created_at: string;
  paid_at: string | null;
}

const TABLE = "purchases";

export async function insertPending(params: {
  externalId: string;
  email: string;
  xenditInvoiceId: string;
}): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from(TABLE).insert({
    external_id: params.externalId,
    email: params.email,
    xendit_invoice_id: params.xenditInvoiceId,
    status: "pending",
  });
  if (error) throw new Error(`insertPending failed: ${error.message}`);
}

export async function findByExternalId(
  externalId: string,
): Promise<Purchase | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("external_id", externalId)
    .maybeSingle();
  if (error) throw new Error(`findByExternalId failed: ${error.message}`);
  return (data as Purchase) ?? null;
}

export async function findByToken(token: string): Promise<Purchase | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("download_token", token)
    .maybeSingle();
  if (error) throw new Error(`findByToken failed: ${error.message}`);
  return (data as Purchase) ?? null;
}

/**
 * Idempotently mark a purchase paid and provision its download token.
 * Only flips a row that is still `pending` (guards against double webhooks).
 * Returns the updated purchase, or null if it was already paid / not found.
 */
export async function markPaidWithToken(params: {
  externalId: string;
  token: string;
  tokenExpiresAt: string;
  downloadsRemaining: number;
}): Promise<Purchase | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      status: "paid",
      download_token: params.token,
      token_expires_at: params.tokenExpiresAt,
      downloads_remaining: params.downloadsRemaining,
      paid_at: new Date().toISOString(),
    })
    .eq("external_id", params.externalId)
    .eq("status", "pending")
    .select("*")
    .maybeSingle();
  if (error) throw new Error(`markPaidWithToken failed: ${error.message}`);
  return (data as Purchase) ?? null;
}

/**
 * Atomically decrement downloads_remaining for a valid token.
 * Guarded on status='paid' and downloads_remaining > 0 so a race can't
 * push the counter negative. Returns true if a row was decremented.
 */
export async function decrementDownloads(token: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.rpc("decrement_download", {
    p_token: token,
  });
  if (error) throw new Error(`decrementDownloads failed: ${error.message}`);
  return data === true;
}
