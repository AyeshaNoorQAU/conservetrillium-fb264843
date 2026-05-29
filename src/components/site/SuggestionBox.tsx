import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().max(80).optional().or(z.literal("")),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  message: z.string().trim().min(3, "Please write a few words.").max(2000),
});

export function SuggestionBox() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ name, email, message });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your input.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("suggestions").insert({
      name: parsed.data.name || null,
      email: parsed.data.email || null,
      message: parsed.data.message,
    });
    setLoading(false);
    if (error) {
      toast.error("Couldn't send — please try again.");
      return;
    }
    setSent(true);
    setName(""); setEmail(""); setMessage("");
    toast.success("Thank you — your suggestion has reached Ayesha.");
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-secondary/40 p-8 lg:p-10 shadow-[var(--shadow-soft)]">
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative">
        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Leave a suggestion</p>
        <h3 className="text-display text-2xl sm:text-3xl text-foreground leading-snug">
          Have an idea, correction, or a story to share?
        </h3>
        <p className="mt-3 text-sm text-muted-foreground">
          Anonymous or signed — every voice helps shape this conservation effort.
        </p>

        {sent ? (
          <div className="mt-8 flex items-center gap-3 text-[var(--moss)]">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm">Received with thanks. You can send another anytime.</span>
            <button onClick={() => setSent(false)} className="ml-auto text-xs underline text-muted-foreground">
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 grid sm:grid-cols-2 gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              maxLength={80}
              className="px-4 py-3 rounded-xl bg-background border border-border focus:border-primary outline-none text-sm"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (optional)"
              maxLength={255}
              className="px-4 py-3 rounded-xl bg-background border border-border focus:border-primary outline-none text-sm"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your suggestion, question, or observation…"
              maxLength={2000}
              rows={4}
              required
              className="sm:col-span-2 px-4 py-3 rounded-xl bg-background border border-border focus:border-primary outline-none text-sm resize-none"
            />
            <div className="sm:col-span-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{message.length}/2000</span>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send suggestion
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
