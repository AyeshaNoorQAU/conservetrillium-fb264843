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
          {shots.map((s, i) => {
            const kb = ["ken-burns-1", "ken-burns-2", "ken-burns-3"][i % 3];
            return (
              <figure
                key={i}
                className={`relative overflow-hidden rounded-xl group ${s.span ?? ""}`}
              >
                <img
                  src={s.src}
                  alt={s.alt}
                  className={`w-full h-full object-cover ${kb} will-change-transform`}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                <figcaption className="absolute bottom-3 left-4 right-4 text-xs text-white tracking-wide translate-y-2 opacity-80 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  {s.caption}
                </figcaption>
              </figure>
            );
          })}
        </div>

        {/* Instagram reel feature */}
        <div className="mt-16 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-5 fade-up">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
              Featured reel · @pakistan_mbz
            </p>
            <h3 className="text-display text-3xl lg:text-4xl leading-tight">
              A minute in the field —{" "}
              <span className="italic text-[var(--moss)]">
                voices from the valley.
              </span>
            </h3>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Watch our team document Trillium populations and converse with
              custodian communities in the Pakistani Himalayas. Shared directly
              from our project Instagram.
            </p>
            <a
              href="https://www.instagram.com/reel/DD7IC3pP1YE/"
              target="_blank"
              rel="noreferrer noopener"
              className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors"
            >
              <span className="border-b border-current pb-0.5">Open on Instagram</span>
              <span aria-hidden>→</span>
            </a>
          </div>
          <div className="lg:col-span-7 fade-up fade-up-delay-1">
            <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-[var(--shadow-elevated)] bg-black aspect-[9/16]">
              <iframe
                src="https://www.instagram.com/reel/DD7IC3pP1YE/embed"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 w-full h-full"
                title="Project field reel from @pakistan_mbz"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

