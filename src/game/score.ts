import { selectionFromIds, solveGreedy } from "./greedy";
import { solveOptimal } from "./optimal";
import type { BossStrategy, Grade, Round, RoundResult } from "./types";

export function gradeRound(
  playerValue: number,
  optimalValue: number,
  beat: boolean,
): Grade {
  const optimality = optimalValue > 0 ? playerValue / optimalValue : 0;
  if (playerValue === optimalValue) return "S";
  if (beat && optimality >= 0.95) return "A";
  if (beat) return "B";
  if (optimality >= 0.85) return "C";
  return "D";
}

export function evaluateRound(
  round: Round,
  bossStrategy: BossStrategy,
  playerItemIds: readonly string[],
  secondsLeft: number,
): RoundResult {
  const player = selectionFromIds(round.items, playerItemIds);
  const boss = solveGreedy(round.items, round.capacity, bossStrategy);
  const optimal = solveOptimal(round.items, round.capacity);
  const optimality = optimal.value > 0 ? player.value / optimal.value : 0;
  const beat = player.value > boss.value;
  const tie = player.value === boss.value;
  const safeSeconds = Math.max(0, Math.floor(secondsLeft));
  const score =
    Math.round(1000 * optimality) + (beat ? 300 : 0) + safeSeconds * 5;

  return {
    player,
    boss,
    optimal,
    optimality,
    beat,
    tie,
    score,
    grade: gradeRound(player.value, optimal.value, beat),
    secondsLeft: safeSeconds,
  };
}
