import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

/**
 * Client-side function to delete the current user's account.
 * Calls Supabase admin API via service role for account deletion.
 */
export const deleteCurrentUser = async () => {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.access_token) {
    throw new Error("Not signed in");
  }

  const token = session.session.access_token;

  // Call Supabase Edge Function for account deletion
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-account`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to delete account");
  }

  return { success: true };
};

// Hidden no-op route — file exists only to host the client function
export const Route = createFileRoute("/api/delete-account")({
  component: () => null,
});
