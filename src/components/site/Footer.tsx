import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
            <Leaf className="w-3.5 h-3.5" strokeWidth={2.2} />
          </span>
          <span className="text-display text-base text-foreground">
            Conserve<span className="italic"> Trillium</span>
          </span>
        </div>

        <p className="text-xs text-muted-foreground text-center md:text-right max-w-md">
          A conservation initiative of the Pakistan Museum of Natural History,
          supported by the Mohamed bin Zayed Species Conservation Fund (MBZ /
          ISCF). Photography by Syed Munir Hussain &amp; Mr. Sabih-ul-Hassan.
        </p>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} ConserveTrillium
        </p>
      </div>
    </footer>
  );
}
