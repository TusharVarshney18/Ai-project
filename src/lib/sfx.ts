// Tiny WebAudio sound-effects engine — no asset files, generated on the fly.
// Each effect returns void; safe to no-op on the server.

let ctx: AudioContext | null = null;
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  return ctx;
}

function tone(
  freq: number,
  dur: number,
  type: OscillatorType = "sine",
  gain = 0.15,
  attack = 0.005,
) {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume();
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, c.currentTime);
  g.gain.setValueAtTime(0, c.currentTime);
  g.gain.linearRampToValueAtTime(gain, c.currentTime + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.connect(g).connect(c.destination);
  o.start();
  o.stop(c.currentTime + dur);
  return o;
}

/** Soft "boop" used when sending a message. */
export function playBoop() {
  const c = getCtx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(620, c.currentTime);
  o.frequency.exponentialRampToValueAtTime(880, c.currentTime + 0.08);
  g.gain.setValueAtTime(0, c.currentTime);
  g.gain.linearRampToValueAtTime(0.18, c.currentTime + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.18);
  o.connect(g).connect(c.destination);
  if (c.state === "suspended") c.resume();
  o.start();
  o.stop(c.currentTime + 0.2);
}

/** Cute "hop" — two quick rising chirps. */
export function playHop() {
  tone(440, 0.09, "sine", 0.12);
  setTimeout(() => tone(660, 0.11, "sine", 0.13), 70);
}

/** Click for UI elements. */
export function playClick() {
  tone(900, 0.04, "triangle", 0.08);
}
