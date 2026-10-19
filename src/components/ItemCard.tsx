import { useDraggable } from "@dnd-kit/core";
import type { Item } from "../game/types";

export function ItemFace({ item, selected }: { item: Item; selected: boolean }) {
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <span className="text-3xl leading-none" aria-hidden="true">
          {item.emoji}
        </span>
        <span
          className={`border px-1.5 py-0.5 font-mono text-[9px] tracking-widest ${
            selected
              ? "border-acid bg-acid text-ink"
              : "border-paper/15 text-muted"
          }`}
        >
          {selected ? "IN" : "+"}
        </span>
      </div>
      <div className="mt-5 text-sm font-semibold tracking-tight text-paper">
        {item.name}
      </div>
      <div className="mt-2 flex items-center gap-3 font-mono text-[10px] tracking-wide text-muted">
        <span>
          W <span className="text-paper">{item.weight}</span>
        </span>
        <span>
          V <span className="text-paper">{item.value}</span>
        </span>
      </div>
    </>
  );
}

interface ItemCardProps {
  item: Item;
  selected: boolean;
  onToggle: (item: Item) => void;
}

export function ItemCard({ item, selected, onToggle }: ItemCardProps) {
  const { listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    disabled: selected,
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      aria-pressed={selected}
      aria-label={`${item.name}, weight ${item.weight}, value ${item.value}`}
      onClick={() => onToggle(item)}
      style={
        transform
          ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
          : undefined
      }
      className={`group relative min-h-28 cursor-grab border-2 p-3 text-left transition-[background-color,border-color,opacity] duration-150 active:cursor-grabbing sm:min-h-32 ${
        selected
          ? "border-acid bg-acid/10"
          : "border-paper/20 bg-ink-2 hover:border-paper/60 hover:bg-ink-3"
      } ${isDragging ? "z-20 opacity-30" : ""}`}
      {...listeners}
    >
      <ItemFace item={item} selected={selected} />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-paper/15 transition-colors group-hover:border-acid"
      />
    </button>
  );
}

export function ItemGhost({ item }: { item: Item }) {
  return (
    <div className="w-44 rotate-2 border-2 border-acid bg-ink-2 p-3 shadow-[8px_8px_0_0_var(--color-acid)]">
      <ItemFace item={item} selected={false} />
    </div>
  );
}
