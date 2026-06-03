import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

const HERO_KEYS = [
  { k: "hero_eyebrow", l: "Eyebrow line (small caps above headline)" },
  { k: "hero_headline_a", l: "Headline — first line" },
  { k: "hero_headline_b", l: "Headline — italic accent (second line)" },
  { k: "hero_tagline", l: "Tagline paragraph" },
  { k: "hero_cta_primary_label", l: "Primary CTA label" },
  { k: "hero_cta_primary_href", l: "Primary CTA link (e.g. #mission)" },
  { k: "hero_cta_secondary_label", l: "Secondary CTA label" },
  { k: "hero_cta_secondary_href", l: "Secondary CTA link" },
];

export function HeroAdmin() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("site_settings").select("key,value").in("key", HERO_KEYS.map((h) => h.k)).then(({ data }) => {
      const m: Record<string, string> = {};
      for (const r of (data ?? []) as { key: string; value: string }[]) m[r.key] = r.value;
      setValues(m);
    });
  }, []);

  const save = async (k: string) => {
    setSaving(k);
    const { error } = await supabase.from("site_settings").upsert({ key: k, value: values[k] ?? "", updated_at: new Date().toISOString() });
    setSaving(null);
    if (error) return toast.error(error.message);
    toast.success("Saved.");
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <p className="text-sm text-muted-foreground">Edit the homepage hero copy. Changes appear within seconds.</p>
      {HERO_KEYS.map((h) => {
        const multi = h.k === "hero_tagline";
        return (
          <div key={h.k} className="p-5 rounded-2xl bg-card border border-border">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{h.l}</p>
            {multi ? (
              <textarea
                rows={3}
                value={values[h.k] ?? ""}
                onChange={(e) => setValues({ ...values, [h.k]: e.target.value })}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-background border border-border outline-none text-sm resize-none"
              />
            ) : (
              <input
                value={values[h.k] ?? ""}
                onChange={(e) => setValues({ ...values, [h.k]: e.target.value })}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-background border border-border outline-none text-sm"
              />
            )}
            <button
              onClick={() => save(h.k)}
              disabled={saving === h.k}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs disabled:opacity-60"
            >
              {saving === h.k ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Save
            </button>
          </div>
        );
      })}
    </div>
  );
}
