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
import { Timer } from "../components/Timer";
import { getBoss } from "../game/bosses";
import type { Item, Round } from "../game/types";
import { useCountdown } from "../hooks/useCountdown";

interface GameScreenProps {
  round: Round;
  roundNumber: number;
  totalScore: number;
  onSubmit: (itemIds: string[], secondsLeft: number) => void;
}

export function GameScreen({
  round,
  roundNumber,
  totalScore,
  onSubmit,
}: GameScreenProps) {
  const boss = getBoss(round.bossId);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const noticeTimer = useRef<number | null>(null);
  const submittedRef = useRef(false);
  const selectedRef = useRef<string[]>([]);

  const selectedItems = selectedIds
    .map((id) => round.items.find((item) => item.id === id))
    .filter((item): item is Item => Boolean(item));
  const totalWeight = selectedItems.reduce((total, item) => total + item.weight, 0);
  const totalValue = selectedItems.reduce((total, item) => total + item.value, 0);
  const activeItem = activeId
    ? round.items.find((item) => item.id === activeId) ?? null
    : null;

  const submit = (secondsLeft: number) => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    onSubmit(selectedRef.current, secondsLeft);
  };

  const secondsLeft = useCountdown(round.timeLimit, () => submit(0));

  useEffect(() => {
    selectedRef.current = selectedIds;
  }, [selectedIds]);

  useEffect(() => {
    return () => {
      if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    };
  }, []);

  const showNotice = (message: string) => {
    setNotice(message);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 1600);
  };

  const addItem = (item: Item) => {
    if (submittedRef.current) return;
    if (selectedRef.current.includes(item.id)) return;
    if (totalWeight + item.weight > round.capacity) {
      showNotice(`TOO HEAVY — ${item.weight} WON'T FIT`);
      return;
    }
    setSelectedIds((current) => [...current, item.id]);
    setNotice(null);
  };

  const removeItem = (itemId: string) => {
    if (submittedRef.current) return;
    setSelectedIds((current) => current.filter((id) => id !== itemId));
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
      disabled={selectedItems.length === 0}
      className={`group flex w-full items-center justify-between border-2 border-acid bg-acid px-4 py-4 text-ink transition-transform hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--color-paper)] disabled:cursor-not-allowed disabled:border-paper/10 disabled:bg-paper/10 disabled:text-paper/30 disabled:hover:translate-y-0 disabled:hover:shadow-none ${extraClass}`}
    >
      <span className="font-mono text-xs font-semibold tracking-[0.2em]">
        SUBMIT PICK
      </span>
      <span className="text-2xl leading-none transition-transform group-hover:translate-x-1">
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
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-28 pt-4 sm:px-8 lg:pb-8">
        <header className="flex items-center justify-between gap-3 border-b border-paper/10 pb-3">
          <Brand compact />
          <div className="flex items-center gap-3 font-mono text-[9px] tracking-[0.14em] text-muted sm:gap-5">
            <span>
              ROUND{" "}
              <span className="text-paper">{String(roundNumber).padStart(2, "0")}</span>
            </span>
            <span>
              SCORE{" "}
              <span className="text-acid">{totalScore.toLocaleString()}</span>
            </span>
            <span className="hidden border border-paper/15 px-2 py-1 uppercase text-paper/60 sm:inline">
              {round.difficulty}
            </span>
          </div>
        </header>

        <div className="mt-3 lg:hidden">
          <BossPanel boss={boss} variant="strip" />
        </div>

        <div className="mt-4 hidden items-end justify-between gap-4 sm:flex">
          <div>
            <p className="font-mono text-[9px] tracking-[0.2em] text-muted">
              THE ROUND
            </p>
            <h1 className="mt-1 text-balance text-2xl font-bold leading-tight sm:text-3xl">
              Fill the bag. Beat the bot.
            </h1>
          </div>
          <p className="shrink-0 font-mono text-[10px] tracking-[0.12em] text-muted">
            CAPACITY <span className="text-paper">{round.capacity}</span>
          </p>
        </div>

        <main className="mt-3 grid flex-1 gap-4 lg:mt-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-4">
            <Backpack
              items={selectedItems}
              capacity={round.capacity}
              totalWeight={totalWeight}
              totalValue={totalValue}
              onRemove={removeItem}
            />

            <div aria-live="polite" className="min-h-5">
              {notice && (
                <p className="animate-shake border border-blood/50 bg-blood/10 px-3 py-2 font-mono text-[10px] tracking-[0.08em] text-blood">
                  {notice}
                </p>
              )}
            </div>

            <section>
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <p className="font-mono text-[9px] tracking-[0.2em] text-muted">
                    AVAILABLE LOOT
                  </p>
                  <h2 className="mt-1 text-lg font-bold">
                    Choose <span className="text-acid">carefully</span>.
                  </h2>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[9px] tracking-[0.12em] text-muted">
                    {round.items.length - selectedItems.length} LEFT
                  </p>
                  <p className="mt-1 font-mono text-[9px] tracking-[0.12em] text-paper/55 sm:hidden">
                    CAP {round.capacity}
                  </p>
                </div>
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
              <p className="mt-3 font-mono text-[9px] leading-relaxed tracking-[0.08em] text-muted">
                TAP TO ADD / TAP A BAG ITEM TO REMOVE
                <span className="hidden sm:inline"> / DRAG ON DESKTOP</span>
              </p>
            </section>
          </div>

          <aside className="hidden space-y-3 lg:block">
            <BossPanel boss={boss} />
            <Timer seconds={secondsLeft} total={round.timeLimit} />
            {submitButton()}
            <p className="font-mono text-[9px] leading-relaxed tracking-[0.04em] text-muted">
              The bot has already made its pick. Its method stays hidden until the
              reveal.
            </p>
          </aside>
        </main>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-paper/20 bg-ink/95 p-3 backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-xl items-center gap-3">
            <Timer seconds={secondsLeft} total={round.timeLimit} compact />
            {submitButton("flex-1 py-3")}
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeItem ? <ItemGhost item={activeItem} /> : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
