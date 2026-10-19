const BEST_KEY = "beat-greedy:best";

export function readBest(): number {
  try {
    const value = Number(window.localStorage.getItem(BEST_KEY));
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

export function writeBest(value: number): void {
  try {
    window.localStorage.setItem(BEST_KEY, String(Math.floor(value)));
  } catch {
    // Storage can be unavailable in private browsing; the session still works.
  }
}
