/**
 * Single source of truth for product + commerce settings.
 * Edit copy, pricing, and the download link here.
 */

export const config = {
  // --- Product ---
  productName: "Habit Tracker",
  tagline:
    "Isang habit tracker na binili mo minsan. Hindi binabayaran buwan-buwan.",
  subheadline:
    "Track your habits, protect your streaks, at makita ang progress mo — ₱149 one-time. Walang subscription, walang ads, walang paywall sa gitna.",

  // --- SEO / meta ---
  pageTitle: "Habit Tracker App — ₱149 One-Time, No Subscription",
  metaDescription:
    "Track habits, build streaks, and see your progress. One-time ₱149 via GCash, Maya, or card. Instant download. No subscription, no ads, no account needed.",

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
