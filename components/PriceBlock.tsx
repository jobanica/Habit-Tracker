import { config, formatPrice } from "@/lib/config";

const perks = [
  "One-time payment — no subscription",
  "Instant download after payment",
  "Emailed to you as well",
  "Pay with GCash, Maya, card or bank transfer",
];

export default function PriceBlock() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="mx-auto max-w-md rounded-3xl border border-indigo-100 bg-gradient-to-b from-white to-indigo-50 p-8 text-center shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          {config.productName}
        </p>
        <div className="mt-4 flex items-baseline justify-center gap-1">
          <span className="text-5xl font-extrabold tracking-tight text-slate-900">
            {formatPrice()}
          </span>
          <span className="text-lg text-slate-500">one-time</span>
        </div>
        <ul className="mt-8 space-y-3 text-left">
          {perks.map((perk) => (
            <li key={perk} className="flex items-start gap-3 text-slate-700">
              <svg
                className="mt-0.5 shrink-0 text-indigo-600"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 10.5l4 4 8-9"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{perk}</span>
            </li>
          ))}
        </ul>
        <a
          href="#buy"
          className="mt-8 block w-full rounded-xl bg-indigo-600 px-8 py-4 text-center text-lg font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
        >
          Buy Now
        </a>
      </div>
    </section>
  );
}
