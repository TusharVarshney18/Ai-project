import { useCallback, useEffect, useRef, useState } from "react";

type Opts = { onStart?: () => void; onEnd?: () => void };

// Estimate mouth openness (0..1) from a chunk of text (a word/syllable)
// based on vowel content. Lightweight phoneme proxy for real lip-sync.
function estimateMouthLevel(chunk: string): number {
  if (!chunk) return 0;
  const s = chunk.toLowerCase();
  const wide = (s.match(/[aàáâäãåoòóôöõ]/g) || []).length;
  const mid = (s.match(/[eèéêëiìíîï]/g) || []).length;
  const closed = (s.match(/[uùúûüy]/g) || []).length;
  const consonants = (s.match(/[bcdfghjklmnpqrstvwxz]/g) || []).length;
  const score = wide * 1.0 + mid * 0.7 + closed * 0.55 + consonants * 0.12;
  const norm = Math.min(1, score / Math.max(2, s.length * 0.7));
  return Math.max(0.18, norm);
}

export function useSpeech({ onStart, onEnd }: Opts = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const [mouthLevel, setMouthLevel] = useState(0);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const decayRef = useRef<number | null>(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  // Smoothly decay mouth level between boundary events so the jaw closes naturally.
  useEffect(() => {
    if (!isSpeaking) return;
    let raf: number | null = null;
    const tick = () => {
      setMouthLevel((m) => (m > 0.02 ? m * 0.82 : 0));
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => {
      if (raf !== null) window.cancelAnimationFrame(raf);
    };
  }, [isSpeaking]);

  const speak = useCallback(
    (text: string) => {
      if (!text || typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.1;
      u.pitch = 1.85;
      u.volume = 1;
      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find((v) => /child|kid|junior/i.test(v.name) && v.lang.startsWith("en")) ||
        voices.find((v) =>
          /(samantha|karen|tessa|victoria|zira|google.*us.*english)/i.test(v.name),
        ) ||
        voices.find((v) => /female/i.test(v.name) && v.lang.startsWith("en")) ||
        voices.find((v) => v.lang.startsWith("en"));
      if (preferred) u.voice = preferred;

      u.onstart = () => {
        setIsSpeaking(true);
        setMouthLevel(0.4);
        onStart?.();
      };

      u.onerror = () => {
        setIsSpeaking(false);
        setMouthLevel(0);
        onEnd?.();
      };
      // Real lip-sync: SpeechSynthesis fires 'boundary' per word/syllable.
      // Map the actual spoken chunk's phoneme content to mouth openness.
      u.onboundary = (e: SpeechSynthesisEvent) => {
        const start = e.charIndex ?? 0;
        const len = (e as any).charLength ?? 0;
        const chunk = len > 0 ? text.slice(start, start + len) : text.slice(start, start + 6);
        const level = estimateMouthLevel(chunk);
        setMouthLevel(Math.min(1, level + (Math.random() - 0.5) * 0.08));
        if (decayRef.current !== null) window.clearTimeout(decayRef.current);
        decayRef.current = window.setTimeout(() => {
          setMouthLevel((m) => Math.min(m, 0.15));
        }, 140);
      };
      u.onend = () => {
        setIsSpeaking(false);
        setMouthLevel(0);
        if (decayRef.current !== null) window.clearTimeout(decayRef.current);
        onEnd?.();
      };
      utterRef.current = u;
      window.speechSynthesis.speak(u);
    },
    [onStart, onEnd],
  );

  const stop = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setMouthLevel(0);
    if (decayRef.current !== null) window.clearTimeout(decayRef.current);
  }, []);

  return { speak, stop, isSpeaking, supported, mouthLevel };
}

// Optional voice input
export function useSpeechRecognition() {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSupported(!!SR);
  }, []);

  const start = useCallback((onResult: (text: string) => void) => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      onResult(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  }, []);

  const stop = useCallback(() => {
    recRef.current?.stop();
    setListening(false);
  }, []);

  return { start, stop, listening, supported };
}
