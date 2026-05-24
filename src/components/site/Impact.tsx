import himalayas from "@/assets/himalayas.jpg";

const milestones = [
  {
    n: "01",
    title: "Landscape-scale survey",
    body: "Approximately 1.43 million hectares surveyed across four of six targeted Himalayan regions, mapping current and historical Trillium populations.",
  },
  {
    n: "02",
    title: "In-situ conservation sites",
    body: "28 previously reported sites reassessed and 11 new or potential conservation sites identified for protection, in collaboration with the KP Forest Department.",
  },
  {
    n: "03",
    title: "Herbarium & gene-bank",
    body: "21 herbarium voucher specimens and 32 seed and rhizome samples preserved at PMNH for taxonomic reference and future propagation research.",
  },
  {
    n: "04",
    title: "Capacity building",
    body: "23 field forest officers trained in identification, sustainable harvest ethics, and long-term monitoring protocols.",
  },
  {
    n: "05",
    title: "Community awareness",
    body: "32 community sessions, 7 forest department workshops, and school programs reaching over 2,000 students across mountain valleys.",
  },
  {
    n: "06",
    title: "Scientific publication",
    body: "Two peer-reviewed manuscripts on the biocultural and geospatial dimensions of Trillium conservation submitted to international journals.",
  },
];

export function Impact() {
  return (
    <section id="impact" className="relative py-28 lg:py-40 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-96 -z-10">
        <img
          src={himalayas}
          alt=""
          aria-hidden
          className="w-full h-full object-cover opacity-25"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-6">
            What we've achieved
          </p>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-balance">
            Two years in the field.{" "}
            <span className="italic text-[var(--moss)]">Lifetimes of impact.</span>
          </h2>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            Phase I (April 2024 – April 2025) is complete. Phase II is now
            underway, extending our reach across the remaining Himalayan
            valleys through 2026.
          </p>
        </div>

        <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden shadow-[var(--shadow-soft)]">
          {milestones.map((m) => (
            <article
              key={m.n}
              className="bg-card p-8 lg:p-10 hover:bg-secondary/60 transition-colors duration-500 group"
            >
              <div className="text-display text-5xl text-accent/70 group-hover:text-accent transition-colors">
                {m.n}
              </div>
              <h3 className="mt-4 text-display text-2xl text-foreground">
                {m.title}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {m.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
