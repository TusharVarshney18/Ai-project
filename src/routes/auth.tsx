import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const credsSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

type Mode = "login" | "register" | "forgot";

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
  const [showPassword, setShowPassword] = useState(false);

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

      if (!parsed.success) {
        return setError("Invalid email");
      }

      setBusy(true);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getRedirectUrl()}/reset-password`,
      });

      setBusy(false);

      if (error) {
        setError(error.message);
      } else {
        setInfo("Reset link sent to your email.");
      }

      return;
    }

    const parsed = credsSchema.safeParse({
      email,
      password,
    });

    if (!parsed.success) {
      return setError(parsed.error.issues[0].message);
    }

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
      setError(err.message || "Authentication failed");
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
    <main
      style={{
        WebkitTapHighlightColor: "transparent",
      }}
      className="
        min-h-[100dvh]
        bg-[radial-gradient(circle_at_top,#eef4ff,white_45%,#f7f9fc)]
        flex
        flex-col
        relative
        overflow-hidden
        supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)]
        supports-[padding:max(0px)]:pb-[env(safe-area-inset-bottom)]
      "
    >
      {/* Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-blue-400/10 blur-3xl rounded-full" />
      </div>

      {/* Header */}
      <header
        className="
          relative
          z-10
          h-16
          sm:h-20
          px-4
          sm:px-8
          flex
          items-center
          justify-between
          backdrop-blur-xl
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              w-10
              h-10
              sm:w-11
              sm:h-11
              rounded-2xl
              bg-blue-600
              text-white
              flex
              items-center
              justify-center
              font-bold
              text-base
              sm:text-lg
              shadow-lg
              shadow-blue-200
            "
          >
            T
          </div>

          <div>
            <div className="text-base sm:text-xl font-bold tracking-tight text-slate-900">
              Tushar.Dev
            </div>

            <div className="text-xs text-slate-500 -mt-1">
              Bunny AI Workspace
            </div>
          </div>
        </div>

        <button
          className="
            h-10
            sm:h-11
            px-4
            sm:px-5
            rounded-xl
            border
            border-slate-200
            bg-white/80
            backdrop-blur-xl
            text-xs
            sm:text-sm
            font-medium
            active:scale-[0.98]
            transition
            shadow-sm
          "
        >
          Contact
        </button>
      </header>

      {/* Content */}
      <section
        className="
          relative
          z-10
          flex-1
          flex
          items-center
          justify-center
          px-3
          sm:px-4
          py-6
          sm:py-10
        "
      >
        <div
          className="
            w-full
            max-w-[520px]
            bg-white/85
            backdrop-blur-2xl
            rounded-[28px]
            sm:rounded-[32px]
            border
            border-white/60
            shadow-[0_10px_40px_rgba(15,23,42,0.08)]
            px-5
            sm:px-10
            py-7
            sm:py-12
            transition-all
          "
        >
          {/* Hero */}
          <div className="text-center mb-8 sm:mb-10">
            <div
              className="
                w-14
                h-14
                sm:w-16
                sm:h-16
                rounded-2xl
                bg-gradient-to-br
                from-blue-600
                to-indigo-600
                text-white
                flex
                items-center
                justify-center
                text-xl
                sm:text-2xl
                font-bold
                mx-auto
                mb-5
                shadow-xl
                shadow-blue-200
              "
            >
              AI
            </div>

            <h1
              className="
                text-3xl
                sm:text-5xl
                font-bold
                tracking-tight
                text-slate-900
                mb-3
                sm:mb-4
                leading-tight
              "
            >
              {mode === "login" && "Welcome back"}
              {mode === "register" && "Create your workspace"}
              {mode === "forgot" && "Reset password"}
            </h1>

            <p
              className="
                text-slate-500
                text-sm
                sm:text-lg
                leading-relaxed
                max-w-sm
                mx-auto
                px-2
              "
            >
              Secure access to Bunny AI powered applications by Tushar.Dev
            </p>
          </div>

          {/* Google */}
          {mode !== "forgot" && (
            <>
              <button
                onClick={onGoogle}
                className="
                  w-full
                  h-14
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white/80
                  backdrop-blur-xl
                  hover:bg-white
                  transition-all
                  text-[15px]
                  sm:text-[16px]
                  font-medium
                  flex
                  items-center
                  justify-center
                  gap-3
                  active:scale-[0.99]
                  shadow-sm
                "
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="w-5 h-5"
                  alt="Google"
                />

                Continue with Google
              </button>

              <div className="flex items-center gap-4 my-7 sm:my-8">
                <div className="flex-1 h-px bg-slate-200" />

                <span className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-slate-400">
                  Or continue with email
                </span>

                <div className="flex-1 h-px bg-slate-200" />
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full
                  h-14
                  px-4
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white/80
                  backdrop-blur-xl
                  outline-none
                  text-[16px]
                  focus:ring-4
                  focus:ring-blue-100
                  focus:border-blue-500
                  transition
                "
              />
            </div>

            {/* Password */}
            {mode !== "forgot" && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">
                    Password
                  </label>

                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="
                      w-full
                      h-14
                      px-4
                      pr-14
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white/80
                      backdrop-blur-xl
                      outline-none
                      text-[16px]
                      focus:ring-4
                      focus:ring-blue-100
                      focus:border-blue-500
                      transition
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                      hover:text-slate-600
                    "
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Remember */}
            {mode === "login" && (
              <label className="flex items-center gap-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300"
                />

                Keep me signed in for 30 days
              </label>
            )}

            {/* Error */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
                {error}
              </div>
            )}

            {/* Info */}
            {info && (
              <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
                {info}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={busy}
              className="
                w-full
                h-14
                rounded-2xl
                bg-blue-600
                hover:bg-blue-700
                active:scale-[0.99]
                text-white
                text-base
                sm:text-lg
                font-semibold
                transition-all
                shadow-lg
                shadow-blue-200/60
                disabled:opacity-60
              "
            >
              {busy
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : mode === "register"
                ? "Create Account"
                : "Send Reset Link"}
            </button>
          </form>

          {/* Bottom */}
          <div className="mt-8 text-center text-sm sm:text-[15px] text-slate-500">
            {mode === "login" && (
              <>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-blue-600 font-semibold hover:text-blue-700"
                >
                  Create an account
                </button>
              </>
            )}

            {mode === "register" && (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-blue-600 font-semibold hover:text-blue-700"
                >
                  Sign in
                </button>
              </>
            )}

            {mode === "forgot" && (
              <button
                onClick={() => setMode("login")}
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Back to login
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="
          relative
          z-10
          px-4
          sm:px-8
          py-6
          flex
          flex-col
          gap-4
          md:flex-row
          items-center
          justify-between
          text-xs
          sm:text-sm
          text-slate-500
        "
      >
        <div className="text-center md:text-left">
          © 2024 Tushar.Dev — Built with Bunny AI
        </div>

        <div className="flex items-center gap-4 sm:gap-8 flex-wrap justify-center">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms</a>
          <a href="/docs">Docs</a>
          <a href="/support">Support</a>
        </div>
      </footer>
    </main>
  );
}