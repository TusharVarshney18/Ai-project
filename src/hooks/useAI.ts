import { useCallback, useState } from "react";
import { sendChat, type ChatMessage, type Emotion } from "@/services/llmService";

export type AIState = "idle" | "thinking" | "speaking";

const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content: "Hi, I'm Mochi the bunny! Ask me anything and I'll hop to it. 🐰",
};

export function useAI() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [state, setState] = useState<AIState>("idle");
  const [emotion, setEmotion] = useState<Emotion>("happy");
  const [error, setError] = useState<string | null>(null);

const ask = useCallback(
  async (text: string): Promise<{ reply: string; emotion: Emotion } | null> => {
    const trimmed = text.trim();
    if (!trimmed) return null;

    setError(null);
    setState("thinking");
    setEmotion("curious");

    try {
      // ✅ build from current state (NOT inside setState)
      const nextMessages: ChatMessage[] = [
        ...messages,
        { role: "user", content: trimmed },
      ];

      // ✅ update UI immediately
      setMessages(nextMessages);

      // ✅ send correct full history
      const result = await sendChat(nextMessages);

      // ✅ append AI reply
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.reply },
      ]);

      setEmotion(result.emotion ?? "neutral");
      setState("idle");

      return result;

    } catch (e: any) {
      const msg = e?.message ?? "Something went wrong.";

      setError(msg);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `(${msg})` },
      ]);

      setEmotion("sad");
      setState("idle");

      return null;
    }
  },
  [messages] // ✅ IMPORTANT dependency
);

  const reset = useCallback(() => {
    setMessages([INITIAL_MESSAGE]);
    setState("idle");
    setEmotion("happy");
    setError(null);
  }, []);

  return { messages, state, setState, emotion, setEmotion, ask, error, reset };
}
