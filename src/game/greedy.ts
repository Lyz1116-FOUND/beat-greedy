import type { Item, Selection } from "./types";

export function selectionFromIds(items: Item[], itemIds: readonly string[]): Selection {
  const wanted = new Set(itemIds);
  const chosen = items.filter((item) => wanted.has(item.id));
  return {
    itemIds: chosen.map((item) => item.id),
    weight: chosen.reduce((total, item) => total + item.weight, 0),
    value: chosen.reduce((total, item) => total + item.value, 0),
  };
}

export function compareRatio(a: Item, b: Item): number {
  const left = a.value * b.weight;
  const right = b.value * a.weight;
  if (left !== right) return right - left;
  if (a.value !== b.value) return b.value - a.value;
  return a.id.localeCompare(b.id);
}

export function solveGreedy(
  items: readonly Item[],
  capacity: number,
  strategy: "ratio" | "value" | "weight" | "ratio-swap",
): Selection {
  const indexed = items.map((item, index) => ({ item, index }));
  const sorted = [...indexed].sort((a, b) => {
    if (strategy === "weight") {
      if (a.item.weight !== b.item.weight) return a.item.weight - b.item.weight;
      return compareRatio(a.item, b.item);
    }
    if (strategy === "value") {
      if (a.item.value !== b.item.value) return b.item.value - a.item.value;
      return compareRatio(a.item, b.item);
    }
    return compareRatio(a.item, b.item) || a.index - b.index;
  });

  const chosen = new Set<number>();
  let weight = 0;
  let value = 0;

  for (const { item, index } of sorted) {
    if (weight + item.weight <= capacity) {
      chosen.add(index);
      weight += item.weight;
      value += item.value;
    }
  }

  if (strategy === "ratio-swap") {
    let bestDelta = 0;
    let bestOut = -1;
    let bestIn = -1;

    for (const outIndex of chosen) {
      const outItem = items[outIndex];
      for (let inIndex = 0; inIndex < items.length; inIndex += 1) {
        if (chosen.has(inIndex)) continue;
        const inItem = items[inIndex];
        if (weight - outItem.weight + inItem.weight > capacity) continue;
        const delta = inItem.value - outItem.value;
        if (delta > bestDelta) {
          bestDelta = delta;
          bestOut = outIndex;
          bestIn = inIndex;
        }
      }
    }

    if (bestOut >= 0 && bestIn >= 0) {
      chosen.delete(bestOut);
      chosen.add(bestIn);
      weight = [...chosen].reduce((total, index) => total + items[index].weight, 0);
      value = [...chosen].reduce((total, index) => total + items[index].value, 0);
    }
  }

  const itemIds = [...chosen]
    .sort((a, b) => a - b)
    .map((index) => items[index].id);

  return { itemIds, weight, value };
}
