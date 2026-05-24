import team from "@/assets/field-team.jpg";
import capacity from "@/assets/capacity-building.jpg";
import insitu from "@/assets/insitu-planting.jpg";
import community from "@/assets/community.jpg";
import himalayas from "@/assets/himalayas.jpg";

const shots = [
  { src: team, alt: "Discovery Pakistan media feature with project director Dr. Rizwana Khanum in the field", caption: "Discovery Pakistan · June 2024", span: "md:col-span-2 md:row-span-2" },
  { src: himalayas, alt: "Snow-capped Himalayan peaks where Trillium populations were surveyed", caption: "Surveyed regions · Pakistani Himalayas", span: "md:col-span-2" },
  { src: capacity, alt: "Forest officer training session led by PMNH", caption: "Capacity building · 23 officers trained" },
  { src: insitu, alt: "In-situ Trillium replanting with community volunteers", caption: "In-situ conservation · Ayubia & Jheka Gali" },
  { src: community, alt: "Community awareness gathering with elders across multiple valleys", caption: "Community meetings · 32 sessions" },
];

export function Field() {
  return (
    <section id="field" className="relative py-28 lg:py-40 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-6">
              In the Field
            </p>
            <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-balance">
              From <em className="text-[var(--moss)]">Kashmir</em> to Shangla — every
              valley, every voice.
            </h2>
          </div>
          <a
            href="https://www.instagram.com/pakistan_mbz/"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors group"
          >
            <span className="border-b border-current pb-0.5">
              Follow @pakistan_mbz on Instagram
            </span>
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>

        <div className="grid md:grid-cols-4 grid-rows-[repeat(4,200px)] md:grid-rows-[repeat(2,300px)] gap-3">
          {shots.map((s, i) => (
            <figure
              key={i}
              className={`relative overflow-hidden rounded-xl group ${s.span ?? ""}`}
            >
              <img
                src={s.src}
                alt={s.alt}
                className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <figcaption className="absolute bottom-3 left-4 right-4 text-xs text-white tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {s.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
