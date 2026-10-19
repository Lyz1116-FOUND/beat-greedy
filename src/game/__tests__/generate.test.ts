import { describe, expect, it } from "vitest";
import { generateRound } from "../generate";
import { solveGreedy } from "../greedy";
import { solveOptimal } from "../optimal";
import type { Difficulty } from "../types";

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

describe("generateRound", () => {
  it("always produces a valid, non-trivial round", () => {
    for (const difficulty of DIFFICULTIES) {
      for (let seed = 1; seed <= 30; seed += 1) {
        const round = generateRound(seed, difficulty);
        const totalWeight = round.items.reduce((total, item) => total + item.weight, 0);
        const maxWeight = Math.max(...round.items.map((item) => item.weight));

        expect(round.items).toHaveLength(8);
        expect(new Set(round.items.map((item) => item.id)).size).toBe(8);
        expect(round.items.every((item) => item.weight > 0 && item.value > 0)).toBe(true);
        expect(maxWeight).toBeLessThanOrEqual(round.capacity);
        expect(totalWeight).toBeGreaterThan(round.capacity);

        const optimal = solveOptimal(round.items, round.capacity);
        const greedy = solveGreedy(round.items, round.capacity, "ratio");
        expect(optimal.value).toBeGreaterThan(0);
        expect(optimal.itemIds.length).toBeGreaterThanOrEqual(2);
        expect(greedy.itemIds.length).toBeGreaterThanOrEqual(2);
        expect(greedy.value).toBeLessThanOrEqual(optimal.value);
        expect(greedy.weight).toBeLessThanOrEqual(round.capacity);
        expect(round.capacity / totalWeight).toBeGreaterThanOrEqual(0.36);
        expect(round.capacity / totalWeight).toBeLessThanOrEqual(0.58);
      }
    }
  });

  it("uses difficulty-specific time limits", () => {
    expect(generateRound(1, "easy").timeLimit).toBe(40);
    expect(generateRound(1, "medium").timeLimit).toBe(30);
    expect(generateRound(1, "hard").timeLimit).toBe(20);
  });

  it("is deterministic for a seed", () => {
    expect(generateRound(12345, "medium")).toEqual(generateRound(12345, "medium"));
  });

  it("mixes winnable and greedy-is-optimal rounds", () => {
    let gapRounds = 0;
    let perfectGreedyRounds = 0;

    for (let seed = 1; seed <= 80; seed += 1) {
      const round = generateRound(seed, "medium");
      const optimal = solveOptimal(round.items, round.capacity);
      const greedy = solveGreedy(round.items, round.capacity, "ratio");
      if (optimal.value > greedy.value) gapRounds += 1;
      if (optimal.value === greedy.value) perfectGreedyRounds += 1;
    }

    expect(gapRounds).toBeGreaterThan(20);
    expect(perfectGreedyRounds).toBeGreaterThan(3);
  });
});
