import Link from "next/link";
import type { Metadata } from "next";
import { config } from "@/lib/config";

export const metadata: Metadata = { title: `Terms · ${config.productName}` };

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16">
      <Link href="/" className="text-sm font-medium text-indigo-600 hover:underline">
        ← Back to home
      </Link>
      <h1 className="mt-6 text-3xl font-bold text-slate-900">Terms of Service</h1>
      <p className="mt-2 text-sm text-slate-500">Placeholder — replace with your own terms.</p>
      <div className="mt-8 space-y-4 text-slate-700">
        <p>
          This is a placeholder Terms of Service page for {config.companyName}.
          Replace this copy with your actual terms before going live.
        </p>
        <p>
          {config.productName} is a digital product sold as a one-time purchase.
          Describe your license, acceptable use, and any restrictions here.
        </p>
        <p>
          For questions about these terms, contact{" "}
          <a href={`mailto:${config.supportEmail}`} className="text-indigo-600 hover:underline">
            {config.supportEmail}
          </a>
          .
        </p>
      </div>
    </main>
  );
}
