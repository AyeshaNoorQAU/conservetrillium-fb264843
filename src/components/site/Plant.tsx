import rhizome from "@/assets/trillium-rhizome.jpg";
import { ZoomableImage } from "./ZoomableImage";
import { Tilt3D } from "./Tilt3D";
import { Link } from "@tanstack/react-router";

const facts = [
  { label: "Family", value: "Melanthiaceae" },
  { label: "Local Name", value: "Nag Chatri · Teen Patra" },
  { label: "Altitude", value: "2,400 – 3,300 m" },
  { label: "Habitat", value: "Moist temperate Himalayan forests" },
  { label: "Uses", value: "Reproductive health · anti-inflammatory · hormonal balance" },
  { label: "Threats", value: "Overharvesting · habitat loss · slow regeneration" },
];

export function Plant() {
  return (
    <section id="plant" className="relative py-28 lg:py-40 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-6">Botanical Profile</p>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-balance">
            <em className="text-[var(--moss)]">Trillium govanianum</em> — a slow-growing jewel of
            the high Himalayas.
          </h2>
        </div>

        <div className="mt-16 grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5 group/tilt">
            <Tilt3D max={10}>
              <ZoomableImage
                src={rhizome}
                alt="Trillium govanianum plant with three whorled leaves, deep-maroon bloom and rhizome"
                className="aspect-[3/4] shadow-[var(--shadow-elevated)]"
              />
            </Tilt3D>
            <p className="mt-4 text-xs text-muted-foreground italic">
              Photograph: Syed Munir Hussain, PMNH field collection. Hover for 3D parallax; click{" "}
              <em>Zoom &amp; pan</em> to inspect rhizome detail.
            </p>
            <Link
              to="/plants"
              className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors"
            >
              <span className="border-b border-current pb-0.5">
                Explore other Himalayan medicinal plants
              </span>
              <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="lg:col-span-7">
            <p className="text-lg leading-relaxed text-foreground/90">
              First described in the 19th century, <em>Trillium govanianum</em> produces a single
              deep-maroon bloom held above three broad leaves. Its rhizome — rich in steroidal
              saponins — has been a cornerstone of Himalayan ethnomedicine for centuries.
            </p>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              But this slow-growing species takes years to mature, and its limited distribution
              makes every uprooted plant a permanent loss to the ecosystem. Listed on the{" "}
              <strong className="text-foreground">IUCN Red List as Endangered</strong>, its survival
              now depends entirely on coordinated conservation.
            </p>

            <dl className="mt-10 grid sm:grid-cols-2 gap-x-8 gap-y-6">
              {facts.map((f) => (
                <div key={f.label} className="border-t border-border pt-4">
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    {f.label}
                  </dt>
                  <dd className="mt-2 text-foreground text-[15px] leading-snug">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
