export type BunnyId =
  | "mochi"
  | "cocoa"
  | "snow"
  | "midnight"
  | "lumi"
  | "boba"
  | "starry"
  | "matcha"
  | "sakura"
  | "cloudy"
  | "peaches"
  | "cotton"
  | "berry";

export type BunnyConfig = {
  id: BunnyId;
  name: string;
  emoji: string;
  description: string;
  /** Fur palette for the SVG */
  furLight: string;
  furDark: string;
  furStroke: string;
  innerEarStart: string;
  innerEarEnd: string;
  /** Soft glow color */
  glow: string;
  /** UI accent (used for chips / theme hint) */
  accent: string;
  /** Accessory type rendered in Avatar SVG */
  accessory:
    | "bow"
    | "star-crown"
    | "headband"
    | "moon"
    | "leaf-clip"
    | "sakura"
    | "cloud-hat"
    | "polka-bow"
    | "fluffy-tuft"
    | "berry-cluster"
    | "none";
  /** Primary accessory color */
  accessoryColor: string;
  /** Secondary accessory color */
  accessoryColorAlt: string;
  /** Eye style */
  eyeStyle: "round" | "crescent" | "galaxy" | "sparkle" | "heart" | "dreamy";
  /** Eye fill color */
  eyeColor: string;
  /** Eye iris color (for multi-layer eyes) */
  eyeIrisColor: string;
  /** Cheek blush color */
  cheekColor: string;
  /** Nose color */
  noseColor: string;
  /** Mouth / whisker stroke color */
  mouthColor: string;
  /** Whisker color */
  whiskerColor: string;
};

export const BUNNIES: Record<BunnyId, BunnyConfig> = {
  // ── Original four ──────────────────────────────────────────────────────────
  mochi: {
    id: "mochi",
    name: "Mochi",
    emoji: "🐰",
    description: "The cheerful original — soft cream fur and a warm heart.",
    furLight: "oklch(0.98 0.005 280)",
    furDark: "oklch(0.86 0.02 280)",
    furStroke: "oklch(0.75 0.02 280)",
    innerEarStart: "oklch(0.85 0.1 10)",
    innerEarEnd: "oklch(0.7 0.14 15)",
    glow: "oklch(0.82 0.14 30 / 0.45)",
    accent: "oklch(0.78 0.16 25)",
    accessory: "none",
    accessoryColor: "oklch(0.75 0.18 10)",
    accessoryColorAlt: "oklch(0.6 0.2 10)",
    eyeStyle: "round",
    eyeColor: "oklch(0.18 0.04 280)",
    eyeIrisColor: "oklch(0.35 0.06 280)",
    cheekColor: "oklch(0.78 0.16 15 / 0.65)",
    noseColor: "oklch(0.78 0.18 15)",
    mouthColor: "oklch(0.5 0.16 15)",
    whiskerColor: "oklch(0.6 0.04 280)",
  },
  cocoa: {
    id: "cocoa",
    name: "Cocoa",
    emoji: "🍫",
    description: "Warm and chocolatey — a cozy companion for sweet conversations.",
    furLight: "oklch(0.65 0.07 50)",
    furDark: "oklch(0.42 0.08 45)",
    furStroke: "oklch(0.32 0.07 45)",
    innerEarStart: "oklch(0.78 0.12 25)",
    innerEarEnd: "oklch(0.6 0.15 25)",
    glow: "oklch(0.55 0.12 50 / 0.5)",
    accent: "oklch(0.55 0.14 50)",
    accessory: "none",
    accessoryColor: "oklch(0.55 0.14 50)",
    accessoryColorAlt: "oklch(0.42 0.12 45)",
    eyeStyle: "round",
    eyeColor: "oklch(0.18 0.04 45)",
    eyeIrisColor: "oklch(0.32 0.08 45)",
    cheekColor: "oklch(0.7 0.14 30 / 0.5)",
    noseColor: "oklch(0.72 0.14 25)",
    mouthColor: "oklch(0.45 0.12 35)",
    whiskerColor: "oklch(0.5 0.06 45)",
  },
  snow: {
    id: "snow",
    name: "Snow",
    emoji: "❄️",
    description: "Pure white winter bunny with a quiet, gentle vibe.",
    furLight: "oklch(0.99 0.003 240)",
    furDark: "oklch(0.92 0.01 240)",
    furStroke: "oklch(0.78 0.02 240)",
    innerEarStart: "oklch(0.9 0.05 240)",
    innerEarEnd: "oklch(0.78 0.08 230)",
    glow: "oklch(0.92 0.05 220 / 0.5)",
    accent: "oklch(0.78 0.1 220)",
    accessory: "none",
    accessoryColor: "oklch(0.78 0.1 220)",
    accessoryColorAlt: "oklch(0.65 0.12 220)",
    eyeStyle: "round",
    eyeColor: "oklch(0.22 0.04 230)",
    eyeIrisColor: "oklch(0.42 0.1 230)",
    cheekColor: "oklch(0.82 0.1 220 / 0.5)",
    noseColor: "oklch(0.8 0.1 230)",
    mouthColor: "oklch(0.55 0.1 220)",
    whiskerColor: "oklch(0.65 0.04 240)",
  },
  midnight: {
    id: "midnight",
    name: "Midnight",
    emoji: "🌙",
    description: "Mysterious dusky bunny — a little sassy, a little stargazer.",
    furLight: "oklch(0.42 0.05 280)",
    furDark: "oklch(0.22 0.06 280)",
    furStroke: "oklch(0.15 0.05 280)",
    innerEarStart: "oklch(0.6 0.18 320)",
    innerEarEnd: "oklch(0.4 0.2 320)",
    glow: "oklch(0.55 0.22 320 / 0.55)",
    accent: "oklch(0.62 0.22 320)",
    accessory: "none",
    accessoryColor: "oklch(0.62 0.22 320)",
    accessoryColorAlt: "oklch(0.45 0.2 320)",
    eyeStyle: "round",
    eyeColor: "oklch(0.95 0.02 280)",
    eyeIrisColor: "oklch(0.75 0.08 280)",
    cheekColor: "oklch(0.55 0.2 320 / 0.45)",
    noseColor: "oklch(0.6 0.18 320)",
    mouthColor: "oklch(0.7 0.14 320)",
    whiskerColor: "oklch(0.55 0.05 280)",
  },

  // ── New girl avatars ────────────────────────────────────────────────────────
  lumi: {
    id: "lumi",
    name: "Lumi",
    emoji: "💜",
    description: "Lavender dream — starry eyes and a glittering crown.",
    furLight: "oklch(0.95 0.04 300)",
    furDark: "oklch(0.82 0.08 300)",
    furStroke: "oklch(0.72 0.1 300)",
    innerEarStart: "oklch(0.74 0.18 300)",
    innerEarEnd: "oklch(0.6 0.22 305)",
    glow: "oklch(0.72 0.2 305 / 0.5)",
    accent: "oklch(0.68 0.22 305)",
    accessory: "star-crown",
    accessoryColor: "oklch(0.8 0.2 300)",
    accessoryColorAlt: "oklch(0.65 0.22 305)",
    eyeStyle: "sparkle",
    eyeColor: "oklch(0.28 0.1 300)",
    eyeIrisColor: "oklch(0.5 0.22 305)",
    cheekColor: "oklch(0.78 0.2 300 / 0.5)",
    noseColor: "oklch(0.8 0.18 300)",
    mouthColor: "oklch(0.6 0.2 305)",
    whiskerColor: "oklch(0.68 0.08 300)",
  },
  boba: {
    id: "boba",
    name: "Boba",
    emoji: "🧋",
    description: "Milk tea vibes — caramel fur, freckles, and a cozy headband.",
    furLight: "oklch(0.96 0.04 65)",
    furDark: "oklch(0.84 0.09 60)",
    furStroke: "oklch(0.74 0.1 58)",
    innerEarStart: "oklch(0.75 0.16 55)",
    innerEarEnd: "oklch(0.6 0.18 52)",
    glow: "oklch(0.72 0.16 58 / 0.5)",
    accent: "oklch(0.65 0.18 55)",
    accessory: "headband",
    accessoryColor: "oklch(0.55 0.16 50)",
    accessoryColorAlt: "oklch(0.68 0.18 55)",
    eyeStyle: "crescent",
    eyeColor: "oklch(0.28 0.08 50)",
    eyeIrisColor: "oklch(0.42 0.12 50)",
    cheekColor: "oklch(0.72 0.18 40 / 0.55)",
    noseColor: "oklch(0.72 0.16 55)",
    mouthColor: "oklch(0.5 0.16 50)",
    whiskerColor: "oklch(0.62 0.08 58)",
  },
  starry: {
    id: "starry",
    name: "Starry",
    emoji: "🌙",
    description: "Galaxy night bunny — dark fur dusted with stars and moonlight.",
    furLight: "oklch(0.32 0.1 285)",
    furDark: "oklch(0.18 0.12 285)",
    furStroke: "oklch(0.38 0.14 295)",
    innerEarStart: "oklch(0.48 0.2 295)",
    innerEarEnd: "oklch(0.34 0.22 295)",
    glow: "oklch(0.55 0.22 295 / 0.55)",
    accent: "oklch(0.62 0.22 295)",
    accessory: "moon",
    accessoryColor: "oklch(0.88 0.18 90)",
    accessoryColorAlt: "oklch(0.18 0.12 285)",
    eyeStyle: "galaxy",
    eyeColor: "oklch(0.92 0.04 280)",
    eyeIrisColor: "oklch(0.62 0.2 280)",
    cheekColor: "oklch(0.55 0.22 295 / 0.45)",
    noseColor: "oklch(0.52 0.2 295)",
    mouthColor: "oklch(0.65 0.18 295)",
    whiskerColor: "oklch(0.42 0.12 285)",
  },
  matcha: {
    id: "matcha",
    name: "Matcha",
    emoji: "🍃",
    description: "Earthy green tea bunny — calm, gentle, and close to nature.",
    furLight: "oklch(0.95 0.06 145)",
    furDark: "oklch(0.82 0.1 145)",
    furStroke: "oklch(0.72 0.12 145)",
    innerEarStart: "oklch(0.72 0.2 145)",
    innerEarEnd: "oklch(0.57 0.22 148)",
    glow: "oklch(0.7 0.2 145 / 0.45)",
    accent: "oklch(0.58 0.22 148)",
    accessory: "leaf-clip",
    accessoryColor: "oklch(0.42 0.2 145)",
    accessoryColorAlt: "oklch(0.56 0.22 148)",
    eyeStyle: "round",
    eyeColor: "oklch(0.22 0.1 145)",
    eyeIrisColor: "oklch(0.38 0.16 145)",
    cheekColor: "oklch(0.72 0.2 140 / 0.5)",
    noseColor: "oklch(0.72 0.2 145)",
    mouthColor: "oklch(0.48 0.2 148)",
    whiskerColor: "oklch(0.6 0.1 145)",
  },
  sakura: {
    id: "sakura",
    name: "Sakura",
    emoji: "🌸",
    description: "Cherry blossom bunny — romantic lashes and falling petals.",
    furLight: "oklch(0.98 0.02 5)",
    furDark: "oklch(0.88 0.08 5)",
    furStroke: "oklch(0.78 0.12 5)",
    innerEarStart: "oklch(0.82 0.16 5)",
    innerEarEnd: "oklch(0.68 0.2 8)",
    glow: "oklch(0.8 0.18 8 / 0.5)",
    accent: "oklch(0.72 0.2 8)",
    accessory: "sakura",
    accessoryColor: "oklch(0.78 0.18 5)",
    accessoryColorAlt: "oklch(0.62 0.2 8)",
    eyeStyle: "sparkle",
    eyeColor: "oklch(0.2 0.08 5)",
    eyeIrisColor: "oklch(0.38 0.18 8)",
    cheekColor: "oklch(0.76 0.18 5 / 0.55)",
    noseColor: "oklch(0.72 0.2 8)",
    mouthColor: "oklch(0.52 0.2 5)",
    whiskerColor: "oklch(0.65 0.08 5)",
  },
  cloudy: {
    id: "cloudy",
    name: "Cloudy",
    emoji: "☁️",
    description: "Sky blue dreamer — cloud hat, rainbow whiskers, head in the clouds.",
    furLight: "oklch(0.95 0.04 240)",
    furDark: "oklch(0.82 0.08 240)",
    furStroke: "oklch(0.72 0.1 240)",
    innerEarStart: "oklch(0.75 0.16 240)",
    innerEarEnd: "oklch(0.6 0.2 242)",
    glow: "oklch(0.72 0.18 240 / 0.5)",
    accent: "oklch(0.62 0.2 242)",
    accessory: "cloud-hat",
    accessoryColor: "oklch(0.99 0.004 240)",
    accessoryColorAlt: "oklch(0.78 0.1 240)",
    eyeStyle: "dreamy",
    eyeColor: "oklch(0.22 0.08 240)",
    eyeIrisColor: "oklch(0.42 0.18 240)",
    cheekColor: "oklch(0.72 0.18 240 / 0.5)",
    noseColor: "oklch(0.75 0.16 240)",
    mouthColor: "oklch(0.48 0.18 242)",
    whiskerColor: "oklch(0.62 0.08 240)",
  },
  peaches: {
    id: "peaches",
    name: "Peaches",
    emoji: "🍑",
    description: "Peachy coral cutie — heart eyes, polka-dot bow, and big warm cheeks.",
    furLight: "oklch(0.97 0.04 40)",
    furDark: "oklch(0.86 0.1 38)",
    furStroke: "oklch(0.76 0.14 36)",
    innerEarStart: "oklch(0.78 0.2 30)",
    innerEarEnd: "oklch(0.62 0.22 28)",
    glow: "oklch(0.76 0.2 32 / 0.5)",
    accent: "oklch(0.68 0.22 30)",
    accessory: "polka-bow",
    accessoryColor: "oklch(0.68 0.22 30)",
    accessoryColorAlt: "oklch(0.55 0.22 28)",
    eyeStyle: "heart",
    eyeColor: "oklch(0.22 0.08 38)",
    eyeIrisColor: "oklch(0.4 0.16 32)",
    cheekColor: "oklch(0.76 0.22 32 / 0.55)",
    noseColor: "oklch(0.74 0.2 35)",
    mouthColor: "oklch(0.52 0.22 30)",
    whiskerColor: "oklch(0.64 0.1 38)",
  },
  cotton: {
    id: "cotton",
    name: "Cotton",
    emoji: "🤍",
    description: "Cloud-fluff white bunny — extra fluffy with purple shimmer eyes.",
    furLight: "oklch(0.995 0.002 300)",
    furDark: "oklch(0.94 0.01 300)",
    furStroke: "oklch(0.86 0.02 300)",
    innerEarStart: "oklch(0.86 0.1 320)",
    innerEarEnd: "oklch(0.74 0.14 320)",
    glow: "oklch(0.88 0.1 310 / 0.5)",
    accent: "oklch(0.72 0.18 315)",
    accessory: "fluffy-tuft",
    accessoryColor: "oklch(0.78 0.16 320)",
    accessoryColorAlt: "oklch(0.6 0.2 320)",
    eyeStyle: "sparkle",
    eyeColor: "oklch(0.22 0.08 305)",
    eyeIrisColor: "oklch(0.48 0.22 310)",
    cheekColor: "oklch(0.8 0.16 315 / 0.55)",
    noseColor: "oklch(0.78 0.16 320)",
    mouthColor: "oklch(0.58 0.18 318)",
    whiskerColor: "oklch(0.72 0.06 305)",
  },
  berry: {
    id: "berry",
    name: "Berry",
    emoji: "🫐",
    description: "Blueberry bunny — deep violet fur with a berry-cluster hair topping.",
    furLight: "oklch(0.9 0.08 295)",
    furDark: "oklch(0.74 0.16 295)",
    furStroke: "oklch(0.64 0.18 297)",
    innerEarStart: "oklch(0.65 0.22 295)",
    innerEarEnd: "oklch(0.5 0.24 298)",
    glow: "oklch(0.62 0.24 296 / 0.5)",
    accent: "oklch(0.58 0.24 296)",
    accessory: "berry-cluster",
    accessoryColor: "oklch(0.38 0.2 295)",
    accessoryColorAlt: "oklch(0.48 0.22 295)",
    eyeStyle: "dreamy",
    eyeColor: "oklch(0.18 0.08 295)",
    eyeIrisColor: "oklch(0.38 0.22 295)",
    cheekColor: "oklch(0.6 0.22 295 / 0.5)",
    noseColor: "oklch(0.65 0.22 295)",
    mouthColor: "oklch(0.5 0.2 297)",
    whiskerColor: "oklch(0.55 0.12 295)",
  },
};

export const BUNNY_LIST: BunnyConfig[] = [
  BUNNIES.mochi,
  BUNNIES.cocoa,
  BUNNIES.snow,
  BUNNIES.midnight,
  BUNNIES.lumi,
  BUNNIES.boba,
  BUNNIES.starry,
  BUNNIES.matcha,
  BUNNIES.sakura,
  BUNNIES.cloudy,
  BUNNIES.peaches,
  BUNNIES.cotton,
  BUNNIES.berry,
];

export function getBunny(id: string | null | undefined): BunnyConfig {
  return BUNNIES[(id as BunnyId) in BUNNIES ? (id as BunnyId) : "mochi"];
}
