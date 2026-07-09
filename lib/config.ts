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
  // After paying, buyers get a Download button that pulls the product straight
  // down (no Google Drive page in between). This requires a SINGLE file on
  // Drive — if your product is multiple files, zip them into one first.
  //
  // In Drive: right-click the FILE (not a folder) → Share → "Anyone with the
  // link" (Viewer) → Copy link. From that link, copy the ID — the part between
  // "/d/" and "/view" — and paste ONLY that ID below.
  // Example link: https://drive.google.com/file/d/ABC123xyz/view?usp=sharing
  //          →    driveFileId: "ABC123xyz"
  driveFileId: "1burGx8wGeeAQpZ09obbgg3QMooiMsLUp",

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

/**
 * Direct-download URL for the product file on Google Drive.
 * The `uc?export=download` form makes Drive serve the file as an attachment
 * instead of opening its preview page, so the buyer's browser downloads it
 * immediately. Works for a single shared file (see `driveFileId` above).
 */
export function downloadUrl(): string {
  return `https://drive.google.com/uc?export=download&id=${config.driveFileId}`;
}
