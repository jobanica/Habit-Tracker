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
 * Idempotently mark a purchase paid and attach its private access token.
 * Only flips a row that is still `pending` (guards against double webhooks).
 * Returns the updated purchase, or null if it was already paid / not found.
 */
export async function markPaidWithToken(params: {
  externalId: string;
  token: string;
}): Promise<Purchase | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      status: "paid",
      download_token: params.token,
      paid_at: new Date().toISOString(),
    })
    .eq("external_id", params.externalId)
    .eq("status", "pending")
    .select("*")
    .maybeSingle();
  if (error) throw new Error(`markPaidWithToken failed: ${error.message}`);
  return (data as Purchase) ?? null;
}
