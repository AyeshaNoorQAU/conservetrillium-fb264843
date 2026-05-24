import leaves from "@/assets/trillium-leaves.jpg";

export function Mission() {
  return (
    <section id="mission" className="relative py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        <div className="lg:col-span-7 order-2 lg:order-1">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-6">
            Our Mission
          </p>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.05] text-balance">
            Where ancient knowledge meets{" "}
            <span className="italic text-[var(--moss)]">modern conservation.</span>
          </h2>
          <div className="mt-8 space-y-5 text-muted-foreground text-base lg:text-lg leading-relaxed max-w-2xl">
            <p>
              The mountain communities of the Pakistani Himalayas have, for
              generations, lived alongside one of the world's most precious
              medicinal flowers — <em>Trillium govanianum</em>, locally known
              as <em>nag chatri</em>. Today, overharvesting, habitat loss, and
              climate pressures threaten its survival.
            </p>
            <p>
              Our project — implemented by the{" "}
              <strong className="text-foreground">
                Pakistan Museum of Natural History (PMNH)
              </strong>{" "}
              and supported by the{" "}
              <strong className="text-foreground">
                Mohamed bin Zayed Species Conservation Fund
              </strong>
              {" "}— combines rigorous field science, gender-inclusive
              community engagement, and policy advocacy to safeguard this
              biocultural heritage for the generations still to come.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
            {[
              ["1.43M", "hectares surveyed"],
              ["28", "sites assessed"],
              ["11", "new conservation sites"],
              ["2,000+", "students engaged"],
            ].map(([num, label]) => (
              <div key={label} className="border-t border-border pt-4">
                <div className="text-display text-3xl text-primary">{num}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 order-1 lg:order-2 relative">
          <div className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-[var(--shadow-elevated)]">
            <img
              src={leaves}
              alt="Close-up of Trillium govanianum leaves on the Himalayan forest floor"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl" />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden sm:block bg-card border border-border px-5 py-4 rounded-xl shadow-[var(--shadow-soft)]">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              IUCN Status
            </div>
            <div className="text-display text-xl text-ember">Endangered</div>
          </div>
        </div>
      </div>
    </section>
  );
}
