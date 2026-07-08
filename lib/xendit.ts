import "server-only";
import { config } from "./config";

/**
 * Thin fetch wrapper over the Xendit Invoice API (v2).
 * Docs: POST/GET https://api.xendit.co/v2/invoices — HTTP Basic auth with the
 * secret key as the username and an empty password.
 *
 * Server-side only. XENDIT_SECRET_KEY must never reach the client.
 */

const XENDIT_BASE = "https://api.xendit.co";

function authHeader(): string {
  const key = process.env.XENDIT_SECRET_KEY;
  if (!key) throw new Error("XENDIT_SECRET_KEY is not set");
  // Basic auth: base64("<secret_key>:")
  return `Basic ${Buffer.from(`${key}:`).toString("base64")}`;
}

export interface XenditInvoice {
  id: string;
  external_id: string;
  status: "PENDING" | "PAID" | "SETTLED" | "EXPIRED";
  invoice_url: string;
  amount: number;
  payer_email?: string;
  paid_at?: string;
}

export interface CreateInvoiceParams {
  externalId: string;
  email: string;
}

/**
 * Create a hosted Xendit invoice and return it (including `invoice_url`).
 */
export async function createInvoice({
  externalId,
  email,
}: CreateInvoiceParams): Promise<XenditInvoice> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) throw new Error("NEXT_PUBLIC_APP_URL is not set");

  const body = {
    external_id: externalId,
    amount: config.priceAmount,
    payer_email: email,
    currency: config.currency,
    description: `${config.productName} — one-time purchase`,
    invoice_duration: config.invoiceDurationSeconds,
    success_redirect_url: `${appUrl}/thank-you?order=${encodeURIComponent(
      externalId,
    )}`,
    failure_redirect_url: `${appUrl}/payment-failed`,
  };

  const res = await fetch(`${XENDIT_BASE}/v2/invoices`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Xendit createInvoice failed (${res.status}): ${text}`);
  }

  return (await res.json()) as XenditInvoice;
}

/**
 * Fetch an invoice by its Xendit id, to verify status server-side.
 */
export async function getInvoice(id: string): Promise<XenditInvoice> {
  const res = await fetch(`${XENDIT_BASE}/v2/invoices/${encodeURIComponent(id)}`, {
    method: "GET",
    headers: { Authorization: authHeader() },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Xendit getInvoice failed (${res.status}): ${text}`);
  }

  return (await res.json()) as XenditInvoice;
}

/** Whether an invoice status counts as successfully paid. */
export function isPaidStatus(status: string): boolean {
  return status === "PAID" || status === "SETTLED";
}
