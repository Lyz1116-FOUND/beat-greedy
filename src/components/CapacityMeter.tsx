interface CapacityMeterProps {
  weight: number;
  capacity: number;
}

const SEGMENTS = 12;

export function CapacityMeter({ weight, capacity }: CapacityMeterProps) {
  const ratio = capacity > 0 ? weight / capacity : 0;
  const percent = Math.min(100, Math.round(ratio * 100));
  const tight = ratio >= 0.8;
  const remaining = Math.max(0, capacity - weight);

  return (
    <div
      role="progressbar"
      aria-label="背包载重"
      aria-valuemin={0}
      aria-valuemax={capacity}
      aria-valuenow={weight}
    >
      <div className="flex items-end justify-between">
        <span className="text-[10px] tracking-[0.18em] text-ink-soft">
          背包载重
        </span>
        <span
          className={`font-display text-xl leading-none tabular ${
            tight ? "text-vermilion" : "text-ink"
          }`}
        >
          {weight}
          <span className="ml-0.5 text-[11px] text-ink-soft">/ {capacity}</span>
        </span>
      </div>

      <div className="relative mt-2 h-4 overflow-hidden rounded-full border-2 border-ink bg-rice-deep">
        <div
          className={`h-full rounded-r-full transition-[width,background-color] duration-200 ${
            tight ? "bg-vermilion" : "bg-jade"
          }`}
          style={{ width: `${percent}%` }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex"
        >
          {Array.from({ length: SEGMENTS }, (_, index) => (
            <span
              key={index}
              className="flex-1 border-r border-ink/15 last:border-r-0"
            />
          ))}
        </div>
      </div>

      <div className="mt-1.5 flex items-center justify-between text-[9px]">
        <span className={tight ? "text-vermilion" : "text-ink-soft"}>
          {tight ? "快满了，别硬塞" : `还能装 ${remaining}`}
        </span>
        <span className="tabular text-ink-soft">{percent}%</span>
      </div>
    </div>
  );
}
