import { BookOpen, ExternalLink, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";


const papers = [
  {
    title:
      "Biocultural dimensions of endangered medicinal flora: Community knowledge, gender roles, and governance in the Pakistani Himalayas",
    authors:
      "Khanum R, Noor A, Hussain A, Hussain R, Akrum S, Qayum S, Kazmi RA, Ali SF, Khan S, Hanif M, Munir S, Hassan SU.",
    journal: "Ethnobotany Research & Applications · 33:49 (2026)",
    doi: "https://doi.org/10.32859/era.33.49.1-12",
  },
  {
    title:
      "Geospatial and Climate-based Conservation Assessment of Trillium govanianum",
    authors: "PMNH Conservation Research Group",
    journal: "Manuscript submitted · 2026",
  },
];

const keywords = [
  "Ethnobotany",
  "Traditional Ecological Knowledge",
  "Trillium govanianum",
  "Dactylorhiza hatagirea",
  "Aconitum heterophyllum",
  "Podophyllum hexandrum",
  "Gender roles",
  "Community governance",
  "Biocultural conservation",
];

export function Science() {
  return (
    <section id="science" className="relative py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-6">
            Scientific Contributions
          </p>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-balance">
            Evidence-led, peer-reviewed,{" "}
            <span className="italic text-[var(--moss)]">community-rooted.</span>
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Our findings have been documented through ethnobotanical surveys
            across 24 mountain villages, engaging 120 respondents — household
            collectors, forestry officers, and herbal traders — across
            altitudes of 2,000 – 3,300 m.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {keywords.map((k) => (
              <span
                key={k}
                className="px-3 py-1.5 text-xs rounded-full bg-secondary text-secondary-foreground border border-border"
              >
                {k}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 space-y-5">
          {papers.map((p) => (
            <article
              key={p.title}
              className="group p-7 lg:p-9 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-500 hover:shadow-[var(--shadow-elevated)]"
            >
              <div className="flex items-start gap-4">
                <div className="grid place-items-center w-11 h-11 rounded-full bg-primary/10 text-primary shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-display text-xl lg:text-2xl text-foreground leading-snug">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground italic">
                    {p.authors}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-wider text-primary">
                    {p.journal}
                  </p>
                  {p.doi && (
                    <a
                      href={p.doi}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm text-accent hover:text-foreground transition-colors"
                    >
                      View publication
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
