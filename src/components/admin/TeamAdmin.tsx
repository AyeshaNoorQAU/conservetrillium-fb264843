import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { MediaUpload } from "@/components/admin/MediaUpload";
import type { TeamRow } from "@/lib/cms";

const BADGES = [
  { v: "founder", l: "Founder" },
  { v: "project_head", l: "Project Director" },
  { v: "supervisor", l: "Supervisor (tribute)" },
  { v: "member", l: "Team member" },
];

const empty = (): Partial<TeamRow> => ({
  name: "",
  role: "",
  bio: "",
  photo_url: null,
  badge: "member",
  email: "",
  researchgate: "",
  initials: "",
  sort_order: 50,
});

export function TeamAdmin() {
  const [items, setItems] = useState<TeamRow[]>([]);
  const [draft, setDraft] = useState<Partial<TeamRow>>(empty());
  const [editing, setEditing] = useState<TeamRow | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("team_members").select("*").order("sort_order");
    setItems((data as TeamRow[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.name) return toast.error("Name is required.");
    setSaving(true);
    const row = editing ? { ...editing, ...draft } : draft;
    const { error } = editing
      ? await supabase.from("team_members").update(row).eq("id", editing.id)
      : await supabase.from("team_members").insert(row as TeamRow);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Updated." : "Added.");
    setEditing(null); setDraft(empty()); load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this member?")) return;
    await supabase.from("team_members").delete().eq("id", id);
    load();
  };

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <form onSubmit={save} className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border h-fit space-y-3">
        <h2 className="text-display text-xl mb-2">{editing ? "Edit member" : "New team member"}</h2>
        <F label="Name" v={draft.name ?? ""} on={(v) => setDraft({ ...draft, name: v })} />
        <F label="Role / title" v={draft.role ?? ""} on={(v) => setDraft({ ...draft, role: v })} multiline />
        <F label="Bio (optional)" v={draft.bio ?? ""} on={(v) => setDraft({ ...draft, bio: v })} multiline rows={4} />
        <div>
          <L>Badge</L>
          <select value={draft.badge ?? "member"} onChange={(e) => setDraft({ ...draft, badge: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm">
            {BADGES.map((b) => <option key={b.v} value={b.v}>{b.l}</option>)}
          </select>
        </div>
        <div>
          <L>Photo</L>
          <MediaUpload value={draft.photo_url} onChange={(u) => setDraft({ ...draft, photo_url: u })} folder="team" />
        </div>
        <F label="Email" v={draft.email ?? ""} on={(v) => setDraft({ ...draft, email: v })} />
        <F label="ResearchGate URL" v={draft.researchgate ?? ""} on={(v) => setDraft({ ...draft, researchgate: v })} />
        <F label="Initials" v={draft.initials ?? ""} on={(v) => setDraft({ ...draft, initials: v })} />
        <F label="Sort order (lower = first)" v={String(draft.sort_order ?? 50)} on={(v) => setDraft({ ...draft, sort_order: parseInt(v) || 50 })} />
        <div className="flex gap-2 pt-2">
          <button disabled={saving} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {editing ? "Save changes" : "Add member"}
          </button>
          {editing && <button type="button" onClick={() => { setEditing(null); setDraft(empty()); }} className="px-4 py-2.5 rounded-full border border-border text-sm">Cancel</button>}
        </div>
      </form>
      <div className="lg:col-span-3 space-y-3">
        {items.map((m) => (
          <div key={m.id} className="p-5 rounded-2xl bg-card border border-border flex items-start gap-4">
            {m.photo_url ? (
              <img src={m.photo_url} alt="" className="w-14 h-14 rounded-full object-cover" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-secondary grid place-items-center text-sm">{m.initials}</div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{m.badge} · sort {m.sort_order}</p>
              <h3 className="text-display text-lg">{m.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{m.role}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => { setEditing(m); setDraft(m); }} className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/40">Edit</button>
              <button onClick={() => remove(m.id)} className="text-xs text-ember inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border hover:border-ember/40"><Trash2 className="w-3 h-3" />Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function L({ children }: { children: React.ReactNode }) {
  return <label className="block text-[11px] uppercase tracking-widest text-muted-foreground mb-1.5">{children}</label>;
}
function F({ label, v, on, multiline, rows = 2 }: { label: string; v: string; on: (v: string) => void; multiline?: boolean; rows?: number }) {
  return (
    <div>
      <L>{label}</L>
      {multiline ? (
        <textarea value={v} onChange={(e) => on(e.target.value)} rows={rows} className="w-full px-3 py-2 rounded-lg bg-background border border-border outline-none text-sm resize-none" />
      ) : (
        <input value={v} onChange={(e) => on(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border outline-none text-sm" />
      )}
    </div>
  );
}
