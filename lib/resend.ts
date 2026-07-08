import "server-only";
import { Resend } from "resend";
import { config } from "./config";

/**
 * Resend delivery email. Server-side only.
 */

function getClient(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

function deliveryHtml(downloadUrl: string): string {
  return `
  <div style="font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #111827;">
    <h1 style="font-size: 22px; margin: 0 0 8px;">Thanks for your purchase! 🎉</h1>
    <p style="font-size: 15px; line-height: 1.6; color: #374151;">
      Your copy of <strong>${config.productName}</strong> is ready. Click the button
      below to download it. This secure link expires in
      ${config.downloadTokenTtlDays} days and allows up to
      ${config.maxDownloads} downloads.
    </p>
    <p style="margin: 28px 0;">
      <a href="${downloadUrl}"
         style="background: #4f46e5; color: #ffffff; text-decoration: none;
                padding: 14px 28px; border-radius: 10px; font-size: 16px;
                font-weight: 600; display: inline-block;">
        Download ${config.productName}
      </a>
    </p>
    <p style="font-size: 13px; line-height: 1.6; color: #6b7280;">
      If the button doesn't work, copy and paste this link into your browser:<br />
      <a href="${downloadUrl}" style="color: #4f46e5; word-break: break-all;">${downloadUrl}</a>
    </p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 28px 0;" />
    <p style="font-size: 13px; color: #6b7280;">
      Need help? Reply to this email or contact
      <a href="mailto:${config.supportEmail}" style="color: #4f46e5;">${config.supportEmail}</a>.
    </p>
  </div>`;
}

export async function sendDeliveryEmail(params: {
  to: string;
  downloadUrl: string;
}): Promise<void> {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) throw new Error("RESEND_FROM_EMAIL is not set");

  const resend = getClient();
  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: `Your ${config.productName} download is ready`,
    html: deliveryHtml(params.downloadUrl),
  });

  if (error) {
    throw new Error(`Resend send failed: ${JSON.stringify(error)}`);
  }
}
