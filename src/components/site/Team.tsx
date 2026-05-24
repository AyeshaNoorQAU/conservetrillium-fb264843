import { Mail, Award, ExternalLink, GraduationCap } from "lucide-react";

const team = [
  {
    name: "Dr. Rizwana Khanum",
    role: "Project Director (PD) — Co-Author",
    email: "rizvana.khan@gmail.com",
    researchgate: "https://www.researchgate.net/profile/Rizwana-Khanum-3",
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
                  ? "bg-card border-primary/40 shadow-[var(--shadow-elevated)]"
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
              <div className="mt-5 space-y-2">
                {m.email && (
                  <a
                    href={`mailto:${m.email}`}
                    className="flex items-center gap-2 text-xs text-primary hover:underline break-all"
                  >
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    {m.email}
                  </a>
                )}
                {m.researchgate && (
                  <a
                    href={m.researchgate}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-2 text-xs text-[var(--moss)] hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    ResearchGate profile
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Supervisor — tribute */}
        <div className="mt-16 relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-secondary/40 p-8 lg:p-12">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="relative grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-2 flex lg:justify-center">
              <div className="grid place-items-center w-20 h-20 rounded-full bg-[var(--moss)]/10 text-[var(--moss)]">
                <GraduationCap className="w-9 h-9" strokeWidth={1.5} />
              </div>
            </div>
            <div className="lg:col-span-7">
              <p className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">
                With deepest respect
              </p>
              <h3 className="text-display text-2xl sm:text-3xl text-foreground leading-snug">
                Dr. Mushtaq Ahmad
              </h3>
              <p className="text-sm text-muted-foreground mt-1 italic">
                Academic Supervisor — Department of Plant Sciences,
                Quaid-i-Azam University
              </p>
              <p className="mt-5 text-muted-foreground leading-relaxed text-[15px]">
                Though not a part of the project team, this work would not
                exist without the quiet mentorship, scholarly rigour, and
                patient guidance of my supervisor. His belief in
                ethnobotanical research and his unwavering encouragement have
                shaped every chapter of this journey. I remain forever
                grateful for the opportunity to learn under his care.
              </p>
            </div>
            <div className="lg:col-span-3 lg:text-right">
              <a
                href="https://www.researchgate.net/profile/Mushtaq-Ahmad-48"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-background text-sm text-foreground hover:border-primary/40 hover:text-primary transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Visit ResearchGate
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
