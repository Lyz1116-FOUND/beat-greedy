import type { Boss } from "../game/types";

function ThinkingDots() {
  return (
    <span className="inline-flex items-end gap-1" aria-label="Boss is thinking">
      <span className="thinking-dot h-1.5 w-1.5 bg-acid" />
      <span className="thinking-dot h-1.5 w-1.5 bg-acid" />
      <span className="thinking-dot h-1.5 w-1.5 bg-acid" />
    </span>
  );
}

function BossPortrait({ boss, large }: { boss: Boss; large: boolean }) {
  if (boss.image) {
    return (
      <img
        src={boss.image}
        alt={`${boss.name} boss portrait`}
        className={`h-full w-full object-cover ${
          large
            ? "object-center"
            : "origin-[50%_18%] scale-[1.75] object-top"
        }`}
      />
    );
  }

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${
        large ? "aspect-[5/4]" : "aspect-square"
      }`}
      style={{
        background: `radial-gradient(circle at 50% 42%, ${boss.accent}33, transparent 62%), #20231a`,
      }}
    >
      <div
        className={`${large ? "text-[128px]" : "text-4xl"} leading-none grayscale-[15%]`}
        aria-hidden="true"
      >
        {boss.emoji}
      </div>
    </div>
  );
}

interface BossPanelProps {
  boss: Boss;
  variant?: "panel" | "strip";
}

export function BossPanel({ boss, variant = "panel" }: BossPanelProps) {
  if (variant === "strip") {
    return (
      <section className="flex items-center gap-3 border-2 border-paper/20 bg-ink-2 p-2.5">
        <div className="h-16 w-16 shrink-0 overflow-hidden border border-paper/15">
          <BossPortrait boss={boss} large={false} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.16em] text-muted">
            <span className="h-1.5 w-1.5 bg-acid" />
            <span>OPPONENT // METHOD CLASSIFIED</span>
          </div>
          <p className="mt-0.5 truncate text-sm font-bold">
            {boss.name}{" "}
            <span className="font-mono text-[10px] font-normal text-muted">
              {boss.alias}
            </span>
          </p>
          <p className="truncate text-[11px] text-paper/55">“{boss.intro}”</p>
        </div>
        <ThinkingDots />
      </section>
    );
  }

  return (
    <section className="overflow-hidden border-2 border-paper/20 bg-ink-2">
      <div className="flex items-center justify-between border-b border-paper/10 px-3 py-2 font-mono text-[9px] tracking-[0.18em] text-muted">
        <span>OPPONENT // LIVE</span>
        <span className="flex items-center gap-1.5 text-acid">
          <span className="h-1.5 w-1.5 animate-pulse bg-acid" />
          ONLINE
        </span>
      </div>

      <div className="relative overflow-hidden border-b border-paper/10">
        <BossPortrait boss={boss} large />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-2 via-transparent to-transparent" />
        <div className="scanline pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-acid/10 to-transparent" />
        <span className="absolute left-3 top-3 border border-paper/20 bg-ink/70 px-1.5 py-1 font-mono text-[8px] tracking-[0.18em] text-paper/60">
          METHOD: CLASSIFIED
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-lg font-bold leading-none">{boss.name}</h2>
          <span className="font-mono text-[9px] tracking-[0.14em] text-muted">
            {boss.alias}
          </span>
        </div>
        <p className="mt-2 min-h-10 text-balance text-sm leading-snug text-paper/60">
          “{boss.intro}”
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-paper/10 pt-3 font-mono text-[9px] tracking-[0.16em] text-muted">
          <span>THINKING</span>
          <ThinkingDots />
        </div>
      </div>
    </section>
  );
}
