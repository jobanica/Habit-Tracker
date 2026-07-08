import { config } from "@/lib/config";

const faqs = [
  {
    q: "Paano ako magbabayad?",
    a: "GCash, Maya, credit/debit card, o bank transfer — lahat secure via Xendit checkout.",
  },
  {
    q: "Paano ko makukuha 'yung app?",
    a: "Pagkatapos magbayad, lalabas agad sa screen ang Google Drive download mo — one click at sa'yo na. Wala pang isang minuto.",
  },
  {
    q: "May monthly fee ba?",
    a: "Wala. ₱149 one-time lang. No subscription, no hidden charges, no upsell.",
  },
  {
    q: "Kailangan ko bang gumawa ng account?",
    a: "Hindi. Email mo lang para ma-tie sa purchase mo at para may resibo ka. 'Yun lang.",
  },
  {
    q: "Paano i-install?",
    a: "Placeholder — palitan mo ito ng totoong steps para sa ZIP mo (hal. i-download, i-extract, buksan sa phone/browser). Maging honest dito para walang refund request.",
  },
  {
    q: "Paano kung nawala ko 'yung download link?",
    a: `Message mo lang kami sa ${config.supportEmail} gamit ang email na ginamit mo sa bayad — bibigyan ka namin ulit ng access.`,
  },
];

export default function Faq() {
  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-5">
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
          Mga tanong na madalas
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
