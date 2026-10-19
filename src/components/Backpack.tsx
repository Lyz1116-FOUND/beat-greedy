import { useDroppable } from "@dnd-kit/core";
import type { Item } from "../game/types";
import { CapacityMeter } from "./CapacityMeter";

interface BackpackProps {
  items: Item[];
  capacity: number;
  totalWeight: number;
  totalValue: number;
  onRemove: (itemId: string) => void;
}

export function Backpack({
  items,
  capacity,
  totalWeight,
  totalValue,
  onRemove,
}: BackpackProps) {
  const { isOver, setNodeRef } = useDroppable({ id: "backpack" });

  return (
    <section className="border-2 border-paper/25 bg-ink-2/80">
      <header className="flex items-center justify-between border-b border-paper/10 px-4 py-3">
        <span className="font-mono text-[10px] tracking-[0.2em] text-muted">
          YOUR BACKPACK
        </span>
        <span className="font-mono text-[10px] tracking-[0.16em] text-muted">
          VALUE{" "}
          <span className="text-xl font-semibold tracking-normal text-acid">
            {totalValue}
          </span>
        </span>
      </header>

      <div
        ref={setNodeRef}
        className={`m-3 flex min-h-24 flex-wrap content-start items-center gap-2 border-2 border-dashed p-3 transition-colors ${
          isOver
            ? "border-acid bg-acid/10"
            : "border-paper/20 bg-ink/40"
        }`}
      >
        {items.length === 0 ? (
          <div className="w-full py-3 text-center">
            <p className="font-mono text-[11px] tracking-[0.16em] text-paper/55">
              {isOver ? "DROP IT" : "EMPTY"}
            </p>
            <p className="mt-1 text-xs text-muted">
              Tap an item, or drag it here.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onRemove(item.id)}
              aria-label={`Remove ${item.name} from backpack`}
              className="group flex items-center gap-2 border border-paper/20 bg-ink-3 px-2.5 py-2 text-left transition-colors hover:border-blood/70 hover:bg-blood/10"
            >
              <span className="text-xl leading-none" aria-hidden="true">
                {item.emoji}
              </span>
              <span>
                <span className="block text-xs font-semibold text-paper">
                  {item.name}
                </span>
                <span className="block font-mono text-[9px] text-muted">
                  W{item.weight} · V{item.value}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="ml-1 font-mono text-xs text-muted group-hover:text-blood"
              >
                ×
              </span>
            </button>
          ))
        )}
      </div>

      <div className="border-t border-paper/10 px-4 py-3">
        <CapacityMeter weight={totalWeight} capacity={capacity} />
      </div>
    </section>
  );
}
