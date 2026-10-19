import type { Boss, Difficulty } from "../game/types";
import { BOSSES } from "../game/bosses";
import { Brand } from "../components/Brand";

const DIFFICULTY_OPTIONS: {
  id: Difficulty;
  label: string;
  time: string;
  note: string;
}[] = [
  { id: "easy", label: "EASY", time: "40S", note: "soft traps" },
  { id: "medium", label: "MEDIUM", time: "30S", note: "classic" },
  { id: "hard", label: "HARD", time: "20S", note: "sharp traps" },
];

interface StartScreenProps {
  difficulty: Difficulty;
  best: number;
  boss: Boss;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onStart: () => void;
}

function BossPreview({ boss }: { boss: Boss }) {
  const bossNumber = BOSSES.findIndex((candidate) => candidate.id === boss.id) + 1;

  return (
    <div className="border-2 border-paper/20 bg-ink-2 p-4">
      <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.18em] text-muted">
        <span>FIRST OPPONENT</span>
        <span className="text-acid">
          FILE #{String(Math.max(1, bossNumber)).padStart(2, "0")}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-4">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden border border-paper/15 text-5xl"
          style={{ background: `radial-gradient(circle, ${boss.accent}2e, #20231a)` }}
        >
          {boss.image ? (
            <img
              src={boss.image}
              alt={`${boss.name} boss portrait`}
              className="h-full w-full origin-[50%_18%] scale-[1.75] object-cover object-top"
            />
          ) : (
            <span aria-hidden="true">{boss.emoji}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-lg font-bold leading-tight">
            {boss.name}{" "}
            <span className="font-mono text-[10px] font-normal tracking-[0.12em] text-muted">
              {boss.alias}
            </span>
          </p>
          <p className="mt-1 text-sm leading-snug text-paper/55">
            “{boss.tagline}”
          </p>
        </div>
      </div>
      <p className="mt-3 border-t border-paper/10 pt-3 font-mono text-[9px] leading-relaxed tracking-[0.08em] text-muted">
        IT PICKS FIRST. YOU SEE THE WHOLE BOARD.
      </p>
    </div>
  );
}

function Fact({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-ink px-3 py-3">
      <p className="font-mono text-xl font-semibold leading-none text-paper">{value}</p>
      <p className="mt-1.5 font-mono text-[9px] tracking-[0.18em] text-muted">{label}</p>
    </div>
  );
}

export function StartScreen({
  difficulty,
  best,
  boss,
  onDifficultyChange,
  onStart,
}: StartScreenProps) {
  const selected = DIFFICULTY_OPTIONS.find((option) => option.id === difficulty)!;

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-8 sm:py-6">
      <header className="flex items-center justify-between">
        <Brand />
        <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.18em] text-muted">
          <span className="h-1.5 w-1.5 bg-acid" />
          <span>PROTOCOL OPEN</span>
        </div>
      </header>

      <main className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16 lg:py-14">
        <section>
          <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.24em] text-muted">
            <span className="h-px w-8 bg-acid" />
            LOCAL OPTIMUM IS A TRAP
          </div>
          <h1 className="mt-5 text-[clamp(4.2rem,16vw,10rem)] font-black leading-[0.78] tracking-[-0.075em]">
            BEAT
            <br />
            <span className="text-acid">GREEDY</span>
            <span className="text-blood">.</span>
          </h1>
          <p className="mt-7 max-w-lg text-balance text-lg leading-snug text-paper/65 sm:text-xl">
            The bot always takes the move that looks best right now.
            <span className="text-paper"> You can see the whole board.</span>
          </p>
          <div className="mt-8 grid max-w-lg grid-cols-3 gap-px border border-paper/15 bg-paper/15">
            <Fact value="08" label="ITEMS" />
            <Fact value="01" label="BACKPACK" />
            <Fact value="∞" label="RETRIES" />
          </div>
          <p className="mt-5 max-w-md font-mono text-[10px] leading-relaxed tracking-[0.04em] text-muted">
            A 0/1 KNAPSACK DUEL. BEAT THE BOT. THEN BEAT THE OPTIMUM.
          </p>
        </section>

        <section className="space-y-3">
          <BossPreview boss={boss} />

          <div className="border-2 border-paper/20 bg-ink-2">
            <div className="border-b border-paper/10 p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] tracking-[0.2em] text-muted">
                  DIFFICULTY
                </span>
                <span className="font-mono text-[9px] tracking-[0.12em] text-muted">
                  {selected.time} / ROUND
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {DIFFICULTY_OPTIONS.map((option) => {
                  const active = option.id === difficulty;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => onDifficultyChange(option.id)}
                      aria-pressed={active}
                      className={`border-2 px-2 py-3 text-left transition-colors ${
                        active
                          ? "border-acid bg-acid text-ink"
                          : "border-paper/15 bg-ink text-paper/65 hover:border-paper/40 hover:text-paper"
                      }`}
                    >
                      <span className="block font-mono text-[10px] font-semibold tracking-[0.12em]">
                        {option.label}
                      </span>
                      <span
                        className={`mt-2 block font-mono text-[8px] tracking-[0.08em] ${
                          active ? "text-ink/60" : "text-muted"
                        }`}
                      >
                        {option.time} · {option.note}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4">
              <button
                type="button"
                onClick={onStart}
                className="group flex w-full items-center justify-between border-2 border-acid bg-acid px-4 py-4 text-ink transition-transform hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--color-paper)]"
              >
                <span className="font-mono text-xs font-semibold tracking-[0.2em]">
                  PLAY
                </span>
                <span className="text-2xl leading-none transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
              <div className="mt-4 flex items-center justify-between border-t border-paper/10 pt-3 font-mono text-[9px] tracking-[0.12em]">
                <span className="text-muted">BEST SESSION</span>
                <span className="text-paper">
                  {best > 0 ? best.toLocaleString() : "—"}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-paper/10 pt-4 font-mono text-[9px] tracking-[0.12em] text-muted">
        <span>NO LOGIN / NO BACKEND / ONE GREEDY COW</span>
        <span>V0.1 · KNAPSACK</span>
      </footer>
    </div>
  );
}
