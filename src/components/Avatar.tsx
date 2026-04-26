import { motion } from "framer-motion";
import type { Emotion } from "@/services/llmService";
import { getBunny } from "@/lib/bunnies";

type Props = {
  isSpeaking: boolean;
  isThinking?: boolean;
  emotion?: Emotion;
  /** Real-time mouth openness 0..1 */
  mouthLevel?: number;
  /** Selected bunny character (defaults to mochi) */
  bunny?: string;
};

// ─── Accessory renderers ──────────────────────────────────────────────────────

function AccessoryBow({ color, colorAlt }: { color: string; colorAlt: string }) {
  return (
    <g>
      <ellipse cx="130" cy="28" rx="30" ry="16" fill={color} opacity="0.9" />
      <ellipse cx="100" cy="24" rx="20" ry="12" fill={color} transform="rotate(-18,100,24)" />
      <ellipse cx="160" cy="24" rx="20" ry="12" fill={color} transform="rotate(18,160,24)" />
      <circle cx="130" cy="28" r="10" fill={colorAlt} />
    </g>
  );
}

function AccessoryStarCrown({ color, colorAlt }: { color: string; colorAlt: string }) {
  return (
    <g>
      {/* centre star */}
      <polygon points="130,8 134,20 146,20 136,28 140,40 130,32 120,40 124,28 114,20 126,20" fill={color} />
      {/* side mini stars */}
      <polygon points="92,16 94,24 102,24 96,28 98,36 92,30 86,36 88,28 82,24 90,24" fill={colorAlt} opacity="0.75" />
      <polygon points="168,16 170,24 178,24 172,28 174,36 168,30 162,36 164,28 158,24 166,24" fill={colorAlt} opacity="0.75" />
    </g>
  );
}

function AccessoryHeadband({ color, colorAlt }: { color: string; colorAlt: string }) {
  return (
    <g>
      <rect x="50" y="132" width="160" height="22" rx="11" fill={color} opacity="0.85" />
      <circle cx="130" cy="143" r="16" fill={colorAlt} />
      <circle cx="130" cy="143" r="9" fill={color} />
    </g>
  );
}

function AccessoryMoon({ color, colorAlt }: { color: string; colorAlt: string }) {
  return (
    <g>
      {/* crescent shape: big circle minus offset circle */}
      <path d="M108,18 Q130,6 152,18 Q142,34 108,18Z" fill={color} />
      <circle cx="148" cy="20" r="11" fill={colorAlt} />
      {/* small stars */}
      <text x="88" y="52" fontSize="14" fill={color} opacity="0.7">★</text>
      <text x="162" y="48" fontSize="10" fill={color} opacity="0.6">★</text>
    </g>
  );
}

function AccessoryLeafClip({ color, colorAlt }: { color: string; colorAlt: string }) {
  return (
    <g>
      <ellipse cx="164" cy="136" rx="24" ry="11" fill={color} transform="rotate(-30,164,136)" />
      <ellipse cx="185" cy="122" rx="20" ry="9" fill={colorAlt} transform="rotate(-15,185,122)" />
      <circle cx="162" cy="142" r="6" fill={color} opacity="0.8" />
    </g>
  );
}

function AccessorySakura({ color, colorAlt }: { color: string; colorAlt: string }) {
  return (
    <g>
      {/* petal cluster left */}
      <ellipse cx="72" cy="142" rx="20" ry="12" fill={color} transform="rotate(-40,72,142)" opacity="0.9" />
      <ellipse cx="52" cy="128" rx="18" ry="10" fill={colorAlt} transform="rotate(-60,52,128)" opacity="0.8" />
      <ellipse cx="62" cy="112" rx="15" ry="9" fill={color} transform="rotate(-80,62,112)" opacity="0.7" />
      {/* falling petals */}
      <ellipse cx="212" cy="100" rx="12" ry="7" fill={color} transform="rotate(20,212,100)" opacity="0.5" />
      <ellipse cx="36" cy="248" rx="10" ry="6" fill={colorAlt} transform="rotate(-30,36,248)" opacity="0.45" />
    </g>
  );
}

function AccessoryCloudHat({ color, colorAlt }: { color: string; colorAlt: string }) {
  return (
    <g>
      {/* cloud puffs */}
      <ellipse cx="100" cy="124" rx="34" ry="24" fill={color} opacity="0.9" />
      <ellipse cx="130" cy="114" rx="38" ry="26" fill={color} opacity="0.95" />
      <ellipse cx="160" cy="124" rx="34" ry="24" fill={color} opacity="0.9" />
      <ellipse cx="130" cy="134" rx="52" ry="18" fill={color} opacity="0.85" />
      {/* tiny rainbow */}
      <path d="M88,138 Q130,110 172,138" stroke="#FFB0C8" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M94,144 Q130,118 166,144" stroke="#FFD080" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M100,150 Q130,126 160,150" stroke={colorAlt} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.5" />
    </g>
  );
}

function AccessoryPolkaBow({ color, colorAlt }: { color: string; colorAlt: string }) {
  return (
    <g>
      <ellipse cx="130" cy="28" rx="32" ry="18" fill={color} opacity="0.9" />
      <ellipse cx="98" cy="24" rx="22" ry="14" fill={colorAlt} transform="rotate(-18,98,24)" />
      <ellipse cx="162" cy="24" rx="22" ry="14" fill={colorAlt} transform="rotate(18,162,24)" />
      <circle cx="130" cy="28" r="11" fill={color} opacity="0.95" />
      {/* polka dots */}
      <circle cx="114" cy="22" r="3" fill="white" opacity="0.6" />
      <circle cx="125" cy="36" r="2.5" fill="white" opacity="0.6" />
      <circle cx="147" cy="22" r="3" fill="white" opacity="0.6" />
    </g>
  );
}

function AccessoryFluffyTuft({ color, colorAlt }: { color: string; colorAlt: string }) {
  return (
    <g>
      {/* fluffy puffs */}
      <circle cx="110" cy="132" r="22" fill="oklch(0.99 0.003 300)" stroke="oklch(0.88 0.02 300)" strokeWidth="1" />
      <circle cx="130" cy="122" r="24" fill="oklch(0.99 0.003 300)" stroke="oklch(0.88 0.02 300)" strokeWidth="1" />
      <circle cx="150" cy="132" r="22" fill="oklch(0.99 0.003 300)" stroke="oklch(0.88 0.02 300)" strokeWidth="1" />
      <circle cx="96" cy="144" r="18" fill="oklch(0.99 0.003 300)" stroke="oklch(0.88 0.02 300)" strokeWidth="1" />
      <circle cx="164" cy="144" r="18" fill="oklch(0.99 0.003 300)" stroke="oklch(0.88 0.02 300)" strokeWidth="1" />
      {/* mini bow on tuft */}
      <ellipse cx="130" cy="114" rx="18" ry="9" fill={color} opacity="0.9" />
      <ellipse cx="112" cy="112" rx="12" ry="7" fill={colorAlt} transform="rotate(-15,112,112)" />
      <ellipse cx="148" cy="112" rx="12" ry="7" fill={colorAlt} transform="rotate(15,148,112)" />
      <circle cx="130" cy="114" r="6" fill={color} />
    </g>
  );
}

function AccessoryBerryCluster({ color, colorAlt }: { color: string; colorAlt: string }) {
  return (
    <g>
      <circle cx="110" cy="130" r="17" fill={color} />
      <circle cx="130" cy="118" r="19" fill={colorAlt} />
      <circle cx="150" cy="130" r="17" fill={color} />
      <circle cx="96" cy="142" r="13" fill={color} opacity="0.85" />
      <circle cx="164" cy="142" r="13" fill={color} opacity="0.85" />
      {/* leaf */}
      <ellipse cx="130" cy="100" rx="14" ry="7" fill="oklch(0.42 0.2 145)" transform="rotate(-10,130,100)" />
      <ellipse cx="146" cy="106" rx="12" ry="6" fill="oklch(0.55 0.22 148)" transform="rotate(20,146,106)" />
      {/* shine dots */}
      <circle cx="114" cy="124" r="3.5" fill="white" opacity="0.5" />
      <circle cx="134" cy="112" r="4.5" fill="white" opacity="0.4" />
      <circle cx="153" cy="124" r="3.5" fill="white" opacity="0.5" />
    </g>
  );
}

// ─── Eye renderers ────────────────────────────────────────────────────────────

type EyeProps = {
  cx: number;
  eyeColor: string;
  irisColor: string;
  ry: number;
};

function EyeRound({ cx, eyeColor, irisColor, ry }: EyeProps) {
  return (
    <g style={{ transformOrigin: `${cx}px 170px`, animation: "blink 4.5s infinite" }}>
      <motion.ellipse cx={cx} cy={170} animate={{ ry, rx: 11 }} transition={{ type: "spring", stiffness: 200, damping: 18 }} fill={eyeColor} />
      <circle cx={cx + 3} cy={166} r={3.5} fill="white" />
      <circle cx={cx - 2} cy={174} r={1.8} fill="white" />
    </g>
  );
}

function EyeSparkle({ cx, eyeColor, irisColor, ry }: EyeProps) {
  return (
    <g style={{ transformOrigin: `${cx}px 170px`, animation: "blink 4.5s infinite" }}>
      <motion.ellipse cx={cx} cy={170} animate={{ ry: ry + 2, rx: 12 }} transition={{ type: "spring", stiffness: 200, damping: 18 }} fill={eyeColor} />
      <ellipse cx={cx} cy={170} rx={8} ry={ry - 2} fill={irisColor} />
      <circle cx={cx + 3} cy={164} r={3.5} fill="white" />
      <circle cx={cx - 2} cy={175} r={1.8} fill="white" />
      {/* sparkle */}
      <text x={cx - 6} y={168} fontSize="8" fill="white">✦</text>
      {/* lashes */}
      <line x1={cx - 10} y1={158} x2={cx - 13} y2={153} stroke={eyeColor} strokeWidth="1.5" strokeLinecap="round" />
      <line x1={cx} y1={157} x2={cx - 1} y2={151} stroke={eyeColor} strokeWidth="1.5" strokeLinecap="round" />
      <line x1={cx + 10} y1={158} x2={cx + 13} y2={153} stroke={eyeColor} strokeWidth="1.5" strokeLinecap="round" />
    </g>
  );
}

function EyeCrescent({ cx, eyeColor }: EyeProps) {
  return (
    <g>
      {/* happy crescent (closed arc) */}
      <path
        d={`M${cx - 13},170 Q${cx},${158} ${cx + 13},170`}
        stroke={eyeColor}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* lashes */}
      <line x1={cx - 12} y1={169} x2={cx - 15} y2={164} stroke={eyeColor} strokeWidth="1.5" strokeLinecap="round" />
      <line x1={cx + 12} y1={169} x2={cx + 15} y2={164} stroke={eyeColor} strokeWidth="1.5" strokeLinecap="round" />
    </g>
  );
}

function EyeGalaxy({ cx, eyeColor, irisColor, ry }: EyeProps) {
  return (
    <g style={{ transformOrigin: `${cx}px 170px`, animation: "blink 4.5s infinite" }}>
      <motion.ellipse cx={cx} cy={170} animate={{ ry, rx: 11 }} transition={{ type: "spring", stiffness: 200, damping: 18 }} fill={eyeColor} />
      <ellipse cx={cx} cy={170} rx={8} ry={ry - 3} fill={irisColor} />
      <circle cx={cx + 3} cy={164} r={3.5} fill="white" />
      <circle cx={cx - 2} cy={175} r={1.5} fill="oklch(0.8 0.12 280)" />
    </g>
  );
}

function EyeHeart({ cx, eyeColor, ry }: EyeProps) {
  return (
    <g style={{ transformOrigin: `${cx}px 170px`, animation: "blink 4.5s infinite" }}>
      <motion.ellipse cx={cx} cy={170} animate={{ ry, rx: 11 }} transition={{ type: "spring", stiffness: 200, damping: 18 }} fill={eyeColor} />
      <circle cx={cx + 3} cy={164} r={3.5} fill="white" />
      <circle cx={cx - 2} cy={175} r={1.8} fill="white" />
      {/* tiny heart overlay */}
      <text x={cx - 7} y={172} fontSize="10" fill="oklch(0.7 0.22 15)">♥</text>
    </g>
  );
}

function EyeDreamy({ cx, eyeColor, irisColor, ry }: EyeProps) {
  return (
    <g style={{ transformOrigin: `${cx}px 170px`, animation: "blink 4.5s infinite" }}>
      <motion.ellipse cx={cx} cy={170} animate={{ ry: ry + 1, rx: 12 }} transition={{ type: "spring", stiffness: 200, damping: 18 }} fill={eyeColor} />
      <ellipse cx={cx} cy={170} rx={7} ry={ry - 3} fill={irisColor} />
      <circle cx={cx + 3} cy={163} r={3.5} fill="white" />
      <circle cx={cx - 2} cy={176} r={1.8} fill="white" />
      {/* brow lifted curious */}
      <path
        d={`M${cx - 12},${155} Q${cx},${151} ${cx + 12},${155}`}
        stroke={eyeColor}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function renderEyes(b: ReturnType<typeof getBunny>, eyeRy: number) {
  const props = (cx: number): EyeProps => ({
    cx,
    eyeColor: b.eyeColor,
    irisColor: b.eyeIrisColor,
    ry: eyeRy,
  });
  switch (b.eyeStyle) {
    case "crescent": return <><EyeCrescent {...props(100)} /><EyeCrescent {...props(160)} /></>;
    case "sparkle":  return <><EyeSparkle  {...props(100)} /><EyeSparkle  {...props(160)} /></>;
    case "galaxy":   return <><EyeGalaxy   {...props(100)} /><EyeGalaxy   {...props(160)} /></>;
    case "heart":    return <><EyeHeart    {...props(100)} /><EyeHeart    {...props(160)} /></>;
    case "dreamy":   return <><EyeDreamy   {...props(100)} /><EyeDreamy   {...props(160)} /></>;
    default:         return <><EyeRound    {...props(100)} /><EyeRound    {...props(160)} /></>;
  }
}

function renderAccessory(b: ReturnType<typeof getBunny>) {
  const p = { color: b.accessoryColor, colorAlt: b.accessoryColorAlt };
  switch (b.accessory) {
    case "bow":           return <AccessoryBow           {...p} />;
    case "star-crown":    return <AccessoryStarCrown     {...p} />;
    case "headband":      return <AccessoryHeadband      {...p} />;
    case "moon":          return <AccessoryMoon          {...p} />;
    case "leaf-clip":     return <AccessoryLeafClip      {...p} />;
    case "sakura":        return <AccessorySakura        {...p} />;
    case "cloud-hat":     return <AccessoryCloudHat      {...p} />;
    case "polka-bow":     return <AccessoryPolkaBow      {...p} />;
    case "fluffy-tuft":   return <AccessoryFluffyTuft    {...p} />;
    case "berry-cluster": return <AccessoryBerryCluster  {...p} />;
    default:              return null;
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Avatar({ isSpeaking, isThinking, emotion = "neutral", mouthLevel = 0, bunny }: Props) {
  const mouthOpen = isSpeaking ? mouthLevel : 0;
  const b = getBunny(bunny);

  const cfg = (() => {
    switch (emotion) {
      case "happy":
        return { earTilt: 6,  earSpeed: 2.2, eyeRy: 10, mouthPath: "M118,232 Q130,244 142,232", browY: 158, browTilt: -2 };
      case "curious":
        return { earTilt: 14, earSpeed: 2.5, eyeRy: 14, mouthPath: "M122,234 Q130,236 138,234", browY: 154, browTilt: -6 };
      case "surprised":
        return { earTilt: -8, earSpeed: 1.2, eyeRy: 17, mouthPath: "M126,236 Q130,242 134,236", browY: 148, browTilt: 0 };
      case "sad":
        return { earTilt: 22, earSpeed: 4,   eyeRy: 12, mouthPath: "M118,238 Q130,228 142,238", browY: 156, browTilt: 8 };
      default:
        return { earTilt: 0,  earSpeed: 3,   eyeRy: 13, mouthPath: "M122,234 L138,234",          browY: 156, browTilt: 0 };
    }
  })();

  const jawH = 2 + mouthOpen * (emotion === "surprised" ? 22 : 16);

  // Stable gradient IDs per bunny so multiple avatars never collide
  const fid  = `fur-${b.id}`;
  const eid  = `inner-${b.id}`;
  const cid  = `cheek-${b.id}`;
  const nid  = `nose-${b.id}`;

  return (
    <div className="relative flex items-center justify-center">
      {/* Glow halo */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{ background: `radial-gradient(circle, ${b.glow}, transparent 70%)` }}
        animate={{
          scale:   isSpeaking ? [1, 1.08, 1] : isThinking ? [1, 1.04, 1] : 1,
          opacity: isSpeaking ? [0.7, 1, 0.7] : 0.55,
        }}
        transition={{ duration: isSpeaking ? 0.6 : 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Body float / emotion tilt */}
      <motion.div
        className={emotion === "sad" ? "relative" : "relative animate-float"}
        animate={
          emotion === "happy"
            ? { y: [0, -18, 0, -8, 0], scale: isSpeaking ? [1, 1.015, 1] : 1 }
            : emotion === "sad"
            ? { y: 10, rotate: -3, scale: 0.96 }
            : { scale: isSpeaking ? [1, 1.015, 1] : 1 }
        }
        transition={
          emotion === "happy"
            ? { y: { duration: 1.1, repeat: Infinity, ease: "easeOut" }, scale: { duration: 0.4, repeat: isSpeaking ? Infinity : 0 } }
            : emotion === "sad"
            ? { duration: 0.8, ease: "easeOut" }
            : { duration: 0.4, repeat: isSpeaking ? Infinity : 0 }
        }
      >
        <svg width="260" height="300" viewBox="0 0 260 300" className="drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <defs>
            <radialGradient id={fid} cx="45%" cy="40%" r="65%">
              <stop offset="0%"   stopColor={b.furLight} />
              <stop offset="100%" stopColor={b.furDark}  />
            </radialGradient>
            <radialGradient id={eid} cx="50%" cy="50%" r="60%">
              <stop offset="0%"   stopColor={b.innerEarStart} />
              <stop offset="100%" stopColor={b.innerEarEnd}   />
            </radialGradient>
            <radialGradient id={cid} cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor={b.cheekColor} />
              <stop offset="100%" stopColor={b.cheekColor.replace(/[\d.]+\)$/, "0)")} />
            </radialGradient>
            <radialGradient id={nid} cx="50%" cy="40%" r="60%">
              <stop offset="0%"   stopColor={b.noseColor} />
              <stop offset="100%" stopColor={b.noseColor} />
            </radialGradient>
          </defs>

          {/* ── Accessory (rendered behind ears so it looks natural) ── */}
          {renderAccessory(b)}

          {/* ── Left ear ── */}
          <motion.g
            style={{ transformOrigin: "95px 95px" }}
            animate={{ rotate: [-cfg.earTilt - 2, -cfg.earTilt + 2, -cfg.earTilt - 2] }}
            transition={{ duration: cfg.earSpeed, repeat: Infinity, ease: "easeInOut" }}
          >
            <ellipse cx="85"  cy="55" rx="22" ry="55" fill={`url(#${fid})`} stroke={b.furStroke} strokeWidth="1.5" />
            <ellipse cx="85"  cy="60" rx="11" ry="40" fill={`url(#${eid})`} />
          </motion.g>

          {/* ── Right ear ── */}
          <motion.g
            style={{ transformOrigin: "165px 95px" }}
            animate={{ rotate: [cfg.earTilt + 2, cfg.earTilt - 2, cfg.earTilt + 2] }}
            transition={{ duration: cfg.earSpeed, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
          >
            <ellipse cx="175" cy="55" rx="22" ry="55" fill={`url(#${fid})`} stroke={b.furStroke} strokeWidth="1.5" />
            <ellipse cx="175" cy="60" rx="11" ry="40" fill={`url(#${eid})`} />
          </motion.g>

          {/* ── Head ── */}
          <ellipse cx="130" cy="180" rx="92" ry="86" fill={`url(#${fid})`} stroke={b.furStroke} strokeWidth="1.5" />

          {/* ── Cheeks ── */}
          <circle cx="68"  cy="200" r={emotion === "happy" ? 22 : 18} fill={`url(#${cid})`} />
          <circle cx="192" cy="200" r={emotion === "happy" ? 22 : 18} fill={`url(#${cid})`} />

          {/* ── Brows (skip for crescent eyes — they include their own) ── */}
          {b.eyeStyle !== "crescent" && (
            <>
              <motion.path
                d={`M85,${cfg.browY} Q100,${cfg.browY - 4} 115,${cfg.browY + cfg.browTilt}`}
                stroke={b.eyeColor}
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <motion.path
                d={`M145,${cfg.browY + cfg.browTilt} Q160,${cfg.browY - 4} 175,${cfg.browY}`}
                stroke={b.eyeColor}
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            </>
          )}

          {/* ── Eyes ── */}
          {renderEyes(b, cfg.eyeRy)}

          {/* ── Nose ── */}
          <path
            d="M130,200 Q118,200 122,210 Q130,220 138,210 Q142,200 130,200 Z"
            fill={`url(#${nid})`}
            stroke={b.noseColor}
            strokeWidth="1"
          />

          {/* ── Whiskers ── */}
          <g stroke={b.whiskerColor} strokeWidth="1.5" strokeLinecap="round" fill="none">
            <line x1="55"  y1="218" x2="105" y2="215" />
            <line x1="55"  y1="228" x2="105" y2="225" />
            <line x1="155" y1="215" x2="205" y2="218" />
            <line x1="155" y1="225" x2="205" y2="228" />
          </g>

          {/* ── Mouth (closed) ── */}
          <motion.path
            d={cfg.mouthPath}
            stroke={b.mouthColor}
            strokeWidth="2.8"
            fill="none"
            strokeLinecap="round"
            animate={{ opacity: mouthOpen > 0.1 ? 0 : 1 }}
            transition={{ duration: 0.1 }}
          />

          {/* ── Mouth (open / speaking) ── */}
          <motion.g animate={{ opacity: mouthOpen > 0.1 ? 1 : 0 }} transition={{ duration: 0.1 }}>
            <motion.ellipse
              cx="130"
              animate={{ cy: 240 + jawH / 2, ry: jawH }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              rx={emotion === "surprised" ? 11 : 14}
              fill="oklch(0.32 0.12 20)"
            />
            <rect x="124" y="232" width="5" height="8" rx="1.2" fill="white" />
            <rect x="131" y="232" width="5" height="8" rx="1.2" fill="white" />
          </motion.g>

          {/* ── Teeth (visible at rest, not sad) ── */}
          {mouthOpen < 0.1 && emotion !== "sad" && (
            <>
              <rect x="124" y="232" width="5" height="6" rx="1.2" fill="white" />
              <rect x="131" y="232" width="5" height="6" rx="1.2" fill="white" />
            </>
          )}

          {/* ── Tear (sad emotion) ── */}
          {emotion === "sad" && (
            <motion.path
              d="M105,184 Q103,194 107,196 Q111,194 109,184 Z"
              fill="oklch(0.7 0.15 230)"
              animate={{ opacity: [0, 1, 1, 0], y: [0, 6, 12, 18] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          )}
        </svg>

        {/* ── Thinking dots ── */}
        {isThinking && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block h-2 w-2 rounded-full bg-primary"
                animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}