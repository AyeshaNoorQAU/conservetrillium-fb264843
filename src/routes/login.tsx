import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Leaf, Loader2, Mail, Github, Phone, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Sign in — ConserveTrillium" }, { name: "robots", content: "noindex" }],
  }),
  component: LoginPage,
});

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" width="18" height="18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
      <path d="M16.365 1.43c0 1.14-.42 2.21-1.27 3.05-.83.84-2.05 1.49-3.13 1.4-.13-1.11.42-2.27 1.21-3.06.83-.86 2.21-1.5 3.19-1.39zM20.5 17.34c-.55 1.27-.81 1.83-1.52 2.94-.99 1.54-2.4 3.46-4.14 3.47-1.55.02-1.95-1.01-4.06-1-2.11.01-2.55 1.02-4.1 1-1.74-.02-3.07-1.75-4.07-3.28C-.34 17.32-.6 11.97 2.05 9.06c1.5-1.66 3.87-2.7 6.05-2.7 2.21 0 3.61 1.22 5.43 1.22 1.78 0 2.86-1.22 5.42-1.22 1.93 0 3.99 1.05 5.45 2.87-4.79 2.62-4.02 9.48.1 8.11z" />
    </svg>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "apple" | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const signInWithProvider = async (provider: "google" | "apple") => {
    setOauthLoading(provider);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setOauthLoading(null);
      toast.error(result.error.message ?? `Couldn't sign in with ${provider}`);
      return;
    }
    if (!result.redirected) {
      navigate({ to: "/admin" });
    }
  };

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    setEmailLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setEmailSent(true);
    toast.success("Check your inbox for the sign-in link.");
  };

  const comingSoon = (label: string) =>
    toast(`${label} sign-in is coming soon`, {
      description: "We're rolling this out once provider credentials are configured.",
    });

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-secondary/40 via-background to-secondary/20 px-6 py-16">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-8 text-muted-foreground hover:text-primary"
        >
          <span className="grid place-items-center w-9 h-9 rounded-full bg-primary text-primary-foreground">
            <Leaf className="w-4 h-4" />
          </span>
          <span className="text-display text-lg">
            Conserve<em> Trillium</em>
          </span>
        </Link>
        <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-elevated)]">
          <h1 className="text-display text-3xl text-foreground leading-tight">Welcome back.</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            One tap to join the conservation community. No passwords to remember.
          </p>

          <div className="mt-7 space-y-2.5">
            <button
              onClick={() => signInWithProvider("google")}
              disabled={oauthLoading !== null}
              className="w-full inline-flex items-center justify-center gap-3 px-5 py-3 rounded-full bg-white text-gray-900 text-sm font-medium border border-border hover:bg-gray-50 disabled:opacity-60 transition-colors"
            >
              {oauthLoading === "google" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              Continue with Google
            </button>
            <button
              onClick={() => signInWithProvider("apple")}
              disabled={oauthLoading !== null}
              className="w-full inline-flex items-center justify-center gap-3 px-5 py-3 rounded-full bg-black text-white text-sm font-medium hover:bg-black/90 disabled:opacity-60 transition-colors"
            >
              {oauthLoading === "apple" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <AppleIcon />
              )}
              Continue with Apple
            </button>
            <button
              onClick={() => comingSoon("GitHub")}
              className="w-full inline-flex items-center justify-center gap-3 px-5 py-3 rounded-full bg-[#24292f] text-white text-sm font-medium hover:bg-[#1b1f24] transition-colors relative"
            >
              <Github className="w-4 h-4" />
              Continue with GitHub
              <span className="absolute right-3 text-[10px] uppercase tracking-widest bg-white/15 px-1.5 py-0.5 rounded">
                soon
              </span>
            </button>
          </div>

          <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            or
            <div className="h-px flex-1 bg-border" />
          </div>

          {emailSent ? (
            <div className="rounded-2xl border border-border bg-secondary/40 p-5 text-center">
              <div className="inline-grid place-items-center w-11 h-11 rounded-full bg-primary/10 text-primary mb-3">
                <Check className="w-5 h-5" />
              </div>
              <p className="text-sm text-foreground font-medium">Magic link sent</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Open the email on this device — one tap signs you in.
              </p>
              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                }}
                className="mt-4 text-xs text-primary hover:underline"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={sendMagicLink} className="space-y-2.5">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 rounded-full bg-background border border-border focus:border-primary outline-none text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={emailLoading}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors"
              >
                {emailLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                Email me a sign-in link
              </button>
            </form>
          )}

          <button
            onClick={() => comingSoon("SMS")}
            className="mt-3 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-border text-foreground text-sm hover:border-primary/40 transition-colors relative"
          >
            <Phone className="w-4 h-4" />
            Continue with phone (SMS)
            <span className="absolute right-3 text-[10px] uppercase tracking-widest bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">
              soon
            </span>
          </button>
        </div>

        <p className="mt-6 text-[11px] text-center text-muted-foreground leading-relaxed px-4">
          By continuing you agree to our community guidelines. Admin access is granted manually by
          the project owner after sign-in.
        </p>
      </div>
    </div>
  );
}
