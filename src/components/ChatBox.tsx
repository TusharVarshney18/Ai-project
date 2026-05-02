import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import { Mic, MicOff, Send, Square } from "lucide-react";
import type { ChatMessage } from "@/services/llmService";
import type { AIState } from "@/hooks/useAI";
import { useSpeechRecognition } from "@/hooks/useSpeech";

type Props = {
  messages: ChatMessage[];
  state: AIState;
  onSend: (text: string) => void;
  onStop: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
};

function haptic() {
  try { navigator.vibrate?.(10); } catch {}
}

export function ChatBox({ messages, state, onSend, onStop, inputRef }: Props) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const activeInputRef = inputRef ?? internalInputRef;

  const { start, stop, listening, supported } = useSpeechRecognition();

  /* ───────────── Smooth Scroll (optimized) ───────────── */
  useEffect(() => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, [messages.length]);

  /* ───────────── Memoized Messages ───────────── */
  const renderedMessages = useMemo(() => {
    return messages.map((m, i) => ({
      id: i,
      role: m.role,
      content: m.content,
    }));
  }, [messages]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || state === "thinking") return;

    haptic();
    onSend(input);
    setInput("");
  };

  const toggleMic = () => {
    if (listening) {
      stop();
    } else {
      start((text) => {
        setInput(text);
        setTimeout(() => onSend(text), 80);
      });
    }
  };

  /* ───────────── UI ───────────── */
  return (
    <div className="h-[100dvh] md:h-[600px] max-w-2xl mx-auto flex flex-col overflow-hidden rounded-3xl
      bg-gradient-to-br from-[#0b1220] via-[#0f172a] to-[#1e293b]
      border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.6)]">

      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
        <div>
          <p className="text-xs tracking-[0.3em] text-white/40 uppercase">Mochi AI</p>
          <h2 className="text-lg font-semibold text-white">Bunny Assistant</h2>
        </div>

        <div className="flex gap-2 text-xs text-white/70">
          <span className="px-3 py-1 rounded-full bg-white/10">{state}</span>
          <span className="px-3 py-1 rounded-full bg-white/10">{messages.length}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <AnimatePresence initial={false}>
          {renderedMessages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[78%] px-4 py-3 text-[15px] leading-relaxed rounded-2xl ${
                  m.role === "user"
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-sm"
                    : "bg-white/10 text-white border border-white/10 rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Thinking */}
        {state === "thinking" && (
          <div className="flex">
            <div className="flex gap-2 rounded-2xl bg-white/10 px-4 py-3 border border-white/10">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-2 w-2 bg-white rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={submit}
        className="flex items-center gap-3 border-t border-white/10 bg-black/30 px-3 py-3 backdrop-blur-xl"
      >
        {supported && (
          <button
            type="button"
            onClick={toggleMic}
            className={`h-11 w-11 flex items-center justify-center rounded-full transition ${
              listening
                ? "bg-red-500 text-white animate-pulse"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {listening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
        )}

        <input
          ref={activeInputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message Mochi..."
          disabled={state === "thinking"}
          className="flex-1 rounded-full bg-white/10 px-5 py-3 text-[15px] text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {state === "speaking" ? (
          <button
            type="button"
            onClick={onStop}
            className="h-11 w-11 flex items-center justify-center rounded-full bg-red-500 text-white"
          >
            <Square size={16} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim() || state === "thinking"}
            onClick={haptic}
            className="h-11 w-11 flex items-center justify-center rounded-full
              bg-gradient-to-br from-indigo-500 to-purple-600 text-white
              transition hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        )}
      </form>
    </div>
  );
}