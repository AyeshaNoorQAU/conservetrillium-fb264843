import { Mail, Instagram, MapPin, Building2, ExternalLink } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="relative py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-12 gap-12 lg:gap-20">
        <div className="lg:col-span-5">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-6">
            Get in touch
          </p>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-balance">
            Collaborate, contribute,{" "}
            <span className="italic text-[var(--moss)]">or simply ask.</span>
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Whether you are a researcher, conservationist, journalist, student,
            or a community member from the Himalayan valleys — we would love to
            hear from you.
          </p>
        </div>

        <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
          <a
            href="mailto:ayesha.22413028@bps.qau.edu.pk"
            className="group p-7 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all hover:shadow-[var(--shadow-elevated)]"
          >
            <div className="grid place-items-center w-11 h-11 rounded-full bg-primary text-primary-foreground mb-5">
              <Mail className="w-5 h-5" />
            </div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Email
            </div>
            <div className="mt-1 text-foreground text-base break-all group-hover:text-primary transition-colors">
              ayesha.22413028@bps.qau.edu.pk
            </div>
          </a>

          <a
            href="https://www.instagram.com/pakistan_mbz/"
            target="_blank"
            rel="noreferrer noopener"
            className="group p-7 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all hover:shadow-[var(--shadow-elevated)]"
          >
            <div className="grid place-items-center w-11 h-11 rounded-full bg-primary text-primary-foreground mb-5">
              <Instagram className="w-5 h-5" />
            </div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Field documentary
            </div>
            <div className="mt-1 text-foreground text-base group-hover:text-primary transition-colors">
              @pakistan_mbz
            </div>
          </a>

          <a
            href="https://www.researchgate.net/profile/Ayesha-Noor-14"
            target="_blank"
            rel="noreferrer noopener"
            className="group p-7 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all hover:shadow-[var(--shadow-elevated)] sm:col-span-2"
          >
            <div className="grid place-items-center w-11 h-11 rounded-full bg-[var(--moss)] text-white mb-5">
              <ExternalLink className="w-5 h-5" />
            </div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
              ResearchGate — Lead Author
            </div>
            <div className="mt-1 text-foreground text-base group-hover:text-primary transition-colors">
              Ayesha Noor · view publications &amp; profile →
            </div>
          </a>

          <div className="p-7 rounded-2xl bg-card border border-border">
            <div className="grid place-items-center w-11 h-11 rounded-full bg-secondary text-secondary-foreground mb-5">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Implemented by
            </div>
            <div className="mt-1 text-foreground text-base leading-snug">
              Pakistan Museum of Natural History (PMNH)
            </div>
          </div>

          <div className="p-7 rounded-2xl bg-card border border-border">
            <div className="grid place-items-center w-11 h-11 rounded-full bg-secondary text-secondary-foreground mb-5">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Department
            </div>
            <div className="mt-1 text-foreground text-base leading-snug">
              Department of Plant Sciences,<br />
              Quaid-i-Azam University, Islamabad
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
