import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Send, Loader2 } from "lucide-react";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Messages — ConserveTrillium" },
      { name: "description", content: "Direct messages with the community." },
    ],
  }),
  component: MessagesPage,
  errorComponent: () => <div className="p-10 text-center">Couldn’t load messages.</div>,
  notFoundComponent: () => <div className="p-10 text-center">Not found.</div>,
});

type Conv = { id: string; created_at: string; otherName: string | null };
type Msg = { id: string; conversation_id: string; author_id: string; body: string; created_at: string };

function MessagesPage() {
  const { user, loading } = useAuth();
  const [convs, setConvs] = useState<Conv[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [newPeerEmail, setNewPeerEmail] = useState("");

  // Load my conversations
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: mems } = await supabase
        .from("conversation_members")
        .select("conversation_id, conversations(id, created_at)")
        .eq("user_id", user.id);
      const ids = (mems ?? []).map((m) => m.conversation_id);
      if (ids.length === 0) {
        setConvs([]);
        return;
      }
      const { data: others } = await supabase
        .from("conversation_members")
        .select("conversation_id, user_id")
        .in("conversation_id", ids)
        .neq("user_id", user.id);
      const otherIds = Array.from(new Set((others ?? []).map((o) => o.user_id)));
      const { data: profs } = otherIds.length
        ? await supabase.from("profiles").select("id, display_name").in("id", otherIds)
        : { data: [] };
      const nameMap = new Map((profs ?? []).map((p) => [p.id, p.display_name]));
      const otherByConv = new Map<string, string>();
      (others ?? []).forEach((o) => otherByConv.set(o.conversation_id, o.user_id));

      setConvs(
        ids.map((id) => ({
          id,
          created_at: "",
          otherName: nameMap.get(otherByConv.get(id) ?? "") ?? "Member",
        })),
      );
    })();
  }, [user]);

  // Load messages for active conv + realtime
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("messages")
        .select("id, conversation_id, author_id, body, created_at")
        .eq("conversation_id", active)
        .order("created_at", { ascending: true });
      if (!cancelled) setMsgs((data ?? []) as Msg[]);
    })();
    const channel = supabase
      .channel(`msg-${active}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${active}` },
        (p) => setMsgs((prev) => [...prev, p.new as Msg]),
      )
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [active]);

  const send = async () => {
    if (!user || !active || !body.trim()) return;
    setBusy(true);
    const text = body.trim();
    setBody("");
    await supabase.from("messages").insert({
      conversation_id: active,
      author_id: user.id,
      body: text,
    });
    setBusy(false);
  };

  const startNewConvo = async () => {
    if (!user || !newPeerEmail.trim()) return;
    // Find target user by email -> profiles.display_name fallback search
    const email = newPeerEmail.trim().toLowerCase();
    // We don't have email in profiles, so we'll search display_name as a fallback.
    const { data: peers } = await supabase
      .from("profiles")
      .select("id, display_name")
      .ilike("display_name", `%${email}%`)
      .limit(1);
    const peer = peers?.[0];
    if (!peer) {
      alert("No member found by that name. (Search uses display name.)");
      return;
    }
    const { data: conv, error } = await supabase
      .from("conversations")
      .insert({})
      .select("id")
      .single();
    if (error || !conv) return;
    await supabase.from("conversation_members").insert([
      { conversation_id: conv.id, user_id: user.id },
      { conversation_id: conv.id, user_id: peer.id },
    ]);
    setConvs((prev) => [{ id: conv.id, created_at: "", otherName: peer.display_name }, ...prev]);
    setActive(conv.id);
    setNewPeerEmail("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="mx-auto max-w-5xl px-6 lg:px-10 pt-32 pb-24">
        <h1 className="text-display text-3xl text-foreground mb-6">Messages</h1>
        {loading ? null : !user ? (
          <div className="p-5 rounded-xl border border-border bg-muted/30 text-sm">
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>{" "}
            to view messages.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 h-[560px]">
            <aside className="rounded-xl border border-border bg-card overflow-y-auto">
              <div className="p-3 border-b border-border">
                <input
                  value={newPeerEmail}
                  onChange={(e) => setNewPeerEmail(e.target.value)}
                  placeholder="Find a member by name"
                  className="w-full px-3 py-1.5 rounded border border-border bg-background text-sm"
                />
                <button
                  onClick={startNewConvo}
                  className="mt-2 w-full px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs"
                >
                  Start new chat
                </button>
              </div>
              {convs.length === 0 && (
                <p className="p-3 text-xs text-muted-foreground">No conversations yet.</p>
              )}
              <ul>
                {convs.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => setActive(c.id)}
                      className={`w-full text-left px-4 py-3 text-sm border-b border-border hover:bg-muted ${
                        active === c.id ? "bg-muted" : ""
                      }`}
                    >
                      {c.otherName || "Member"}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
            <section className="rounded-xl border border-border bg-card flex flex-col">
              {!active ? (
                <div className="flex-1 grid place-items-center text-sm text-muted-foreground">
                  Pick a conversation
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {msgs.map((m) => (
                      <div
                        key={m.id}
                        className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap ${
                          m.author_id === user.id
                            ? "ml-auto bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        {m.body}
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border p-3 flex gap-2">
                    <input
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          send();
                        }
                      }}
                      placeholder="Type a message…"
                      className="flex-1 px-3 py-2 rounded-full border border-border bg-background text-sm"
                    />
                    <button
                      onClick={send}
                      disabled={busy || !body.trim()}
                      className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm disabled:opacity-50"
                    >
                      {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </>
              )}
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
