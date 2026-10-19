import { useState } from "react";
import { getBoss } from "./game/bosses";
import { generateRound } from "./game/generate";
import { solveGreedy } from "./game/greedy";
import { solveOptimal } from "./game/optimal";
import { evaluateRound } from "./game/score";
import { randomSeed } from "./game/rng";
import type { Difficulty, Round, RoundResult } from "./game/types";
import { readBest, writeBest } from "./lib/storage";
import { GameScreen } from "./screens/GameScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { StartScreen } from "./screens/StartScreen";

type Screen =
  | { kind: "title" }
  | { kind: "playing"; round: Round; number: number }
  | { kind: "result"; round: Round; result: RoundResult; number: number };

const MVP_BOSS = getBoss("bull-rush");

export default function App() {
  const [screen, setScreen] = useState<Screen>({ kind: "title" });
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [totalScore, setTotalScore] = useState(0);
  const [best, setBest] = useState(() => readBest());
  const [newBest, setNewBest] = useState(false);

  const createRound = (requireBeatable: boolean): Round => {
    for (let attempt = 0; attempt < (requireBeatable ? 16 : 1); attempt += 1) {
      const round = generateRound(randomSeed(), difficulty);
      if (!requireBeatable) return round;

      const boss = getBoss(round.bossId);
      const bot = solveGreedy(round.items, round.capacity, boss.strategy);
      const optimal = solveOptimal(round.items, round.capacity);
      if (bot.value < optimal.value) return round;
    }
    return generateRound(randomSeed(), difficulty);
  };

  const startGame = () => {
    setTotalScore(0);
    setNewBest(false);
    setScreen({ kind: "playing", round: createRound(true), number: 1 });
  };

  const handleSubmit = (itemIds: string[], secondsLeft: number) => {
    if (screen.kind !== "playing") return;
    const boss = getBoss(screen.round.bossId);
    const result = evaluateRound(
      screen.round,
      boss.strategy,
      itemIds,
      secondsLeft,
    );
    const nextTotal = totalScore + result.score;
    const isNewBest = nextTotal > best;

    setTotalScore(nextTotal);
    setNewBest(isNewBest);
    if (isNewBest) {
      setBest(nextTotal);
      writeBest(nextTotal);
    }
    setScreen({
      kind: "result",
      round: screen.round,
      result,
      number: screen.number,
    });
  };

  const playAgain = () => {
    if (screen.kind !== "result") return;
    setScreen({
      kind: "playing",
      round: createRound(false),
      number: screen.number + 1,
    });
  };

  const changeDifficulty = () => {
    setTotalScore(0);
    setNewBest(false);
    setScreen({ kind: "title" });
  };

  if (screen.kind === "title") {
    return (
      <StartScreen
        difficulty={difficulty}
        best={best}
        boss={MVP_BOSS}
        onDifficultyChange={setDifficulty}
        onStart={startGame}
      />
    );
  }

  if (screen.kind === "playing") {
    return (
      <GameScreen
        key={screen.round.id}
        round={screen.round}
        roundNumber={screen.number}
        totalScore={totalScore}
        onSubmit={handleSubmit}
      />
    );
  }

  return (
    <ResultScreen
      boss={getBoss(screen.round.bossId)}
      round={screen.round}
      result={screen.result}
      roundNumber={screen.number}
      totalScore={totalScore}
      best={best}
      newBest={newBest}
      onPlayAgain={playAgain}
      onChangeDifficulty={changeDifficulty}
    />
  );
}
