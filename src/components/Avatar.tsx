import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import type { Emotion } from "@/services/llmService";
import { getBunny, type BunnyConfig } from "@/lib/bunnies";

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

const StaticLayer = memo(function StaticLayer({ b }: { b: BunnyConfig }) {
  const fid = `fur-${b.id}`;
  const eid = `ear-${b.id}`;
  const muzzleId = `muzzle-${b.id}`;

  return (
    <>
      <defs>
        <radialGradient id={fid} cx="40%" cy="35%">
          <stop offset="0%" stopColor={b.furLight} />
          <stop offset="100%" stopColor={b.furDark} />
        </radialGradient>

        <radialGradient id={eid}>
          <stop offset="0%" stopColor={b.innerEarStart} />
          <stop offset="100%" stopColor={b.innerEarEnd} />
        </radialGradient>
        <radialGradient id={muzzleId} cx="50%" cy="45%">
          <stop offset="0%" stopColor={b.furLight} />
          <stop offset="100%" stopColor={b.furDark} />
        </radialGradient>
      </defs>

      {/* Ears (slightly tilted for lively look) */}
      <g transform="rotate(-56 86 102)">
        <ellipse cx="86" cy="102" rx="22" ry="58" fill={`url(#${fid})`} stroke={b.furStroke} strokeWidth="2" />
        <ellipse cx="86" cy="108" rx="9" ry="37" fill={`url(#${eid})`} opacity="0.88" />
      </g>
      <g transform="rotate(56 174 102)">
        <ellipse cx="174" cy="102" rx="22" ry="58" fill={`url(#${fid})`} stroke={b.furStroke} strokeWidth="2" />
        <ellipse cx="174" cy="108" rx="9" ry="37" fill={`url(#${eid})`} opacity="0.88" />
      </g>

      {/* Head + chubby cheeks */}
      <ellipse cx="130" cy="176" rx="94" ry="88" fill={`url(#${fid})`} stroke={b.furStroke} strokeWidth="2.4" />
      <ellipse cx="84" cy="194" rx="22" ry="24" fill={b.furLight} opacity="0.44" />
      <ellipse cx="176" cy="194" rx="22" ry="24" fill={b.furLight} opacity="0.44" />
      <ellipse cx="130" cy="216" rx="50" ry="32" fill={`url(#${muzzleId})`} opacity="0.62" />

      {/* Tiny plush body + paws (for fluffy look) */}
      <ellipse cx="130" cy="270" rx="52" ry="34" fill={`url(#${fid})`} stroke={b.furStroke} strokeOpacity="0.4" />
      <ellipse cx="104" cy="252" rx="13" ry="11" fill={b.furLight} opacity="0.95" />
      <ellipse cx="156" cy="252" rx="13" ry="11" fill={b.furLight} opacity="0.95" />
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
  b,
}: {
  isSpeaking: boolean;
  emotion: Emotion;
  mouthLevel: number;
  b: BunnyConfig;
}) {
  const mouthOpen = isSpeaking ? Math.round(mouthLevel * 10) / 10 : 0;
  const eyeY = 172;
  const left = 96;
  const right = 164;
  const isSad = emotion === "sad";
  const isHappy = emotion === "happy";
  const isSurprised = emotion === "surprised";
  const isCurious = emotion === "curious";

  const mouthPath = isSad
    ? "M 114 244 Q 130 232 146 244"
    : isSurprised
      ? "M 118 234 Q 130 248 142 234"
      : "M 114 231 Q 130 246 146 231";
  const speakingMouthPath = isSad
    ? "M 112 245 Q 130 230 148 245"
    : isSurprised
      ? "M 116 235 Q 130 252 144 235"
      : "M 112 232 Q 130 250 148 232";

  return (
    <>
      {/* Brows / expression lines */}
      <g stroke={b.mouthColor} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.82">
        <path d={isSad ? "M 82 153 Q 94 147 106 154" : isCurious ? "M 84 154 Q 96 146 108 151" : "M 84 153 Q 96 146 108 152"} />
        <path d={isSad ? "M 154 154 Q 166 147 178 153" : isCurious ? "M 152 151 Q 164 146 176 154" : "M 152 152 Q 164 146 176 153"} />
      </g>

      {/* Eyes */}
      {[left, right].map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy={eyeY} rx={18.5} ry={16.8} fill="white" opacity="0.99" />
          <ellipse cx={cx} cy={eyeY} rx={18.5} ry={16.8} fill="none" stroke={b.furStroke} strokeOpacity="0.24" />
          <ellipse cx={cx} cy={eyeY - 8} rx={17} ry={6.8} fill={b.furLight} opacity="0.55" />
          <ellipse cx={cx} cy={eyeY + 8.4} rx={15} ry={4.2} fill="oklch(1 0 0 / 0.18)" />

          {/* iris */}
          <ellipse cx={cx} cy={eyeY + 2.5} rx={9.4} ry={10.8} fill={`url(#eye-${b.id})`} />
          <ellipse cx={cx} cy={eyeY + 3.5} rx={4.3} ry={5.3} fill={b.eyeColor} />
          <ellipse cx={cx} cy={eyeY + 7.2} rx={8.2} ry={3.1} fill="oklch(1 0 0 / 0.1)" />

          {/* highlights */}
          <circle cx={cx + 3.1} cy={eyeY - 4.8} r={3} fill="white" />
          <circle cx={cx - 2.5} cy={eyeY + 3.8} r={1.4} fill="white" />
          <circle cx={cx + 0.5} cy={eyeY - 0.6} r={0.8} fill="oklch(1 0 0 / 0.65)" />

          {/* lashes */}
          <path d={`M ${cx - 14} ${eyeY - 11} Q ${cx} ${eyeY - 18} ${cx + 14} ${eyeY - 11}`} fill="none" stroke={b.mouthColor} strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
        </g>
      ))}
      {[left, right].map((cx) => (
        <motion.ellipse
          key={`lid-${cx}`}
          cx={cx}
          cy={eyeY}
          rx="18"
          fill={b.furLight}
          animate={{ ry: isSurprised ? 0 : [0, 0, 0, 13.5, 0, 0] }}
          transition={{ duration: 9, repeat: Infinity, times: [0, 0.6, 0.64, 0.66, 0.7, 1], ease: "easeInOut" }}
        />
      ))}

      {/* Tears when sad */}
      {isSad &&
        [left, right].map((cx) => (
          <motion.path
            key={`tear-${cx}`}
            d={`M ${cx + 8} ${eyeY + 13} Q ${cx + 12.8} ${eyeY + 21} ${cx + 8} ${eyeY + 30} Q ${cx + 3.2} ${eyeY + 21} ${cx + 8} ${eyeY + 13} Z`}
            fill="oklch(0.8 0.08 230 / 0.8)"
            animate={{ y: [0, 2.2, 0], opacity: [0.55, 0.95, 0.55] }}
            transition={{ duration: 1.35, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      {isSad &&
        [left, right].map((cx) => (
          <motion.circle
            key={`tear-shine-${cx}`}
            cx={cx + 9.5}
            cy={eyeY + 19}
            r="1.3"
            fill="white"
            animate={{ y: [0, 2.2, 0], opacity: [0.35, 0.75, 0.35] }}
            transition={{ duration: 1.35, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

      {/* Nose */}
      <path d="M 124 209 Q 130 216 136 209 Q 130 205 124 209 Z" fill={b.noseColor} />

      {/* Whiskers */}
      <g stroke={b.whiskerColor} strokeWidth="1.8" strokeLinecap="round" opacity="0.75">
        <line x1="95" y1="220" x2="64" y2="216" />
        <line x1="95" y1="229" x2="64" y2="230" />
        <line x1="165" y1="220" x2="196" y2="216" />
        <line x1="165" y1="229" x2="196" y2="230" />
      </g>

      {/* Mouth */}
      <motion.path
        d={mouthPath}
        fill="none"
        stroke={isHappy ? b.accessoryColor : b.mouthColor}
        strokeWidth="2.8"
        strokeLinecap="round"
        animate={{ d: isSpeaking ? speakingMouthPath : mouthPath }}
        transition={{ duration: 0.12 }}
      />
      {(isSpeaking || isSurprised) && (
        <motion.ellipse
          cx="130"
          cy="239"
          rx={isSurprised ? 9 : 8}
          animate={{ ry: isSurprised ? 5 + mouthOpen * 5 : 2 + mouthOpen * 6 }}
          transition={{ duration: 0.12 }}
          fill={b.mouthColor}
          opacity="0.85"
        />
      )}
    </>
  );
});

/* ───────────────────────────────────────────────────────────── */
/* ✨ EFFECTS LAYER */
/* ───────────────────────────────────────────────────────────── */

const EffectsLayer = memo(function EffectsLayer({
  isSpeaking,
  b,
}: {
  isSpeaking: boolean;
  b: BunnyConfig;
}) {
  return (
    <>
      {/* blush */}
      {[74, 186].map((cx) => (
        <motion.circle
          key={cx}
          cx={cx}
          cy="211"
          r="18"
          fill={b.cheekColor}
          animate={
            isSpeaking
              ? { scale: [1, 1.1, 1], opacity: [0.46, 0.75, 0.46] }
              : { opacity: 0.54 }
          }
          transition={{ duration: 1.1, repeat: Infinity }}
        />
      ))}
    </>
  );
});

const StyleLayer = memo(function StyleLayer({ b }: { b: BunnyConfig }) {
  const showGlasses = b.id === "cocoa" || b.id === "boba" || b.accessory === "headband";
  const showLipstick = b.id === "midnight" || b.id === "peaches" || b.id === "sakura";

  return (
    <>
      {showGlasses && (
        <g opacity="0.95">
          <ellipse cx="99" cy="173" rx="20" ry="15" fill="none" stroke={b.accessoryColor} strokeWidth="3" />
          <ellipse cx="161" cy="173" rx="20" ry="15" fill="none" stroke={b.accessoryColor} strokeWidth="3" />
          <line x1="119" y1="173" x2="141" y2="173" stroke={b.accessoryColorAlt} strokeWidth="2.8" strokeLinecap="round" />
          <line x1="79" y1="171" x2="68" y2="168" stroke={b.accessoryColorAlt} strokeWidth="2" strokeLinecap="round" opacity="0.75" />
          <line x1="181" y1="171" x2="192" y2="168" stroke={b.accessoryColorAlt} strokeWidth="2" strokeLinecap="round" opacity="0.75" />
        </g>
      )}

      {showLipstick && (
        <g>
          <ellipse cx="130" cy="234" rx="18" ry="7" fill={b.accessoryColor} opacity="0.22" />
          <path d="M 114 231 Q 130 241 146 231" fill="none" stroke={b.accessoryColor} strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="145" cy="229" r="1.8" fill="white" opacity="0.65" />
        </g>
      )}
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
            <radialGradient id={`eye-${b.id}`}>
              <stop offset="0%" stopColor={b.eyeIrisColor} />
              <stop offset="100%" stopColor={b.accent} />
            </radialGradient>
          </defs>

          <StaticLayer b={b} />
          <EffectsLayer isSpeaking={isSpeaking} b={b} />
          {/* top accessory marker */}
          {b.accessory !== "none" && (
            <g>
              <circle cx="130" cy="114" r="10" fill={b.accessoryColor} opacity="0.9" />
              <circle cx="118" cy="116" r="7" fill={b.accessoryColorAlt} opacity="0.9" />
              <circle cx="142" cy="116" r="7" fill={b.accessoryColorAlt} opacity="0.9" />
            </g>
          )}
          <FaceLayer
            isSpeaking={isSpeaking}
            emotion={emotion}
            mouthLevel={mouthLevel}
            b={b}
          />
          <StyleLayer b={b} />
        </svg>
      </motion.div>
    </div>
  );
}