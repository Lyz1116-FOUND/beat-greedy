export interface Rng {
  next: () => number;
  int: (min: number, max: number) => number;
  pick: <T>(values: readonly T[]) => T;
  shuffle: <T>(values: readonly T[]) => T[];
}

export function createRng(seed: number): Rng {
  let state = seed >>> 0;

  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const int = (min: number, max: number) =>
    min + Math.floor(next() * (max - min + 1));

  const pick = <T,>(values: readonly T[]): T => {
    if (values.length === 0) throw new Error("Cannot pick from an empty list");
    return values[int(0, values.length - 1)];
  };

  const shuffle = <T,>(values: readonly T[]): T[] => {
    const result = [...values];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = int(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  return { next, int, pick, shuffle };
}

export function randomSeed(): number {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    return crypto.getRandomValues(new Uint32Array(1))[0];
  }
  return (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
}
