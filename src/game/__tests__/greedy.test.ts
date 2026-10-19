import { describe, expect, it } from "vitest";
import { solveGreedy } from "../greedy";
import { solveOptimal } from "../optimal";
import type { BossStrategy, Item } from "../types";

const items: Item[] = [
  { id: "a", name: "辣条", icon: "spicy-strip", weight: 5, value: 10 },
  { id: "b", name: "奶糖", icon: "candy", weight: 6, value: 11 },
  { id: "c", name: "弹珠", icon: "marbles", weight: 4, value: 8 },
  { id: "d", name: "蒲扇", icon: "fan", weight: 9, value: 9 },
];

describe("solveGreedy", () => {
  const strategies: BossStrategy[] = ["ratio", "value", "weight", "ratio-swap"];

  it("never exceeds capacity", () => {
    for (const strategy of strategies) {
      const result = solveGreedy(items, 10, strategy);
      expect(result.weight).toBeLessThanOrEqual(10);
      expect(result.value).toBe(
        result.itemIds.reduce(
          (total, id) => total + items.find((item) => item.id === id)!.value,
          0,
        ),
      );
    }
  });

  it("uses value density for ratio greedy", () => {
    const result = solveGreedy(items, 10, "ratio");
    expect(result.itemIds).toEqual(["a", "c"]);
    expect(result.value).toBe(18);
  });

  it("uses the lightest items for weight greedy", () => {
    const result = solveGreedy(items, 10, "weight");
    expect(result.itemIds).toEqual(["a", "c"]);
    expect(result.weight).toBe(9);
  });

  it("picks the biggest value first, then fills remaining space", () => {
    const result = solveGreedy(items, 10, "value");
    expect(result.itemIds).toEqual(["b", "c"]);
    expect(result.value).toBe(19);
  });

  it("ratio-swap is never worse than ratio", () => {
    for (let capacity = 1; capacity <= 20; capacity += 1) {
      const ratio = solveGreedy(items, capacity, "ratio");
      const swapped = solveGreedy(items, capacity, "ratio-swap");
      expect(swapped.value).toBeGreaterThanOrEqual(ratio.value);
      expect(swapped.value).toBeLessThanOrEqual(
        solveOptimal(items, capacity).value,
      );
    }
  });

  it("is deterministic", () => {
    expect(solveGreedy(items, 10, "ratio-swap")).toEqual(
      solveGreedy(items, 10, "ratio-swap"),
    );
  });
});
