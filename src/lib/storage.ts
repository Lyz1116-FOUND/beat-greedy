const BEST_KEY = "beat-greedy:best";
const SOUND_KEY = "beat-greedy:sound";

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

export function readSound(): boolean {
  try {
    return window.localStorage.getItem(SOUND_KEY) !== "off";
  } catch {
    return true;
  }
}

export function writeSound(enabled: boolean): void {
  try {
    window.localStorage.setItem(SOUND_KEY, enabled ? "on" : "off");
  } catch {
    // Keep the in-memory preference when storage is unavailable.
  }
}
