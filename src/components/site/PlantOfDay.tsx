import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { Sparkles, CheckCircle2, Flame } from "lucide-react";
import { getPlantOfDay, getMyStreak, markLearned } from "@/lib/streaks.functions";
import { useAuth } from "@/hooks/use-auth";

export function PlantOfDay() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const fetchPod = useServerFn(getPlantOfDay);
  const fetchStreak = useServerFn(getMyStreak);
  const mark = useServerFn(markLearned);

  const podQ = useQuery({
    queryKey: ["plant-of-day"],
    queryFn: () => fetchPod(),
    retry: false,
  });

  const streakQ = useQuery({
    queryKey: ["my-streak"],
    queryFn: () => fetchStreak(),
    enabled: !!user,
    retry: false,
  });

  const m = useMutation({
    mutationFn: () => mark(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-streak"] });
    },
  });

  const pod = podQ.data?.plantOfDay as
    | {
        plants: {
          id: string;
          scientific_name: string;
          local_name: string | null;
          image_url: string | null;
          slug: string;
          description: string | null;
        } | null;
        blurb: string | null;
        fact: string | null;
      }
    | null
    | undefined;

  if (!pod?.plants) return null;
  const p = pod.plants;
  const learned = streakQ.data?.learnedToday;

  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-10">
        <div className="flex flex-col md:flex-row gap-6 items-stretch">
          <div className="w-full md:w-64 h-48 md:h-auto rounded-xl overflow-hidden bg-muted">
            {p.image_url && (
              <img src={p.image_url} alt={p.scientific_name} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-primary text-xs uppercase tracking-[0.25em] mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Plant of the Day
              </div>
              <h3 className="text-display text-2xl sm:text-3xl text-foreground">
                <span className="italic">{p.scientific_name}</span>
                {p.local_name ? <span className="text-muted-foreground"> · {p.local_name}</span> : null}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground max-w-2xl line-clamp-3">
                {pod.blurb || pod.fact || p.description || "A featured medicinal plant from the Himalayas."}
              </p>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {user ? (
                learned ? (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm">
                    <CheckCircle2 className="w-4 h-4" /> Learned today
                  </span>
                ) : (
                  <button
                    onClick={() => m.mutate()}
                    disabled={m.isPending}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {m.isPending ? "Saving…" : "Mark as learned"}
                  </button>
                )
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
                >
                  <Flame className="w-4 h-4" /> Sign in to start a streak
                </Link>
              )}
              <Link
                to="/plants"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Browse all plants →
              </Link>
              {streakQ.data ? (
                <Link
                  to="/streak"
                  className="ml-auto inline-flex items-center gap-1.5 text-sm text-foreground"
                >
                  <Flame className="w-4 h-4 text-[oklch(0.72_0.16_50)]" />
                  {streakQ.data.current}-day streak
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
