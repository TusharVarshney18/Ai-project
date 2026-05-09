import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { BUNNY_LIST, type BunnyConfig, type BunnyId } from "@/lib/bunnies";
import { playClick } from "@/lib/sfx";

type Props = {
  current: BunnyId;
  onSelect: (id: BunnyId) => void;
  disabled?: boolean;
};

function getStyleBadge(id: BunnyId): string {
  switch (id) {
    case "mochi":
      return "🎀";
    case "cocoa":
      return "🥽";
    case "snow":
      return "❄️";
    case "midnight":
      return "💄";
    case "lumi":
      return "✨";
    case "boba":
      return "🕶️";
    case "starry":
      return "🌙";
    case "matcha":
      return "🍃";
    case "sakura":
      return "🌸";
    case "cloudy":
      return "☁️";
    case "peaches":
      return "💋";
    case "cotton":
      return "👑";
    case "berry":
      return "🫐";
    default:
      return "✨";
  }
}

function getStyleText(id: BunnyId): string {
  switch (id) {
    case "mochi":
      return "Soft bow style";
    case "cocoa":
      return "Goggles cutie";
    case "snow":
      return "Ice princess";
    case "midnight":
      return "Lipstick glam";
    case "lumi":
      return "Star queen";
    case "boba":
      return "Shades + chill";
    case "starry":
      return "Night diva";
    case "matcha":
      return "Nature fairy";
    case "sakura":
      return "Blossom babe";
    case "cloudy":
      return "Dream cloud";
    case "peaches":
      return "Kissy peach";
    case "cotton":
      return "Princess fluff";
    case "berry":
      return "Berry pop";
    default:
      return "Cute bunny";
  }
}

function Accessory({ b }: { b: BunnyConfig }) {
  if (b.accessory === "none") return null;

  if (b.accessory === "moon") {
    return (
      <path
        d="M 20 7 A 6 6 0 1 0 25 17 A 5 5 0 1 1 20 7 Z"
        fill={b.accessoryColor}
        opacity="0.95"
      />
    );
  }

  if (b.accessory === "headband") {
    return (
      <path
        d="M 8 14 Q 20 5 32 14"
        fill="none"
        stroke={b.accessoryColor}
        strokeWidth="2.3"
        strokeLinecap="round"
      />
    );
  }

  if (b.accessory === "polka-bow" || b.accessory === "bow") {
    return (
      <g>
        <ellipse cx="14" cy="10" rx="4.5" ry="3.8" fill={b.accessoryColorAlt} />
        <ellipse cx="26" cy="10" rx="4.5" ry="3.8" fill={b.accessoryColorAlt} />
        <circle cx="20" cy="10" r="2.2" fill={b.accessoryColor} />
      </g>
    );
  }

  return (
    <g>
      <circle cx="20" cy="8.5" r="2.8" fill={b.accessoryColor} />
      <circle cx="14.5" cy="10.5" r="2.1" fill={b.accessoryColorAlt} />
      <circle cx="25.5" cy="10.5" r="2.1" fill={b.accessoryColorAlt} />
    </g>
  );
}

function BunnyMini({ b }: { b: BunnyConfig }) {
  return (
    <svg viewBox="0 0 40 40" className="h-8 w-8 drop-shadow-sm">
      <ellipse cx="13" cy="10" rx="4.2" ry="8.5" fill={b.furLight} />
      <ellipse cx="27" cy="10" rx="4.2" ry="8.5" fill={b.furLight} />
      <ellipse cx="20" cy="24" rx="12" ry="10.5" fill={b.furLight} />
      <Accessory b={b} />
      <circle cx="16.5" cy="23" r="2.5" fill="white" />
      <circle cx="23.5" cy="23" r="2.5" fill="white" />
      <circle cx="16.8" cy="23.2" r="1.2" fill={b.eyeColor} />
      <circle cx="23.8" cy="23.2" r="1.2" fill={b.eyeColor} />
      <circle cx="20" cy="26.8" r="1.1" fill={b.noseColor} />
      <path
        d="M 17.8 29.4 Q 20 31 22.2 29.4"
        fill="none"
        stroke={b.mouthColor}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BunnyPicker({ current, onSelect, disabled }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {BUNNY_LIST.map((b) => {
        const active = b.id === current;
        const styleBadge = getStyleBadge(b.id);
        const styleText = getStyleText(b.id);

        return (
          <motion.button
            key={b.id}
            type="button"
            disabled={disabled}
            onClick={() => {
              playClick();
              onSelect(b.id);
            }}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            className={`group relative flex items-center gap-3 rounded-3xl p-3.5 text-left transition
              backdrop-blur-md border
              ${
                active
                  ? "bg-gradient-to-br from-pink-100/80 to-rose-200/60 border-pink-300 shadow-[0_8px_30px_rgba(255,182,193,0.35)]"
                  : "bg-white/10 border-white/10 hover:bg-white/20"
              }
              disabled:opacity-50`}
            aria-pressed={active}
          >
            {/* Glow effect */}
            {active && (
              <motion.div
                layoutId="bunnyGlow"
                className="absolute inset-0 rounded-3xl bg-pink-200/30 blur-xl"
              />
            )}

            {/* Avatar bubble */}
            <div
              className="relative grid h-11 w-11 place-items-center rounded-2xl shadow-inner"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${b.accent}, ${b.furDark})`,
              }}
            >
              <BunnyMini b={b} />

              {/* style overlay */}
              <span className="absolute -top-1.5 -right-1 text-xs drop-shadow-sm">
                {styleBadge}
              </span>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <span className="block truncate text-sm font-semibold text-gray-800">{b.name}</span>
              <span className="text-[11px] text-gray-500 truncate block">{styleText}</span>
            </div>

            {/* Selected indicator */}
            {active && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-400 text-white shadow-md"
              >
                <Check className="h-3 w-3" />
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
