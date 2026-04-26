import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { StarField } from "@/components/StarField";


export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign in to Mochi 🐰" },
      { name: "description", content: "Log in or create an account to chat privately with Mochi the AI bunny." },
    ],
  }),
});

const credsSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

type Mode = "login" | "register" | "forgot";

function AuthPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!loading && session) return <Navigate to="/" />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (mode === "forgot") {
      const parsed = z.string().trim().email("Enter a valid email").safeParse(email);
      if (!parsed.success) { setError(parsed.error.issues[0].message); return; }
      setBusy(true);
      const { error: err } = await supabase.auth.resetPasswordForEmail(parsed.data, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setBusy(false);
      if (err) setError(err.message);
      else setInfo("Password reset email sent. Check your inbox!");
      return;
    }

    const parsed = credsSchema.safeParse({ email, password });
    if (!parsed.success) { setError(parsed.error.issues[0].message); return; }
    setBusy(true);
    try {
      if (mode === "register") {
        const { error: err } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (err) throw err;
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (err) throw err;
      }
      navigate({ to: "/" });
    } catch (err: any) {
      setError(err?.message ?? "Authentication failed");
    } finally {
      setBusy(false);
    }
  };


const onGoogle = async () => {
  setError(null);
  setBusy(true);

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) {
    setBusy(false);
    setError(error.message);
  }

  // ❌ DO NOT navigate manually
  // Supabase will handle redirect automatically
};

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4">
      <StarField />
      <Card className="w-full max-w-md p-8 glass">
        <h1 className="text-3xl font-bold tracking-tight">
          {mode === "login" ? "Welcome back" : mode === "register" ? "Create account" : "Reset password"} <span>🐰</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "login" && "Sign in to chat privately with Mochi."}
          {mode === "register" && "Make an account to start chatting with Mochi."}
          {mode === "forgot" && "Enter your email and we'll send you a reset link."}
        </p>

        {mode !== "forgot" && (
          <>
            <Button type="button" variant="outline" className="mt-6 w-full" onClick={onGoogle} disabled={busy}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" aria-hidden>
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.4 1.1 7.4 2.8l5.7-5.7C33.6 7.1 29 5 24 5 13.5 5 5 13.5 5 24s8.5 19 19 19 19-8.5 19-19c0-1.2-.1-2.4-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c2.8 0 5.4 1.1 7.4 2.8l5.7-5.7C33.6 7.1 29 5 24 5 16.4 5 9.8 9 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 43c5 0 9.5-1.9 12.9-5l-6-5.1C29.1 34.4 26.7 35 24 35c-5.3 0-9.7-2.6-11.3-6.5l-6.5 5C9.6 39 16.2 43 24 43z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.8l6 5.1C40.9 35.6 44 30.3 44 24c0-1.2-.1-2.4-.4-3.5z"/>
              </svg>
              Continue with Google
            </Button>
            <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              <span>or</span>
              <span className="h-px flex-1 bg-border" />
            </div>
          </>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          {mode !== "forgot" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {mode === "login" && (
                  <button type="button" className="text-xs text-muted-foreground hover:text-foreground" onClick={() => { setMode("forgot"); setError(null); setInfo(null); }}>
                    Forgot?
                  </button>
                )}
              </div>
              <Input id="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
          )}

          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
          {info && <p className="text-sm text-foreground/80" role="status">{info}</p>}

          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Please wait…" : mode === "login" ? "Sign in" : mode === "register" ? "Create account" : "Send reset link"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode((m) => (m === "login" ? "register" : "login"));
            setError(null); setInfo(null);
          }}
          className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground"
        >
          {mode === "login" ? "No account? Create one" : mode === "register" ? "Already have an account? Sign in" : ""}
        </button>
        {mode === "forgot" && (
          <button type="button" onClick={() => { setMode("login"); setError(null); setInfo(null); }} className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground">
            Back to sign in
          </button>
        )}
      </Card>
    </main>
  );
}
