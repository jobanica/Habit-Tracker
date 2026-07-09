import Link from "next/link";
import { findByExternalId } from "@/lib/purchases";
import { getInvoice, isPaidStatus } from "@/lib/xendit";
import { maskEmail } from "@/lib/format";
import { config } from "@/lib/config";
import ProcessingRefresh from "@/components/ProcessingRefresh";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        {children}
      </div>
    </main>
  );
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  if (!order) {
    return (
      <Shell>
        <h1 className="text-xl font-bold text-slate-900">Order not found</h1>
        <p className="mt-2 text-slate-600">
          We couldn&apos;t find your order reference.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm font-medium text-indigo-600 hover:underline">
          ← Back to home
        </Link>
      </Shell>
    );
  }

  const purchase = await findByExternalId(order);

  // Verify payment status directly with Xendit — never trust the redirect alone.
  let paidAtXendit = false;
  if (purchase?.xendit_invoice_id) {
    try {
      const invoice = await getInvoice(purchase.xendit_invoice_id);
      paidAtXendit = isPaidStatus(invoice.status);
    } catch {
      // Treat as not-yet-confirmed; the page will keep polling.
      paidAtXendit = false;
    }
  }

  const ready =
    purchase?.status === "paid" && Boolean(purchase.download_token);

  // Paid + fulfilled → reveal the download.
  if (ready && purchase) {
    return (
      <Shell>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 13l4 4 10-11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Payment complete 🎉</h1>
        <p className="mt-2 text-slate-600">
          Thanks for buying <strong>{config.productName}</strong>! Open it on
          Google Drive below.
        </p>
        <a
          href={config.googleDriveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block w-full rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
        >
          Open on Google Drive
        </a>
        <p className="mt-4 text-sm text-slate-500">
          Pinadala rin namin ang link sa{" "}
          <strong>{maskEmail(purchase.email)}</strong>. I-save mo ang{" "}
          <Link
            href={`/download/${purchase.download_token}`}
            className="font-medium text-indigo-600 hover:underline"
          >
            private access link
          </Link>{" "}
          para ma-access anytime.
        </p>
      </Shell>
    );
  }

  // Paid at Xendit but webhook hasn't provisioned yet, OR still pending —
  // keep the buyer informed and auto-refresh.
  return (
    <Shell>
      <ProcessingRefresh />
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
        <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">
        {paidAtXendit ? "Finalizing your order…" : "Waiting for payment…"}
      </h1>
      <p className="mt-2 text-slate-600">
        {paidAtXendit
          ? "Your payment went through. We're preparing your download link — this page will update automatically in a few seconds."
          : "We haven't received confirmation of your payment yet. This page will refresh automatically once it lands."}
      </p>
      <p className="mt-6 text-sm text-slate-500">
        Taking too long? Contact{" "}
        <a href={`mailto:${config.supportEmail}`} className="font-medium text-indigo-600 hover:underline">
          {config.supportEmail}
        </a>
        .
      </p>
    </Shell>
  );
}
