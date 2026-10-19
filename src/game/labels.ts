import type { BossStrategy, Difficulty, Grade } from "./types";

export const DIFFICULTY_META: Record<
  Difficulty,
  { name: string; time: string; note: string; short: string }
> = {
  easy: { name: "慢慢挑", time: "40 秒", note: "陷阱少，先赢一把", short: "慢" },
  medium: { name: "正常逛", time: "30 秒", note: "有坑，也有肉", short: "稳" },
  hard: { name: "限时抢", time: "20 秒", note: "老手再进", short: "狠" },
};

export const GRADE_META: Record<Grade, { title: string; note: string }> = {
  S: { title: "神算", note: "这就是标准答案" },
  A: { title: "稳赚", note: "又赢又接近最优" },
  B: { title: "小赚", note: "赢了老板一包" },
  C: { title: "差点", note: "没赢，但算得不差" },
  D: { title: "被拿捏", note: "这单交学费" },
};

export const METHOD_META: Record<
  BossStrategy,
  { name: string; description: string; formula: string }
> = {
  ratio: {
    name: "性价比贪心",
    description:
      "按每件货「值 ÷ 重」从高到低拿，装不下就跳过。它只看眼前最划算的那一件，不会回头检查整包。",
    formula: "值 ÷ 重",
  },
  value: {
    name: "最大件贪心",
    description:
      "先拿标价最高的，不管有多重。贵的东西不一定装得下，但它不在乎。",
    formula: "只看值",
  },
  weight: {
    name: "最轻贪心",
    description: "先拿最轻的，能多塞几件是几件。它追求数量，不追求总价值。",
    formula: "只看重",
  },
  "ratio-swap": {
    name: "性价比 + 一件替换",
    description:
      "先用性价比拿满，再试着换掉一件。比普通贪心多检查一步，但依然不是全局最优。",
    formula: "性价比 + 复盘",
  },
};
