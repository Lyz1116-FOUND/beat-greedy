interface TimerProps {
  seconds: number;
  total: number;
  compact?: boolean;
}

export function Timer({ seconds, total, compact = false }: TimerProps) {
  const urgent = seconds <= Math.min(10, Math.ceil(total * 0.33));
  const progress = total > 0 ? Math.max(0, Math.min(1, seconds / total)) : 0;
  const ringColor = urgent
    ? "#d6402c"
    : progress > 0.55
      ? "#3e7757"
      : "#e3a33c";

  const ringStyle = {
    background: `conic-gradient(${ringColor} ${progress * 360}deg, #e9d9bd 0deg)`,
  };

  if (compact) {
    return (
      <div
        role="timer"
        aria-label={`还剩 ${seconds} 秒`}
        className={`flex shrink-0 items-center gap-2 rounded-full border-2 border-ink bg-cream py-1.5 pl-1.5 pr-3 shadow-[0_3px_0_rgba(42,37,30,0.22)] ${
          urgent ? "animate-tick" : ""
        }`}
      >
        <div
          className="relative h-9 w-9 rounded-full"
          style={ringStyle}
          aria-hidden="true"
        >
          <div className="absolute inset-[3px] flex items-center justify-center rounded-full bg-cream">
            <span
              className={`font-display text-base leading-none tabular ${
                urgent ? "text-vermilion" : "text-ink"
              }`}
            >
              {String(seconds).padStart(2, "0")}
            </span>
          </div>
        </div>
        <span className="text-[9px] leading-tight tracking-[0.16em] text-ink-soft">
          秒
          <br />
          倒计时
        </span>
      </div>
    );
  }

  return (
    <section
      role="timer"
      aria-label={`还剩 ${seconds} 秒`}
      className="paper-card relative flex items-center justify-between gap-3 overflow-hidden p-4"
    >
      <span
        aria-hidden="true"
        className="absolute -right-7 top-3 rotate-3 rounded-full bg-vermilion px-8 py-1 text-[9px] tracking-[0.2em] text-cream"
      >
        限时
      </span>
      <div className="min-w-0">
        <p className="text-[9px] tracking-[0.22em] text-ink-soft">倒计时</p>
        <p
          className={`mt-2 font-display text-2xl leading-none ${
            urgent ? "animate-tick text-vermilion" : "text-ink"
          }`}
        >
          {urgent ? "手别抖" : "慢慢算"}
        </p>
        <p className="mt-2 max-w-32 text-[10px] leading-snug text-ink-soft">
          {urgent ? "最后几秒，交卷也算数。" : "提前交卷，剩下的时间算钱。"}
        </p>
      </div>

      <div
        className={`relative h-24 w-24 shrink-0 rounded-full ${
          urgent ? "animate-tick" : ""
        }`}
        style={ringStyle}
        aria-hidden="true"
      >
        <div className="absolute inset-[7px] flex flex-col items-center justify-center rounded-full border-2 border-ink bg-cream">
          <span
            className={`font-display text-[38px] leading-none tabular ${
              urgent ? "text-vermilion" : "text-ink"
            }`}
          >
            {String(seconds).padStart(2, "0")}
          </span>
          <span className="mt-0.5 text-[9px] text-ink-soft">秒</span>
        </div>
      </div>
    </section>
  );
}
