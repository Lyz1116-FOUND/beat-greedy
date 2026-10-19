import { Brand } from "../components/Brand";
import type {
  Boss,
  BossStrategy,
  Item,
  Round,
  RoundResult,
} from "../game/types";

const METHODS: Record<BossStrategy, { label: string; description: string }> = {
  ratio: {
    label: "RATIO GREEDY",
    description:
      "Sorts everything by value ÷ weight, takes the best deals that fit, and never looks back.",
  },
  value: {
    label: "VALUE GREEDY",
    description:
      "Sorts by the biggest number on the card. It does not care how heavy the prize is.",
  },
  weight: {
    label: "WEIGHT GREEDY",
    description:
      "Takes the lightest thing first so it can keep moving. Efficiency is not the point.",
  },
  "ratio-swap": {
    label: "RATIO + ONE SWAP",
    description:
      "Runs ratio greedy, then checks one replacement. A little hindsight goes a long way.",
  },
};

function ItemStrip({ items }: { items: Item[] }) {
  return (
    <div className="mt-3 flex min-h-8 flex-wrap gap-1.5">
      {items.length === 0 ? (
        <span className="self-center font-mono text-[9px] tracking-[0.12em] text-muted">
          EMPTY
        </span>
      ) : (
        items.map((item) => (
          <span
            key={item.id}
            title={`${item.name} · W${item.weight} · V${item.value}`}
            className="flex h-8 w-8 items-center justify-center border border-paper/15 bg-ink-3 text-lg"
          >
            {item.emoji}
          </span>
        ))
      )}
    </div>
  );
}

interface ResultColumnProps {
  label: string;
  value: number;
  weight: number;
  items: Item[];
  tone: "player" | "boss" | "optimal";
  delay: number;
}

function ResultColumn({
  label,
  value,
  weight,
  items,
  tone,
  delay,
}: ResultColumnProps) {
  const toneClass = {
    player: "border-t-acid bg-acid/[0.035]",
    boss: "border-t-blood/70",
    optimal: "border-t-paper/50 bg-paper/[0.025]",
  }[tone];
  const labelClass = {
    player: "text-acid",
    boss: "text-blood",
    optimal: "text-paper/70",
  }[tone];

  return (
    <div
      className={`animate-rise min-w-0 border-t-2 p-3 sm:p-4 ${toneClass}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between gap-1 font-mono text-[9px] tracking-[0.14em]">
        <span className={labelClass}>{label}</span>
        <span className="text-muted">W{weight}</span>
      </div>
      <p className="mt-3 font-mono text-3xl font-semibold leading-none tabular sm:text-4xl">
        {value}
      </p>
      <p className="mt-1 font-mono text-[8px] tracking-[0.12em] text-muted">
        TOTAL VALUE
      </p>
      <ItemStrip items={items} />
    </div>
  );
}

function ScoreRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[8px] tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-1 font-mono text-sm font-semibold tabular text-paper">
        {value}
      </p>
    </div>
  );
}

interface ResultScreenProps {
  boss: Boss;
  round: Round;
  result: RoundResult;
  roundNumber: number;
  totalScore: number;
  best: number;
  newBest: boolean;
  onPlayAgain: () => void;
  onChangeDifficulty: () => void;
}

export function ResultScreen({
  boss,
  round,
  result,
  roundNumber,
  totalScore,
  best,
  newBest,
  onPlayAgain,
  onChangeDifficulty,
}: ResultScreenProps) {
  const itemMap = new Map(round.items.map((item) => [item.id, item]));
  const itemsFor = (ids: string[]) =>
    ids
      .map((id) => itemMap.get(id))
      .filter((item): item is Item => Boolean(item));

  const verdict = result.beat
    ? "YOU BEAT GREEDY"
    : result.tie
      ? "DEAD HEAT"
      : "GREEDY WINS";
  const verdictColor = result.beat
    ? "text-acid"
    : result.tie
      ? "text-paper"
      : "text-blood";
  const gradeColor =
    result.grade === "S" || result.grade === "A"
      ? "border-acid text-acid"
      : result.grade === "D"
        ? "border-blood text-blood"
        : "border-paper text-paper";
  const bossLine = result.beat
    ? boss.loseLine
    : result.tie
      ? boss.tieLine
      : boss.winLine;
  const optimalityPercent = Math.min(100, result.optimality * 100);
  const displayedPercent = Math.round(optimalityPercent * 10) / 10;
  const optimalityPoints = Math.round(1000 * result.optimality);
  const timeBonus = result.secondsLeft * 5;
  const greedyWasOptimal = result.boss.value === result.optimal.value;
  const method = METHODS[boss.strategy];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col overflow-x-clip px-4 py-5 sm:px-8">
      <header className="flex items-center justify-between border-b border-paper/10 pb-3">
        <Brand compact />
        <span className="font-mono text-[9px] tracking-[0.16em] text-muted">
          ROUND {String(roundNumber).padStart(2, "0")} / REVEAL
        </span>
      </header>

      <main className="flex-1 py-6 sm:py-8">
        <div className="flex items-start justify-between gap-4">
          <div className="animate-rise">
            <p className="font-mono text-[9px] tracking-[0.2em] text-muted">
              ROUND RESULT
            </p>
            <h1
              className={`mt-2 text-balance text-[clamp(1.9rem,7vw,3.8rem)] font-black leading-[0.92] tracking-[-0.045em] ${verdictColor}`}
            >
              {verdict}
            </h1>
            <p className="mt-3 max-w-md text-sm leading-snug text-paper/60">
              <span className="font-mono text-[10px] tracking-[0.1em] text-muted">
                {boss.alias}:{" "}
              </span>
              “{bossLine}”
            </p>
          </div>
          <div
            className={`animate-stamp flex shrink-0 origin-top-right -rotate-3 flex-col items-center border-4 px-3 py-1.5 ${gradeColor}`}
          >
            <span className="font-mono text-[8px] tracking-[0.18em]">GRADE</span>
            <span className="text-4xl font-black leading-none sm:text-5xl">
              {result.grade}
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 divide-x divide-paper/10 border-2 border-paper/20 bg-ink-2/60">
          <ResultColumn
            label="YOU"
            value={result.player.value}
            weight={result.player.weight}
            items={itemsFor(result.player.itemIds)}
            tone="player"
            delay={40}
          />
          <ResultColumn
            label="BOT"
            value={result.boss.value}
            weight={result.boss.weight}
            items={itemsFor(result.boss.itemIds)}
            tone="boss"
            delay={140}
          />
          <ResultColumn
            label="OPTIMAL"
            value={result.optimal.value}
            weight={result.optimal.weight}
            items={itemsFor(result.optimal.itemIds)}
            tone="optimal"
            delay={240}
          />
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1.04fr_0.96fr]">
          <section className="border-2 border-paper/20 bg-ink-2 p-4">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-mono text-[9px] tracking-[0.18em] text-muted">
                OPTIMALITY
              </span>
              <span className="font-mono text-lg font-semibold tabular text-paper">
                {displayedPercent}%
              </span>
            </div>
            <div className="mt-2 h-2.5 w-full bg-paper/10">
              <div
                className={`h-full ${displayedPercent === 100 ? "bg-acid" : "bg-paper/70"}`}
                style={{ width: `${optimalityPercent}%` }}
              />
            </div>
            <p className="mt-2 font-mono text-[9px] tracking-[0.08em] text-muted">
              YOUR {result.player.value} / OPTIMUM {result.optimal.value}
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-paper/10 pt-3">
              <ScoreRow label="OPTIMALITY" value={`+${optimalityPoints}`} />
              <ScoreRow label="BEAT BONUS" value={result.beat ? "+300" : "—"} />
              <ScoreRow label="TIME BONUS" value={`+${timeBonus}`} />
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-paper/10 pt-3">
              <span className="font-mono text-[9px] tracking-[0.16em] text-muted">
                ROUND SCORE
              </span>
              <span className="font-mono text-xl font-semibold tabular text-acid">
                +{result.score.toLocaleString()}
              </span>
            </div>
            {displayedPercent === 100 && (
              <p className="mt-2 font-mono text-[9px] tracking-[0.12em] text-acid">
                PERFECT PACKING.
              </p>
            )}
          </section>

          <section className="border-2 border-paper/20 bg-ink-2 p-4">
            <p className="font-mono text-[9px] tracking-[0.18em] text-muted">
              METHOD REVEALED // {boss.alias}
            </p>
            <h2 className="mt-1 font-mono text-lg font-semibold tracking-[0.04em] text-acid">
              {method.label}
            </h2>
            <p className="mt-2 text-sm leading-snug text-paper/60">
              {method.description}
            </p>
            {greedyWasOptimal && (
              <p className="mt-3 border-l-2 border-paper/40 pl-3 font-mono text-[9px] leading-relaxed tracking-[0.06em] text-paper/65">
                THE BOT WAS OPTIMAL THIS ROUND. EVEN A GREEDY MOVE CAN BE RIGHT.
              </p>
            )}
            <div className="mt-3 border-t border-paper/10 pt-3">
              <span className="font-mono text-[8px] tracking-[0.16em] text-muted">
                SESSION
              </span>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-xl font-semibold tabular text-paper">
                  {totalScore.toLocaleString()}
                </span>
                {newBest && (
                  <span className="border border-acid px-1.5 py-0.5 font-mono text-[8px] tracking-[0.12em] text-acid">
                    NEW BEST
                  </span>
                )}
                <span className="font-mono text-[9px] text-muted">
                  BEST {best.toLocaleString()}
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onPlayAgain}
            className="group flex flex-1 items-center justify-between border-2 border-acid bg-acid px-4 py-4 text-ink transition-transform hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--color-paper)]"
          >
            <span className="font-mono text-xs font-semibold tracking-[0.2em]">
              PLAY AGAIN
            </span>
            <span className="text-2xl leading-none transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
          <button
            type="button"
            onClick={onChangeDifficulty}
            className="border-2 border-paper/25 bg-ink-2 px-4 py-4 font-mono text-xs tracking-[0.12em] text-paper/70 transition-colors hover:border-paper/60 hover:text-paper"
          >
            CHANGE DIFFICULTY
          </button>
        </div>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-paper/10 pt-4 font-mono text-[9px] tracking-[0.12em] text-muted">
        <span>LOCAL OPTIMUM ≠ GLOBAL OPTIMUM</span>
        <span>V0.1 · KNAPSACK</span>
      </footer>
    </div>
  );
}
