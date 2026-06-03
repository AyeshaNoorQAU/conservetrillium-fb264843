import { useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// 100 years of seconds — effectively permanent for the bucket lifetime
const SIGN_EXPIRY = 60 * 60 * 24 * 365 * 100;

export function MediaUpload({
  value,
  onChange,
  folder = "uploads",
}: {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  folder?: string;
}) {
  const [busy, setBusy] = useState(false);

  const onFile = async (file: File) => {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be under 8 MB.");
      return;
    }
    setBusy(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;
    const up = await supabase.storage
      .from("site-media")
      .upload(path, file, { cacheControl: "31536000", upsert: false });
    if (up.error) {
      toast.error(up.error.message);
      setBusy(false);
      return;
    }
    const signed = await supabase.storage
      .from("site-media")
      .createSignedUrl(path, SIGN_EXPIRY);
    setBusy(false);
    if (signed.error || !signed.data?.signedUrl) {
      toast.error(signed.error?.message ?? "Could not sign URL.");
      return;
    }
    onChange(signed.data.signedUrl);
    toast.success("Image uploaded.");
  };

  return (
    <div className="flex items-center gap-3">
      {value ? (
        <div className="relative">
          <img
            src={value}
            alt=""
            className="w-20 h-20 rounded-lg object-cover ring-1 ring-border"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -top-2 -right-2 grid place-items-center w-6 h-6 rounded-full bg-ember text-white"
            aria-label="Remove image"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div className="w-20 h-20 rounded-lg bg-secondary grid place-items-center text-muted-foreground">
          <Upload className="w-5 h-5" />
        </div>
      )}
      <label className="text-xs inline-flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-background hover:border-primary/40 cursor-pointer">
        {busy ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Upload className="w-3.5 h-3.5" />
        )}
        {value ? "Replace" : "Upload image"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
            e.target.value = "";
          }}
        />
      </label>
    </div>
  );
}
