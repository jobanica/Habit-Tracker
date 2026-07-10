import { config, formatPrice } from "@/lib/config";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
        <div className="text-center md:text-left">
          <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
            One-time · Walang subscription
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            {config.tagline}
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-slate-600 md:mx-0">
            {config.subheadline}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row md:items-start">
            <a
              href="#buy"
              className="w-full rounded-xl bg-indigo-600 px-8 py-4 text-center text-lg font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 sm:w-auto"
            >
              Get {config.productName} — {formatPrice()}
            </a>
            <span className="text-sm text-slate-500">
              GCash · Maya · Card · Instant download after payment
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute -inset-6 rounded-[3rem] bg-indigo-600/10 blur-2xl" />
            {/* App reveal video — swap /reveal.mp4 to update */}
            <div className="relative mx-auto w-[260px] overflow-hidden rounded-[2.5rem] border-[6px] border-slate-900 bg-slate-900 shadow-2xl">
              <video
                className="block h-auto w-full"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/reveal-poster.jpg"
                aria-label={`${config.productName} app preview`}
              >
                <source src="/reveal.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
