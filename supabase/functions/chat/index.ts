import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ✅ Stronger system prompt (forces behavior)
const SYSTEM_PROMPT = `
You are Mochi, a cheerful bunny AI assistant.

RULES:
- Always respond in 1–2 short sentences
- Be warm, playful, friendly
- Match emotion with tone

Emotion mapping:
happy → greetings, friendly, positive
curious → questions, interest
sad → hurt, negative tone
surprised → excitement, wow moments
neutral → normal responses

Return ONLY valid JSON like:
{
  "reply": "your message",
  "emotion": "happy"
}
`;

const MAX_MESSAGES = 10;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    if (!body || !Array.isArray(body.messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid messages format" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const safeMessages = body.messages.slice(-MAX_MESSAGES);

    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY not configured");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...safeMessages,
          ],
        }),
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq error:", err);

      return new Response(
        JSON.stringify({ error: "AI request failed" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content?.trim();

    let reply = "";
    let emotion: "happy" | "curious" | "surprised" | "sad" | "neutral" =
      "neutral";

    // ✅ 1. Try parsing JSON response
    try {
      const parsed = JSON.parse(raw);
      reply = parsed.reply || "";
      emotion = parsed.emotion || "neutral";
    } catch {
      // ❗ Model didn't follow JSON → fallback
      reply = raw || "Sorry, I couldn't respond.";

      const text = reply.toLowerCase();

      if (
        text.includes("sorry") ||
        text.includes("hurt") ||
        text.includes("bad")
      ) {
        emotion = "sad";
      } else if (
        text.includes("wow") ||
        text.includes("amazing") ||
        text.includes("incredible")
      ) {
        emotion = "surprised";
      } else if (text.includes("?")) {
        emotion = "curious";
      } else if (
        text.includes("hi") ||
        text.includes("hello") ||
        text.includes("great") ||
        text.includes("nice")
      ) {
        emotion = "happy";
      } else {
        emotion = "neutral";
      }
    }

    // ✅ Final validation
    const valid = ["happy", "curious", "surprised", "sad", "neutral"];
    if (!valid.includes(emotion)) emotion = "neutral";

    return new Response(
      JSON.stringify({ reply, emotion }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Function crash:", err);

    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Unknown error",
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});