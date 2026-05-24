import { Sprout, Users, GraduationCap, Megaphone } from "lucide-react";

const actions = [
  { icon: Sprout, title: "Do not uproot", body: "Never harvest wild Trillium — its rhizome takes years to regenerate. Choose cultivated alternatives." },
  { icon: Users, title: "Protect habitats", body: "Support local forest-protection efforts and respect designated in-situ conservation zones." },
  { icon: Megaphone, title: "Report sightings", body: "Inform forest staff about illegal collection. Your voice strengthens enforcement." },
  { icon: GraduationCap, title: "Teach the next generation", body: "Share what you learn here with children and students — conservation is a relay race." },
];

export function Help() {
  return (
    <section id="help" className="relative py-28 lg:py-40 bg-primary text-primary-foreground overflow-hidden">
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-accent/20 blur-3xl" aria-hidden />
      <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] rounded-full bg-[var(--ember)]/15 blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-6">
            A shared responsibility
          </p>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-balance">
            Saving Himalayan Trillium begins{" "}
            <span className="italic">with you.</span>
          </h2>
          <p className="mt-6 text-primary-foreground/80 text-lg leading-relaxed">
            Communities, students, forest officers, and researchers — each play
            an irreplaceable role. Here is how you can help, today.
          </p>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="p-7 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 backdrop-blur-sm hover:bg-primary-foreground/10 transition-all duration-500"
            >
              <div className="grid place-items-center w-11 h-11 rounded-full bg-accent text-accent-foreground mb-5">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-display text-xl">{title}</h3>
              <p className="mt-3 text-sm text-primary-foreground/70 leading-relaxed">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
