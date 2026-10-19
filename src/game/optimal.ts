import type { Item, Selection } from "./types";

export function solveOptimal(items: readonly Item[], capacity: number): Selection {
  const count = items.length;
  const dp: number[][] = Array.from({ length: count + 1 }, () =>
    new Array<number>(capacity + 1).fill(0),
  );

  for (let i = 1; i <= count; i += 1) {
    const item = items[i - 1];
    for (let c = 0; c <= capacity; c += 1) {
      dp[i][c] = dp[i - 1][c];
      if (item.weight <= c) {
        dp[i][c] = Math.max(dp[i][c], dp[i - 1][c - item.weight] + item.value);
      }
    }
  }

  const itemIds: string[] = [];
  let remaining = capacity;

  for (let i = count; i > 0; i -= 1) {
    if (dp[i][remaining] === dp[i - 1][remaining]) continue;
    const item = items[i - 1];
    itemIds.push(item.id);
    remaining -= item.weight;
  }

  itemIds.reverse();
  const chosen = new Set(itemIds);
  const chosenItems = items.filter((item) => chosen.has(item.id));

  return {
    itemIds,
    weight: chosenItems.reduce((total, item) => total + item.weight, 0),
    value: chosenItems.reduce((total, item) => total + item.value, 0),
  };
}

export function solveOptimalBruteForce(items: readonly Item[], capacity: number): Selection {
  let best: Selection = { itemIds: [], weight: 0, value: 0 };
  const count = items.length;

  for (let mask = 0; mask < 1 << count; mask += 1) {
    let weight = 0;
    let value = 0;
    const itemIds: string[] = [];

    for (let i = 0; i < count; i += 1) {
      if ((mask & (1 << i)) === 0) continue;
      const item = items[i];
      weight += item.weight;
      value += item.value;
      if (weight > capacity) break;
      itemIds.push(item.id);
    }

    if (weight <= capacity && value > best.value) {
      best = { itemIds, weight, value };
    }
  }

  return best;
}
