import { Mail, Award } from "lucide-react";

const team = [
  {
    name: "Dr. Rizwana Khanum",
    role: "Project Director (PD) — Co-Author",
    email: "rizvana.khan@gmail.com",
    lead: true,
  },
  {
    name: "Dr. Amir Hussain",
    role: "Assistant in Project Activities, PMNH",
  },
  {
    name: "Syed Munir Hussain",
    role: "Sr. Collection In-Charge, PMNH",
  },
  {
    name: "Mr. Sabih-ul-Hassan",
    role: "Project-Recruited Field Worker",
  },
];

export function Team() {
  return (
    <section id="team" className="relative py-28 lg:py-40 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-6">
            With gratitude
          </p>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-balance">
            A dedication to the hands &amp;{" "}
            <span className="italic text-[var(--moss)]">hearts</span> behind
            this work.
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            This project exists because of the unwavering vision, scholarship,
            and field labour of a small team committed to the survival of
            <em> Trillium govanianum</em> in the Pakistani Himalayas.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {team.map((m) => (
            <div
              key={m.name}
              className={`group relative p-7 rounded-2xl border transition-all ${
                m.lead
                  ? "bg-card border-primary/40 shadow-[var(--shadow-elevated)] lg:row-span-1"
                  : "bg-card border-border hover:border-primary/40"
              }`}
            >
              {m.lead && (
                <div className="inline-flex items-center gap-1.5 mb-5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-widest">
                  <Award className="w-3 h-3" />
                  Project Director
                </div>
              )}
              <div className="text-display text-xl text-foreground leading-tight">
                {m.name}
              </div>
              <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {m.role}
              </div>
              {m.email && (
                <a
                  href={`mailto:${m.email}`}
                  className="mt-5 inline-flex items-center gap-2 text-xs text-primary hover:underline break-all"
                >
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  {m.email}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
