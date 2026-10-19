interface TimerProps {
  seconds: number;
  total: number;
  compact?: boolean;
}

export function Timer({ seconds, total, compact = false }: TimerProps) {
  const urgent = seconds <= Math.min(10, Math.ceil(total * 0.33));
  const progress = total > 0 ? Math.max(0, Math.min(1, seconds / total)) : 0;

  if (compact) {
    return (
      <div
        role="timer"
        aria-label={`${seconds} seconds left`}
        className="flex shrink-0 items-center gap-2"
      >
        <span
          className={`font-mono text-2xl font-semibold tabular ${
            urgent ? "text-blood" : "text-paper"
          }`}
        >
          {String(seconds).padStart(2, "0")}
        </span>
        <div className="h-8 w-1.5 border border-paper/15 p-px">
          <div
            className={`w-full transition-[height] duration-200 ${
              urgent ? "bg-blood" : "bg-acid"
            }`}
            style={{ height: `${progress * 100}%`, marginTop: `${(1 - progress) * 100}%` }}
          />
        </div>
        <span className="font-mono text-[9px] tracking-[0.16em] text-muted">SEC</span>
      </div>
    );
  }

  return (
    <div
      role="timer"
      aria-label={`${seconds} seconds left`}
      className={`border-2 p-4 ${
        urgent ? "border-blood/60 bg-blood/10" : "border-paper/20 bg-ink-2"
      }`}
    >
      <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.18em]">
        <span className="text-muted">TIME LEFT</span>
        <span className={urgent ? "text-blood" : "text-muted"}>
          {urgent ? "HURRY" : "LIVE"}
        </span>
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span
          className={`font-mono text-6xl font-semibold leading-none tabular ${
            urgent ? "text-blood" : "text-paper"
          }`}
        >
          {String(seconds).padStart(2, "0")}
        </span>
        <span className="font-mono text-[10px] tracking-[0.16em] text-muted">SEC</span>
      </div>
      <div className="mt-4 h-1.5 w-full bg-paper/10">
        <div
          className={`h-full transition-[width] duration-200 ${
            urgent ? "bg-blood" : "bg-acid"
          }`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
