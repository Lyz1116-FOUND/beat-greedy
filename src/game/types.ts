export type Difficulty = "easy" | "medium" | "hard";

export type BossStrategy = "ratio" | "value" | "weight" | "ratio-swap";

export type Grade = "S" | "A" | "B" | "C" | "D";

export interface Item {
  id: string;
  name: string;
  emoji: string;
  weight: number;
  value: number;
}

export interface Selection {
  itemIds: string[];
  weight: number;
  value: number;
}

export interface Round {
  id: string;
  seed: number;
  difficulty: Difficulty;
  capacity: number;
  items: Item[];
  bossId: string;
  timeLimit: number;
}

export interface Boss {
  id: string;
  name: string;
  alias: string;
  emoji: string;
  strategy: BossStrategy;
  tagline: string;
  intro: string;
  winLine: string;
  loseLine: string;
  tieLine: string;
  accent: string;
  image?: string;
}

export interface RoundResult {
  player: Selection;
  boss: Selection;
  optimal: Selection;
  optimality: number;
  beat: boolean;
  tie: boolean;
  score: number;
  grade: Grade;
  secondsLeft: number;
}
