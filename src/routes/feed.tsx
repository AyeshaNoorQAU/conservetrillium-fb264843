import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Heart, MessageCircle, MapPin, Image as ImageIcon, Send, Loader2 } from "lucide-react";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { title: "Community Feed — ConserveTrillium" },
      {
        name: "description",
        content: "Share plant sightings, photos, and field notes from the Himalayan flora community.",
      },
    ],
  }),
  component: FeedPage,
  errorComponent: () => <div className="p-10 text-center">Couldn’t load feed.</div>,
  notFoundComponent: () => <div className="p-10 text-center">Not found.</div>,
});

type Post = {
  id: string;
  author_id: string;
  body: string;
  photo_url: string | null;
  plant_id: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
  plants?: { scientific_name: string; slug: string } | null;
  profiles?: { display_name: string | null } | null;
  post_likes: { user_id: string }[];
  post_comments: { id: string }[];
};

// Cast around supabase relationship inference quirks for nested selects.
type Loose = Record<string, unknown>;

function FeedPage() {
  const { user } = useAuth();

  const postsQ = useQuery({
    queryKey: ["feed-posts"],
    queryFn: async (): Promise<Post[]> => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          "id, author_id, body, photo_url, plant_id, lat, lng, created_at, plants(scientific_name, slug), post_likes(user_id), post_comments(id)"
        )
        .eq("hidden", false)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      const rows = (data ?? []) as unknown as Post[];
      // Hydrate display_name from profiles separately (no FK join available).
      const ids = Array.from(new Set(rows.map((r) => r.author_id)));
      if (ids.length) {
        const { data: profs } = await supabase
          .from("profiles")
          .select("id, display_name")
          .in("id", ids);
        const map = new Map((profs ?? []).map((p) => [p.id, p.display_name]));
        rows.forEach((r) => {
          r.profiles = { display_name: map.get(r.author_id) ?? null };
        });
      }
      return rows;
    },
    retry: false,
  });

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="mx-auto max-w-2xl px-6 lg:px-10 pt-32 pb-24">
        <h1 className="text-display text-4xl text-foreground">Community feed</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Sightings, photos, and field notes from the community.
        </p>

        {user ? (
          <Composer onPosted={() => postsQ.refetch()} userId={user.id} />
        ) : (
          <div className="mt-8 p-5 rounded-xl border border-border bg-muted/30 text-sm">
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>{" "}
            to share your own sighting.
          </div>
        )}

        <div className="mt-8 space-y-6">
          {postsQ.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
          {postsQ.data?.length === 0 && (
            <p className="text-sm text-muted-foreground">No posts yet — be the first.</p>
          )}
          {postsQ.data?.map((p) => (
            <PostCard key={p.id} post={p} currentUserId={user?.id} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Composer({ onPosted, userId }: { onPosted: () => void; userId: string }) {
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [plantId, setPlantId] = useState<string>("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [plants, setPlants] = useState<{ id: string; scientific_name: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase
      .from("plants")
      .select("id, scientific_name")
      .order("scientific_name")
      .then(({ data }) => setPlants(data ?? []));
  }, []);

  const useGps = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => alert("Could not get location"),
    );
  };

  const submit = async () => {
    if (!body.trim()) return;
    setBusy(true);
    try {
      let photo_url: string | null = null;
      if (file) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `posts/${userId}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("site-media")
          .upload(path, file, { upsert: false });
        if (upErr) throw upErr;
        photo_url = path;
      }
      const { error } = await supabase.from("posts").insert({
        author_id: userId,
        body: body.trim(),
        photo_url,
        plant_id: plantId || null,
        lat: coords?.lat ?? null,
        lng: coords?.lng ?? null,
      });
      if (error) throw error;
      setBody("");
      setFile(null);
      setPlantId("");
      setCoords(null);
      if (fileRef.current) fileRef.current.value = "";
      onPosted();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-8 p-5 rounded-xl border border-border bg-card">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Share a sighting, a question, or a field note…"
        rows={3}
        className="w-full resize-none bg-transparent text-sm focus:outline-none"
      />
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border cursor-pointer hover:border-primary/40">
          <ImageIcon className="w-3.5 h-3.5" />
          {file ? file.name.slice(0, 20) : "Photo"}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <select
          value={plantId}
          onChange={(e) => setPlantId(e.target.value)}
          className="px-3 py-1.5 rounded-full border border-border bg-background text-foreground"
        >
          <option value="">Tag a plant (optional)</option>
          {plants.map((p) => (
            <option key={p.id} value={p.id}>
              {p.scientific_name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={useGps}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${coords ? "border-primary text-primary" : "border-border hover:border-primary/40"}`}
        >
          <MapPin className="w-3.5 h-3.5" /> {coords ? "GPS set" : "Add GPS"}
        </button>
        <button
          onClick={submit}
          disabled={busy || !body.trim()}
          className="ml-auto inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground disabled:opacity-50"
        >
          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          Post
        </button>
      </div>
    </div>
  );
}

function PostCard({ post, currentUserId }: { post: Post; currentUserId?: string }) {
  const qc = useQueryClient();
  const [signed, setSigned] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (!post.photo_url) return;
    supabase.storage
      .from("site-media")
      .createSignedUrl(post.photo_url, 60 * 60)
      .then(({ data }) => setSigned(data?.signedUrl ?? null));
  }, [post.photo_url]);

  const liked = !!currentUserId && post.post_likes.some((l) => l.user_id === currentUserId);

  const like = useMutation({
    mutationFn: async () => {
      if (!currentUserId) return;
      if (liked) {
        await supabase.from("post_likes").delete().eq("post_id", post.id).eq("user_id", currentUserId);
      } else {
        await supabase.from("post_likes").insert({ post_id: post.id, user_id: currentUserId });
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["feed-posts"] }),
  });

  return (
    <article className="p-5 rounded-xl border border-border bg-card">
      <header className="flex items-center gap-3 text-sm">
        <div className="w-9 h-9 rounded-full bg-primary/10 grid place-items-center text-primary text-xs font-medium">
          {(post.profiles?.display_name ?? "U").slice(0, 1).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="text-foreground">{post.profiles?.display_name || "A community member"}</div>
          <div className="text-xs text-muted-foreground">
            {new Date(post.created_at).toLocaleString()}
            {post.plants && (
              <>
                {" · "}
                <span className="italic">{post.plants.scientific_name}</span>
              </>
            )}
            {post.lat && post.lng && (
              <>
                {" · "}
                {post.lat.toFixed(2)}, {post.lng.toFixed(2)}
              </>
            )}
          </div>
        </div>
      </header>
      <p className="mt-3 text-sm text-foreground whitespace-pre-wrap">{post.body}</p>
      {signed && (
        <img src={signed} alt="" className="mt-3 w-full rounded-lg max-h-[480px] object-cover" />
      )}
      <div className="mt-4 flex items-center gap-4 text-sm">
        <button
          onClick={() => like.mutate()}
          disabled={!currentUserId}
          className={`inline-flex items-center gap-1.5 ${liked ? "text-[oklch(0.62_0.22_25)]" : "text-muted-foreground"} hover:text-foreground transition-colors disabled:opacity-50`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} /> {post.post_likes.length}
        </button>
        <button
          onClick={() => setShowComments((v) => !v)}
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <MessageCircle className="w-4 h-4" /> {post.post_comments.length}
        </button>
      </div>
      {showComments && <CommentThread postId={post.id} currentUserId={currentUserId} />}
    </article>
  );
}

function CommentThread({ postId, currentUserId }: { postId: string; currentUserId?: string }) {
  const qc = useQueryClient();
  const [body, setBody] = useState("");
  const q = useQuery({
    queryKey: ["post-comments", postId],
    queryFn: async () => {
      const { data } = await supabase
        .from("post_comments")
        .select("id, body, author_id, created_at")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });
      const rows = data ?? [];
      const ids = Array.from(new Set(rows.map((r) => r.author_id)));
      let nameMap = new Map<string, string | null>();
      if (ids.length) {
        const { data: profs } = await supabase
          .from("profiles")
          .select("id, display_name")
          .in("id", ids);
        nameMap = new Map((profs ?? []).map((p) => [p.id, p.display_name]));
      }
      return rows.map((r) => ({
        id: r.id,
        body: r.body,
        display_name: nameMap.get(r.author_id) ?? null,
      }));
    },
  });
  const m = useMutation({
    mutationFn: async () => {
      if (!currentUserId || !body.trim()) return;
      await supabase.from("post_comments").insert({
        post_id: postId,
        author_id: currentUserId,
        body: body.trim(),
      });
    },
    onSuccess: () => {
      setBody("");
      qc.invalidateQueries({ queryKey: ["post-comments", postId] });
      qc.invalidateQueries({ queryKey: ["feed-posts"] });
    },
  });
  return (
    <div className="mt-4 pt-4 border-t border-border space-y-3">
      {q.data?.map((c) => (
        <div key={c.id} className="text-sm">
          <span className="text-foreground font-medium">{c.display_name || "Anon"}:</span>{" "}
          <span className="text-muted-foreground">{c.body}</span>
        </div>
      ))}
      {currentUserId && (
        <div className="flex gap-2">
          <input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add a comment…"
            className="flex-1 px-3 py-1.5 rounded-full border border-border bg-background text-sm"
          />
          <button
            onClick={() => m.mutate()}
            disabled={!body.trim() || m.isPending}
            className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm disabled:opacity-50"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}
