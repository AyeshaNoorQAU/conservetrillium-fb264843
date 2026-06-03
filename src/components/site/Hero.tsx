import { useSiteSettings } from "@/lib/cms";
import hero from "@/assets/hero-trillium.jpg";
import { ArrowDown } from "lucide-react";

const DEF = {
  hero_eyebrow: "Pakistan Museum of Natural History · ISCF / MBZ Funded",
  hero_headline_a: "Saving the Himalayan Trillium,",
  hero_headline_b: "one valley at a time.",
  hero_tagline:
    "A field-led conservation initiative protecting Trillium govanianum — a critically endangered medicinal herb of the Pakistani Himalayas — through science, community stewardship, and intergenerational knowledge.",
  hero_cta_primary_label: "Discover the project",
  hero_cta_primary_href: "#mission",
  hero_cta_secondary_label: "How you can help",
  hero_cta_secondary_href: "#help",
};

export function Hero() {
  const s = useSiteSettings();
  const g = (k: keyof typeof DEF) => (s?.[k] ?? DEF[k]) as string;

  return (
    <section id="top" className="relative min-h-screen w-full overflow-hidden grain">
      <img
        src={hero}
        alt="Trillium govanianum blooming in a misty Himalayan alpine meadow at sunrise"
        className="absolute inset-0 w-full h-full object-cover slow-zoom"
      />
      <div className="absolute inset-0 hero-overlay" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 min-h-screen flex flex-col justify-end pb-24 pt-32">
        <p className="fade-up text-white/80 text-xs sm:text-sm uppercase tracking-[0.35em] mb-6">
          {g("hero_eyebrow")}
        </p>
        <h1 className="fade-up fade-up-delay-1 text-white text-display text-5xl sm:text-6xl lg:text-8xl leading-[0.95] max-w-5xl text-balance">
          {g("hero_headline_a")}
          <span className="italic text-[oklch(0.85_0.09_60)]"> {g("hero_headline_b")}</span>
        </h1>
        <p className="fade-up fade-up-delay-2 mt-8 max-w-2xl text-white/85 text-base sm:text-lg leading-relaxed">
          {g("hero_tagline")}
        </p>

        <div className="fade-up fade-up-delay-3 mt-10 flex flex-wrap items-center gap-4">
          <a
            href={g("hero_cta_primary_href")}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-primary text-sm font-medium hover:bg-white/90 transition-all shadow-[var(--shadow-elevated)]"
          >
            {g("hero_cta_primary_label")}
          </a>
          <a
            href={g("hero_cta_secondary_href")}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/40 text-white text-sm hover:bg-white/10 transition-all"
          >
            {g("hero_cta_secondary_label")}
          </a>
        </div>

        <a
          href="#mission"
          className="fade-up fade-up-delay-3 mt-16 flex items-center gap-3 text-white/60 hover:text-white text-xs tracking-widest uppercase transition-colors w-fit"
        >
          <span className="h-px w-10 bg-white/40" />
          Scroll <ArrowDown className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-32 mist-fade pointer-events-none" />
    </section>
  );
}
