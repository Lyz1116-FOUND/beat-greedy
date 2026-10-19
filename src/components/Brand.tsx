export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className={`seal shrink-0 ${
          compact ? "h-8 w-8 text-[18px]" : "h-10 w-10 text-[22px]"
        }`}
      >
        贪
      </span>
      <div className="leading-none">
        <p
          className={`font-display tracking-[0.08em] ${
            compact ? "text-base" : "text-lg"
          }`}
        >
          贪心小卖部
        </p>
        <p
          className={`mt-1 text-[8px] tracking-[0.24em] text-ink-soft ${
            compact ? "hidden sm:block" : ""
          }`}
        >
          BEAT GREEDY · 反贪心练习
        </p>
      </div>
    </div>
  );
}
