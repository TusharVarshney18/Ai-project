import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { StarField } from "@/components/StarField";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-10">
      <StarField />
      <Card className="w-full max-w-3xl p-8 glass">
        <h1 className="text-3xl mb-6 font-semibold text-white">Terms of Service</h1>

        <p className="text-gray-300 mb-4">
          Use this app responsibly. Do not misuse the service.
        </p>

        <p className="text-gray-400 mb-4">
          This service is provided as-is without guarantees.
        </p>

        <p className="text-gray-500 mt-10 text-sm">
          © {new Date().getFullYear()} Tushar Studio
        </p>
      </Card>
    </main>
  );
}
