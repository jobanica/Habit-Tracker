import "server-only";
import nodemailer from "nodemailer";
import { config } from "./config";

/**
 * Delivery email via Gmail SMTP. Server-side only.
 * Sent on payment so buyers always get their download link even if the
 * post-payment redirect fails (common with GCash + in-app browsers).
 *
 * Requires GMAIL_USER (the Gmail address) and GMAIL_APP_PASSWORD (a 16-char
 * Google App Password — NOT your normal Gmail password).
 */

function getTransport() {
  const user = process.env.GMAIL_USER?.trim();
  // App passwords are shown with spaces ("abcd efgh ijkl mnop"); strip them.
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  if (!user || !pass) {
    throw new Error("GMAIL_USER and GMAIL_APP_PASSWORD must be set");
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

function deliveryHtml(downloadUrl: string): string {
  return `
  <div style="font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #111827;">
    <h1 style="font-size: 22px; margin: 0 0 8px;">Salamat sa purchase mo! 🎉</h1>
    <p style="font-size: 15px; line-height: 1.6; color: #374151;">
      Ready na ang <strong>${config.productName}</strong> mo. I-click ang button
      sa baba para buksan ang download mo sa Google Drive. Pwede mong i-save ang
      link na ito para ma-access mo ulit anytime.
    </p>
    <p style="margin: 28px 0;">
      <a href="${downloadUrl}"
         style="background: #4f46e5; color: #ffffff; text-decoration: none;
                padding: 14px 28px; border-radius: 10px; font-size: 16px;
                font-weight: 600; display: inline-block;">
        Buksan ang download
      </a>
    </p>
    <p style="font-size: 13px; line-height: 1.6; color: #6b7280;">
      Kung hindi gumana ang button, i-copy at i-paste ang link na ito sa browser mo:<br />
      <a href="${downloadUrl}" style="color: #4f46e5; word-break: break-all;">${downloadUrl}</a>
    </p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 28px 0;" />
    <p style="font-size: 13px; color: #6b7280;">
      May tanong? Reply lang sa email na ito o mag-message sa
      <a href="mailto:${config.supportEmail}" style="color: #4f46e5;">${config.supportEmail}</a>.
    </p>
  </div>`;
}

export async function sendDeliveryEmail(params: {
  to: string;
  downloadUrl: string;
}): Promise<void> {
  const user = process.env.GMAIL_USER?.trim();
  const transport = getTransport();
  await transport.sendMail({
    from: `${config.productName} <${user}>`,
    to: params.to,
    subject: `Ready na ang ${config.productName} download mo`,
    html: deliveryHtml(params.downloadUrl),
  });
}
