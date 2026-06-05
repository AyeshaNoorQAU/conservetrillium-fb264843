import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Flame, Trophy, Calendar } from "lucide-react";
import { getMyStreak } from "@/lib/streaks.functions";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/streak")({
  head: () => ({
    meta: [
      { title: "Your Streak — ConserveTrillium" },
      { name: "description", content: "Track your daily plant-learning streak." },
    ],
  }),
  component: StreakPage,
  errorComponent: () => <div className="p-10 text-center">Couldn’t load streak.</div>,
  notFoundComponent: () => <div className="p-10 text-center">Not found.</div>,
});

function last30Days(): string[] {
  const out: string[] = [];
  const d = new Date();
  for (let i = 29; i >= 0; i--) {
    const x = new Date(d);
    x.setUTCDate(d.getUTCDate() - i);
    out.push(x.toISOString().slice(0, 10));
  }
  return out;
}

function StreakPage() {
  const { user, loading } = useAuth();
  const fetchStreak = useServerFn(getMyStreak);
  const q = useQuery({
    queryKey: ["my-streak"],
    queryFn: () => fetchStreak(),
    enabled: !!user,
    retry: false,
  });

  const days = last30Days();
  const set = new Set(q.data?.recentDates ?? []);

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="mx-auto max-w-3xl px-6 lg:px-10 pt-32 pb-24">
        <h1 className="text-display text-4xl sm:text-5xl text-foreground">Your streak</h1>
        <p className="mt-3 text-muted-foreground">
          Mark the Plant of the Day each day to keep your streak alive.
        </p>

        {loading ? null : !user ? (
          <div className="mt-10 p-6 rounded-xl border border-border bg-muted/30">
            <p className="text-sm text-foreground">Sign in to start tracking your streak.</p>
            <Link
              to="/login"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm"
            >
              Sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Stat icon={<Flame className="w-5 h-5" />} label="Current" value={q.data?.current ?? 0} />
              <Stat icon={<Trophy className="w-5 h-5" />} label="Longest" value={q.data?.longest ?? 0} />
              <Stat
                icon={<Calendar className="w-5 h-5" />}
                label="Last 30 days"
                value={`${set.size}/30`}
              />
            </div>

            <div className="mt-10">
              <h2 className="text-sm uppercase tracking-[0.25em] text-muted-foreground mb-4">
                Last 30 days
              </h2>
              <div className="grid grid-cols-10 gap-1.5">
                {days.map((d) => (
                  <div
                    key={d}
                    title={d}
                    className={`aspect-square rounded ${
                      set.has(d)
                        ? "bg-primary"
                        : "bg-muted border border-border"
                    }`}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="p-5 rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-[0.25em]">
        {icon} {label}
      </div>
      <div className="mt-2 text-display text-3xl text-foreground">{value}</div>
    </div>
  );
}
