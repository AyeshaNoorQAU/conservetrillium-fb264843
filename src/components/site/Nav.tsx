import { useEffect, useState } from "react";
import { Leaf, Menu, X, Shield, Flame } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/use-auth";
import { getMyStreak } from "@/lib/streaks.functions";
import { NotificationBell } from "@/components/site/NotificationBell";
import { SafeBoundary } from "@/components/site/SafeBoundary";

const sectionLinks = [
  { href: "#mission", label: "Mission" },
  { href: "#plant", label: "The Plant" },
  { href: "#field", label: "Field Work" },
  { href: "#science", label: "Science" },
  { href: "#contact", label: "Contact" },
];

const pageLinks = [
  { to: "/plants", label: "Plants" },
  { to: "/feed", label: "Feed" },
  { to: "/identify", label: "Identify" },
  { to: "/publication", label: "Publication" },
  { to: "/student-lab", label: "Student Lab" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const onHome = loc.pathname === "/";
  const { user, isAdmin } = useAuth();
  const fetchStreak = useServerFn(getMyStreak);
  const streakQ = useQuery({
    queryKey: ["my-streak"],
    queryFn: () => fetchStreak(),
    enabled: !!user,
    retry: false,
  });
  const streak = streakQ.data?.current ?? 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const opaque = scrolled || !onHome;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${opaque ? "bg-background/85 backdrop-blur-md border-b border-border/60" : "bg-transparent"}`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span
            className={`grid place-items-center w-9 h-9 rounded-full transition-colors ${opaque ? "bg-primary text-primary-foreground" : "bg-white/15 text-white backdrop-blur"}`}
          >
            <Leaf className="w-4 h-4" strokeWidth={2.2} />
          </span>
          <span
            className={`text-display text-lg tracking-tight ${opaque ? "text-foreground" : "text-white"}`}
          >
            Conserve<span className="italic"> Trillium</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {onHome &&
            sectionLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`text-sm tracking-wide transition-colors ${opaque ? "text-muted-foreground hover:text-primary" : "text-white/80 hover:text-white"}`}
              >
                {l.label}
              </a>
            ))}
          {pageLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-primary font-medium" }}
              className={`text-sm tracking-wide transition-colors ${opaque ? "text-muted-foreground hover:text-primary" : "text-white/80 hover:text-white"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          {user && streak > 0 && (
            <Link
              to="/streak"
              title={`${streak}-day streak`}
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                opaque
                  ? "bg-[oklch(0.97_0.04_60)] text-[oklch(0.45_0.16_50)] hover:bg-[oklch(0.94_0.06_60)]"
                  : "bg-white/15 text-white backdrop-blur hover:bg-white/25"
              }`}
            >
              <Flame className="w-3.5 h-3.5" /> {streak}
            </Link>
          )}
          {user && <NotificationBell opaque={opaque} />}
          <Link
            to={user ? "/admin" : "/login"}
            className={`hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full transition-all ${
              opaque
                ? isAdmin
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border border-border text-foreground hover:border-primary/40"
                : "bg-white/15 text-white backdrop-blur hover:bg-white/25"
            }`}
            title={user ? "Open admin" : "Sign in to edit the site"}
          >
            <Shield className="w-3.5 h-3.5" /> {isAdmin ? "Admin" : user ? "Account" : "Sign in"}
          </Link>
        </div>

        <button
          className={`lg:hidden p-2 rounded-md ${opaque ? "text-foreground" : "text-white"}`}
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-background border-t border-border">
          <div className="px-6 py-4 flex flex-col gap-3">
            {onHome &&
              sectionLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-foreground/80"
                >
                  {l.label}
                </a>
              ))}
            {pageLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-sm text-foreground/80"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to={user ? "/admin" : "/login"}
              onClick={() => setOpen(false)}
              className="text-sm text-primary"
            >
              {isAdmin ? "Admin dashboard" : user ? "Account" : "Sign in"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
