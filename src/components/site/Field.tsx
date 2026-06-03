import { useState } from "react";
import { useCmsList, type GalleryRow } from "@/lib/cms";
import { Lightbox } from "@/components/site/Lightbox";
import team from "@/assets/field-team.jpg";
import capacity from "@/assets/capacity-building.jpg";
import insitu from "@/assets/insitu-planting.jpg";
import community from "@/assets/community.jpg";
import himalayas from "@/assets/himalayas.jpg";
import elder from "@/assets/gallery-elder.jpg";
import herbarium from "@/assets/gallery-herbarium.jpg";
import meadow from "@/assets/gallery-meadow.jpg";
import trek from "@/assets/gallery-trek.jpg";
import { Expand } from "lucide-react";

type Shot = { src: string; alt: string; caption: string; span?: string };

const defaultShots: Shot[] = [
  {
    src: team,
    alt: "Discovery Pakistan media feature with project director Dr. Rizwana Khanum in the field",
    caption: "Discovery Pakistan · June 2024",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    src: himalayas,
    alt: "Snow-capped Himalayan peaks where Trillium populations were surveyed",
    caption: "Surveyed regions · Pakistani Himalayas",
    span: "md:col-span-2",
  },
  {
    src: meadow,
    alt: "Trillium and wildflowers in misty alpine meadow at dawn",
    caption: "Alpine meadow · Trillium habitat at dawn",
  },
  {
    src: capacity,
    alt: "Forest officer training session led by PMNH",
    caption: "Capacity building · 23 officers trained",
  },
  {
    src: insitu,
    alt: "In-situ Trillium replanting with community volunteers",
    caption: "In-situ conservation · Ayubia & Jheka Gali",
  },
  {
    src: elder,
    alt: "Village elder holds a wild medicinal plant specimen at dawn",
    caption: "Knowledge keepers · custodian elder",
  },
  {
    src: community,
    alt: "Community awareness gathering with elders across multiple valleys",
    caption: "Community meetings · 32 sessions",
  },
  {
    src: herbarium,
    alt: "Botanist pressing a Trillium specimen on a herbarium sheet",
    caption: "Herbarium · vouchering field collections",
  },
  {
    src: trek,
    alt: "Young Pakistani field researchers trekking through deodar forest at sunset",
    caption: "Survey trek · forest path at golden hour",
  },
];

export function Field() {
  const dynamic = useCmsList<GalleryRow>("gallery_photos");
  const [openAt, setOpenAt] = useState<number | null>(null);

  const dynamicShots: Shot[] = (dynamic ?? []).map((r) => ({
    src: r.image_url,
    alt: r.alt ?? r.caption ?? "Field photograph",
    caption: r.caption ?? "",
  }));
  const shots = [...defaultShots, ...dynamicShots];

  return (
    <section id="field" className="relative py-28 lg:py-40 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-6">In the Field</p>
            <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-balance">
              From <em className="text-[var(--moss)]">Kashmir</em> to Shangla — every valley, every
              voice.
            </h2>
            <p className="mt-5 text-sm text-muted-foreground">
              Photography by <span className="text-foreground">Syed Munir Hussain</span>. Tap any
              photograph to enter the lightbox.
            </p>
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
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>

        <div className="grid md:grid-cols-4 auto-rows-[180px] md:auto-rows-[260px] gap-3">
          {shots.map((s, i) => {
            const kb = ["ken-burns-1", "ken-burns-2", "ken-burns-3"][i % 3];
            return (
              <button
                key={i}
                onClick={() => setOpenAt(i)}
                className={`relative overflow-hidden rounded-xl group text-left ${s.span ?? ""}`}
                aria-label={`Open ${s.caption}`}
              >
                <img
                  src={s.src}
                  alt={s.alt}
                  className={`w-full h-full object-cover ${kb} will-change-transform transition-transform duration-700 group-hover:scale-[1.04]`}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute top-3 right-3 grid place-items-center w-8 h-8 rounded-full bg-white/15 backdrop-blur text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Expand className="w-3.5 h-3.5" />
                </div>
                <figcaption className="absolute bottom-3 left-4 right-4 text-xs text-white tracking-wide translate-y-2 opacity-80 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  {s.caption}
                </figcaption>
              </button>
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
              <span className="italic text-[var(--moss)]">voices from the valley.</span>
            </h3>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Watch our team document Trillium populations and converse with custodian communities
              in the Pakistani Himalayas. Shared directly from our project Instagram.
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

      {openAt !== null && (
        <Lightbox
          items={shots.map((s) => ({ src: s.src, caption: s.caption, alt: s.alt }))}
          index={openAt}
          onIndexChange={setOpenAt}
          onClose={() => setOpenAt(null)}
        />
      )}
    </section>
  );
}
