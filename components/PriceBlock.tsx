import { config, formatPrice } from "@/lib/config";

export default function PriceBlock() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="mx-auto max-w-md rounded-3xl border border-indigo-100 bg-gradient-to-b from-white to-indigo-50 p-8 text-center shadow-lg">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {formatPrice()}. One-time. Sa&apos;yo na.
        </h2>
        <div className="mt-6 flex items-baseline justify-center gap-1">
          <span className="text-6xl font-extrabold tracking-tight text-slate-900">
            {formatPrice()}
          </span>
        </div>
        <p className="mt-4 text-slate-600">
          Presyo ng isang milk tea run — pero ito, gagamitin mo araw-araw.
        </p>
        <a
          href="#buy"
          className="mt-8 block w-full rounded-xl bg-indigo-600 px-8 py-4 text-center text-lg font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
        >
          Get {config.productName} — {formatPrice()}
        </a>
        <p className="mt-4 text-xs text-slate-500">
          Secure checkout via Xendit · Download sa screen at sa email mo
        </p>
      </div>
    </section>
  );
}
