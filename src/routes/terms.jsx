import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { StarField } from "@/components/StarField";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  const blockCopy = (e) => e.preventDefault();

  return (
    <main
      className="relative flex min-h-screen items-center justify-center px-4 py-10"
      onCopy={blockCopy}
      onCut={blockCopy}
      onContextMenu={blockCopy}
    >
      <StarField />
      <Card className="w-full max-w-3xl p-8 glass">
        <h1 className="text-3xl mb-6 font-semibold text-white">Terms of Service</h1>

        <p className="text-gray-300 mb-4">Use this app responsibly. Do not misuse the service.</p>

        <p className="text-gray-400 mb-4">This service is provided as-is without guarantees.</p>

        <h2 className="text-xl mt-6 mb-2 font-semibold text-white">Intellectual Property</h2>
        <p className="text-gray-300 mb-4">
          All designs, code, graphics, text, and features are owned by Tushar Studio and protected
          by copyright. You may not copy, replicate, resell, redistribute, or create derivative
          products from this application without written permission.
        </p>

        <h2 className="text-xl mt-6 mb-2 font-semibold text-white">Restrictions</h2>
        <p className="text-gray-300 mb-4">
          Unauthorized copying, reverse engineering, scraping, automated extraction, or cloning of
          this project is strictly prohibited.
        </p>

        <p className="text-gray-500 mt-10 text-sm">
          © {new Date().getFullYear()} Tushar Studio. All rights reserved.
        </p>
      </Card>
    </main>
  );
}
