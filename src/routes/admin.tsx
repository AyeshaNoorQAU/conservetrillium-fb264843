import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  Loader2,
  LogOut,
  Trash2,
  Inbox,
  Megaphone,
  Settings,
  Plus,
  ShieldAlert,
  ArrowLeft,
  Save,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — ConserveTrillium" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminPage,
});

type Suggestion = {
  id: string;
  name: string | null;
  email: string | null;
  message: string;
  created_at: string;
  read_at: string | null;
};
type Announcement = {
  id: string;
  title: string;
  body: string;
  published: boolean;
  created_at: string;
};
type Setting = { key: string; value: string };

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center px-6">
        <div className="max-w-md text-center">
          <ShieldAlert className="w-10 h-10 mx-auto text-ember" />
          <h1 className="mt-4 text-display text-3xl">Awaiting admin access</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your account <strong>{user.email}</strong> is signed in but doesn't yet have the
            <code className="px-1 mx-1 rounded bg-secondary">admin</code> role. Open the backend
            dashboard and add a row to <code className="px-1 rounded bg-secondary">user_roles</code>{" "}
            with your user id and role = <em>admin</em>.
          </p>
          <button
            onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/login" }))}
            className="mt-6 text-xs underline text-muted-foreground"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"announcements" | "suggestions" | "settings">("announcements");

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-background border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4" /> View site
            </Link>
            <span className="text-display text-xl">Admin</span>
          </div>
          <button
            onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/login" }))}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex gap-2 mb-8 flex-wrap">
          {(
            [
              { id: "announcements", label: "Announcements", icon: Megaphone },
              { id: "suggestions", label: "Suggestions inbox", icon: Inbox },
              { id: "settings", label: "Site settings", icon: Settings },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
                tab === t.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground border border-border hover:border-primary/40"
              }`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {tab === "announcements" && <AnnouncementsAdmin />}
        {tab === "suggestions" && <SuggestionsAdmin />}
        {tab === "settings" && <SettingsAdmin />}
      </div>
    </div>
  );
}

function AnnouncementsAdmin() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as Announcement[]) ?? []);
  };
  useEffect(() => {
    load();
  }, []);

  const post = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 1 || body.trim().length < 1) return;
    setSaving(true);
    const { error } = await supabase.from("announcements").insert({ title, body, published: true });
    setSaving(false);
    if (error) return toast.error(error.message);
    setTitle("");
    setBody("");
    toast.success("Posted.");
    load();
  };
  const togglePublish = async (a: Announcement) => {
    await supabase.from("announcements").update({ published: !a.published }).eq("id", a.id);
    load();
  };
  const remove = async (id: string) => {
    await supabase.from("announcements").delete().eq("id", id);
    load();
  };

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <form
        onSubmit={post}
        className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border h-fit"
      >
        <h2 className="text-display text-xl mb-4">New announcement</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full mb-3 px-4 py-3 rounded-xl bg-background border border-border outline-none text-sm"
          maxLength={200}
          required
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your update…"
          rows={6}
          className="w-full px-4 py-3 rounded-xl bg-background border border-border outline-none text-sm resize-none"
          maxLength={4000}
          required
        />
        <button
          disabled={saving}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}{" "}
          Publish
        </button>
      </form>
      <div className="lg:col-span-3 space-y-3">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">No announcements yet.</p>
        )}
        {items.map((a) => (
          <div key={a.id} className="p-5 rounded-2xl bg-card border border-border">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  {new Date(a.created_at).toLocaleString()}
                </p>
                <h3 className="text-display text-lg mt-1">{a.title}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-2">{a.body}</p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => togglePublish(a)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/40"
                >
                  {a.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => remove(a.id)}
                  className="text-xs text-ember inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border hover:border-ember/40"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SuggestionsAdmin() {
  const [items, setItems] = useState<Suggestion[]>([]);
  const load = async () => {
    const { data } = await supabase
      .from("suggestions")
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as Suggestion[]) ?? []);
  };
  useEffect(() => {
    load();
  }, []);

  const markRead = async (s: Suggestion) => {
    await supabase
      .from("suggestions")
      .update({ read_at: s.read_at ? null : new Date().toISOString() })
      .eq("id", s.id);
    load();
  };
  const remove = async (id: string) => {
    await supabase.from("suggestions").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-sm text-muted-foreground">Inbox is empty.</p>}
      {items.map((s) => (
        <div
          key={s.id}
          className={`p-5 rounded-2xl bg-card border ${s.read_at ? "border-border opacity-70" : "border-primary/40"}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                {new Date(s.created_at).toLocaleString()}
                {s.name && <> · {s.name}</>}
                {s.email && (
                  <>
                    {" "}
                    ·{" "}
                    <a className="text-primary" href={`mailto:${s.email}`}>
                      {s.email}
                    </a>
                  </>
                )}
              </p>
              <p className="text-sm text-foreground whitespace-pre-wrap mt-2">{s.message}</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => markRead(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/40"
              >
                {s.read_at ? "Mark unread" : "Mark read"}
              </button>
              <button
                onClick={() => remove(s.id)}
                className="text-xs text-ember inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border hover:border-ember/40"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SettingsAdmin() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("*")
      .then(({ data }) => setSettings((data as Setting[]) ?? []));
  }, []);

  const save = async (key: string, value: string) => {
    setSaving(key);
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() });
    setSaving(null);
    if (error) toast.error(error.message);
    else toast.success("Saved.");
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <p className="text-sm text-muted-foreground">
        Editable text snippets shown across the site. Add new keys here, then reference them in
        code.
      </p>
      {settings.map((s, i) => (
        <div key={s.key} className="p-5 rounded-2xl bg-card border border-border">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{s.key}</p>
          <textarea
            defaultValue={s.value}
            rows={2}
            onChange={(e) => {
              const c = [...settings];
              c[i] = { ...s, value: e.target.value };
              setSettings(c);
            }}
            className="w-full mt-2 px-4 py-3 rounded-xl bg-background border border-border outline-none text-sm resize-none"
          />
          <button
            onClick={() => save(s.key, settings[i].value)}
            disabled={saving === s.key}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs disabled:opacity-60"
          >
            {saving === s.key ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Save className="w-3 h-3" />
            )}{" "}
            Save
          </button>
        </div>
      ))}
    </div>
  );
}
