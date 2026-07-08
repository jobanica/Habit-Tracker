"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Auto-refreshes the thank-you page until the download token appears
 * (i.e. the Xendit webhook has finished provisioning the purchase).
 */
export default function ProcessingRefresh({
  intervalMs = 4000,
}: {
  intervalMs?: number;
}) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => router.refresh(), intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);

  return null;
}
