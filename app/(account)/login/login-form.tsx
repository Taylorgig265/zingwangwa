"use client";

import { useState } from "react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();
  const supabase = getSupabaseBrowserClient();

  if (!isSupabaseConfigured || !supabase) {
    return (
      <div className="mt-8 rounded-3xl bg-brand-honey/10 p-6 text-center text-sm text-brand-cacao/80">
        Auth isn’t configured yet. Add your Supabase keys to <code>.env.local</code> â€” see the
        README. The whole menu still works without it! ðŸŸ
      </div>
    );
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } =
      mode === "signin"
        ? await supabase!.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: `${location.origin}/account` },
          })
        : await supabase!.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: `${location.origin}/account` },
          });
    setBusy(false);
    if (error) toast(error.message, "ðŸ˜¬");
    else toast("Magic link sent! Check your inbox. âœ¨", "ðŸ“¬");
  }

  async function handleGoogle() {
    await supabase!.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/account` },
    });
  }

  const inputCls =
    "w-full rounded-2xl border-2 border-brand-honey/50 bg-brand-white px-4 py-3 text-brand-cacao placeholder:text-brand-cacao/40 focus:border-brand-burnt focus:outline-none";

  return (
    <div className="mt-8 space-y-4 rounded-3xl border-2 border-brand-honey/40 p-6">
      <form onSubmit={handleEmail} className="space-y-3">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
        />
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Sendingâ€¦" : mode === "signin" ? "Send magic link âœ¨" : "Create account âœ¨"}
        </Button>
      </form>

      <button
        onClick={handleGoogle}
        className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-brand-honey/60 py-3 font-display text-brand-cacao transition-colors hover:bg-brand-honey/15"
      >
        <GoogleIcon /> Continue with Google
      </button>

      <p className="text-center text-sm text-brand-cacao/60">
        {mode === "signin" ? "New here? " : "Already snacking? "}
        <button
          className="font-semibold text-brand-burnt underline underline-offset-2"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          {mode === "signin" ? "Create an account" : "Sign in"}
        </button>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.1h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.2-2 3.7-5 3.7-8.6z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-5.9-2.1-6.8-5.1l-3.9 3C3.3 21.4 7.3 24 12 24z" />
      <path fill="#FBBC05" d="M5.2 14.3c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3l-4-3C.5 8.2 0 10 0 12s.5 3.8 1.3 5.3l3.9-3z" />
      <path fill="#EA4335" d="M12 4.6c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1 15.2 0 12 0 7.3 0 3.3 2.6 1.3 6.7l3.9 3c1-2.9 3.6-5.1 6.8-5.1z" />
    </svg>
  );
}
