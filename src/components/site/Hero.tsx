import hero from "@/assets/hero-trillium.jpg";
import { ArrowDown } from "lucide-react";

export function Hero() {
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
          Pakistan Museum of Natural History · ISCF / MBZ Funded
        </p>
        <h1 className="fade-up fade-up-delay-1 text-white text-display text-5xl sm:text-6xl lg:text-8xl leading-[0.95] max-w-5xl text-balance">
          Saving the Himalayan&nbsp;Trillium,
          <span className="italic text-[oklch(0.85_0.09_60)]"> one valley at a time.</span>
        </h1>
        <p className="fade-up fade-up-delay-2 mt-8 max-w-2xl text-white/85 text-base sm:text-lg leading-relaxed">
          A field-led conservation initiative protecting <em>Trillium govanianum</em> — a critically
          endangered medicinal herb of the Pakistani Himalayas — through science, community
          stewardship, and intergenerational knowledge.
        </p>

        <div className="fade-up fade-up-delay-3 mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#mission"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-primary text-sm font-medium hover:bg-white/90 transition-all shadow-[var(--shadow-elevated)]"
          >
            Discover the project
          </a>
          <a
            href="#help"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/40 text-white text-sm hover:bg-white/10 transition-all"
          >
            How you can help
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
