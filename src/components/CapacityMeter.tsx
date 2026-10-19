interface CapacityMeterProps {
  weight: number;
  capacity: number;
}

const SEGMENTS = 16;

export function CapacityMeter({ weight, capacity }: CapacityMeterProps) {
  const ratio = capacity > 0 ? weight / capacity : 0;
  const filled = Math.min(SEGMENTS, Math.round(ratio * SEGMENTS));
  const tight = ratio >= 0.8;

  return (
    <div
      role="progressbar"
      aria-label="Backpack capacity"
      aria-valuemin={0}
      aria-valuemax={capacity}
      aria-valuenow={weight}
    >
      <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.16em]">
        <span className="text-muted">CAPACITY</span>
        <span className={tight ? "text-blood" : "text-paper"}>
          {weight} / {capacity}
        </span>
      </div>
      <div className="mt-2 flex gap-[3px]" aria-hidden="true">
        {Array.from({ length: SEGMENTS }, (_, index) => (
          <span
            key={index}
            className={`h-3 flex-1 border transition-colors duration-150 ${
              index < filled
                ? tight
                  ? "border-blood bg-blood"
                  : "border-acid bg-acid"
                : "border-paper/10 bg-paper/5"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
