/**
 * Single source of truth for product + commerce settings.
 * Edit copy and pricing here — do not hardcode these values elsewhere.
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

  // --- Delivery / product file ---
  // Filename of the ZIP uploaded to the private Supabase Storage bucket `product`.
  productFilename: "habit-tracker.zip",
  storageBucket: "product",

  // --- Download link security ---
  downloadTokenTtlDays: 7,
  maxDownloads: 5,
  signedUrlTtlSeconds: 60,

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
