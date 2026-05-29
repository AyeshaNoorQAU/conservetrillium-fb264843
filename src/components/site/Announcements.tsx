import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Item = { id: string; title: string; body: string; created_at: string };

export function Announcements() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    supabase
      .from("announcements")
      .select("id,title,body,created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(4)
      .then(({ data }) => setItems((data as Item[]) ?? []));
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="relative py-20 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex items-center gap-3 mb-8">
          <span className="grid place-items-center w-10 h-10 rounded-full bg-[var(--moss)] text-white">
            <Megaphone className="w-4 h-4" />
          </span>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Latest from the field</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {items.map((a, i) => (
            <article
              key={a.id}
              style={{ animationDelay: `${i * 0.1}s` }}
              className="fade-up p-7 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all hover:shadow-[var(--shadow-elevated)]"
            >
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                {new Date(a.created_at).toLocaleDateString(undefined, {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </p>
              <h3 className="mt-2 text-display text-2xl text-foreground leading-snug">{a.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{a.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
