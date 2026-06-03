import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { MediaUpload } from "@/components/admin/MediaUpload";
import type { GalleryRow } from "@/lib/cms";

export function GalleryAdmin() {
  const [items, setItems] = useState<GalleryRow[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [alt, setAlt] = useState("");
  const [sort, setSort] = useState(100);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("gallery_photos").select("*").order("sort_order");
    setItems((data as GalleryRow[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return toast.error("Upload an image first.");
    setSaving(true);
    const { error } = await supabase.from("gallery_photos").insert({ image_url: image, caption, alt, sort_order: sort });
    setSaving(false);
    if (error) return toast.error(error.message);
    setImage(null); setCaption(""); setAlt(""); setSort(100);
    toast.success("Added to gallery.");
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Remove this gallery photo?")) return;
    await supabase.from("gallery_photos").delete().eq("id", id);
    load();
  };

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <form onSubmit={add} className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border h-fit space-y-3">
        <h2 className="text-display text-xl mb-2">New gallery photo</h2>
        <div>
          <L>Image</L>
          <MediaUpload value={image} onChange={setImage} folder="gallery" />
        </div>
        <F label="Caption" v={caption} on={setCaption} />
        <F label="Alt text (accessibility)" v={alt} on={setAlt} multiline />
        <F label="Sort order" v={String(sort)} on={(v) => setSort(parseInt(v) || 100)} />
        <button disabled={saving} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add photo
        </button>
      </form>
      <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.length === 0 && <p className="text-sm text-muted-foreground col-span-full">No custom photos yet. The home-page gallery shows the curated defaults until you add some.</p>}
        {items.map((g) => (
          <div key={g.id} className="relative group rounded-xl overflow-hidden border border-border">
            <img src={g.image_url} alt={g.alt ?? ""} className="w-full aspect-square object-cover" />
            <div className="absolute inset-x-0 bottom-0 p-2 text-[11px] text-white bg-gradient-to-t from-black/80 to-transparent">{g.caption}</div>
            <button onClick={() => remove(g.id)} className="absolute top-2 right-2 grid place-items-center w-7 h-7 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function L({ children }: { children: React.ReactNode }) {
  return <label className="block text-[11px] uppercase tracking-widest text-muted-foreground mb-1.5">{children}</label>;
}
function F({ label, v, on, multiline }: { label: string; v: string; on: (v: string) => void; multiline?: boolean }) {
  return (
    <div>
      <L>{label}</L>
      {multiline ? (
        <textarea value={v} onChange={(e) => on(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg bg-background border border-border outline-none text-sm resize-none" />
      ) : (
        <input value={v} onChange={(e) => on(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border outline-none text-sm" />
      )}
    </div>
  );
}
