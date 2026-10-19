import {
  DndContext,
  DragOverlay,
  MouseSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useEffect, useRef, useState } from "react";
import { Backpack } from "../components/Backpack";
import { BossPanel } from "../components/BossPanel";
import { Brand } from "../components/Brand";
import { ItemCard, ItemGhost } from "../components/ItemCard";
import { SoundToggle } from "../components/SoundToggle";
import { Timer } from "../components/Timer";
import { drawBanter, drawIdleBanter } from "../game/banter";
import { getBoss } from "../game/bosses";
import { DIFFICULTY_META } from "../game/labels";
import type { Item, PlayStats, Round } from "../game/types";
import { useCountdown } from "../hooks/useCountdown";
import { audio } from "../lib/audio";

interface GameScreenProps {
  round: Round;
  roundNumber: number;
  totalScore: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSubmit: (
    itemIds: string[],
    secondsLeft: number,
    stats: PlayStats,
  ) => void;
}

interface Notice {
  id: number;
  text: string;
}

export function GameScreen({
  round,
  roundNumber,
  totalScore,
  soundEnabled,
  onToggleSound,
  onSubmit,
}: GameScreenProps) {
  const boss = getBoss(round.bossId);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [bossLine, setBossLine] = useState(boss.intro);
  const [submitting, setSubmitting] = useState(false);

  const selectedRef = useRef<string[]>([]);
  const submittedRef = useRef(false);
  const finalSecondsRef = useRef(0);
  const lowTimeRef = useRef(false);
  const lastTickRef = useRef(-1);
  const lastActionRef = useRef(0);
  const noticeTimer = useRef<number | null>(null);
  const submitTimer = useRef<number | null>(null);
  const statsRef = useRef<PlayStats>({
    picks: 0,
    removals: 0,
    rejections: 0,
    items: 0,
  });

  const selectedItems = selectedIds
    .map((id) => round.items.find((item) => item.id === id))
    .filter((item): item is Item => Boolean(item));
  const totalWeight = selectedItems.reduce((total, item) => total + item.weight, 0);
  const totalValue = selectedItems.reduce((total, item) => total + item.value, 0);
  const activeItem = activeId
    ? round.items.find((item) => item.id === activeId) ?? null
    : null;
  const difficulty = DIFFICULTY_META[round.difficulty];

  const submit = (secondsLeft: number) => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    finalSecondsRef.current = Math.max(0, secondsLeft);
    setBossLine(drawBanter("submit", boss.id));
    setSubmitting(true);
    audio.play("submit");
    const stats: PlayStats = {
      ...statsRef.current,
      items: selectedRef.current.length,
    };
    submitTimer.current = window.setTimeout(() => {
      onSubmit(selectedRef.current, finalSecondsRef.current, stats);
    }, 850);
  };

  const secondsLeft = useCountdown(round.timeLimit, () => submit(0));

  useEffect(() => {
    selectedRef.current = selectedIds;
  }, [selectedIds]);

  useEffect(() => {
    lastActionRef.current = Date.now();
  }, []);

  useEffect(() => {
    return () => {
      if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
      if (submitTimer.current) window.clearTimeout(submitTimer.current);
    };
  }, []);

  useEffect(() => {
    if (secondsLeft <= 10 && !lowTimeRef.current && !submittedRef.current) {
      lowTimeRef.current = true;
      setBossLine(drawBanter("lowTime", boss.id));
    }
    if (
      secondsLeft > 0 &&
      secondsLeft <= 5 &&
      lastTickRef.current !== secondsLeft
    ) {
      lastTickRef.current = secondsLeft;
      audio.play("tick");
    }
  }, [secondsLeft, boss.id]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (submittedRef.current || lowTimeRef.current) return;
      if (Date.now() - lastActionRef.current < 12000) return;
      lastActionRef.current = Date.now();
      setBossLine(drawIdleBanter(boss.id));
    }, 4000);
    return () => window.clearInterval(timer);
  }, [boss.id]);

  const showNotice = (text: string) => {
    setNotice({ id: Date.now(), text });
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 1900);
  };

  const currentItems = () =>
    selectedRef.current
      .map((id) => round.items.find((item) => item.id === id))
      .filter((item): item is Item => Boolean(item));

  const addItem = (item: Item) => {
    if (submittedRef.current) return;
    if (selectedRef.current.includes(item.id)) return;
    lastActionRef.current = Date.now();

    const items = currentItems();
    const weight = items.reduce((total, entry) => total + entry.weight, 0);
    const over = weight + item.weight - round.capacity;

    if (over > 0) {
      statsRef.current.rejections += 1;
      audio.play("reject");
      showNotice(`还差 ${over}，这件先放下`);
      setBossLine(drawBanter("reject", boss.id));
      return;
    }

    const isFirst = statsRef.current.picks === 0;
    statsRef.current.picks += 1;
    const next = [...selectedRef.current, item.id];
    selectedRef.current = next;
    setSelectedIds(next);
    setNotice(null);
    audio.play("pick");

    const nextRatio = (weight + item.weight) / round.capacity;
    if (nextRatio >= 0.8) {
      setBossLine(drawBanter("tight", boss.id));
    } else {
      setBossLine(drawBanter(isFirst ? "firstPick" : "pick", boss.id));
    }
  };

  const removeItem = (itemId: string) => {
    if (submittedRef.current) return;
    lastActionRef.current = Date.now();
    statsRef.current.removals += 1;
    const next = selectedRef.current.filter((id) => id !== itemId);
    selectedRef.current = next;
    setSelectedIds(next);
    setNotice(null);
    audio.play("remove");
    setBossLine(drawBanter("remove", boss.id));
  };

  const toggleItem = (item: Item) => {
    if (selectedRef.current.includes(item.id)) {
      removeItem(item.id);
    } else {
      addItem(item);
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    if (event.over?.id !== "backpack") return;
    const item = round.items.find((candidate) => candidate.id === event.active.id);
    if (item) addItem(item);
  };

  const submitButton = (extraClass = "") => (
    <button
      type="button"
      onClick={() => submit(secondsLeft)}
      disabled={selectedItems.length === 0 || submitting}
      className={`btn-primary w-full whitespace-nowrap ${extraClass}`}
    >
      <span>
        {selectedItems.length === 0
          ? "先装点东西"
          : submitting
            ? "数货中…"
            : "就这些，结账！"}
      </span>
      <span aria-hidden="true" className="text-xl leading-none">
        →
      </span>
    </button>
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-28 pt-4 sm:px-6 lg:pb-6">
        <header className="flex items-center justify-between gap-2 border-b-2 border-dashed border-ink/20 pb-3">
          <Brand compact />
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-right leading-none">
              <p className="text-[9px] tracking-[0.12em] text-ink-soft">
                第 {roundNumber} 单 · {difficulty.name}
              </p>
              <p className="mt-1 font-display text-base leading-none text-vermilion tabular">
                {totalScore.toLocaleString()}
                <span className="ml-1 text-[9px] text-ink-soft">分</span>
              </p>
            </div>
            <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />
          </div>
        </header>

        <div className="mt-3 lg:hidden">
          <BossPanel boss={boss} line={bossLine} variant="strip" />
        </div>

        <main className="mt-3 grid flex-1 gap-4 lg:mt-4 lg:grid-cols-[minmax(0,1fr)_306px]">
          <div className="min-w-0">
            <div className="mb-3 hidden items-end justify-between gap-3 sm:flex">
              <div>
                <p className="text-[9px] tracking-[0.2em] text-ink-soft">
                  第 {String(roundNumber).padStart(2, "0")} 单
                </p>
                <h1 className="mt-1 font-display text-2xl leading-tight">
                  把包塞满，把老板比下去。
                </h1>
              </div>
              <p className="shrink-0 rounded-full border border-ink/20 bg-cream/60 px-3 py-1 text-[10px] text-ink-soft">
                容量 {round.capacity}
              </p>
            </div>

            <Backpack
              items={selectedItems}
              capacity={round.capacity}
              totalWeight={totalWeight}
              totalValue={totalValue}
              onRemove={removeItem}
            />

            <div aria-live="polite" className="min-h-6">
              {notice && (
                <p
                  key={notice.id}
                  className="animate-shake rounded-lg border-2 border-vermilion bg-vermilion/10 px-3 py-1.5 text-[11px] font-semibold text-vermilion"
                >
                  包塞不下了：{notice.text}
                </p>
              )}
            </div>

            <section className="mt-3">
              <div className="mb-2.5 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[9px] tracking-[0.2em] text-ink-soft">
                    今日货架
                  </p>
                  <h2 className="mt-0.5 font-display text-xl leading-tight">
                    挑吧，<span className="text-vermilion">别只看单价。</span>
                  </h2>
                </div>
                <span className="shrink-0 rounded-full border border-ink/20 bg-cream/60 px-2.5 py-1 text-[10px] text-ink-soft">
                  {round.items.length - selectedItems.length} 件没拿
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {round.items.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    selected={selectedIds.includes(item.id)}
                    onToggle={toggleItem}
                  />
                ))}
              </div>

              <p className="mt-2.5 text-[10px] leading-relaxed text-ink-soft">
                点一下拿货 · 再点一下放回
                <span className="hidden sm:inline"> · 桌面可以拖进包里</span>
              </p>
            </section>
          </div>

          <aside className="hidden self-start lg:sticky lg:top-4 lg:block lg:space-y-3">
            <BossPanel boss={boss} line={bossLine} />
            <Timer seconds={secondsLeft} total={round.timeLimit} />
            {submitButton()}
            <p className="text-center text-[9px] leading-relaxed text-ink-soft">
              提前交卷，剩下的秒数算钱。
              <br />
              老板的选择，交卷后才揭晓。
            </p>
          </aside>
        </main>

        <footer className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t-2 border-dashed border-ink/15 pt-3.5 text-[9px] tracking-[0.1em] text-ink-soft">
          <span>局部最优 ≠ 全局最优</span>
          <span>V1.1 · KNAPSACK</span>
        </footer>

        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-ink/20 bg-rice/95 px-3 pt-2.5 backdrop-blur lg:hidden"
          style={{ paddingBottom: "calc(0.7rem + env(safe-area-inset-bottom))" }}
        >
          <div className="mx-auto flex max-w-xl items-center gap-2.5">
            <Timer seconds={secondsLeft} total={round.timeLimit} compact />
            <div className="min-w-0 flex-1">
              {submitButton("px-3 py-2.5 text-base")}
            </div>
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeItem ? <ItemGhost item={activeItem} /> : null}
        </DragOverlay>

        {submitting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-rice/90 px-6 backdrop-blur-sm">
            <div className="paper-card animate-rise w-full max-w-xs rotate-1 p-6 text-center">
              <span className="seal mx-auto h-16 w-16 bg-cream text-2xl">算</span>
              <p className="mt-4 font-display text-2xl">老板正在数货……</p>
              <div className="mt-3 flex justify-center gap-1.5">
                <span className="thinking-dot h-2 w-2 rounded-full bg-vermilion" />
                <span className="thinking-dot h-2 w-2 rounded-full bg-mustard" />
                <span className="thinking-dot h-2 w-2 rounded-full bg-jade" />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-ink-soft">
                “{bossLine}”
              </p>
            </div>
          </div>
        )}
      </div>
    </DndContext>
  );
}
