import { config } from "@/lib/config";

const faqs = [
  {
    q: "What payment methods can I use?",
    a: "You can pay with GCash, Maya, credit/debit card, or bank transfer through our secure checkout powered by Xendit.",
  },
  {
    q: "How do I get the product after paying?",
    a: "Instantly. Right after payment you land on a page with your download link, and we also email the same secure link to you.",
  },
  {
    q: "Do I need an account?",
    a: "No. There's no sign-up and no login — just your email so we can send your download link.",
  },
  {
    q: "How long is my download link valid?",
    a: `Your secure link works for ${config.downloadTokenTtlDays} days and allows up to ${config.maxDownloads} downloads. Need it re-sent? Just contact us.`,
  },
  {
    q: "What's your refund policy?",
    a: "Placeholder: state your refund policy here (e.g. digital goods are non-refundable, or a 7-day money-back guarantee).",
  },
];

export default function Faq() {
  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-5">
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
          Frequently asked questions
        </h2>
        <div className="mt-10 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {faqs.map((faq) => (
            <details key={faq.q} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-slate-900">
                {faq.q}
                <span className="ml-4 shrink-0 text-indigo-600 transition group-open:rotate-45">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-slate-600">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
