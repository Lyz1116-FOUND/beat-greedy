import { describe, expect, it } from "vitest";
import { generateRound } from "../generate";
import { solveOptimal, solveOptimalBruteForce } from "../optimal";
import { createRng } from "../rng";
import type { Item } from "../types";

function randomItems(seed: number, count: number): Item[] {
  const rng = createRng(seed);
  return Array.from({ length: count }, (_, index) => {
    const weight = rng.int(1, 10);
    const value = rng.int(1, 30);
    return {
      id: `item-${index}`,
      name: `Item ${index}`,
      icon: "coin",
      weight,
      value,
    };
  });
}

describe("solveOptimal", () => {
  it("matches brute force on random small instances", () => {
    for (let seed = 1; seed <= 200; seed += 1) {
      const items = randomItems(seed, 8);
      const capacity = createRng(seed * 7).int(5, 30);
      const dp = solveOptimal(items, capacity);
      const brute = solveOptimalBruteForce(items, capacity);
      expect(dp.value).toBe(brute.value);
      expect(dp.weight).toBeLessThanOrEqual(capacity);
      expect(
        dp.itemIds.reduce(
          (total, id) => total + items.find((item) => item.id === id)!.weight,
          0,
        ),
      ).toBe(dp.weight);
    }
  });

  it("matches brute force on generated rounds", () => {
    for (let seed = 1; seed <= 40; seed += 1) {
      const round = generateRound(seed, "hard");
      expect(solveOptimal(round.items, round.capacity).value).toBe(
        solveOptimalBruteForce(round.items, round.capacity).value,
      );
    }
  });

  it("handles an empty and zero-capacity backpack", () => {
    expect(solveOptimal([], 10)).toEqual({ itemIds: [], weight: 0, value: 0 });
    expect(solveOptimal(randomItems(1, 5), 0)).toEqual({
      itemIds: [],
      weight: 0,
      value: 0,
    });
  });
});
