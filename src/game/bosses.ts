import type { Boss } from "./types";

export const BOSSES: Boss[] = [
  {
    id: "milk-frog",
    name: "奶蛙",
    alias: "MILK FROG",
    emoji: "🐸",
    strategy: "value",
    tagline: "一口吞掉最大的。",
    intro: "看起来最贵的，先给我。",
    winLine: "咕咕嘎嘎。你的计算，不够贪。",
    loseLine: "……嗝。刚才那口不算。",
    tieLine: "我们一样贪，也一样的错。",
    accent: "#c8ff4a",
    image: "/bosses/milk-frog.webp",
  },
  {
    id: "yellow-rush",
    name: "黄鼠",
    alias: "YELLOW RUSH",
    emoji: "🐭",
    strategy: "weight",
    tagline: "最轻的先跑。",
    intro: "时间就是价值，轻的才跑得快。",
    winLine: "超时了，宝贝。",
    loseLine: "你……你居然算得比我快。",
    tieLine: "同速送达。",
    accent: "#ffd400",
    image: "/bosses/yellow-rush.webp",
  },
  {
    id: "bull-rush",
    name: "牛来",
    alias: "BULL RUSH",
    emoji: "🐮",
    strategy: "ratio",
    tagline: "死鱼眼，但会算性价比。",
    intro: "我只拿当前最划算的那一个。",
    winLine: "贪心，从不回头看。",
    loseLine: "……这不对。让我再算一遍。",
    tieLine: "算你跟我一样贪。",
    accent: "#ff8b3d",
    image: "/bosses/bull-rush.webp",
  },
  {
    id: "engineer",
    name: "梁子",
    alias: "THE ENGINEER",
    emoji: "🧑🏻‍💻",
    strategy: "ratio-swap",
    tagline: "先选，再复盘。",
    intro: "贪心之后，我会检查一遍。",
    winLine: "你没有复盘。",
    loseLine: "这个解……比我的更优。",
    tieLine: "工程上可以接受。",
    accent: "#6da8ff",
    image: "/bosses/engineer.webp",
  },
];

export const MVP_BOSS_ID = "bull-rush";

export function getBoss(id: string): Boss {
  return BOSSES.find((boss) => boss.id === id) ?? BOSSES[2];
}
