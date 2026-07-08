import { NextResponse } from "next/server";
import { findByToken, decrementDownloads } from "@/lib/purchases";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { config } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Consumes one download for a valid token and redirects to a short-lived
 * (60s) signed URL for the product file in the private Storage bucket.
 * The counter is decremented here (on the actual download click), not on
 * page view, so refreshing the download page doesn't burn downloads.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  const purchase = await findByToken(token);
  if (!purchase || purchase.status !== "paid") {
    return NextResponse.redirect(`${appUrl}/download/${token}`);
  }

  // Atomic guard: only proceeds if paid, unexpired and downloads remain.
  const ok = await decrementDownloads(token);
  if (!ok) {
    return NextResponse.redirect(`${appUrl}/download/${token}`);
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage
      .from(config.storageBucket)
      .createSignedUrl(config.productFilename, config.signedUrlTtlSeconds, {
        download: true,
      });

    if (error || !data?.signedUrl) {
      throw new Error(error?.message ?? "Could not create signed URL");
    }

    return NextResponse.redirect(data.signedUrl);
  } catch (err) {
    console.error("[deliver] signed URL failed:", err);
    return NextResponse.redirect(`${appUrl}/download/${token}`);
  }
}
