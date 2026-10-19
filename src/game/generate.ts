import { createRng } from "./rng";
import { solveGreedy } from "./greedy";
import { solveOptimal } from "./optimal";
import { MVP_BOSS_ID } from "./bosses";
import type { Difficulty, Item, ItemIconKey, Round } from "./types";

const TEMPLATES: readonly { name: string; icon: ItemIconKey }[] = [
  { name: "辣条", icon: "spicy-strip" },
  { name: "老冰棍", icon: "ice-pop" },
  { name: "快乐水", icon: "soda" },
  { name: "干脆面", icon: "noodle" },
  { name: "卤蛋", icon: "egg" },
  { name: "烤肠", icon: "sausage" },
  { name: "奶糖", icon: "candy" },
  { name: "金币巧克力", icon: "coin" },
  { name: "糖葫芦", icon: "tanghulu" },
  { name: "烤红薯", icon: "sweet-potato" },
  { name: "冰西瓜", icon: "watermelon" },
  { name: "小游戏机", icon: "handheld" },
  { name: "随身听", icon: "walkman" },
  { name: "搪瓷杯", icon: "mug" },
  { name: "铁皮蛙", icon: "tin-frog" },
  { name: "玻璃弹珠", icon: "marbles" },
  { name: "小人书", icon: "comic" },
  { name: "暖水瓶", icon: "thermos" },
  { name: "小板凳", icon: "stool" },
  { name: "蒲扇", icon: "fan" },
  { name: "电子表", icon: "watch" },
  { name: "半导体", icon: "radio" },
  { name: "泡泡糖", icon: "gum" },
  { name: "火柴", icon: "matches" },
];

const TIME_LIMITS: Record<Difficulty, number> = {
  easy: 40,
  medium: 30,
  hard: 20,
};

const GAP_BANDS: Record<Difficulty, readonly [number, number]> = {
  easy: [0.03, 0.13],
  medium: [0.06, 0.22],
  hard: [0.1, 0.34],
};

const CAPACITY_BANDS: Record<Difficulty, readonly [number, number]> = {
  easy: [0.45, 0.58],
  medium: [0.4, 0.55],
  hard: [0.36, 0.5],
};

const NOISE_SCALE: Record<Difficulty, number> = {
  easy: 2.5,
  medium: 4.5,
  hard: 6.5,
};

function makeAttempt(
  seed: number,
  difficulty: Difficulty,
  attempt: number,
): Round {
  const rng = createRng((seed + attempt * 0x9e3779b9) >>> 0);
  const templates = rng.shuffle(TEMPLATES).slice(0, 8);

  const items: Item[] = templates.map(({ name, icon }, index) => {
    const weight = rng.int(2, 9);
    const density = 1.6 + rng.next() * 2.6;
    const noise = (rng.next() * 2 - 1) * NOISE_SCALE[difficulty];
    let value = Math.max(2, Math.round(weight * density + noise));

    if (difficulty === "hard" && rng.next() < 0.35) {
      if (rng.next() < 0.5 && weight <= 4) {
        value = Math.round(weight * (4.6 + rng.next() * 1.8));
      } else if (weight >= 7) {
        value = Math.round(weight * (2.2 + rng.next() * 0.9));
      }
    }

    return {
      id: `item-${index}`,
      name,
      icon,
      weight,
      value,
    };
  });

  const totalWeight = items.reduce((total, item) => total + item.weight, 0);
  const sortedWeights = items.map((item) => item.weight).sort((a, b) => a - b);
  const lightestThree =
    sortedWeights[0] + sortedWeights[1] + sortedWeights[2];
  const hardMin = Math.max(sortedWeights[sortedWeights.length - 1], lightestThree);
  const [minRatio, maxRatio] = CAPACITY_BANDS[difficulty];
  const preferredMin = Math.ceil(totalWeight * minRatio);
  const preferredMax = Math.floor(totalWeight * maxRatio);
  const maxCapacity = Math.max(
    hardMin,
    Math.min(totalWeight - sortedWeights[0], preferredMax),
  );
  const minCapacity = Math.min(
    maxCapacity,
    Math.max(hardMin, preferredMin),
  );
  const capacity = rng.int(minCapacity, maxCapacity);

  return {
    id: `round-${seed.toString(16)}`,
    seed,
    difficulty,
    capacity,
    items,
    bossId: MVP_BOSS_ID,
    timeLimit: TIME_LIMITS[difficulty],
  };
}

export function generateRound(
  seed: number,
  difficulty: Difficulty,
  bossId = MVP_BOSS_ID,
  attempts = 180,
): Round {
  const modeRng = createRng((seed ^ 0xa5a5a5a5) >>> 0);
  const wantsPerfectGreedy = modeRng.next() < 0.22;
  const [minGap, maxGap] = GAP_BANDS[difficulty];
  const targetGap = (minGap + maxGap) / 2;

  let best: Round | null = null;
  let lastValid: Round | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  let bestGap = wantsPerfectGreedy ? Number.POSITIVE_INFINITY : -1;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const candidate = makeAttempt(seed, difficulty, attempt);
    const greedy = solveGreedy(candidate.items, candidate.capacity, "ratio");
    const optimal = solveOptimal(candidate.items, candidate.capacity);

    if (
      optimal.value < 24 ||
      optimal.itemIds.length < 2 ||
      greedy.itemIds.length < 2
    ) {
      continue;
    }

    lastValid = candidate;
    const gap = (optimal.value - greedy.value) / optimal.value;

    if (wantsPerfectGreedy) {
      if (gap === 0) {
        return { ...candidate, bossId };
      }
      if (gap < bestGap) {
        bestGap = gap;
        best = candidate;
      }
      continue;
    }

    if (gap > 0 && gap >= minGap && gap <= maxGap) {
      return { ...candidate, bossId };
    }

    const distance = gap > 0 ? Math.abs(gap - targetGap) : 1;
    if (gap > 0 && distance < bestDistance) {
      bestDistance = distance;
      best = candidate;
    }
  }

  if (best) return { ...best, bossId };
  if (lastValid) return { ...lastValid, bossId };

  return {
    ...makeAttempt(seed, difficulty, 0),
    bossId,
  };
}
