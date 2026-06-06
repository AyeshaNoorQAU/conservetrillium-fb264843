import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Upload, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { identifyPlant } from "@/lib/identify.functions";

export const Route = createFileRoute("/identify")({
  head: () => ({
    meta: [
      { title: "AI Plant ID — ConserveTrillium" },
      {
        name: "description",
        content: "Upload a photo to identify a Himalayan plant with AI assistance.",
      },
    ],
  }),
  component: IdentifyPage,
  errorComponent: () => <div className="p-10 text-center">Couldn’t load identify.</div>,
  notFoundComponent: () => <div className="p-10 text-center">Not found.</div>,
});

function IdentifyPage() {
  const { user } = useAuth();
  const id = useServerFn(identifyPlant);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const m = useMutation({
    mutationFn: async () => {
      if (!file) return null;
      const arr = await file.arrayBuffer();
      const b64 = btoa(String.fromCharCode(...new Uint8Array(arr)));
      return id({ data: { imageBase64: b64, mimeType: file.type || "image/jpeg" } });
    },
  });

  const pick = (f: File | null) => {
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
    m.reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="mx-auto max-w-2xl px-6 lg:px-10 pt-32 pb-24">
        <div className="flex items-center gap-2 text-primary text-xs uppercase tracking-[0.25em] mb-3">
          <Sparkles className="w-3.5 h-3.5" /> AI assistant
        </div>
        <h1 className="text-display text-4xl text-foreground">Identify a plant</h1>
        <p className="mt-3 text-muted-foreground text-sm">
          Upload a clear photo of a leaf, flower, or whole plant. AI returns a best-guess Latin
          name, confidence, and a conservation note. Not a substitute for an expert botanist.
        </p>

        {!user ? (
          <div className="mt-8 p-5 rounded-xl border border-border bg-muted/30 text-sm">
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>{" "}
            to use plant identification.
          </div>
        ) : (
          <>
            <label className="mt-8 block">
              <div className="p-8 rounded-xl border-2 border-dashed border-border bg-card hover:border-primary/40 cursor-pointer text-center">
                {preview ? (
                  <img src={preview} alt="" className="mx-auto max-h-64 rounded-lg" />
                ) : (
                  <div className="text-muted-foreground">
                    <Upload className="w-8 h-8 mx-auto mb-3" />
                    <div className="text-sm">Click to pick a photo</div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => pick(e.target.files?.[0] ?? null)}
                />
              </div>
            </label>

            <button
              onClick={() => m.mutate()}
              disabled={!file || m.isPending}
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground disabled:opacity-50"
            >
              {m.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {m.isPending ? "Identifying…" : "Identify"}
            </button>

            {m.isError && (
              <p className="mt-4 text-sm text-[oklch(0.55_0.2_25)]">
                {(m.error as Error).message}
              </p>
            )}

            {m.data && (
              <div className="mt-6 p-5 rounded-xl border border-border bg-card">
                <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Best guess
                </div>
                <h2 className="text-display text-2xl italic mt-1">
                  {m.data.species || "Unknown"}
                </h2>
                {m.data.common_name && (
                  <div className="text-sm text-muted-foreground">{m.data.common_name}</div>
                )}
                {m.data.confidence && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-xs">
                    Confidence: {m.data.confidence}
                  </div>
                )}
                {m.data.note && (
                  <p className="mt-3 text-sm text-foreground">{m.data.note}</p>
                )}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
