import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }

    const token = authHeader.replace("Bearer ", "");

    const url = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!url || !serviceKey) {
      return new Response("Server not configured", { status: 500, headers: corsHeaders });
    }

    const admin = createClient(url, serviceKey);
    const { data: userData, error: userErr } = await admin.auth.getUser(token);

    if (userErr || !userData.user) {
      return new Response("Invalid session", { status: 401, headers: corsHeaders });
    }

    const userId = userData.user.id;

    // Delete profile data first
    await admin.from("profiles").delete().eq("user_id", userId);

    // Delete the user account
    const { error: delErr } = await admin.auth.admin.deleteUser(userId);
    if (delErr) {
      return new Response(delErr.message, { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return new Response("Internal server error", { status: 500, headers: corsHeaders });
  }
});
