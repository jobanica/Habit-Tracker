import Link from "next/link";
import type { Metadata } from "next";
import { config } from "@/lib/config";

export const metadata: Metadata = { title: `Privacy · ${config.productName}` };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16">
      <Link href="/" className="text-sm font-medium text-indigo-600 hover:underline">
        ← Back to home
      </Link>
      <h1 className="mt-6 text-3xl font-bold text-slate-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Placeholder — replace with your own policy.</p>
      <div className="mt-8 space-y-4 text-slate-700">
        <p>
          This is a placeholder Privacy Policy for {config.companyName}. Replace
          this copy with your actual policy before going live.
        </p>
        <p>
          We collect your email address solely to process your purchase and send
          your download link. Payments are handled securely by Xendit; we never
          see or store your card or wallet details.
        </p>
        <p>
          For privacy questions, contact{" "}
          <a href={`mailto:${config.supportEmail}`} className="text-indigo-600 hover:underline">
            {config.supportEmail}
          </a>
          .
        </p>
      </div>
    </main>
  );
}
