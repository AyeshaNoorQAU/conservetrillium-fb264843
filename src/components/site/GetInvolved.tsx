import { Heart, Users, Handshake, Share2, ArrowUpRight } from "lucide-react";

const ways = [
  {
    icon: Heart,
    title: "Donate",
    text: "Fund a single field season — seeds, soil samples, community workshops. Every contribution stays in the valleys.",
    cta: "Support the work",
    href: "#contact",
    tone: "from-rose-500/15 to-rose-500/0",
  },
  {
    icon: Users,
    title: "Volunteer field work",
    text: "Join a survey or planting expedition. Open to botany, ecology, and ethnobiology students from any university.",
    cta: "Apply to volunteer",
    href: "#contact",
    tone: "from-emerald-500/15 to-emerald-500/0",
  },
  {
    icon: Handshake,
    title: "Partner with us",
    text: "Institutions, NGOs, and herbal-medicine companies — co-fund a valley, sponsor a thesis, or commission baseline data.",
    cta: "Start a conversation",
    href: "#contact",
    tone: "from-amber-500/15 to-amber-500/0",
  },
  {
    icon: Share2,
    title: "Share & advocate",
    text: "Cite the publication, tag a sighting, repost a field story. Awareness is the most renewable resource we have.",
    cta: "Read the publication",
    href: "/publication",
    tone: "from-sky-500/15 to-sky-500/0",
  },
];

export function GetInvolved() {
  return (
    <section id="help" className="relative py-28 lg:py-40 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl mb-14 fade-up">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-6">How you can help</p>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-balance">
            Four ways to{" "}
            <span className="italic text-[var(--moss)]">keep the Trillium blooming.</span>
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Conservation isn't a single act. It's a chain of small commitments — from a student
            joining a survey, to a partner funding a valley, to a citizen sharing the story.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ways.map((w, i) => (
            <a
              key={w.title}
              href={w.href}
              style={{ animationDelay: `${i * 0.08}s` }}
              className={`fade-up group relative overflow-hidden rounded-2xl border border-border bg-card p-7 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-elevated)] transition-all`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${w.tone} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
              />
              <div className="relative">
                <div className="grid place-items-center w-11 h-11 rounded-xl bg-primary/10 text-primary mb-5">
                  <w.icon className="w-5 h-5" />
                </div>
                <div className="text-display text-xl text-foreground leading-tight">{w.title}</div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{w.text}</p>
                <div className="mt-6 inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-primary">
                  {w.cta}
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
