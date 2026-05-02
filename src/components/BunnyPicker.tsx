import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { BUNNY_LIST, type BunnyId } from "@/lib/bunnies";
import { playClick } from "@/lib/sfx";

type Props = {
  current: BunnyId;
  onSelect: (id: BunnyId) => void;
  disabled?: boolean;
};

export function BunnyPicker({ current, onSelect, disabled }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {BUNNY_LIST.map((b) => {
        const active = b.id === current;

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
            className={`group relative flex items-center gap-3 rounded-3xl p-3 text-left transition
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
              className="relative grid h-10 w-10 place-items-center rounded-full text-lg shadow-inner"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${b.accent}, #ffffff20)`,
                color: "white",
              }}
            >
              {b.emoji}

              {/* sparkle overlay */}
              {active && (
                <span className="absolute -top-1 -right-1 text-xs animate-pulse">
                  ✨
                </span>
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <span className="block truncate text-sm font-semibold text-gray-800">
                {b.name}
              </span>
              <span className="text-[11px] text-gray-500">
                Cute bunny
              </span>
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