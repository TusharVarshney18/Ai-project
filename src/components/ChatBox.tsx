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
  // FIX 5: optional ref so parent can blur input (swipe-to-dismiss)
  inputRef?: React.RefObject<HTMLInputElement>;
};

// FIX 2: haptic feedback — 10ms buzz on Android, silent on iOS
function haptic() {
  try { navigator.vibrate?.(10); } catch {}
}

export function ChatBox({ messages, state, onSend, onStop, inputRef }: Props) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const activeInputRef = inputRef ?? internalInputRef;
  const { start, stop, listening, supported } = useSpeechRecognition();

  // Scroll anchor: wait one tick for DOM to paint, then scroll
  useEffect(() => {
    const t = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 0);
    return () => clearTimeout(t);
  }, [messages, state]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || state === "thinking") return;
    haptic(); // FIX 2
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
    <div className="glass flex w-full h-full min-h-0 flex-col overflow-hidden rounded-2xl shadow-[var(--shadow-elegant)] md:h-[460px]">

      {/* Messages scroll area */}
      <div className="flex-1 overflow-y-auto p-5 min-h-0">
        <div className="flex flex-col gap-3">
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

          {/* Scroll anchor */}
          <div ref={bottomRef} className="h-px w-full shrink-0" />
        </div>
      </div>

      {/* Input bar
          FIX 1: safe-area-inset-bottom so it clears the iPhone home indicator
          FIX 3: font-size 16px on input prevents iOS auto-zoom */}
      <form
        onSubmit={submit}
        className="flex shrink-0 items-center gap-2 border-t border-border p-3"
        style={{ paddingBottom: "max(12px, calc(12px + env(safe-area-inset-bottom)))" }}
      >
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

        {/* FIX 3: font-size explicitly 16px — prevents iOS zooming in when tapped */}
        <input
          ref={activeInputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={state === "thinking" ? "Mochi is thinking..." : "Type a message..."}
          disabled={state === "thinking"}
          style={{ fontSize: 16 }}
          className="flex-1 rounded-full bg-input px-4 py-2.5 outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring disabled:opacity-60"
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
            onClick={haptic}
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