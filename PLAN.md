# BEAT GREEDY — 项目总计划

> Last updated: 2026-10-20
> Status: MVP 已完成；v1.1 视觉/文案/声音改版与全量 QA 已完成；待推送部署
> 一句话：和一只只会“选眼前最好”的 Boss 抢背包。你赢它，再逼近真正的最优解。
> v1.1 设计规格见 `docs/ui-redesign.md`。

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
- Boss 立绘维持“深色背景 + 高饱和角色”的原创形象，游戏内作为“员工照/海报”装进奶油相框和胶带，不再让整页变暗。
- 尺寸：900×900 方形立绘，游戏内展示 120–240px。
- 首版每 Boss 1 张半身像；后续加胜利表情、失败表情。
- 参考链接与设计 brief 放 `docs/boss-references.md`；游戏内只放原创生成的图，不直接引用网络图片。

---

## 6. 视觉与交互

### 视觉语言（v1.1 锁定）

方向：**新中式小卖部 + 手账贴纸 + 街机反馈**。参考羊了个羊、合成大奶蛙、狙击外星人的高可点密度与清晰反馈，以及黑神话悟空的印章、纸感与中式排版。完整规格见 `docs/ui-redesign.md`。

- 背景：米纸底 `#f4ead7`，极淡账本横线和颗粒；不再使用暗色终端底。
- 主色：朱砂 `#d6402c`、芥末黄 `#e3a33c`、玉绿 `#3e7757`、暖墨 `#2a251e`、奶油 `#fff9ec`。
- 字体：自托管得意黑子集（按 OFL 保留字体名要求重命名）做展示字与大数字；正文用系统中文字体栈；英文仅做票据注脚。
- 卡片：奶油底、2px 墨线、12–18px 圆角、硬偏移阴影、微旋转；配胶带、价签、印章、虚线撕口。
- 物品：24 个中式小卖部物品，全部自绘 SVG 线条图标，不使用 emoji。
- 按钮：胶囊形朱砂/玉绿实心按钮，底部硬阴影，按下下沉。
- 动效：入场错峰、拿取盖章、超重抖动、交卷数货、结算盖章、满配纸屑；尊重 reduced-motion。

### 关键 UI

- 容量：牛皮纸袋 + 纸尺刻度，接近满格转朱砂。
- 物品卡：自绘图标、中文名、“重/值”价签；选中盖“已装”章。
- Boss 区：深色员工照 + 台词气泡；根据拿取、退回、超重、低时间、交卷实时说风凉话。
- 计时器：圆形进度 + 大数字，最后 1/3 转朱砂。
- 结算三列：你 / 牛来 / 最优解，票据行 + 物品图标，最优列盖“标准答案”。
- 结算新增老板点评、本局人设、套路揭示、复制战绩。
- 移动端：单列；物品 2 列；Boss 缩成店员动态条；计时 + 结账固定底部。
- 键盘可操作：物品卡为按钮，空格/回车切换；结果页焦点管理。
- `prefers-reduced-motion` 下关闭滚动、盖章和彩带。

### 分享

- Vercel 静态链接。
- OG / Twitter meta + 一张 1200×630 静态分享图（新视觉、中文标题）。
- 结算页“复制战绩”：分数、最优率、链接写入剪贴板。
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
v1.1 用 WebAudio 现场合成五声音阶循环与操作/胜负音效，默认开启、可静音并本地记住；不使用任何外部音频素材。

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
- 第一轮 QA 已完成（1440×1000 桌面 + 390×844 移动端模拟）；GitHub 公开仓库已推送。
- v1.1 已完成：米纸设计系统、24 个中文物品与手绘 SVG、牛来风凉话与老板点评、WebAudio 合成音乐/音效、三屏新中式小卖部重写、新 OG/favicon/中文 meta。
- v1.1 全量 QA 已通过：320 / 390 / 1440 无横向溢出；连续 10 局无状态错乱；点击、拖拽、超重、空包超时、提交遮罩、复制战绩、声音持久化、新纪录均实测；0 条 console error；18 个单测、lint、构建全绿。
- 未完成：提交推送 + Vercel 部署 + 线上分享卡验收；拿到公开链接后做试玩调参。

### v1.1 可执行清单

- [x] `docs/ui-redesign.md` 与 PLAN 对齐
- [x] 得意黑子集 + OFL + 重命名；移除旧英文字体依赖
- [x] 米纸/朱砂/玉绿 token、颗粒、胶带/印章/票据/胶囊按钮工具类
- [x] 24 个中文小卖部物品 + 自绘 SVG 图标；更新生成器与测试夹具
- [x] 开始页：店招、雨棚、员工照、难度价签、进店按钮
- [x] 游戏页：纸袋背包、纸尺容量、货架物品卡、圆形计时、店员动态
- [x] Boss 风凉话（≥5 个事件）与玩家操作统计
- [x] 结算页：结账单、三列、评级章、老板点评、本局人设、套路揭示、复制战绩
- [x] WebAudio 五声音阶循环 + 10 个音效 + 静音持久化
- [x] 新 favicon、中文 meta、1200×630 OG
- [x] 全量 QA（桌面/移动/10 局/胜平负/满优/超时/拖拽/分享/声音）
- [ ] 提交推送 + Vercel 部署 + 线上验收

### 完成标准（MVP DoD）

- [ ] 打开链接 3 秒内能开始第一局（部署后确认）
- [x] 点击或拖拽都能完成选择，超重被明确阻止
- [x] 提交 / 超时都正确结算
- [x] YOU / GREEDY / OPTIMAL 三列数值与物品一致（连续 10 局核对）
- [x] 胜 / 平 / 负 / 满优四种状态都正确（S 满优、DEAD HEAT、GREEDY WINS 均实测）
- [x] PLAY AGAIN 连续 10 局无状态错乱
- [x] 手机竖屏可玩，按钮不遮挡（390×844 实测）
- [x] 同 seed 同输出；DP 与暴力对拍通过
- [x] 无 console error；无后端请求（分享链接部署后复查）
- [x] v1.1：全站中文为主，物品无 emoji，无横向溢出，Boss 台词/点评/人设/复制战绩/声音全部可用
- [x] v1.1：测试、lint、构建全绿，320 / 390×844 与 1440×1000 重跑通过

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

1. 完成 v1.1 视觉/文案/声音改版与全量 QA。
2. 提交并推送 GitHub，用已登录的 Vercel 部署最终版本，拿公开链接。
3. 把 og:image 等元信息里的相对路径换成正式域名，验证分享卡。
4. 公开分享给 5–10 人，观察首局完成率与重开率；再调时间、差距区间、分数权重。
5. 稳定后再做 Boss Rush 四人组选择与其余六名 Boss 的策略实装。
