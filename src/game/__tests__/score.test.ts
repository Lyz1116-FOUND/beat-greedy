import { describe, expect, it } from "vitest";
import { evaluateRound, gradeRound } from "../score";
import type { Round } from "../types";

const round: Round = {
  id: "round-test",
  seed: 1,
  difficulty: "easy",
  capacity: 10,
  bossId: "bull-rush",
  timeLimit: 40,
  items: [
    { id: "a", name: "A", emoji: "🅰️", weight: 5, value: 10 },
    { id: "b", name: "B", emoji: "🅱️", weight: 6, value: 11 },
    { id: "c", name: "C", emoji: "🇨", weight: 4, value: 8 },
    { id: "d", name: "D", emoji: "🇩", weight: 9, value: 9 },
  ],
};

describe("evaluateRound", () => {
  it("grades a perfect player as S and adds the speed bonus", () => {
    const result = evaluateRound(round, "ratio", ["b", "c"], 5);
    expect(result.player.value).toBe(19);
    expect(result.boss.value).toBe(18);
    expect(result.optimal.value).toBe(19);
    expect(result.beat).toBe(true);
    expect(result.tie).toBe(false);
    expect(result.optimality).toBe(1);
    expect(result.grade).toBe("S");
    expect(result.score).toBe(1325);
  });

  it("does not award the beat bonus on a tie", () => {
    const result = evaluateRound(round, "ratio", ["a", "c"], 0);
    expect(result.player.value).toBe(18);
    expect(result.boss.value).toBe(18);
    expect(result.tie).toBe(true);
    expect(result.beat).toBe(false);
    expect(result.score).toBe(947);
  });

  it("scores a losing choice from optimality only", () => {
    const result = evaluateRound(round, "ratio", ["a"], 3);
    expect(result.player.value).toBe(10);
    expect(result.beat).toBe(false);
    expect(result.tie).toBe(false);
    expect(result.grade).toBe("D");
    expect(result.score).toBe(526 + 15);
  });

  it("clamps negative time to zero", () => {
    const result = evaluateRound(round, "ratio", ["b", "c"], -10);
    expect(result.secondsLeft).toBe(0);
    expect(result.score).toBe(1300);
  });
});

describe("gradeRound", () => {
  it("assigns grades at the boundaries", () => {
    expect(gradeRound(100, 100, false)).toBe("S");
    expect(gradeRound(96, 100, true)).toBe("A");
    expect(gradeRound(90, 100, true)).toBe("B");
    expect(gradeRound(85, 100, false)).toBe("C");
    expect(gradeRound(84, 100, false)).toBe("D");
  });
});
