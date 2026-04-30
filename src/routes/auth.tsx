import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const credsSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

type Mode = "login" | "register" | "forgot";

/**
 * ✅ FINAL REDIRECT FIX (works everywhere)
 */
const getRedirectUrl = () => {
  return import.meta.env.VITE_APP_URL || window.location.origin;
};

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

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
      const parsed = z.string().email().safeParse(email);
      if (!parsed.success) return setError("Invalid email");

      setBusy(true);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getRedirectUrl()}/reset-password`,
      });

      setBusy(false);

      if (error) setError(error.message);
      else setInfo("Reset link sent to your email.");
      return;
    }

    const parsed = credsSchema.safeParse({ email, password });
    if (!parsed.success) return setError(parsed.error.issues[0].message);

    setBusy(true);

    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: getRedirectUrl(),
          },
        });

        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      }

      navigate({ to: "/" });
    } catch (err: any) {
      setError(err.message || "Auth failed");
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    setBusy(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getRedirectUrl(),
      },
    });

    if (error) {
      setBusy(false);
      setError(error.message);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-sky-100 to-blue-300" />
      <div className="absolute -top-20 -right-20 w-[320px] h-[320px] rounded-full bg-yellow-200/40 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_10%,rgba(255,248,220,0.35),transparent_60%)]" />

      {/* CLOUDS */}
      <Clouds />

      {/* CARD */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/70 backdrop-blur-2xl border border-white/80 rounded-3xl p-8 shadow-[0_20px_60px_rgba(80,130,180,0.2)]">

          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-white shadow flex items-center justify-center">
              🐰
            </div>

            <h1 className="text-xl font-semibold text-gray-800">
              {mode === "login" && "Sign in"}
              {mode === "register" && "Create account"}
              {mode === "forgot" && "Reset password"}
            </h1>
          </div>

          {mode !== "forgot" && (
            <>
              <button
                onClick={onGoogle}
                className="w-full mb-4 h-11 rounded-xl bg-white border border-blue-200 shadow hover:bg-blue-50 transition"
              >
                Continue with Google
              </button>
              <div className="text-center text-xs text-gray-400 mb-4">or</div>
            </>
          )}

          <form onSubmit={onSubmit} className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-white border border-blue-200"
            />

            {mode !== "forgot" && (
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-white border border-blue-200"
              />
            )}

            {mode === "login" && (
              <div className="text-right text-sm">
                <button type="button" onClick={() => setMode("forgot")} className="text-blue-500">
                  Forgot?
                </button>
              </div>
            )}

            {error && <div className="text-red-600 text-sm">{error}</div>}
            {info && <div className="text-green-600 text-sm">{info}</div>}

            <button
              type="submit"
              disabled={busy}
              className="w-full h-12 rounded-xl bg-gray-900 text-white"
            >
              {busy ? "Please wait..." : "Continue"}
            </button>
          </form>

          <div className="text-center mt-6 text-sm">
            {mode === "login" && (
              <>
                No account?
                <button onClick={() => setMode("register")} className="ml-1 text-blue-600">
                  Sign up
                </button>
              </>
            )}

            {mode === "register" && (
              <>
                Already have one?
                <button onClick={() => setMode("login")} className="ml-1 text-blue-600">
                  Sign in
                </button>
              </>
            )}

            {mode === "forgot" && (
              <button onClick={() => setMode("login")} className="text-blue-600">
                Back
              </button>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}

function Clouds() {
  return (
    <>
      <div className="absolute top-[10%] left-[-20%] w-60 h-24 bg-white/70 rounded-full blur-xl animate-[float_60s_linear_infinite]" />
      <div className="absolute top-[30%] left-[-30%] w-72 h-28 bg-white/60 rounded-full blur-xl animate-[float_80s_linear_infinite]" />
    </>
  );
}