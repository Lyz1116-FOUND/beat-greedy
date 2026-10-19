# BEAT GREEDY — 项目总计划

> Last updated: 2026-10-20
> Status: 立项完成 / 待开工
> 一句话：和一只只会“选眼前最好”的 Boss 抢背包。你赢它，再逼近真正的最优解。

---

## 0. 产品定位

- 类型：纯前端、单局 20–40 秒、可连续重开的算法对抗小游戏
- 平台：浏览器，桌面 + 手机，链接直接分享
- 核心对立：**局部最优 ≠ 全局最优**
- 首发玩法：Knapsack（0/1 背包）
- 首发范围：只做 Knapsack，不做账号、排行榜、后端、多人
- 后续世界：Scheduling → Route Planning (TSP) → Set Cover → Graph Coloring

### 设计支柱

1. **10 秒看懂**：看物品、算一算、拖进背包、提交。
2. **每局都有对手**：不是孤独做题，而是和 Boss 比；Boss 会输也会赢。
3. **答案同时揭晓**：YOU / BOSS / OPTIMAL 三列同屏，立刻明白差在哪。
4. **再来一局零摩擦**：结算页一键下一局，总分之一直累积。
5. **梗是皮，算法是骨**：Boss 用不同贪心策略；玩家学的是反制直觉。

---

## 1. 一局完整流程

```
TITLE
  ├─ 选难度 Easy / Medium / Hard
  └─ PLAY
        ↓
ROUND INTRO（首局或新 Boss 才停留，可跳过）
  ├─ Boss 立绘 + 台词（暗示它的贪心倾向）
  └─ “ROUND 01” 盖章 → 1 秒后进入
        ↓
PLAYING（计时开始）
  ├─ 顶部：ROUND / 总分 / 容量条 / 倒计时
  ├─ 左侧：背包（已选物品，可点掉 / 拖回）
  ├─ 右侧：8 个物品卡（点击或拖入背包）
  ├─ Boss 区域：思考动画，选择保持隐藏
  └─ SUBMIT（提前交卷有少量时间分）
        ↓（超时自动提交）
REVEAL（1.5–2.5 秒的仪式感）
  ├─ “OPENING…” → Boss 选择逐张翻出
  └─ 三列数字滚动：YOU / BOSS / OPTIMAL
        ↓
RESULT
  ├─ 胜负章：YOU BEAT GREEDY / GREEDY WINS / DEAD HEAT
  ├─ Optimality % + Grade（S/A/B/C/D）
  ├─ 分数拆解：基础 + 击败奖励 + 时间奖励
  ├─ 三种选择的物品对照（知道最优解拿了什么）
  └─ PLAY AGAIN（同一难度，立即下一局）
```

### 状态机

`title → intro → playing → revealing → result → (playing | title)`

- 计时只在 `playing` 生效；页面失焦时暂停。
- 提交后立即锁操作。
- 结算完成前不能跳下一局，避免吞动画。
- 刷新页面回到 title，当前局不恢复（MVP 不做存档局）。

---

## 2. Knapsack 规则（MVP）

### 题目

- 每局 8 个物品。
- 每个物品：图标、名字、重量 `weight`、价值 `value`（均为正整数）。
- 背包容量 `capacity`。
- 目标：总重量 ≤ capacity 的前提下，最大化总价值。

### 玩家操作

- **点击物品卡**加入 / 移出背包（主交互）。
- **拖拽物品**进背包 / 从背包拖出（dnd-kit，桌面增强，不是唯一操作方式）。
- 超过容量：禁止放入，卡片抖动 + “OVER CAPACITY” 提示。
- 可随时换选，SUBMIT 后锁定。

### 对手

- Boss 使用一个确定的贪心策略，选择在提交前完全隐藏。
- Boss 不超容量：按策略顺序扫描，装不下就跳过，继续下一件。
- MVP 策略：**Ratio Greedy**（`value / weight` 从高到低）。
- 用整数交叉相乘比较，避免浮点误差。

### 最优解

- 0/1 背包动态规划，容量小（≤ 30），O(n × capacity)。
- DP 同时回溯出最优物品集合，结算时展示。
- 所有价值为正，最优值必 > 0。

### 计时

| 难度 | 物品 | 时间 | 出题倾向 |
|------|------|------|----------|
| Easy | 8 | 40s | 贪心与最优差距小，适合先赢一局 |
| Medium | 8 | 30s | 差距适中，有真有假 |
| Hard | 8 | 20s | 陷阱多，贪心容易翻车，也更容易被反制 |

> 初始值，真实手感以试玩为准；只调参数，不改结构。

### 特殊局

刻意保留约 20–25% 的“贪心即最优”局：

```
YOU 37 / GREEDY 37 / OPTIMAL 37
```

此时玩家最多打平，教学信息是：**贪心有时候真的就是答案**。
结算文案显示 “GREEDY WAS OPTIMAL”，不算失败，但拿不到击败奖励。

---

## 3. 出题生成

### 基础生成

- 物品重量：2–10。
- 物品价值：由重量、价值密度和噪声共同决定（避免纯粹正比，否则 Ratio Greedy 几乎总最优）。
- 容量：约为总重量的 35%–55%，并保证：
  - 最大单件 ≤ 容量；
  - 至少 3 件能同时装下；
  - 不可能全装下；
  - DP 最优值 > 0。
- 从 24 个物品名 / emoji 池中抽 8 个不重复的，增加每局记忆点。
- 使用 seeded PRNG（mulberry32），每局保存 seed，便于复现和未来每日挑战。

### “好玩”筛选

不做纯随机，生成 40–80 组候选，按目标函数挑一组：

- 贪心与最优的差距比例（按难度设目标区间）
- 最优解是否包含明显“反直觉”选择（加分）
- 可行组合数量（不要只有一种解）
- 是否出现“高性价比小件占位、导致大件装不下”的经典陷阱（加分）
- 强制保留一部分贪心即最优的局（约 1/5）

避免死循环：候选打分取最优，不做无限 reject。

### 难度差异

- Easy：价值/重量相关性更高，一眼能看出划算；差距 0–12%。
- Medium：混合噪声；差距 5–20%。
- Hard：故意制造高价值重物、低价值轻物、容量卡边；差距 8–30%。

---

## 4. 评分与段位

### 单局

```
optimality = yourValue / optimalValue
beat       = yourValue > botValue
tie        = yourValue == botValue

roundScore = round(1000 × optimality)
           + (beat ? 300 : 0)
           + secondsLeft × 5
```

- 输了也按最优率拿基础分，鼓励继续逼近最优。
- 超过容量不可能提交，因此不需要违规扣分。
- 总分 = 本次会话累计；最高分写入 localStorage。

### Grade

| Grade | 条件 |
|-------|------|
| S | yourValue == optimalValue |
| A | 击败 Boss 且 optimality ≥ 95% |
| B | 击败 Boss |
| C | 未击败，但 optimality ≥ 85% |
| D | 其余 |

### 结算文案

- 赢：`YOU BEAT GREEDY` + 一句 Boss 破防台词
- 平：`DEAD HEAT` + “这次它没算错”
- 输：`GREEDY WINS` + “局部最优，把你骗了”
- 满优：额外的 `PERFECT` 章 + 彩带（CSS/canvas，轻量）

---

## 5. Boss 阵容

### 设计原则

- **原创二创立绘 + 梗化别名**。参考网络形象的气质、配色、表情，但不直接使用官方 logo、官方吉祥物图、平台二创原图。
- 每个 Boss = 一种“只看眼前”的哲学，对应一种确定性策略。
- Boss 台词必须暗示策略，但不明说公式；玩家可以通过结算复盘学会反制。
- 同一套 Boss 未来可跨模式复用（例如“最快”在背包里是选最轻，在调度里是选最短任务）。

### 首发四人组（Knapsack）

| # | 代号 / 显示名 | 梗来源 | 策略 | 性格 |
|---|---|---|---|---|
| 01 | 奶蛙 / MILK FROG | 网络抽象蛙 | 最高价值优先 | 呆、慢、一口吞最大的 |
| 02 | 黄鼠 / YELLOW RUSH | 黄色外卖鼠（影射，不用官方名） | 最轻优先 | 急、快、先拿了再说 |
| 03 | 牛来 / BULL RUSH | 抽象牛 | 性价比优先（ratio） | 莽，但意外会算账 |
| 04 | 梁子 / THE ENGINEER | DeepSeek 梁子形态 | ratio + 一次单件替换（局部搜索） | 冷面工程师，会复盘 |

> MVP 阶段只实现 **03 牛来 / Ratio Greedy** 一个 Boss 的完整皮 + 玩法；其余在核心循环稳定后逐个加入。

### 第二幕：AI 竞技场（后续）

| 显示名 | 影射 | 策略方向 |
|---|---|---|
| THE PLANNER | 拟人 GPT | 同时评估两种贪心，取更好的一种 |
| THE JUDGE | 拟人 Claude | 保守 ratio：前期拒绝过重物品 |
| TWIN SPARK | 拟人 Gemini | 多策略合议（value / ratio / weight 取最优） |
| THE REBEL | 拟人 Grok | 低 ratio 叛逆选法，高方差 |
| THE SAINT | DeepSeek 梁圣形态 | ratio + 多轮 swap 局部搜索，准最优 |
| THE ORACLE | DP 本身（终局彩蛋） | 真·最优，非贪心 |

- Boss 入场卡：编号、名字、一句英文台词。
- 胜利 / 失败各有专属台词；后续做 Boss 图鉴。
- 对外公开版本使用梗化别名，内部代码键保留来源映射，方便替换。

### 美术方向

- 风格：扁平 2D 贴纸感、粗描边、少量网点/噪点、表情夸张、头身比 1:2。
- 配色：暗墨底 + 米白字 + 酸性黄作主强调色；每个 Boss 一个专属辅色。
- 尺寸：1024×1024 方形立绘，游戏内展示 160–240px；透明或纯色底。
- 首版每 Boss 1 张半身像；后续加胜利表情、失败表情。
- 参考链接与设计 brief 放 `docs/boss-references.md`；游戏内只放原创生成的图，不直接引用网络图片。

---

## 6. 视觉与交互

### 视觉语言

- 标题 / 数字：几何无衬线或等宽字，带一点终端感（Space Grotesk + IBM Plex Mono，自托管）。
- 背景：近黑（`#111110`），轻微噪点纹理。
- 主色：酸性黄 `#D8FF3E`；Boss 失败用猩红，玩家胜利用黄绿。
- 卡片：2px 描边、硬阴影、无圆角或极小圆角，像贴纸 / 卡片。
- 动效：短、硬、有反馈；不做大面积玻璃拟态和紫色渐变。

### 关键 UI

- 容量条：色块刻度，超重前变黄，接近满格闪烁。
- 物品卡：emoji/图标、名字、`W`、`V`；选中后提升 + 打勾。
- Boss 区：立绘 + thinking 点点点；提交后翻牌。
- 结算三列：YOU / BOSS / OPTIMAL，数值滚动，最优列带描边高亮。
- 移动端：单列；物品 2 列网格；Boss 缩成顶部横条；SUBMIT 固定底部。
- 键盘可操作：物品卡为按钮，空格/回车切换；结果页焦点管理。
- `prefers-reduced-motion` 下关闭滚动与彩带。

### 分享

- Vercel 静态链接。
- OG / Twitter meta + 一张 1200×630 静态分享图。
- 结算页提供 “COPY RESULT” 文案（未来接 Web Share API），第一版只复制文本 + 链接。
- 无登录、无后端、无数据库。

---

## 7. 技术方案

### 栈（锁定）

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4（`@tailwindcss/vite`）
- @dnd-kit/core（拖拽增强；点击为主）
- Vitest（算法单测）
- Vercel（部署）
- GitHub（托管）

不引入：Next.js、后端框架、状态管理库、数据库、账号系统、分析 SDK（首版）。
音效首版不做；v1.1 再用 WebAudio 加轻量点击/胜负音，默认关闭。

### 目录

```
/
├─ index.html
├─ package.json
├─ vite.config.ts
├─ PLAN.md
├─ docs/
│  └─ boss-references.md        # 考据链接 + 原创设计 brief（不打包网络图）
├─ public/
│  ├─ og.png
│  └─ bosses/                   # 原创立绘 webp/png
└─ src/
   ├─ main.tsx
   ├─ App.tsx
   ├─ styles/index.css
   ├─ game/
   │  ├─ types.ts
   │  ├─ rng.ts
   │  ├─ generate.ts
   │  ├─ greedy.ts
   │  ├─ optimal.ts
   │  ├─ score.ts
   │  ├─ bosses.ts
   │  └─ __tests__/
   │     ├─ generate.test.ts
   │     ├─ greedy.test.ts
   │     ├─ optimal.test.ts
   │     └─ score.test.ts
   ├─ hooks/
   │  ├─ useRound.ts
   │  └─ useCountdown.ts
   ├─ components/
   │  ├─ StartScreen.tsx
   │  ├─ GameScreen.tsx
   │  ├─ BossPanel.tsx
   │  ├─ ItemCard.tsx
   │  ├─ Backpack.tsx
   │  ├─ CapacityMeter.tsx
   │  ├─ Timer.tsx
   │  ├─ ResultScreen.tsx
   │  └─ GradeStamp.tsx
   └─ lib/
      └─ storage.ts
```

### 核心类型（约定）

```ts
type Item = { id: string; name: string; emoji: string; weight: number; value: number };
type Difficulty = "easy" | "medium" | "hard";
type BossStrategy = "ratio" | "value" | "weight" | "ratio-swap";
type Round = { id: string; seed: number; capacity: number; items: Item[]; difficulty: Difficulty; bossId: string };
type RoundResult = {
  player: { value: number; weight: number; itemIds: string[] };
  boss: { value: number; weight: number; itemIds: string[] };
  optimal: { value: number; itemIds: string[] };
  optimality: number;
  beat: boolean;
  tie: boolean;
  score: number;
  grade: "S" | "A" | "B" | "C" | "D";
  secondsLeft: number;
};
```

### 纯函数边界

- `generateRound(seed, difficulty): Round` — 无副作用、可单测。
- `solveGreedy(round): Item[]` / `solveOptimal(round): Item[]` — 纯函数。
- `scoreRound(...): RoundResult` — 纯函数。
- UI 只负责状态和呈现；算法可脱离 React 单独测试。

### 必测

- DP 对拍：小规模随机用例与暴力枚举结果一致。
- Greedy 不超容量、结果稳定（同 seed 同输出）。
- 生成器约束：容量、件数、至少一种解、必要时差距范围。
- 计分边界：平局、满优、倒计时归零。

---

## 8. 开发与上线流程

1. **M0 立项**（本次）：计划、Boss 考据、美术 brief。
2. **M1 骨架**：Vite + TS + Tailwind；开始页 / 游戏页 / 结算页空壳；响应式布局。
3. **M2 算法**：生成器 + Greedy + DP + 计分 + 单测；先纯逻辑跑通。
4. **M3 可玩**：物品选择、容量限制、计时、提交、翻牌、结算、再来一局。
5. **M4 皮肤**：Boss 立绘、入场卡、动效、移动端、OG 图。
6. **M5 上线**：GitHub push → Vercel 导入 → 自动构建 → 得到公开链接。
7. **试玩调参**：时间、差距区间、分数权重；至少自己连续玩 30 局。
8. **公开分享**：把链接发给 5–10 个人，观察首局完成率与重开率。

### 当前进度（2026-10-20）

- M0–M4 已完成：计划/Boss 考据、Vite + Tailwind 骨架、Greedy + DP + 计分、完整可玩闭环、Boss 立绘接入。
- 10 个 Boss 的原创立绘已生成，当前 4 个已有数据条目接入图片；MVP 仍只开放牛来。
- 视觉参考板已建立：688 张去重参考图，仅内部使用，不随游戏发布。
- QA 已完成（1440×1000 桌面 + 390×844 移动端模拟）：开始页 / 游戏页 / 结算页、超重拦截、空背包超时、桌面拖拽、连续 10 局、无 console error。修复了结算页评分章入场动画导致的移动端横向溢出。
- 上线素材已补齐：1200×630 OG 图、BEAT GREEDY 自定义 favicon、正式 README。
- 质量门槛：`npm test` 18/18 通过；oxlint 0 warnings；生产构建通过（JS gzip 92.8 kB，CSS gzip 7.9 kB）。
- 未完成：GitHub / Vercel 部署（等待授权）；部署后做公开链接试玩与调参。

### 完成标准（MVP DoD）

- [ ] 打开链接 3 秒内能开始第一局（部署后确认）
- [x] 点击或拖拽都能完成选择，超重被明确阻止
- [x] 提交 / 超时都正确结算
- [x] YOU / GREEDY / OPTIMAL 三列数值与物品一致（连续 10 局核对）
- [x] 胜 / 平 / 负 / 满优四种状态都正确（S 满优、DEAD HEAT、GREEDY WINS 均实测）
- [x] PLAY AGAIN 连续 10 局无状态错乱
- [x] 手机竖屏可玩，按钮不遮挡（390×844 实测）
- [x] 同 seed 同输出；DP 与暴力对拍通过
- [ ] 无 console error（已验证）；无后端请求（已验证）；分享链接可打开（部署后确认）

---

## 9. MVP 之后（按优先级，不并行堆功能）

1. **Boss Rush 四人组**：奶蛙 / 黄鼠 / 牛来 / 梁子，四套策略 + 出场动画。
2. **成绩分享**：结果卡文案 + Web Share API；最佳分 / 连胜本地记录。
3. **Scheduling 模式**：任务排序，Boss 对应 shortest-job / highest-reward / earliest-deadline。
4. **Route Planning (TSP)**：玩家排路线，Boss 用 nearest-neighbor；可视化路径动画。
5. **每日挑战**：日期 seed，全网同一题。
6. **AI 竞技场 Boss**：GPT / Claude / Gemini / Grok / 梁圣。
7. **账号与全球排行榜**：只有在前面的留存数据证明需要时，才接 Supabase。
8. **Set Cover / Graph Coloring**：新世界。

---

## 10. 风险与边界

- **IP**：不打包官方 logo / 官方吉祥物 / 网络二创原图；角色是原创 homage，公开名用梗化别名。参考链接仅作考据。
- **难度失真**：Ratio Greedy 在纯相关价值下几乎总最优。生成器必须制造“密度高但总价值低”的小件陷阱。
- **时间压力过强**：Hard 20s 可能劝退；先按表上线，试玩后优先调时间，不加新系统。
- **“必须赢”预期**：约 1/5 的局贪心即最优，用文案解释，避免玩家以为游戏坏了。
- **移动端拖拽**：点击必须是完整可用的主路径，拖拽只做锦上添花。
- **范围膨胀**：Knapsack 没调好玩之前，不做第二模式、不做后端、不做账号。

---

## 11. 当前决策（已锁定）

- 游戏名：**BEAT GREEDY**
- 首发玩法：Knapsack only
- 单局时长：40 / 30 / 20 秒
- 物品数：8
- Boss 策略：Ratio Greedy（MVP）
- 最优解：0/1 背包 DP
- 平台：纯前端静态站，React + Vite + Tailwind，Vercel 部署
- 无后端、无账号、无排行榜
- Boss 视觉：原创抽象梗角色，参考网络气质，不直接扒图
- 奖励结构：最优率 + 击败奖励 + 剩余时间
- 首个可玩里程碑：完整打一局并立刻再来一局

---

## 12. 下一步

1. 部署 Vercel，拿公开链接连续试玩并调参（时间、差距区间、分数权重）。
2. 把 og:image 等元信息里的相对路径换成正式域名。
3. 公开分享给 5–10 人，观察首局完成率与重开率。
4. MVP 稳定后再做 Boss Rush 四人组选择与其余六名 Boss 的策略实装。
