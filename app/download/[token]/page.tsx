import Link from "next/link";
import { findByToken } from "@/lib/purchases";
import { config } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function InvalidLink({ reason }: { reason: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 8v5M12 16.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <h1 className="mt-4 text-xl font-bold text-slate-900">
          This download link isn&apos;t valid
        </h1>
        <p className="mt-2 text-slate-600">{reason}</p>
        <p className="mt-6 text-sm text-slate-500">
          Need help? Contact{" "}
          <a
            href={`mailto:${config.supportEmail}`}
            className="font-medium text-indigo-600 hover:underline"
          >
            {config.supportEmail}
          </a>{" "}
          and we&apos;ll sort it out.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm font-medium text-indigo-600 hover:underline"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}

export default async function DownloadPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const purchase = await findByToken(token);

  if (!purchase || purchase.status !== "paid") {
    return <InvalidLink reason="We couldn't find a purchase for this link." />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 4v10m0 0l-4-4m4 4l4-4M5 19h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Your download is ready
        </h1>
        <p className="mt-2 text-slate-600">
          Open <strong>{config.productName}</strong> on Google Drive to download it.
        </p>
        <a
          href={config.googleDriveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block w-full rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
        >
          Open on Google Drive
        </a>
        <p className="mt-4 text-xs text-slate-500">
          Bookmark this page — it&apos;s your private link to access the download
          anytime.
        </p>
      </div>
    </main>
  );
}
