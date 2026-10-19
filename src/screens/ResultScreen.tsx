import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { BossFace } from "../components/BossFace";
import { Brand } from "../components/Brand";
import { ItemIcon } from "../components/ItemIcon";
import { SoundToggle } from "../components/SoundToggle";
import { drawResultLine, getArchetype } from "../game/banter";
import { DIFFICULTY_META, GRADE_META, METHOD_META } from "../game/labels";
import type {
  Boss,
  Item,
  PlayStats,
  Round,
  RoundResult,
} from "../game/types";
import { audio } from "../lib/audio";

const CONFETTI_COLORS = [
  "#d6402c",
  "#e3a33c",
  "#3e7757",
  "#f4ead7",
  "#a52e1f",
];

function confettiPieces() {
  return Array.from({ length: 26 }, (_, index) => ({
    left: (index * 37 + 7) % 100,
    delay: ((index * 13) % 10) / 10,
    duration: 2.4 + ((index * 7) % 16) / 10,
    drift: ((index * 29) % 120) - 60,
    spin: 300 + ((index * 47) % 540),
    color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
  }));
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the legacy path for non-secure contexts.
  }

  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

function ItemStrip({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return (
      <p className="mt-2 text-[10px] text-ink-soft">空包</p>
    );
  }

  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {items.map((item) => (
        <span
          key={item.id}
          title={`${item.name} · 重 ${item.weight} · 值 ${item.value}`}
          aria-label={item.name}
          className="flex h-7 w-7 items-center justify-center rounded border border-ink/20 bg-cream text-ink"
        >
          <ItemIcon className="h-5 w-5" icon={item.icon} />
        </span>
      ))}
    </div>
  );
}

interface ResultColumnProps {
  label: string;
  badge?: string;
  value: number;
  weight: number;
  items: Item[];
  tone: "player" | "boss" | "optimal";
}

function ResultColumn({
  label,
  badge,
  value,
  weight,
  items,
  tone,
}: ResultColumnProps) {
  const toneClass = {
    player: "bg-jade/[0.07]",
    boss: "",
    optimal: "bg-mustard/[0.09]",
  }[tone];
  const labelClass = {
    player: "text-jade",
    boss: "text-vermilion",
    optimal: "text-ink",
  }[tone];

  return (
    <div className={`min-w-0 px-2 py-2.5 ${toneClass}`}>
      <div className="flex min-h-5 flex-wrap items-center gap-1">
        <span
          className={`font-display text-sm leading-none ${labelClass}`}
        >
          {label}
        </span>
        {badge && (
          <span className="rounded-sm bg-ink px-1 py-0.5 text-[7px] leading-none text-cream">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-2 font-display text-[32px] leading-none tabular sm:text-[38px]">
        {value}
      </p>
      <p className="mt-1 text-[9px] text-ink-soft">
        重 {weight} · {items.length} 件
      </p>
      <ItemStrip items={items} />
    </div>
  );
}

function ScoreRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] text-ink-soft">{label}</p>
      <p className="mt-0.5 font-display text-base leading-none tabular text-ink">
        {value}
      </p>
    </div>
  );
}

interface ResultScreenProps {
  boss: Boss;
  round: Round;
  result: RoundResult;
  stats: PlayStats;
  roundNumber: number;
  totalScore: number;
  best: number;
  newBest: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onPlayAgain: () => void;
  onChangeDifficulty: () => void;
}

export function ResultScreen({
  boss,
  round,
  result,
  stats,
  roundNumber,
  totalScore,
  best,
  newBest,
  soundEnabled,
  onToggleSound,
  onPlayAgain,
  onChangeDifficulty,
}: ResultScreenProps) {
  const itemMap = new Map(round.items.map((item) => [item.id, item]));
  const itemsFor = (ids: string[]) =>
    ids
      .map((id) => itemMap.get(id))
      .filter((item): item is Item => Boolean(item));

  const optimalNames = itemsFor(result.optimal.itemIds)
    .map((item) => item.name)
    .join(" · ");
  const playerItems = itemsFor(result.player.itemIds);
  const bossItems = itemsFor(result.boss.itemIds);
  const optimalItems = itemsFor(result.optimal.itemIds);

  const verdict = result.beat
    ? "这波，你赢了"
    : result.tie
      ? "打平，谁也没多得"
      : "老板多赚一口";
  const verdictTone = result.beat ? "text-vermilion" : "text-ink";
  const verdictTag = result.beat ? "赚了" : result.tie ? "平手" : "亏了";
  const bossLine = result.beat
    ? boss.loseLine
    : result.tie
      ? boss.tieLine
      : boss.winLine;

  const kind =
    result.optimality >= 1
      ? "perfect"
      : result.beat
        ? "win"
        : result.tie
          ? "tie"
          : "lose";
  const [snark] = useState(() => drawResultLine(kind, String(round.seed)));
  const [archetype] = useState(() => getArchetype(result, stats));
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const played = useRef(false);

  useEffect(() => {
    if (played.current) return;
    played.current = true;
    audio.play(
      kind === "perfect"
        ? "perfect"
        : kind === "win"
          ? "win"
          : kind === "tie"
            ? "tie"
            : "lose",
    );
  }, [kind]);

  const confetti = useMemo(
    () => (result.optimality >= 1 ? confettiPieces() : []),
    [result.optimality],
  );

  const optimalityPercent = Math.min(100, result.optimality * 100);
  const displayedPercent = Math.round(optimalityPercent * 10) / 10;
  const optimalityPoints = Math.round(1000 * result.optimality);
  const beatBonus = result.beat ? 300 : 0;
  const timeBonus = result.secondsLeft * 5;
  const greedyWasOptimal = result.boss.value === result.optimal.value;
  const method = METHOD_META[boss.strategy];
  const difficulty = DIFFICULTY_META[round.difficulty];
  const gap = Math.max(0, result.boss.value - result.player.value);
  const lead = Math.max(0, result.player.value - result.boss.value);

  const gradeTone = {
    S: "text-vermilion",
    A: "text-jade",
    B: "text-ink",
    C: "text-ink-soft",
    D: "text-vermilion",
  }[result.grade];

  const archetypeTone = {
    jade: "text-jade",
    vermilion: "text-vermilion",
    ink: "text-ink",
  }[archetype.tone];

  const handleCopy = async () => {
    const text = [
      `我在「贪心小卖部」第 ${roundNumber} 单拿了 ${result.player.value} 分，最优率 ${displayedPercent}%，评级 ${result.grade}（${GRADE_META[result.grade].title}）。`,
      `${boss.name}：“${bossLine}”`,
      `来跟我比：${window.location.href}`,
    ].join("\n");
    const ok = await copyText(text);
    setCopyState(ok ? "copied" : "failed");
    if (ok) audio.play("tap");
  };

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col overflow-x-clip px-4 py-5 sm:px-8">
      <header className="flex items-center justify-between gap-3 border-b-2 border-dashed border-ink/20 pb-3">
        <Brand compact />
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-[9px] tracking-[0.14em] text-ink-soft">
            第 {String(roundNumber).padStart(2, "0")} 单 / 结账
          </span>
          <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />
        </div>
      </header>

      <main className="flex-1 py-5 sm:py-7">
        <div className="relative">
          <span
            aria-hidden="true"
            className="tape -top-2.5 left-1/2 -translate-x-1/2 -rotate-2"
          />

          <article className="receipt px-4 py-5 sm:px-8 sm:py-7">
            <div className="flex items-center justify-between gap-2 border-b-2 border-dashed border-ink/20 pb-2.5 text-[9px] tracking-[0.1em] text-ink-soft">
              <span>贪心小卖部 · 结账单</span>
              <span>
                {difficulty.name} / 剩 {result.secondsLeft} 秒
              </span>
            </div>

            <div className="mt-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-ink/25 px-2 py-0.5 text-[9px] text-ink-soft">
                    {verdictTag}
                  </span>
                  {result.optimality >= 1 && (
                    <span className="seal h-7 px-2 text-[10px]">满配</span>
                  )}
                </div>
                <h1
                  className={`mt-2 text-balance font-display text-[clamp(2.1rem,7vw,3.8rem)] leading-none tracking-wide ${verdictTone}`}
                >
                  {verdict}
                </h1>
                <p className="mt-2 max-w-md text-xs leading-relaxed text-ink-soft">
                  {result.beat
                    ? `你比老板多拿了 ${lead} 分货值。`
                    : result.tie
                      ? "你和老板拿了同样的货值，谁也没占到便宜。"
                      : `老板比你多拿了 ${gap} 分货值。`}
                  <span className="ml-1 text-ink">
                    {boss.name}：“{bossLine}”
                  </span>
                </p>
              </div>

              <div
                className={`animate-stamp seal seal-round flex h-20 w-20 shrink-0 origin-top-right -rotate-6 flex-col gap-0.5 bg-cream sm:h-24 sm:w-24 ${gradeTone}`}
                aria-label={`评级 ${result.grade}，${GRADE_META[result.grade].title}`}
              >
                <span className="text-[8px] tracking-[0.18em]">评级</span>
                <span className="font-display text-[38px] leading-none sm:text-[46px]">
                  {result.grade}
                </span>
                <span className="text-[8px] tracking-[0.12em]">
                  {GRADE_META[result.grade].title}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 divide-x-2 divide-dashed divide-ink/15 rounded-xl border-2 border-ink/15">
              <ResultColumn
                label="你"
                value={result.player.value}
                weight={result.player.weight}
                items={playerItems}
                tone="player"
              />
              <ResultColumn
                label={boss.name}
                value={result.boss.value}
                weight={result.boss.weight}
                items={bossItems}
                tone="boss"
              />
              <ResultColumn
                label="最优解"
                badge="标准答案"
                value={result.optimal.value}
                weight={result.optimal.weight}
                items={optimalItems}
                tone="optimal"
              />
            </div>

            <p className="mt-2 text-center text-[10px] text-ink-soft">
              标准答案拿了：
              <span className="font-semibold text-ink">
                {optimalNames || "空包"}
              </span>
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <section className="rounded-xl border-2 border-ink/15 bg-rice/45 p-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-[9px] tracking-[0.14em] text-ink-soft">
                    最优率
                  </span>
                  <span className="font-display text-xl leading-none tabular">
                    {displayedPercent}%
                  </span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full border border-ink/30 bg-cream">
                  <div
                    className={`h-full ${
                      displayedPercent === 100 ? "bg-jade" : "bg-mustard"
                    }`}
                    style={{ width: `${optimalityPercent}%` }}
                  />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 border-t border-dashed border-ink/20 pt-2">
                  <ScoreRow label="最优分" value={`+${optimalityPoints}`} />
                  <ScoreRow
                    label="击败老板"
                    value={beatBonus ? `+${beatBonus}` : "—"}
                  />
                  <ScoreRow label="时间奖励" value={`+${timeBonus}`} />
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-dashed border-ink/20 pt-2">
                  <span className="text-[10px] text-ink-soft">本单得分</span>
                  <span className="font-display text-2xl leading-none text-vermilion tabular">
                    +{result.score.toLocaleString()}
                  </span>
                </div>
              </section>

              <section className="rounded-xl border-2 border-ink/15 bg-rice/45 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[9px] tracking-[0.14em] text-ink-soft">
                      本局人设
                    </p>
                    <p
                      className={`mt-1 font-display text-2xl leading-none ${archetypeTone}`}
                    >
                      {archetype.title}
                    </p>
                  </div>
                  <span className="hand-note text-[10px]">说的就是你</span>
                </div>
                <p className="mt-1.5 text-[11px] leading-snug text-ink-soft">
                  {archetype.note}
                </p>
                <div className="mt-3 border-t border-dashed border-ink/20 pt-2">
                  <p className="text-[9px] tracking-[0.14em] text-ink-soft">
                    老板点评
                  </p>
                  <div className="mt-1.5 flex items-start gap-2">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border-2 border-ink bg-night">
                      <BossFace boss={boss} zoomed className="h-full w-full" />
                    </div>
                    <p className="text-xs leading-snug">“{snark}”</p>
                  </div>
                </div>
              </section>
            </div>

            <section className="mt-3 rounded-xl border-2 border-dashed border-ink/30 bg-cream p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[9px] tracking-[0.14em] text-ink-soft">
                    老板的套路
                  </p>
                  <h2 className="mt-0.5 font-display text-lg leading-none">
                    {method.name}
                  </h2>
                </div>
                <span className="price-tag">
                  <span>{method.formula}</span>
                </span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-ink-soft">
                {method.description}
              </p>
              {greedyWasOptimal && (
                <p className="mt-2 rounded-md bg-mustard/20 px-2 py-1.5 text-[10px] leading-snug text-ink">
                  这局贪心真就是标准答案。你最多打平，不算输。
                </p>
              )}
            </section>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t-2 border-dashed border-ink/20 pt-3">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-ink-soft">
                <span>
                  本场累计{" "}
                  <span className="font-display text-lg text-ink">
                    {totalScore.toLocaleString()}
                  </span>
                </span>
                <span>
                  最高{" "}
                  <span className="font-display text-base text-ink">
                    {best.toLocaleString()}
                  </span>
                </span>
              </div>
              {newBest && <span className="seal h-7 px-2 text-[10px]">新纪录</span>}
            </div>
          </article>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-[1.4fr_1fr_1fr]">
          <button
            type="button"
            onClick={onPlayAgain}
            className="btn-primary py-3.5"
          >
            <span>再来一单</span>
            <span aria-hidden="true" className="text-xl leading-none">
              →
            </span>
          </button>
          <button
            type="button"
            onClick={onChangeDifficulty}
            className="btn-ghost py-3.5"
          >
            回店门口
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="btn-ghost py-3.5"
            aria-live="polite"
          >
            {copyState === "copied"
              ? "已复制战绩"
              : copyState === "failed"
                ? "复制失败"
                : "复制战绩"}
          </button>
        </div>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-dashed border-ink/15 pt-4 text-[9px] tracking-[0.1em] text-ink-soft">
        <span>局部最优 ≠ 全局最优</span>
        <span>V1.1 · KNAPSACK</span>
      </footer>

      {confetti.length > 0 && (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50">
          {confetti.map((piece, index) => (
            <span
              key={index}
              className="confetti-piece"
              style={
                {
                  left: `${piece.left}%`,
                  backgroundColor: piece.color,
                  "--delay": `${piece.delay}s`,
                  "--duration": `${piece.duration}s`,
                  "--drift": `${piece.drift}px`,
                  "--spin": `${piece.spin}deg`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
