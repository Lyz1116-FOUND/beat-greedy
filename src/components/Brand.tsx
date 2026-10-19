export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-7 w-7 items-center justify-center bg-acid font-sans text-[13px] font-black leading-none text-ink">
        BG
      </span>
      <span className="font-mono text-[10px] font-semibold tracking-[0.22em] text-paper">
        BEAT GREEDY
      </span>
      {!compact && (
        <span className="hidden font-mono text-[9px] tracking-[0.16em] text-muted sm:inline">
          / KNAPSACK
        </span>
      )}
    </div>
  );
}
