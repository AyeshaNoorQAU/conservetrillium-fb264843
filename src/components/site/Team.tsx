import { Mail, Award, ExternalLink, GraduationCap, Sparkles } from "lucide-react";
import rizwana from "@/assets/people/rg-rizwana.jpg";
import mushtaq from "@/assets/people/rg-mushtaq.jpg";
import ayesha from "@/assets/people/rg-ayesha.jpg";
import { useCmsList, type TeamRow } from "@/lib/cms";

const fallbackPhoto: Record<string, string> = {
  "Ayesha Noor": ayesha,
  "Dr. Rizwana Khanum": rizwana,
  "Dr. Mushtaq Ahmad": mushtaq,
};

const seeded: TeamRow[] = [
  {
    id: "1",
    name: "Ayesha Noor",
    role: "Founder of ConserveTrillium · M.Phil. Researcher, Department of Plant Sciences, Quaid-i-Azam University",
    bio: "I built ConserveTrillium to give Pakistan's endangered Himalayan medicinal flora a voice on the open web — a place where field photographs, traditional knowledge, peer-reviewed science, and student learning can meet. This is more than a website; it is a small act of stewardship for plants that have healed our communities for centuries.",
    photo_url: ayesha,
    badge: "founder",
    email: "ayesha.22413028@bps.qau.edu.pk",
    researchgate: "https://www.researchgate.net/profile/Ayesha-Noor-14",
    initials: "AN",
    sort_order: 1,
  },
  {
    id: "2",
    name: "Dr. Rizwana Khanum",
    role: "Project Director (PD) — Co-Author",
    bio: null,
    photo_url: rizwana,
    badge: "project_head",
    email: "rizvana.khan@gmail.com",
    researchgate: "https://www.researchgate.net/profile/Rizwana-Khanum-3",
    initials: "RK",
    sort_order: 10,
  },
  { id: "3", name: "Dr. Amir Hussain", role: "Assistant in Project Activities, PMNH", bio: null, photo_url: null, badge: "member", email: null, researchgate: null, initials: "AH", sort_order: 20 },
  { id: "4", name: "Syed Munir Hussain", role: "Sr. Collection In-Charge, PMNH", bio: null, photo_url: null, badge: "member", email: null, researchgate: null, initials: "SM", sort_order: 30 },
  { id: "5", name: "Mr. Sabih-ul-Hassan", role: "Project-Recruited Field Worker", bio: null, photo_url: null, badge: "member", email: null, researchgate: null, initials: "SH", sort_order: 40 },
  {
    id: "6",
    name: "Dr. Mushtaq Ahmad",
    role: "Academic Supervisor — Department of Plant Sciences, Quaid-i-Azam University",
    bio: "With profound gratitude, I dedicate this work to my esteemed supervisor, whose scholarly wisdom and gentle mentorship have been a guiding light throughout my research journey. His patience, vision, and unwavering belief in ethnobotanical science have shaped every step of this endeavour. It is a privilege to learn under his care.",
    photo_url: mushtaq,
    badge: "supervisor",
    email: null,
    researchgate: "https://www.researchgate.net/profile/Mushtaq-Ahmad-48",
    initials: "MA",
    sort_order: 100,
  },
];

export function Team() {
  const rows = useCmsList<TeamRow>("team_members") ?? seeded;
  const list = rows.length ? rows : seeded;

  const founder = list.find((m) => m.badge === "founder");
  const supervisor = list.find((m) => m.badge === "supervisor");
  const members = list.filter((m) => m.badge !== "founder" && m.badge !== "supervisor");

  const photo = (m: TeamRow) => m.photo_url || fallbackPhoto[m.name] || null;

  return (
    <section id="team" className="relative py-28 lg:py-40 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {founder && (
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 p-8 lg:p-12 mb-20 fade-up shadow-[var(--shadow-elevated)]">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-[var(--moss)]/10 blur-3xl" />
            <div className="relative grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-3 flex lg:justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/40 to-[var(--moss)]/40 blur-2xl" />
                  {photo(founder) ? (
                    <img
                      src={photo(founder)!}
                      alt={`${founder.name} — Founder`}
                      className="relative w-36 h-36 rounded-full object-cover ring-4 ring-background shadow-[var(--shadow-elevated)]"
                    />
                  ) : (
                    <div className="relative w-36 h-36 rounded-full grid place-items-center bg-gradient-to-br from-primary/30 to-[var(--moss)]/30 text-display text-3xl ring-4 ring-background">
                      {founder.initials}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 grid place-items-center w-10 h-10 rounded-full bg-primary text-primary-foreground ring-4 ring-background">
                    <Sparkles className="w-4 h-4" strokeWidth={2} />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-9">
                <div className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" /> Founder
                </div>
                <h3 className="text-display text-3xl sm:text-4xl text-foreground leading-tight">
                  {founder.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 italic">{founder.role}</p>
                {founder.bio && (
                  <p className="mt-5 text-foreground/90 leading-relaxed text-[15px]">{founder.bio}</p>
                )}
                <div className="mt-5 flex flex-wrap gap-3">
                  {founder.email && (
                    <a
                      href={`mailto:${founder.email}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background text-xs hover:border-primary/40 hover:text-primary transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{founder.email}</span>
                    </a>
                  )}
                  {founder.researchgate && (
                    <a
                      href={founder.researchgate}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background text-xs hover:border-primary/40 hover:text-primary transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>ResearchGate</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-3xl mb-16 fade-up">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-6">With gratitude</p>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-balance">
            A dedication to the hands &amp;{" "}
            <span className="italic text-[var(--moss)]">hearts</span> behind this work.
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            This project exists because of the unwavering vision, scholarship, and field labour of a
            small team committed to the survival of <em>Trillium govanianum</em> in the Pakistani
            Himalayas.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {members.map((m, i) => {
            const lead = m.badge === "project_head";
            const p = photo(m);
            return (
              <div
                key={m.id}
                style={{ animationDelay: `${i * 0.12}s` }}
                className={`fade-up group relative p-7 rounded-2xl border transition-all duration-500 hover:-translate-y-1 ${
                  lead
                    ? "bg-card border-primary/40 shadow-[var(--shadow-elevated)]"
                    : "bg-card border-border hover:border-primary/40 hover:shadow-[var(--shadow-elevated)]"
                }`}
              >
                {lead && (
                  <div className="inline-flex items-center gap-1.5 mb-5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-widest">
                    <Award className="w-3 h-3" /> Project Director
                  </div>
                )}
                <div className="mb-5 relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-[var(--moss)]/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {p ? (
                    <img
                      src={p}
                      alt={m.name}
                      className="relative w-20 h-20 rounded-full object-cover ring-2 ring-border group-hover:ring-primary/50 transition-all duration-500"
                    />
                  ) : (
                    <div className="relative w-20 h-20 rounded-full grid place-items-center bg-gradient-to-br from-secondary to-secondary/40 text-foreground text-display text-xl ring-2 ring-border group-hover:ring-primary/50 transition-all duration-500">
                      {m.initials}
                    </div>
                  )}
                </div>
                <div className="text-display text-xl text-foreground leading-tight">{m.name}</div>
                <div className="mt-2 text-sm text-muted-foreground leading-relaxed">{m.role}</div>
                <div className="mt-5 space-y-2">
                  {m.email && (
                    <a
                      href={`mailto:${m.email}`}
                      className="flex items-center gap-2 text-xs text-primary hover:underline break-all"
                    >
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span>{m.email}</span>
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
                      <span>ResearchGate profile</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {supervisor && (
          <div className="mt-16 relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-secondary/40 p-8 lg:p-12 fade-up">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-[var(--moss)]/5 blur-3xl" />
            <div className="relative grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-2 flex lg:justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-[var(--moss)]/30 blur-xl" />
                  {photo(supervisor) ? (
                    <img
                      src={photo(supervisor)!}
                      alt={supervisor.name}
                      className="relative w-28 h-28 rounded-full object-cover ring-4 ring-background shadow-[var(--shadow-elevated)]"
                    />
                  ) : (
                    <div className="relative w-28 h-28 rounded-full grid place-items-center bg-gradient-to-br from-secondary to-secondary/40 text-display text-2xl ring-4 ring-background">
                      {supervisor.initials}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 grid place-items-center w-9 h-9 rounded-full bg-[var(--moss)] text-white ring-4 ring-background">
                    <GraduationCap className="w-4 h-4" strokeWidth={2} />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-7">
                <p className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">
                  With deepest respect
                </p>
                <h3 className="text-display text-2xl sm:text-3xl text-foreground leading-snug">
                  {supervisor.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 italic">{supervisor.role}</p>
                {supervisor.bio && (
                  <p className="mt-5 text-muted-foreground leading-relaxed text-[15px]">
                    {supervisor.bio}
                  </p>
                )}
              </div>
              <div className="lg:col-span-3 lg:text-right">
                {supervisor.researchgate && (
                  <a
                    href={supervisor.researchgate}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-background text-sm text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" /> Visit ResearchGate
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
