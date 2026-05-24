import { useEffect, useState } from "react";
import { Leaf } from "lucide-react";

const links = [
  { href: "#mission", label: "Mission" },
  { href: "#plant", label: "The Plant" },
  { href: "#impact", label: "Impact" },
  { href: "#field", label: "Field Work" },
  { href: "#science", label: "Science" },
  { href: "#help", label: "Get Involved" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border/60"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group">
          <span
            className={`grid place-items-center w-9 h-9 rounded-full transition-colors ${
              scrolled ? "bg-primary text-primary-foreground" : "bg-white/15 text-white backdrop-blur"
            }`}
          >
            <Leaf className="w-4 h-4" strokeWidth={2.2} />
          </span>
          <span
            className={`text-display text-lg tracking-tight ${
              scrolled ? "text-foreground" : "text-white"
            }`}
          >
            Conserve<span className="italic"> Trillium</span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm tracking-wide transition-colors ${
                scrolled
                  ? "text-muted-foreground hover:text-primary"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#help"
          className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full transition-all ${
            scrolled
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-white text-primary hover:bg-white/90"
          }`}
        >
          Join the cause
        </a>
      </div>
    </header>
  );
}
