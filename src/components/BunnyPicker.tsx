import { Check } from "lucide-react";
import { BUNNY_LIST, type BunnyId } from "@/lib/bunnies";
import { playClick } from "@/lib/sfx";

type Props = {
  current: BunnyId;
  onSelect: (id: BunnyId) => void;
  disabled?: boolean;
};

export function BunnyPicker({ current, onSelect, disabled }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {BUNNY_LIST.map((b) => {
        const active = b.id === current;
        return (
          <button
            key={b.id}
            type="button"
            disabled={disabled}
            onClick={() => {
              playClick();
              onSelect(b.id);
            }}
            className={`group relative flex items-center gap-2 rounded-xl border p-2 text-left transition disabled:opacity-50 ${
              active
                ? "border-primary bg-primary/10 ring-1 ring-primary"
                : "border-border bg-background hover:bg-accent/40"
            }`}
            aria-pressed={active}
          >
            <span
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-base"
              style={{ background: b.accent, color: "white" }}
              aria-hidden
            >
              {b.emoji}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block truncate text-sm font-medium">{b.name}</span>
            </span>
            {active && <Check className="h-4 w-4 text-primary" />}
          </button>
        );
      })}
    </div>
  );
}
