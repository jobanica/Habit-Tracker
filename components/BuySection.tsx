"use client";

import { useState, FormEvent } from "react";
import { formatPrice } from "@/lib/config";
import { isValidEmail } from "@/lib/format";

export default function BuySection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data?.url) {
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }
      // Redirect to Xendit hosted checkout.
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <section id="buy" className="scroll-mt-8 bg-indigo-600 py-16 md:py-24">
      <div className="mx-auto max-w-lg px-5 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Simulan mo na &apos;yung habit na laging &ldquo;next week na lang.&rdquo;
        </h2>
        <p className="mt-3 text-lg text-indigo-100">
          {formatPrice()} ngayon. Streak mo bukas.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 text-left"
        >
          <label htmlFor="buy-email" className="text-sm font-medium text-indigo-100">
            Saan namin ipapadala ang download link?
          </label>
          <input
            id="buy-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="juan@email.com"
            className="w-full rounded-xl border-0 px-5 py-4 text-slate-900 shadow-sm outline-none ring-2 ring-transparent focus:ring-indigo-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white px-8 py-4 text-lg font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Redirecting…" : `Buy Now — ${formatPrice()}`}
          </button>
          {error && (
            <p className="text-sm font-medium text-indigo-100" role="alert">
              {error}
            </p>
          )}
        </form>
        <p className="mt-4 text-center text-xs text-indigo-200">
          Secure checkout via Xendit · GCash · Maya · Card · Bank transfer
        </p>
      </div>
    </section>
  );
}
