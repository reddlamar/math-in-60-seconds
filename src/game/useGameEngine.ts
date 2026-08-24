import { useCallback, useMemo, useState } from 'react';
import { onCorrectAnswer, onWrongAnswer } from './scoring';
import { generatorForOperation } from './problemGenerators';
import { useGameTimer } from './useGameTimer';
import type { Difficulty, GameState, GameStatus, Operation, Problem } from '../types/game';

const GAME_DURATION_MS = 60000;

export type UseGameEngineResult = {
  problem: Problem | null;
  score: number;
  streak: number;
  timeLeft: number;
  status: GameStatus;
  start: () => void;
  submitAnswer: (value: number) => void;
};

export function useGameEngine(
  operation: Operation,
  difficulty: Difficulty = 'easy'
): UseGameEngineResult {
  const generator = useMemo(() => generatorForOperation(operation), [operation]);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [gameState, setGameState] = useState<GameState>({ score: 0, streak: 0 });
  const [status, setStatus] = useState<GameStatus>('idle');

  const handleExpire = useCallback(() => {
    setStatus('ended');
  }, []);

  const timer = useGameTimer(GAME_DURATION_MS, handleExpire);

  const start = useCallback(() => {
    setGameState({ score: 0, streak: 0 });
    setProblem(generator(difficulty));
    setStatus('playing');
    timer.start();
  }, [generator, difficulty, timer]);

  const submitAnswer = useCallback(
    (value: number) => {
      if (status !== 'playing' || !problem) {
        return;
      }
      setGameState((prev) => (value === problem.answer ? onCorrectAnswer(prev) : onWrongAnswer(prev)));
      setProblem(generator(difficulty));
    },
    [status, problem, generator, difficulty]
  );

  return {
    problem,
    score: gameState.score,
    streak: gameState.streak,
    timeLeft: timer.timeLeft,
    status,
    start,
    submitAnswer,
  };
}
