import Image from "next/image";

const shots = [
  { src: "/screenshot-1.svg", alt: "Habit list preview" },
  { src: "/screenshot-2.svg", alt: "Progress ring preview" },
  { src: "/screenshot-3.svg", alt: "Weekly trends preview" },
];

export default function Screenshots() {
  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Take a look
          </h2>
          <p className="mt-3 text-slate-600">
            Replace these placeholders with real screenshots of your app.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {shots.map((shot) => (
            <div
              key={shot.src}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                width={600}
                height={400}
                className="h-auto w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
