import { formatPrice } from "@/lib/config";

const items = [
  {
    title: "Unlimited habits",
    body: "Walang “upgrade to add more” na lalabas.",
  },
  {
    title: "Streak tracking",
    body: "Kita mo agad kung ilang araw ka nang consistent.",
  },
  {
    title: "Progress analytics",
    body: "Weekly at monthly view para alam mo kung ano'ng gumagana.",
  },
  {
    title: "Works on your phone",
    body: "Install mo parang app, gamit mo kahit saan.",
  },
  {
    title: "Yours forever",
    body: "One-time payment. Ito na 'yun. Wala nang kasunod.",
  },
];

export default function WhatYouGet() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Ano&apos;ng kasama sa {formatPrice()}?
        </h2>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <svg
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
            </div>
            <h3 className="mt-4 font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
