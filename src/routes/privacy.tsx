import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/privacy")({
  component: Privacy,
});

function Privacy() {
  const blockCopy = (e: any) => e.preventDefault();

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#eef4ff,white_45%,#f8fafc)] px-4 py-14 text-slate-900"
      onCopy={blockCopy}
      onCut={blockCopy}
      onContextMenu={blockCopy}
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 mx-auto mb-10 flex w-full max-w-5xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white shadow-lg shadow-blue-200">
            T
          </div>

          <div>
            <div className="text-xl font-bold tracking-tight">
              Tushar.Dev
            </div>

            <div className="-mt-1 text-xs text-slate-500">
              Bunny AI Workspace
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-slate-600">
          <a href="/" className="transition hover:text-slate-900">
            Home
          </a>

          <a href="/auth" className="transition hover:text-slate-900">
            Login
          </a>

          <a href="/privacy" className="font-medium text-blue-600">
            Privacy
          </a>
        </div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <Card className="rounded-[32px] border border-slate-200 bg-white/90 p-10 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          {/* Top */}
          <div className="mb-10 border-b border-slate-100 pb-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
              Bunny AI Privacy Policy
            </div>

            <h1 className="mb-4 text-5xl font-bold tracking-tight text-slate-900">
              Privacy Policy
            </h1>

            <p className="max-w-2xl text-lg leading-relaxed text-slate-500">
              Your privacy matters to us. Bunny AI by Tushar.Dev is built with
              transparency, security, and responsible AI practices.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">
                Information We Collect
              </h2>

              <p className="leading-8 text-slate-600">
                We may collect your email address and authentication details
                when you sign in using Google or other authentication providers.
                This information is used solely for account access and workspace
                personalization.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">
                How We Use Information
              </h2>

              <p className="leading-8 text-slate-600">
                Your information is used to authenticate your account, improve
                platform stability, personalize the Bunny AI experience, and
                maintain service security. We never sell your personal data.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">
                AI Conversations
              </h2>

              <p className="leading-8 text-slate-600">
                Messages submitted to Bunny AI may be processed temporarily to
                generate responses and improve system reliability. Conversations
                are not permanently stored unless explicitly required for
                features you enable.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">
                Security
              </h2>

              <p className="leading-8 text-slate-600">
                We use Supabase authentication, encrypted connections, protected
                APIs, and modern infrastructure security practices to safeguard
                your account and data.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">
                Copyright & Intellectual Property
              </h2>

              <p className="leading-8 text-slate-600">
                All branding, AI workflows, UI components, source code, product
                designs, and assets related to Bunny AI and Tushar.Dev are
                protected under applicable copyright and intellectual property
                laws.
              </p>

              <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <p className="font-medium text-slate-800">
                  Unauthorized copying, cloning, redistribution, resale,
                  reverse-engineering, or commercial reuse of this platform is
                  strictly prohibited without written permission.
                </p>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">
                Contact
              </h2>

              <p className="leading-8 text-slate-600">
                For privacy-related questions or support requests, contact:
              </p>

              <div className="mt-4 inline-flex rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 font-medium text-slate-800">
                Tusharvarshney1810@gmail.com
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-12 border-t border-slate-100 pt-6">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <p className="text-sm text-slate-500">
                © {new Date().getFullYear()} Tushar.Dev — Bunny AI. All rights
                reserved.
              </p>

              <div className="flex items-center gap-6 text-sm text-slate-500">
                <a href="/" className="hover:text-slate-900">
                  Home
                </a>

                <a href="/auth" className="hover:text-slate-900">
                  Login
                </a>

                <a href="/privacy" className="hover:text-slate-900">
                  Privacy
                </a>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}