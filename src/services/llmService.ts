import { supabase } from "@/integrations/supabase/client";

export type ChatMessage = { role: "user" | "assistant"; content: string };
export type Emotion = "happy" | "curious" | "surprised" | "sad" | "neutral";
export type ChatReply = { reply: string; emotion: Emotion };

/**
 * Modular LLM service. Currently uses Lovable AI Gateway via the `chat` edge function.
 * To swap providers (OpenAI, Ollama, etc.), replace the implementation here — the
 * public `sendChat` signature stays the same.
 */
export async function sendChat(messages: ChatMessage[]): Promise<ChatReply> {
  const { data, error } = await supabase.functions.invoke("chat", {
    body: { messages },
  });
  if (error) throw new Error(error.message || "Failed to reach AI");
  if (data?.error) throw new Error(data.error);
  return {
    reply: (data?.reply as string) ?? "",
    emotion: (data?.emotion as Emotion) ?? "neutral",
  };
}
