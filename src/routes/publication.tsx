import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { ArrowLeft, BookOpen, ExternalLink, Users, MapPin, Calendar, Quote } from "lucide-react";

export const Route = createFileRoute("/publication")({
  head: () => ({
    meta: [
      {
        title:
          "Publication: Biocultural Dimensions of Endangered Medicinal Flora — ConserveTrillium",
      },
      {
        name: "description",
        content:
          "Peer-reviewed publication in Ethnobotany Research & Applications: community knowledge, gender roles, and governance around endangered medicinal plants of the Pakistani Himalayas.",
      },
      {
        property: "og:title",
        content: "Biocultural Dimensions of Endangered Medicinal Flora",
      },
      {
        property: "og:description",
        content:
          "Khanum, Noor et al. (2026) — peer-reviewed ethnobotanical study across 24 Himalayan villages, 120 respondents, four endangered species.",
      },
    ],
  }),
  component: PublicationPage,
});

const facts = [
  { icon: Users, label: "Respondents", value: "120" },
  { icon: MapPin, label: "Villages surveyed", value: "24" },
  { icon: Calendar, label: "Published", value: "2026" },
  { icon: BookOpen, label: "Journal", value: "Ethnobotany R&A" },
];

const authors = [
  "Khanum R.", "Noor A.", "Hussain A.", "Hussain R.", "Akrum S.",
  "Qayum S.", "Kazmi R.A.", "Ali S.F.", "Khan S.", "Hanif M.",
  "Munir S.", "Hassan S.U.",
];

const sections = [
  {
    n: "01",
    t: "Aim",
    p: "To document the traditional ecological knowledge (TEK) associated with four endangered medicinal plant species across the Pakistani Himalayas, and to analyse how this knowledge is structured by gender, age, and community governance.",
  },
  {
    n: "02",
    t: "Methods",
    p: "Mixed-method ethnobotanical surveys across 24 villages between 2,000 – 3,300 m, engaging 120 respondents — household collectors, forestry officers, and traders. Quantitative indices (Use Value, Informant Consensus Factor) were combined with semi-structured interviews and FGDs.",
  },
  {
    n: "03",
    t: "Key Findings",
    p: "Women hold the highest-resolution knowledge of household-scale preparations, while men dominate trade. Governance vacuums between forest departments and local jirgas correlate strongly with overharvesting of Trillium govanianum and Dactylorhiza hatagirea.",
  },
  {
    n: "04",
    t: "Implication",
    p: "Conservation policy must explicitly integrate women collectors and elder custodians into decision-making, and formalise hybrid governance bridging state forestry with local custom.",
  },
];

function PublicationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7 fade-up">
              <p className="text-xs uppercase tracking-[0.3em] text-accent mb-6">
                Peer-reviewed · open access
              </p>
              <h1 className="text-display text-4xl sm:text-5xl lg:text-6xl leading-[1.02] text-balance">
                Biocultural dimensions of{" "}
                <span className="italic text-[var(--moss)]">
                  endangered medicinal flora
                </span>{" "}
                in the Pakistani Himalayas.
              </h1>
              <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
                Community knowledge, gender roles, and governance —
                <em> Ethnobotany Research &amp; Applications</em>{" "}
                <strong>33:49</strong> (2026).
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://doi.org/10.32859/era.33.49.1-12"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity shadow-[var(--shadow-elevated)]"
                >
                  Visit publication
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="#abstract"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-foreground text-sm hover:bg-secondary transition-colors"
                >
                  Read summary ↓
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <Book3D />
            </div>
          </div>

          {/* Stat strip */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-3">
            {facts.map((f, i) => (
              <div
                key={f.label}
                style={{ animationDelay: `${i * 0.08}s` }}
                className="fade-up p-6 rounded-2xl bg-card border border-border text-center"
              >
                <f.icon className="w-5 h-5 text-primary mx-auto mb-3" />
                <div className="text-display text-3xl text-foreground">
                  {f.value}
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">
                  {f.label}
                </div>
              </div>
            ))}
          </div>

          {/* Abstract */}
          <section id="abstract" className="mt-24 grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
                Abstract & structure
              </p>
              <h2 className="text-display text-3xl lg:text-4xl leading-tight">
                Four sections.{" "}
                <span className="italic text-[var(--moss)]">
                  One mountain conversation.
                </span>
              </h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                Hover any card below to see it lift off the page — the same
                cinematic care we hope you take with the species themselves.
              </p>
            </div>
            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-4">
              {sections.map((s, i) => (
                <article
                  key={s.n}
                  style={{ animationDelay: `${i * 0.1}s`, transformStyle: "preserve-3d" }}
                  className="fade-up group relative p-7 rounded-2xl bg-card border border-border transition-all duration-500 hover:-translate-y-2 hover:rotate-[-1deg] hover:shadow-[var(--shadow-elevated)] hover:border-primary/40"
                >
                  <div className="text-[11px] uppercase tracking-[0.25em] text-accent">
                    {s.n}
                  </div>
                  <h3 className="mt-2 text-display text-2xl text-foreground">
                    {s.t}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {s.p}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* Quote */}
          <div className="mt-24 p-10 lg:p-16 rounded-3xl bg-gradient-to-br from-primary to-[var(--moss)] text-primary-foreground relative overflow-hidden">
            <Quote className="absolute top-6 left-6 w-14 h-14 opacity-15" />
            <p className="text-display italic text-2xl lg:text-4xl leading-snug max-w-4xl relative">
              "Conservation written without the women who carry the knowledge is
              conservation written in disappearing ink."
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.3em] opacity-80 relative">
              From the discussion · §4.3
            </p>
          </div>

          {/* Authors */}
          <section className="mt-24">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
              Authorship
            </p>
            <h2 className="text-display text-3xl lg:text-4xl leading-tight max-w-3xl">
              A field-led collaboration across PMNH, Quaid-i-Azam University, and
              partner institutions.
            </h2>
            <div className="mt-8 flex flex-wrap gap-2">
              {authors.map((a) => (
                <span
                  key={a}
                  className="px-3 py-1.5 text-xs rounded-full bg-secondary text-secondary-foreground border border-border"
                >
                  {a}
                </span>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Cite as: Khanum R, Noor A, Hussain A, et al. (2026).{" "}
              <em>
                Biocultural dimensions of endangered medicinal flora: Community
                knowledge, gender roles, and governance in the Pakistani
                Himalayas.
              </em>{" "}
              <span className="text-foreground">
                Ethnobotany Research &amp; Applications
              </span>{" "}
              33:49.{" "}
              <a
                href="https://doi.org/10.32859/era.33.49.1-12"
                target="_blank"
                rel="noreferrer noopener"
                className="underline decoration-accent underline-offset-2"
              >
                doi.org/10.32859/era.33.49.1-12
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Book3D() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: -8, ry: 28 });
  const [open, setOpen] = useState(false);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: -y * 18 - 6, ry: x * 35 + 18 });
  };
  const onLeave = () => setTilt({ rx: -8, ry: 28 });

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={() => setOpen((o) => !o)}
      style={{ perspective: "1400px" }}
      className="w-[280px] sm:w-[340px] h-[400px] sm:h-[480px] cursor-pointer relative"
      role="button"
      aria-label="3D publication preview — click to open"
    >
      {/* book body */}
      <div
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: "transform 0.2s ease-out",
        }}
        className="absolute inset-0"
      >
        {/* Inside pages (visible when open) */}
        <div
          style={{
            transform: "translateZ(-2px) rotateY(0deg)",
            transformOrigin: "left center",
          }}
          className="absolute inset-0 rounded-r-md bg-[oklch(0.97_0.01_90)] border border-border shadow-inner p-6 text-[10px] leading-snug text-foreground/80 overflow-hidden"
        >
          <div className="text-[8px] uppercase tracking-widest text-accent mb-2">
            Ethnobotany R&A · 33:49
          </div>
          <div className="text-display text-sm leading-tight text-foreground">
            Biocultural dimensions of endangered medicinal flora
          </div>
          <div className="mt-2 italic text-[9px] text-muted-foreground">
            Khanum, Noor, Hussain et al. (2026)
          </div>
          <div className="mt-4 space-y-1.5 text-[8px]">
            <p>· 24 villages surveyed across 2,000–3,300 m</p>
            <p>· 120 respondents · mixed methods</p>
            <p>· Four endangered medicinal species</p>
            <p>· Gender-disaggregated TEK analysis</p>
            <p>· Hybrid governance recommendations</p>
          </div>
          <div className="mt-4 h-px bg-border" />
          <p className="mt-3 text-[8px] text-muted-foreground leading-relaxed">
            "Women hold the highest-resolution household knowledge; men dominate
            trade. Governance vacuums between forest departments and local
            jirgas correlate with overharvesting…"
          </p>
        </div>

        {/* Front cover */}
        <div
          style={{
            transform: open
              ? "translateZ(8px) rotateY(-155deg)"
              : "translateZ(8px) rotateY(0deg)",
            transformOrigin: "left center",
            transition: "transform 0.9s cubic-bezier(0.2, 0.7, 0.2, 1)",
            backfaceVisibility: "hidden",
          }}
          className="absolute inset-0 rounded-r-md bg-gradient-to-br from-[var(--moss)] via-primary to-[oklch(0.22_0.04_150)] text-primary-foreground p-7 flex flex-col justify-between shadow-2xl"
        >
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] opacity-80">
              Ethnobotany R&A · Vol 33
            </div>
            <div className="mt-1 text-[10px] opacity-60">2026 · Article 49</div>
          </div>
          <div>
            <div className="text-display text-2xl leading-tight italic">
              Biocultural <br /> Dimensions
            </div>
            <div className="mt-4 text-[11px] opacity-80 leading-relaxed">
              of endangered medicinal flora in the Pakistani Himalayas.
            </div>
            <div className="mt-6 text-[10px] uppercase tracking-widest opacity-70">
              Khanum · Noor · Hussain et al.
            </div>
          </div>
          {/* spine accent */}
          <div className="absolute inset-y-0 left-0 w-2 bg-black/30 rounded-l-md" />
        </div>

        {/* Back cover */}
        <div
          style={{
            transform: "translateZ(-8px)",
            backfaceVisibility: "hidden",
          }}
          className="absolute inset-0 rounded-r-md bg-[oklch(0.18_0.04_150)] shadow-2xl"
        />
      </div>

      <p className="absolute -bottom-9 inset-x-0 text-center text-[11px] uppercase tracking-widest text-muted-foreground">
        {open ? "click to close" : "click to open · move to tilt"}
      </p>
    </div>
  );
}
