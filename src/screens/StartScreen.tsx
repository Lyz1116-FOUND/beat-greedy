import { BOSSES } from "../game/bosses";
import { DIFFICULTY_META } from "../game/labels";
import type { Boss, Difficulty } from "../game/types";
import { BossFace } from "../components/BossFace";
import { Brand } from "../components/Brand";
import { SoundToggle } from "../components/SoundToggle";

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

interface StartScreenProps {
  difficulty: Difficulty;
  best: number;
  boss: Boss;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onStart: () => void;
}

function FactTag({ value, label }: { value: string; label: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 rounded-full border-[1.5px] border-ink/25 bg-cream/65 px-3 py-1.5 text-[10px] text-ink-soft">
      <span className="font-display text-lg leading-none text-ink">{value}</span>
      {label}
    </span>
  );
}

function BossPoster({ boss }: { boss: Boss }) {
  const number = Math.max(
    1,
    BOSSES.findIndex((candidate) => candidate.id === boss.id) + 1,
  );

  return (
    <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
      <div
        aria-hidden="true"
        className="absolute -left-4 top-14 hidden -rotate-6 rounded-md border-2 border-ink bg-mustard px-2.5 py-1.5 text-[10px] leading-tight shadow-[3px_3px_0_rgba(42,37,30,0.2)] sm:block"
      >
        全场 8 件
        <br />
        <span className="text-ink/60">概不赊账</span>
      </div>

      <div className="relative rotate-1">
        <span
          aria-hidden="true"
          className="tape -top-2.5 left-10 -rotate-3"
        />
        <div className="paper-card p-3 pb-4">
          <div className="flex items-center justify-between px-1 pb-2 text-[9px] tracking-[0.18em] text-ink-soft">
            <span>店员档案 / {String(number).padStart(2, "0")}</span>
            <span className="flex items-center gap-1.5 text-jade">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-jade" />
              在岗
            </span>
          </div>

          <div className="relative overflow-hidden rounded-xl border-2 border-ink bg-night">
            <BossFace boss={boss} className="aspect-[5/4] w-full" />
            <span className="absolute left-2 top-2 rounded bg-cream/90 px-1.5 py-0.5 text-[9px] font-semibold text-ink">
              本月销冠
            </span>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night via-night/60 to-transparent px-3 pb-2.5 pt-12">
              <p className="font-display text-[28px] leading-none text-cream">
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
            <p className="text-[8px] tracking-[0.18em] text-ink-soft">老板语录</p>
            <p className="mt-1 text-sm font-semibold leading-snug">
              “{boss.intro}”
            </p>
          </div>

          <div className="mt-2 flex items-center justify-between px-1 text-[9px] text-ink-soft">
            <span>老板先拿，你后交</span>
            <span>策略保密</span>
          </div>
          <p className="hand-note mt-3 text-center text-sm">
            “看什么看，称重啊。”
          </p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute -right-3 bottom-16 hidden rotate-6 rounded-full border-2 border-vermilion bg-cream px-3 py-2.5 text-center font-display text-xs leading-tight text-vermilion shadow-[3px_3px_0_rgba(214,64,44,0.16)] sm:block"
      >
        谢绝
        <br />
        还价
      </div>
    </div>
  );
}

export function StartScreen({
  difficulty,
  best,
  boss,
  soundEnabled,
  onToggleSound,
  onDifficultyChange,
  onStart,
}: StartScreenProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full border-[3px] border-vermilion/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 top-40 h-52 w-52 rounded-full border-2 border-dashed border-ink/10"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[46%] top-16 hidden rotate-12 font-display text-4xl text-vermilion/35 lg:block"
      >
        ✳
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-28 left-6 hidden -rotate-6 font-display text-2xl text-jade/35 lg:block"
      >
        ✳
      </span>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-8 sm:py-6">
        <header className="flex items-center justify-between gap-3">
          <Brand />
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-ink/20 bg-cream/65 px-3 py-1.5 text-[10px] text-ink-soft sm:block">
              本机最高{" "}
              <span className="font-semibold text-ink">
                {best > 0 ? best.toLocaleString() : "—"}
              </span>
            </span>
            <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />
          </div>
        </header>

        <main className="grid flex-1 items-center gap-9 py-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:py-12">
          <section className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="rounded-full border-[1.5px] border-ink/25 bg-cream/65 px-3 py-1 text-[10px] tracking-[0.14em] text-ink-soft">
                今日营业 · 背包对决
              </span>
              <span className="text-[9px] tracking-[0.2em] text-ink-soft/80">
                0/1 KNAPSACK
              </span>
            </div>

            <h1 className="mt-4 font-display text-[clamp(3.5rem,12vw,7rem)] leading-[0.9] tracking-[0.01em]">
              别只拿
              <br />
              眼前<span className="text-vermilion">那件。</span>
            </h1>

            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-soft sm:text-lg">
              老板牛来只挑眼前最划算的。
              <span className="font-semibold text-ink">
                你可以把整间店看一遍
              </span>
              ，再决定往包里塞什么。
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <FactTag value="8" label="件货" />
              <FactTag value="30" label="秒一单" />
              <FactTag value="0" label="次登录" />
            </div>

            <div className="mt-7 max-w-xl">
              <div className="flex items-end justify-between gap-3">
                <h2 className="font-display text-xl leading-none">
                  今天想怎么逛？
                </h2>
                <span className="text-[9px] text-ink-soft">
                  难度只改时间和坑的密度
                </span>
              </div>

              <div className="mt-2.5 grid grid-cols-3 gap-2">
                {DIFFICULTIES.map((id) => {
                  const meta = DIFFICULTY_META[id];
                  const active = id === difficulty;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onDifficultyChange(id)}
                      aria-pressed={active}
                      className={`relative rounded-xl border-2 px-2 py-2.5 text-left transition-[background-color,border-color,box-shadow,translate] ${
                        active
                          ? "-translate-y-0.5 border-ink bg-ink text-cream shadow-[0_4px_0_var(--color-vermilion)]"
                          : "border-ink/25 bg-cream/65 text-ink hover:border-ink/60 hover:bg-cream"
                      }`}
                    >
                      <span className="block font-display text-[15px] leading-none">
                        {meta.name}
                      </span>
                      <span
                        className={`mt-1.5 block text-[10px] ${
                          active ? "text-cream/70" : "text-ink-soft"
                        }`}
                      >
                        {meta.time}
                      </span>
                      <span
                        className={`mt-1 hidden text-[9px] leading-tight sm:block ${
                          active ? "text-cream/50" : "text-ink-soft/80"
                        }`}
                      >
                        {meta.note}
                      </span>
                      {active && (
                        <span
                          aria-hidden="true"
                          className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-mustard text-[9px] leading-none text-ink"
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={onStart}
                  className="btn-primary flex-1 py-3.5 text-lg"
                >
                  <span>进店应战</span>
                  <span aria-hidden="true" className="text-xl leading-none">
                    →
                  </span>
                </button>
                <p className="text-center text-[10px] leading-relaxed text-ink-soft sm:max-w-32 sm:text-left">
                  本机最高{" "}
                  <span className="font-semibold text-ink">
                    {best > 0 ? best.toLocaleString() : "—"}
                  </span>
                  <br className="hidden sm:block" />
                  每局重新洗牌
                </p>
              </div>
            </div>
          </section>

          <BossPoster boss={boss} />
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-dashed border-ink/15 pt-4 text-[9px] tracking-[0.1em] text-ink-soft">
          <span>没有登录 / 没有后端 / 只有一头很会算账的牛</span>
          <span>V1.1 · KNAPSACK</span>
        </footer>
      </div>
    </div>
  );
}
