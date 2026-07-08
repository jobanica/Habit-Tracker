import Image from "next/image";
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
              Get the App — {formatPrice()}
            </a>
            <span className="text-sm text-slate-500">
              GCash · Maya · Card · Instant download after payment
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          {/* Replace /mockup.svg with your real product mockup */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-[3rem] bg-indigo-600/10 blur-2xl" />
            <Image
              src="/mockup.svg"
              alt={`${config.productName} app preview`}
              width={280}
              height={560}
              priority
              className="relative drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
