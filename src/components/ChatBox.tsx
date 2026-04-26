import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Send, Square } from "lucide-react";
import type { ChatMessage } from "@/services/llmService";
import type { AIState } from "@/hooks/useAI";
import { useSpeechRecognition } from "@/hooks/useSpeech";

type Props = {
  messages: ChatMessage[];
  state: AIState;
  onSend: (text: string) => void;
  onStop: () => void;
};

export function ChatBox({ messages, state, onSend, onStop }: Props) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { start, stop, listening, supported } = useSpeechRecognition();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, state]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || state === "thinking") return;
    onSend(input);
    setInput("");
  };

  const toggleMic = () => {
    if (listening) {
      stop();
    } else {
      start((text) => {
        setInput(text);
        setTimeout(() => onSend(text), 100);
      });
    }
  };

  return (
    <div className="glass flex h-[460px] w-full flex-col overflow-hidden rounded-2xl shadow-[var(--shadow-elegant)]">
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-5">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-secondary text-secondary-foreground rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {state === "thinking" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="flex gap-1 rounded-2xl bg-secondary px-4 py-3">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <form onSubmit={submit} className="flex items-center gap-2 border-t border-border p-3">
        {supported && (
          <button
            type="button"
            onClick={toggleMic}
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition ${
              listening ? "bg-destructive text-destructive-foreground animate-pulse-glow" : "bg-secondary hover:bg-muted"
            }`}
            aria-label={listening ? "Stop listening" : "Start voice input"}
          >
            {listening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
        )}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={state === "thinking" ? "Mochi is thinking..." : "Type a message..."}
          disabled={state === "thinking"}
          className="flex-1 rounded-full bg-input px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring disabled:opacity-60"
        />
        {state === "speaking" ? (
          <button
            type="button"
            onClick={onStop}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-destructive text-destructive-foreground hover:opacity-90"
            aria-label="Stop speaking"
          >
            <Square size={16} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim() || state === "thinking"}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-primary-foreground transition disabled:opacity-50"
            style={{ background: "var(--gradient-primary)" }}
            aria-label="Send"
          >
            <Send size={18} />
          </button>
        )}
      </form>
    </div>
  );
}
