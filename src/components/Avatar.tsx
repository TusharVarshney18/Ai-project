import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import type { Emotion } from "@/services/llmService";
import { getBunny } from "@/lib/bunnies";

type Props = {
  isSpeaking: boolean;
  isThinking?: boolean;
  emotion?: Emotion;
  mouthLevel?: number;
  bunny?: string;
};

/* ───────────────────────────────────────────────────────────── */
/* 🧱 STATIC LAYER (never re-renders) */
/* ───────────────────────────────────────────────────────────── */

const StaticLayer = memo(function StaticLayer({ b }: any) {
  const fid = `fur-${b.id}`;
  const eid = `ear-${b.id}`;

  return (
    <>
      <defs>
        <radialGradient id={fid} cx="40%" cy="35%">
          <stop offset="0%" stopColor="#fff6f3" />
          <stop offset="100%" stopColor="#f2cfc6" />
        </radialGradient>

        <radialGradient id={eid}>
          <stop offset="0%" stopColor="#ffdfe6" />
          <stop offset="100%" stopColor="#ffc4d2" />
        </radialGradient>
      </defs>

      {/* Ears */}
      <ellipse cx="85" cy="55" rx="22" ry="55" fill={`url(#${fid})`} />
      <ellipse cx="175" cy="55" rx="22" ry="55" fill={`url(#${fid})`} />

      <ellipse cx="85" cy="60" rx="11" ry="40" fill={`url(#${eid})`} />
      <ellipse cx="175" cy="60" rx="11" ry="40" fill={`url(#${eid})`} />

      {/* Head */}
      <ellipse cx="130" cy="180" rx="92" ry="86" fill={`url(#${fid})`} />
    </>
  );
});

/* ───────────────────────────────────────────────────────────── */
/* 👁 FACE LAYER (animated only) */
/* ───────────────────────────────────────────────────────────── */

const FaceLayer = memo(function FaceLayer({
  isSpeaking,
  emotion,
  mouthLevel,
}: {
  isSpeaking: boolean;
  emotion: Emotion;
  mouthLevel: number;
}) {
  const mouthOpen = isSpeaking ? Math.round(mouthLevel * 10) / 10 : 0;

  const eyeY = 170;
  const left = 108;
  const right = 152;

  return (
    <>
      {/* Eyes */}
      {[left, right].map((cx) => (
        <motion.g
          key={cx}
          style={{ transformOrigin: `${cx}px ${eyeY}px` }}
          animate={{ scaleY: [1, 0.15, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <ellipse cx={cx} cy={eyeY} rx={13} ry={12} fill="#1f1f1f" />

          {/* iris */}
          <ellipse cx={cx} cy={eyeY} rx={8} ry={9} fill="url(#eyeGrad)" />

          {/* highlights */}
          <circle cx={cx + 3} cy={eyeY - 5} r={4.5} fill="white" />
          <circle cx={cx - 1} cy={eyeY + 5} r={2} fill="white" />
        </motion.g>
      ))}

      {/* Nose */}
      <ellipse cx="130" cy="205" rx="6" ry="4" fill="#e6a5a5" />

      {/* Mouth */}
      <motion.ellipse
        cx="130"
        cy={240}
        rx="12"
        animate={{ ry: 2 + mouthOpen * 14 }}
        transition={{ duration: 0.12 }}
        fill="#7a4e4e"
      />
    </>
  );
});

/* ───────────────────────────────────────────────────────────── */
/* ✨ EFFECTS LAYER */
/* ───────────────────────────────────────────────────────────── */

const EffectsLayer = memo(function EffectsLayer({
  isSpeaking,
}: {
  isSpeaking: boolean;
}) {
  return (
    <>
      {/* blush */}
      {[68, 192].map((cx) => (
        <motion.circle
          key={cx}
          cx={cx}
          cy="200"
          r="20"
          fill="#ff9bb3"
          animate={
            isSpeaking
              ? { scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }
              : { opacity: 0.6 }
          }
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      ))}
    </>
  );
});

/* ───────────────────────────────────────────────────────────── */
/* 🐰 MAIN AVATAR */
/* ───────────────────────────────────────────────────────────── */

export function Avatar({
  isSpeaking,
  isThinking,
  emotion = "neutral",
  mouthLevel = 0,
  bunny,
}: Props) {
  const b = useMemo(() => getBunny(bunny), [bunny]);

  return (
    <div className="relative flex items-center justify-center">
      {/* glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${b.glow}, transparent 75%)`,
        }}
        animate={
          isSpeaking || isThinking
            ? { scale: [1, 1.05, 1] }
            : { scale: 1 }
        }
        transition={{ duration: 1 }}
      />

      <motion.div
        animate={isSpeaking ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <svg width="260" height="300" viewBox="0 0 260 300">
          <defs>
            <radialGradient id="eyeGrad">
              <stop offset="0%" stopColor="#ffb3c1" />
              <stop offset="100%" stopColor="#ff6b9a" />
            </radialGradient>
          </defs>

          <StaticLayer b={b} />
          <EffectsLayer isSpeaking={isSpeaking} />
          <FaceLayer
            isSpeaking={isSpeaking}
            emotion={emotion}
            mouthLevel={mouthLevel}
          />
        </svg>
      </motion.div>
    </div>
  );
}