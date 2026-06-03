import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { MediaUpload } from "@/components/admin/MediaUpload";
import type { PlantRow } from "@/lib/cms";

const empty = (): Partial<PlantRow> => ({
  slug: "",
  scientific_name: "",
  local_name: "",
  family: "",
  altitude: "",
  iucn: "",
  uses: "",
  threats: "",
  description: "",
  image_url: null,
  sort_order: 100,
});

export function PlantsAdmin() {
  const [items, setItems] = useState<PlantRow[]>([]);
  const [draft, setDraft] = useState<Partial<PlantRow>>(empty());
  const [editing, setEditing] = useState<PlantRow | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("plants").select("*").order("sort_order");
    setItems((data as PlantRow[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const row = editing ? { ...editing, ...draft } : draft;
    if (!row.slug || !row.scientific_name) {
      toast.error("Slug and scientific name are required.");
      setSaving(false);
      return;
    }
    const { error } = editing
      ? await supabase.from("plants").update(row).eq("id", editing.id)
      : await supabase.from("plants").insert(row as PlantRow);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Updated." : "Plant added.");
    setEditing(null);
    setDraft(empty());
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this plant entry?")) return;
    await supabase.from("plants").delete().eq("id", id);
    load();
  };

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <form onSubmit={save} className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border h-fit space-y-3">
        <h2 className="text-display text-xl mb-2">{editing ? "Edit plant" : "New plant"}</h2>
        <Field label="Slug (URL id)" v={draft.slug ?? ""} on={(v) => setDraft({ ...draft, slug: v })} />
        <Field label="Scientific name" v={draft.scientific_name ?? ""} on={(v) => setDraft({ ...draft, scientific_name: v })} />
        <Field label="Local / common name" v={draft.local_name ?? ""} on={(v) => setDraft({ ...draft, local_name: v })} />
        <Field label="Family" v={draft.family ?? ""} on={(v) => setDraft({ ...draft, family: v })} />
        <Field label="Altitude" v={draft.altitude ?? ""} on={(v) => setDraft({ ...draft, altitude: v })} />
        <Field label="IUCN status" v={draft.iucn ?? ""} on={(v) => setDraft({ ...draft, iucn: v })} />
        <Field label="Traditional uses" v={draft.uses ?? ""} on={(v) => setDraft({ ...draft, uses: v })} multiline />
        <Field label="Key threats" v={draft.threats ?? ""} on={(v) => setDraft({ ...draft, threats: v })} multiline />
        <Field label="Description" v={draft.description ?? ""} on={(v) => setDraft({ ...draft, description: v })} multiline rows={4} />
        <div>
          <Label>Image</Label>
          <MediaUpload value={draft.image_url} onChange={(u) => setDraft({ ...draft, image_url: u })} folder="plants" />
        </div>
        <Field label="Sort order" v={String(draft.sort_order ?? 100)} on={(v) => setDraft({ ...draft, sort_order: parseInt(v) || 100 })} />
        <div className="flex gap-2 pt-2">
          <button disabled={saving} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {editing ? "Save changes" : "Add plant"}
          </button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setDraft(empty()); }} className="px-4 py-2.5 rounded-full border border-border text-sm">Cancel</button>
          )}
        </div>
      </form>
      <div className="lg:col-span-3 space-y-3">
        {items.map((p) => (
          <div key={p.id} className="p-5 rounded-2xl bg-card border border-border flex items-start gap-4">
            {p.image_url && <img src={p.image_url} alt="" className="w-16 h-16 rounded-lg object-cover" />}
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{p.family ?? "—"} · sort {p.sort_order}</p>
              <h3 className="text-display text-lg italic">{p.scientific_name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{p.local_name}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => { setEditing(p); setDraft(p); }} className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/40">Edit</button>
              <button onClick={() => remove(p.id)} className="text-xs text-ember inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border hover:border-ember/40"><Trash2 className="w-3 h-3" />Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-[11px] uppercase tracking-widest text-muted-foreground mb-1.5">{children}</label>;
}
function Field({ label, v, on, multiline, rows = 2 }: { label: string; v: string; on: (v: string) => void; multiline?: boolean; rows?: number }) {
  return (
    <div>
      <Label>{label}</Label>
      {multiline ? (
        <textarea value={v} onChange={(e) => on(e.target.value)} rows={rows} className="w-full px-3 py-2 rounded-lg bg-background border border-border outline-none text-sm resize-none" />
      ) : (
        <input value={v} onChange={(e) => on(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border outline-none text-sm" />
      )}
    </div>
  );
}
