import { BOSSES } from "../game/bosses";
import type { Boss } from "../game/types";
import { BossFace } from "./BossFace";

function ThinkingDots() {
  return (
    <span className="inline-flex items-end gap-1" aria-label="老板正在打算盘">
      <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-vermilion" />
      <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-mustard" />
      <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-jade" />
    </span>
  );
}

interface BossPanelProps {
  boss: Boss;
  line: string;
  variant?: "panel" | "strip";
  thinking?: boolean;
}

export function BossPanel({
  boss,
  line,
  variant = "panel",
  thinking = true,
}: BossPanelProps) {
  const bossNumber = Math.max(
    1,
    BOSSES.findIndex((candidate) => candidate.id === boss.id) + 1,
  );

  if (variant === "strip") {
    return (
      <section className="paper-card flex items-center gap-3 rounded-xl p-2.5 shadow-[3px_4px_0_rgba(42,37,30,0.14)]">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 border-ink bg-night">
          <BossFace boss={boss} zoomed className="h-full w-full" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[9px] tracking-[0.16em] text-ink-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-jade" />
            店员动态 · {boss.name}
          </div>
          <p
            className="mt-1 line-clamp-2 text-[13px] font-semibold leading-snug"
            aria-live="polite"
          >
            “{line}”
          </p>
        </div>
        <ThinkingDots />
      </section>
    );
  }

  return (
    <section className="relative">
      <span
        aria-hidden="true"
        className="tape -top-2.5 left-9 -rotate-2"
      />
      <div className="paper-card p-3">
        <div className="flex items-center justify-between px-1 pb-2">
          <span className="text-[9px] tracking-[0.2em] text-ink-soft">
            店员档案 / {String(bossNumber).padStart(2, "0")}
          </span>
          <span className="flex items-center gap-1.5 text-[9px] text-jade">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-jade" />
            在岗
          </span>
        </div>

        <div className="relative overflow-hidden rounded-xl border-2 border-ink bg-night">
          <BossFace boss={boss} className="aspect-[5/4] w-full" />
          <span className="absolute left-2 top-2 rounded bg-cream/90 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-ink">
            本月销冠
          </span>
          <span className="absolute right-2 top-2 rounded-full border border-cream/40 px-2 py-0.5 text-[8px] tracking-[0.16em] text-cream/80">
            ON DUTY
          </span>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night via-night/55 to-transparent px-3 pb-2.5 pt-10">
            <p className="font-display text-2xl leading-none text-cream">
              {boss.name}{" "}
              <span className="text-[10px] tracking-[0.18em] text-cream/55">
                {boss.alias}
              </span>
            </p>
          </div>
        </div>

        <div className="relative mt-3 rounded-xl border-2 border-ink bg-rice px-3 py-2.5">
          <span
            aria-hidden="true"
            className="absolute -top-[7px] left-6 h-3 w-3 rotate-45 border-l-2 border-t-2 border-ink bg-rice"
          />
          <div className="flex items-center justify-between text-[8px] tracking-[0.18em] text-ink-soft">
            <span>老板说</span>
            {thinking && <ThinkingDots />}
          </div>
          <p
            className="mt-1 min-h-10 text-sm font-semibold leading-snug"
            aria-live="polite"
          >
            “{line}”
          </p>
        </div>

        <p className="mt-2 text-center text-[9px] leading-relaxed text-ink-soft">
          它会先拿，你后交。底牌暂时不公开。
        </p>
      </div>
    </section>
  );
}
