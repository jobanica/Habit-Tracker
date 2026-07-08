const items = [
  {
    title: "The full Habit Tracker app",
    body: "Delivered as a downloadable ZIP — yours to keep forever.",
  },
  {
    title: "Daily & weekly habit views",
    body: "See what's due today and track streaks at a glance.",
  },
  {
    title: "Progress charts",
    body: "Visualize consistency so you stay motivated week after week.",
  },
  {
    title: "Clean, distraction-free design",
    body: "No ads, no bloat, no login required to use it.",
  },
  {
    title: "Works offline",
    body: "Your data stays on your device. Fast and private.",
  },
  {
    title: "Free updates",
    body: "Placeholder: describe your update policy here.",
  },
];

export default function WhatYouGet() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          What&apos;s inside
        </h2>
        <p className="mt-3 text-slate-600">
          Everything you need to build habits that stick — edit this copy to match
          your product.
        </p>
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
