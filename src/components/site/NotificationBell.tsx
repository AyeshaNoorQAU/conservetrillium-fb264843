import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

type Notif = {
  id: string;
  kind: string;
  payload: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
};

export function NotificationBell({ opaque }: { opaque: boolean }) {
  const { user } = useAuth();
  const [items, setItems] = useState<Notif[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    const load = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("id, kind, payload, read_at, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      if (active) setItems((data ?? []) as Notif[]);
    };
    load();
    const channel = supabase
      .channel(`notif-${user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        (payload) => setItems((prev) => [payload.new as Notif, ...prev]),
      )
      .subscribe();
    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (!user) return null;
  const unread = items.filter((i) => !i.read_at).length;

  const markAllRead = async () => {
    if (!unread) return;
    await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .is("read_at", null);
    setItems((prev) => prev.map((i) => ({ ...i, read_at: i.read_at ?? new Date().toISOString() })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((v) => !v);
          if (!open) markAllRead();
        }}
        className={`relative p-2 rounded-full transition-colors ${
          opaque ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"
        }`}
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[oklch(0.62_0.22_25)]" />
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-card border border-border rounded-xl shadow-[var(--shadow-elevated)] z-50">
          {items.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No notifications yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((n) => (
                <li key={n.id} className="p-3 text-sm">
                  <div className="text-foreground">{describe(n)}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="p-3 border-t border-border text-right">
            <Link to="/messages" className="text-xs text-primary hover:underline">
              Open messages →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function describe(n: Notif): string {
  switch (n.kind) {
    case "message":
      return "New message in your inbox";
    case "comment":
      return "Someone commented on your post";
    case "like":
      return "Someone liked your post";
    case "broadcast":
      return (n.payload?.title as string) || "Announcement from the team";
    default:
      return n.kind;
  }
}
