import type { PlayStats, RoundResult } from "./types";

export type BanterEvent =
  | "firstPick"
  | "pick"
  | "remove"
  | "reject"
  | "tight"
  | "lowTime"
  | "submit"
  | "idle";

const DEFAULT_LINES: Record<BanterEvent, readonly string[]> = {
  firstPick: [
    "第一件就这？行吧，开张。",
    "眼光不错。可惜，不够贪。",
    "拿得挺快。账算清了吗？",
  ],
  pick: [
    "拿，继续拿。包会替你算账。",
    "这一件，我进货价都比你低。",
    "你挑你的，我算我的。",
    "有点意思。但还差一点。",
    "别急，重头戏在后头。",
  ],
  remove: [
    "哦？反悔了？我也常反悔。",
    "拿出来容易，再放回去可要想清楚。",
    "对，再算一遍。我不着急。",
  ],
  reject: [
    "塞不下就是塞不下，别硬塞。",
    "包：我真的会谢。",
    "硬塞的样子，像极了周一。",
    "超了就是超了，账不认眼泪。",
  ],
  tight: [
    "满了满了，再塞要爆了。",
    "你这包，鼓得像月底的钱包。",
    "就剩这点缝了，悠着点。",
  ],
  lowTime: [
    "手别抖，账会错。",
    "最后几秒，开始表演。",
    "时间不等人，但我等你。",
  ],
  submit: ["行，开盲盒。", "交卷。让我看看你的格局。", "数货中，别眨眼。"],
  idle: [
    "再算，天就黑了。",
    "你不动，我可要涨价了。",
    "怎么，货架不好看？",
  ],
};

const BOSS_LINES: Record<
  string,
  Partial<Record<BanterEvent, readonly string[]>>
> = {
  "bull-rush": {
    firstPick: ["先挑最顺眼的？我懂，我也是。", "拿吧。反正最后都得跟我比。"],
    pick: [
      "这件单价不错。可惜，我早拿走了。",
      "你拿的是热闹，我拿的是差价。",
      "每一件都想要？包可不这么想。",
    ],
    remove: ["退？行，反正亏的不是我。", "我就喜欢看你重新算。"],
    reject: ["包小就别贪。做人也是。", "塞不下还硬塞，像话吗？"],
    tight: ["拉链快哭了。", "再塞，这单算你赔。"],
    lowTime: ["最后十秒。算盘借你？", "快点，牛都要下班了。"],
    submit: ["账本摊开，说话。", "开吧，我等着看差价。"],
  },
  "milk-frog": {
    firstPick: ["先拿？我先咽口水。"],
    pick: ["看起来贵的，才配进我的嘴。"],
    reject: ["吞不下就别吞。"],
  },
  "yellow-rush": {
    firstPick: ["快拿快拿，我还要送下一单。"],
    pick: ["轻的才跑得快，你懂不懂？"],
    lowTime: ["超时了可别怪我。"],
  },
  engineer: {
    firstPick: ["先选。等会儿我会复盘。"],
    pick: ["先拿，不检查一遍等于没拿。"],
    reject: ["容量是硬约束，兄弟。"],
  },
};

const lastLine = new Map<string, string>();

function draw(pool: readonly string[], key: string): string {
  if (pool.length === 0) return "";
  if (pool.length === 1) return pool[0];
  const previous = lastLine.get(key);
  const candidates = pool.filter((line) => line !== previous);
  const line = candidates[Math.floor(Math.random() * candidates.length)];
  lastLine.set(key, line);
  return line;
}

export function drawBanter(event: BanterEvent, bossId: string): string {
  const specific = BOSS_LINES[bossId]?.[event];
  if (specific && Math.random() < 0.76) {
    return draw(specific, `${bossId}:${event}`);
  }
  return draw(DEFAULT_LINES[event], `default:${event}`);
}

export function drawIdleBanter(bossId: string): string {
  return drawBanter("idle", bossId);
}

const RESULT_LINES = {
  win: [
    "这包卖我，我收了。",
    "你赢了这单，下一单可不一定。",
    "算法之神今天站你这边。",
  ],
  tie: [
    "咱俩的算盘，今天一个响。",
    "平手。谁也没占到便宜。",
    "巧了，想到一块去了。",
  ],
  lose: [
    "你盯着眼前，我盯着你的包。",
    "差的那点，刚好是我的利润。",
    "下次记得，最划算的不一定最值钱。",
  ],
  perfect: [
    "你把标准答案抄下来了？",
    "满配。这单我认亏。",
    "行了行了，货架都让你算穿了。",
  ],
} as const;

export function drawResultLine(
  kind: keyof typeof RESULT_LINES,
  salt: string,
): string {
  return draw(RESULT_LINES[kind], `result:${kind}:${salt}`);
}

export interface Archetype {
  title: string;
  note: string;
  tone: "jade" | "vermilion" | "ink";
}

export function getArchetype(
  result: RoundResult,
  stats: PlayStats,
): Archetype {
  if (result.optimality >= 1) {
    return {
      title: "人形计算器",
      note: "标准答案就写在货架上，你只是把它拿下来了。",
      tone: "jade",
    };
  }
  if (result.beat && stats.removals >= 3) {
    return {
      title: "反复横跳王",
      note: "拿进拿出，最后还真让你算对了。",
      tone: "jade",
    };
  }
  if (result.beat && result.secondsLeft >= 10) {
    return {
      title: "快手老贼",
      note: "手快，心更黑。老板还没拨完算盘。",
      tone: "jade",
    };
  }
  if (result.beat) {
    return {
      title: "闷声发财",
      note: "不声不响，把老板算进去了。",
      tone: "jade",
    };
  }
  if (result.tie) {
    return {
      title: "五五开",
      note: "你和老板的算盘，今天同一个响。",
      tone: "ink",
    };
  }
  if (result.optimality >= 0.9) {
    return {
      title: "差一块钱",
      note: "就差一点。老板笑得很轻。",
      tone: "ink",
    };
  }
  if (stats.rejections >= 3) {
    return {
      title: "硬塞选手",
      note: "包装不下，欲望装得下。",
      tone: "vermilion",
    };
  }
  return {
    title: "被拿捏了",
    note: "你盯着眼前，老板盯着你的包。",
    tone: "vermilion",
  };
}
