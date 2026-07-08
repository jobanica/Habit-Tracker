/**
 * Single source of truth for product + commerce settings.
 * Edit copy, pricing, and the download link here.
 */

export const config = {
  // --- Product ---
  productName: "Habit Tracker",
  tagline: "Build habits that actually stick.",
  subheadline:
    "A simple, focused habit tracker that helps you show up every day — no bloat, no subscriptions, just progress you can see.",

  // --- Pricing (one-time) ---
  // Xendit amount is a plain number in the given currency's major unit.
  priceAmount: 149,
  currency: "PHP" as const,

  // --- Delivery ---
  // The Google Drive link customers get after paying.
  // In Drive: right-click the file/folder → Share → "Anyone with the link"
  // (Viewer) → Copy link → paste it here. This link is only ever shown on a
  // payment-verified page, never on a public page.
  googleDriveUrl:
    "https://drive.google.com/drive/folders/11ADoxgmFZ5SupSqh5_4D6NXRes85f6VA?usp=drive_link",

  // --- Invoice ---
  // How long a Xendit invoice stays payable (seconds). 24h.
  invoiceDurationSeconds: 86_400,

  // --- Contact / legal ---
  supportEmail: "support@example.com",
  companyName: "Habit Tracker",
} as const;

/** Formatted price string, e.g. "₱149". */
export function formatPrice(): string {
  return `₱${config.priceAmount.toLocaleString("en-PH")}`;
}
