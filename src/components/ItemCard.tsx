import { useDraggable } from "@dnd-kit/core";
import type { Item } from "../game/types";
import { ItemIcon } from "./ItemIcon";

export function ItemFace({ item, selected }: { item: Item; selected: boolean }) {
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <ItemIcon className="h-12 w-12 text-ink" icon={item.icon} />
        {selected ? (
          <span className="seal h-8 w-8 bg-cream text-[11px] leading-none">
            已装
          </span>
        ) : (
          <span className="flex h-6 w-6 items-center justify-center rounded-full border-[1.5px] border-ink/45 text-sm leading-none text-ink-soft transition-colors group-hover:border-vermilion group-hover:bg-vermilion group-hover:text-cream">
            +
          </span>
        )}
      </div>
      <p className="mt-2 font-display text-[17px] leading-tight tracking-wide">
        {item.name}
      </p>
      <div className="mt-auto flex items-center gap-1.5 pt-2">
        <span className="price-tag">
          <span>重 {item.weight}</span>
        </span>
        <span className="rounded-[5px] border-[1.5px] border-ink/30 bg-rice px-1.5 py-0.5 text-[10px] font-semibold leading-tight text-ink-soft">
          值 {item.value}
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
      aria-label={`${item.name}，重 ${item.weight}，值 ${item.value}`}
      onClick={() => onToggle(item)}
      style={
        transform
          ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
          : undefined
      }
      className={`card-tilt group relative flex min-h-32 cursor-grab flex-col rounded-2xl border-2 p-3 text-left transition-[background-color,border-color,box-shadow,translate] duration-150 active:cursor-grabbing sm:min-h-36 ${
        selected
          ? "border-jade bg-jade-soft shadow-[3px_4px_0_rgba(62,119,87,0.28)]"
          : "border-ink bg-cream shadow-[4px_5px_0_rgba(42,37,30,0.16)] hover:-translate-y-1 hover:border-vermilion hover:shadow-[6px_7px_0_rgba(42,37,30,0.2)]"
      } ${isDragging ? "z-20 opacity-30" : ""}`}
      {...listeners}
    >
      <ItemFace item={item} selected={selected} />
      {selected && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 right-2 h-1.5 w-6 rounded-full bg-jade/40"
        />
      )}
    </button>
  );
}

export function ItemGhost({ item }: { item: Item }) {
  return (
    <div className="w-44 rotate-2 rounded-2xl border-2 border-ink bg-cream p-3 shadow-[7px_8px_0_var(--color-jade)]">
      <ItemFace item={item} selected={false} />
    </div>
  );
}
