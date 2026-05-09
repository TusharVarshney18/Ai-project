import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Circle, Lock, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  head: () => ({
    meta: [
      { title: "Reset password — Mochi 🐰" },
      { name: "description", content: "Choose a new password for your Mochi account." },
    ],
  }),
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  useEffect(() => {
    // Supabase will set a recovery session via the link's hash automatically.
    // Wait briefly and confirm we have one.
    const t = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) setReady(true);
      else setError("Reset link is invalid or expired. Request a new one.");
    }, 300);
    return () => clearTimeout(t);
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords don't match.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
    setTimeout(() => navigate({ to: "/" }), 1200);
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(130deg,#f5f9ff_0%,#ffffff_45%,#eef4ff_100%)] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl flex-col items-center justify-center gap-8">
        <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_24px_64px_rgba(34,89,166,0.14)]">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-semibold text-slate-900">Reset Password</h1>
            <p className="mt-2 text-sm text-slate-500">
              Create a strong new password for your Mochi account.
            </p>
          </div>

          {done ? (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              Password updated successfully. Redirecting...
            </p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  New Password
                </span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="pw"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={!ready}
                    className="h-12 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </label>

              <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs">
                <PasswordRule ok={hasLength} label="8+ characters" />
                <PasswordRule ok={hasSymbol} label="One symbol" />
                <PasswordRule ok={hasUpper} label="One uppercase" />
                <PasswordRule ok={hasNumber} label="One number" />
              </div>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Confirm New Password
                </span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="pw2"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={6}
                    disabled={!ready}
                    className="h-12 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </label>

              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="h-12 w-full rounded-xl bg-blue-600 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                disabled={busy || !ready}
              >
                {busy ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </div>

        <div className="h-28 w-full max-w-md rounded-2xl border border-blue-100 bg-[linear-gradient(130deg,#dce8ff,#f2f7ff)] p-3 shadow-inner">
          <div className="h-full rounded-xl border border-white/80 bg-[radial-gradient(circle_at_20%_20%,#ffffff,transparent_45%),linear-gradient(140deg,#a9c3ff_0%,#7ea4ff_28%,#d7e4ff_64%,#f9fbff_100%)]" />
        </div>
      </div>
    </main>
  );
}

function PasswordRule({ ok, label }: { ok: boolean; label: string }) {
  return (
    <p className={`inline-flex items-center gap-1.5 ${ok ? "text-blue-700" : "text-slate-500"}`}>
      {ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
      {label}
    </p>
  );
}
