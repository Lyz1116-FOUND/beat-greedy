# BEAT GREEDY

A 30-second browser duel against a greedy algorithm. The bot always takes the move that looks best right now. You can see the whole board.

**Local optimum is a trap.**

## How it works

Each round generates 8 items with a weight and a value, plus a backpack capacity. Pick the combination that maximizes total value without going over capacity.

- The bot picks first using **ratio greedy** (`value / weight`).
- After you submit, your pick is compared against the bot and the true optimum.
- The optimum is computed with 0/1 knapsack dynamic programming.
- Rounds are generated to make greedy fail most of the time, but roughly one in five is a round where greedy is already optimal.

You can tap items or drag them into the backpack on desktop. Selecting an item that does not fit is rejected with a notice. Submitting with an empty bag is disabled; running out of time submits whatever is in the bag.

## Scoring

```
roundScore = round(1000 × playerValue / optimalValue)
           + 300 if you beat the bot
           + secondsLeft × 5
```

Grades: `S` for a perfect pack, `A` for a win at 95%+ optimality, `B` for any other win, `C` for 85%+ optimality without a win, otherwise `D`.

Difficulty changes the timer: EASY 40s, MEDIUM 30s, HARD 20s. Higher difficulties also shrink the capacity and widen the value gap between greedy and optimal, so the traps get sharper.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- dnd-kit for desktop drag and drop
- Vitest for the game logic tests

No backend, no login, no database. The session best score is stored in `localStorage`.

## Run locally

```bash
npm install
npm run dev
```

```bash
npm test       # unit tests: greedy, DP vs brute force, scoring, generation
npm run lint
npm run build  # static build in dist/
npm run preview
```

## Deploy

The app is a static site. On Vercel, import the repository and use the defaults:

- Build command: `npm run build`
- Output directory: `dist`

No environment variables are needed.

## Boss art

All boss portraits are original homages created for this project. Reference material gathered during research is kept outside the shipped build and is not redistributed. No official logos, mascots, existing fan characters, or real-person likenesses are included.

## Status

MVP: knapsack mode, one playable boss (Bull Rush), difficulty selection, replay loop, mobile and desktop layouts. Additional bosses, daily challenges, and other algorithmic game modes are planned.
