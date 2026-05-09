import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { StarField } from "@/components/StarField";

export const Route = createFileRoute("/privacy")({
  component: Privacy,
});

function Privacy() {
  const blockCopy = (e: any) => e.preventDefault();

  return (
    <main
      className="relative flex min-h-screen items-center justify-center px-4 py-10 bg-background text-foreground"
      onCopy={blockCopy}
      onCut={blockCopy}
      onContextMenu={blockCopy}
    >
      <StarField />

      <Card className="w-full max-w-3xl p-8 glass shadow-[var(--shadow-elegant)]">
        <h1 className="text-3xl font-semibold mb-6 text-gradient">Privacy Policy</h1>

        <p className="mb-4 text-muted-foreground">
          Mochi AI respects your privacy and uses personal data only to enable authentication and
          app functionality.
        </p>

        <h2 className="text-xl mt-6 mb-2 text-foreground">Information We Collect</h2>
        <p className="mb-4 text-muted-foreground">
          We may collect your email address when you sign in with Google authentication to create
          and manage your account.
        </p>

        <h2 className="text-xl mt-6 mb-2 text-foreground">How We Use Information</h2>
        <p className="mb-4 text-muted-foreground">
          Your data is used only to authenticate you and improve your experience. We do not sell or
          share your personal information.
        </p>

        <h2 className="text-xl mt-6 mb-2 text-foreground">AI Conversations</h2>
        <p className="mb-4 text-muted-foreground">
          Chat messages are processed to generate responses but are not stored permanently by the
          application.
        </p>

        <h2 className="text-xl mt-6 mb-2 text-foreground">Security</h2>
        <p className="mb-4 text-muted-foreground">
          We use Supabase authentication and modern security practices to protect your account.
        </p>

        <h2 className="text-xl mt-6 mb-2 text-foreground">Contact</h2>
        <p className="text-muted-foreground">
          For questions, contact{" "}
          <span className="font-medium text-foreground">Tusharvarshney1810@gmail.com</span>
        </p>

        <h2 className="text-xl mt-6 mb-2 text-foreground">Copyright & Intellectual Property</h2>
        <p className="mb-4 text-muted-foreground">
          All content, branding, UI design, assets, and source code in this project are protected
          under copyright law. Reproduction, cloning, redistribution, scraping, or commercial reuse
          without written permission is prohibited.
        </p>

        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-medium text-foreground">
            Unauthorized copying of this product or its content is not allowed.
          </p>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Tushar Studio. All rights reserved.
        </p>
      </Card>
    </main>
  );
}
