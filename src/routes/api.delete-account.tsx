import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

/**
 * Server function to fully delete the current user's account.
 * Requires the caller's bearer token; uses service role to call admin API.
 */
export const deleteCurrentUser = createServerFn({ method: "POST" })
  .handler(async () => {
    const { getRequest } = await import("@tanstack/react-start/server");
    const req = getRequest();
    const auth = req.headers.get("authorization") || req.headers.get("Authorization");
    if (!auth || !auth.toLowerCase().startsWith("bearer ")) {
      throw new Error("Missing auth token");
    }
    const token = auth.slice(7);

    const url = process.env.SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    if (!url || !serviceKey) throw new Error("Server not configured");

    const admin = createClient(url, serviceKey);
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData.user) throw new Error("Invalid session");

    const userId = userData.user.id;
    // profiles row will cascade-delete via FK if configured; delete explicitly to be safe.
    await admin.from("profiles").delete().eq("user_id", userId);

    const { error: delErr } = await admin.auth.admin.deleteUser(userId);
    if (delErr) throw new Error(delErr.message);

    return { success: true };
  });

// Hidden no-op route — file exists only to host the server function
export const Route = createFileRoute("/api/delete-account")({
  server: {
    handlers: {
      GET: async () => new Response("Not allowed", { status: 405 }),
    },
  },
});
