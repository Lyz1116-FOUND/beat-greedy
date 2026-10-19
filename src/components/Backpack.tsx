import { useDroppable } from "@dnd-kit/core";
import type { Item } from "../game/types";
import { CapacityMeter } from "./CapacityMeter";
import { ItemIcon } from "./ItemIcon";

interface BackpackProps {
  items: Item[];
  capacity: number;
  totalWeight: number;
  totalValue: number;
  onRemove: (itemId: string) => void;
}

function BagDoodle() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className="h-10 w-10 text-ink/25"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 23h32l5 29H11l5-29Z" />
      <path d="M24 23v-4a8 8 0 0 1 16 0v4" />
      <path d="M22 32h20" strokeDasharray="3 4" />
    </svg>
  );
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
    <section className="paper-bag relative overflow-hidden shadow-[4px_5px_0_rgba(42,37,30,0.14)]">
      <span className="tape -top-2.5 right-8 -rotate-3" aria-hidden="true" />
      <div className="bag-mouth h-2.5 border-b border-ink/20" aria-hidden="true" />

      <header className="flex items-end justify-between gap-3 px-4 pt-2">
        <div>
          <h2 className="font-display text-xl leading-none tracking-wide">
            我的包
          </h2>
          <p className="mt-1 text-[10px] text-ink-soft">
            点物品拿货，再点一次放回
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] tracking-[0.16em] text-ink-soft">总价值</p>
          <p className="font-display text-2xl leading-none text-vermilion tabular">
            {totalValue}
          </p>
        </div>
      </header>

      <div
        ref={setNodeRef}
        className={`mx-3 mt-2.5 flex min-h-24 flex-wrap content-start items-center gap-2 rounded-xl border-2 border-dashed p-2.5 transition-colors ${
          isOver
            ? "border-jade bg-jade-soft/80"
            : "border-ink/25 bg-cream/45"
        }`}
      >
        {items.length === 0 ? (
          <div className="flex w-full items-center justify-center gap-3 py-2">
            <BagDoodle />
            <div>
              <p className="font-display text-sm text-ink/70">
                {isOver ? "放进来吧" : "空包。先装两件试试。"}
              </p>
              <p className="mt-0.5 text-[10px] text-ink-soft">
                轻的不一定赚，贵的也不一定装得下。
              </p>
            </div>
          </div>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onRemove(item.id)}
              aria-label={`把${item.name}从包里拿出来`}
              title={`${item.name} · 重 ${item.weight} · 值 ${item.value}`}
              className="group flex items-center gap-1.5 rounded-lg border-2 border-ink/20 bg-cream px-1.5 py-1 text-left shadow-[2px_2px_0_rgba(42,37,30,0.1)] transition-colors hover:border-vermilion hover:bg-vermilion/5"
            >
              <ItemIcon className="h-7 w-7 shrink-0 text-ink" icon={item.icon} />
              <span className="min-w-0">
                <span className="block max-w-24 truncate text-[12px] font-semibold leading-tight">
                  {item.name}
                </span>
                <span className="block text-[9px] leading-tight text-ink-soft">
                  重 {item.weight} · 值 {item.value}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="ml-0.5 text-sm leading-none text-ink/35 group-hover:text-vermilion"
              >
                ×
              </span>
            </button>
          ))
        )}
      </div>

      <div className="px-4 pb-4 pt-3">
        <CapacityMeter weight={totalWeight} capacity={capacity} />
      </div>
    </section>
  );
}
