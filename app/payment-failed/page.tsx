import Link from "next/link";
import { config } from "@/lib/config";

export default function PaymentFailedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Payment not completed</h1>
        <p className="mt-2 text-slate-600">
          Your payment didn&apos;t go through, so you haven&apos;t been charged.
          You can try again anytime.
        </p>
        <Link
          href="/#buy"
          className="mt-6 block w-full rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
        >
          Try again
        </Link>
        <p className="mt-4 text-sm text-slate-500">
          Need help? Contact{" "}
          <a href={`mailto:${config.supportEmail}`} className="font-medium text-indigo-600 hover:underline">
            {config.supportEmail}
          </a>
          .
        </p>
      </div>
    </main>
  );
}
