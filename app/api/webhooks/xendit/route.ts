import { NextResponse } from "next/server";
import { isPaidStatus } from "@/lib/xendit";
import { findByExternalId, markPaidWithToken } from "@/lib/purchases";
import { sendDeliveryEmail } from "@/lib/resend";
import { generateToken } from "@/lib/format";
import { config } from "@/lib/config";

export const runtime = "nodejs";

/**
 * Xendit invoice callback.
 * Verifies the `x-callback-token` header against XENDIT_CALLBACK_TOKEN,
 * then fulfils PAID invoices idempotently. Always returns 200 fast on
 * accepted events so Xendit doesn't retry unnecessarily.
 */
export async function POST(req: Request) {
  const expected = process.env.XENDIT_CALLBACK_TOKEN;
  const received = req.headers.get("x-callback-token");

  if (!expected || received !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: { external_id?: string; status?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const externalId = payload.external_id;
  const status = payload.status ?? "";

  if (!externalId) {
    return NextResponse.json({ error: "Missing external_id" }, { status: 400 });
  }

  // Only act on successful payments; ack everything else so Xendit stops retrying.
  if (!isPaidStatus(status)) {
    return NextResponse.json({ received: true });
  }

  try {
    const purchase = await findByExternalId(externalId);
    if (!purchase) {
      // Unknown order — ack to avoid infinite retries, but log for investigation.
      console.warn(`[webhook] unknown external_id: ${externalId}`);
      return NextResponse.json({ received: true });
    }

    // Idempotency: only the first transition from pending -> paid provisions
    // a token and sends the email. Concurrent/duplicate callbacks no-op.
    const token = generateToken();
    const expiresAt = new Date(
      Date.now() + config.downloadTokenTtlDays * 24 * 60 * 60 * 1000,
    ).toISOString();

    const updated = await markPaidWithToken({
      externalId,
      token,
      tokenExpiresAt: expiresAt,
      downloadsRemaining: config.maxDownloads,
    });

    if (!updated) {
      // Already paid — nothing to do.
      return NextResponse.json({ received: true, duplicate: true });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const downloadUrl = `${appUrl}/download/${updated.download_token}`;

    // Email is a second delivery channel; the thank-you page also shows the
    // link. Don't fail the webhook (and trip the idempotency guard on retry)
    // just because email delivery hiccuped — log and move on.
    try {
      await sendDeliveryEmail({ to: updated.email, downloadUrl });
    } catch (mailErr) {
      console.error(`[webhook] delivery email failed for ${externalId}:`, mailErr);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[webhook] processing failed:", err);
    // 500 lets Xendit retry the callback later.
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
