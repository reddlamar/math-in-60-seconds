import type { GameState } from '../types/game';

const STREAK_BONUS_THRESHOLD = 3;
const BASE_POINTS = 1;
const BONUS_POINTS = 3;
const WRONG_ANSWER_PENALTY = 1;

export function onCorrectAnswer(state: GameState): GameState {
  const newStreak = state.streak + 1;
  const pointsEarned = newStreak > STREAK_BONUS_THRESHOLD ? BONUS_POINTS : BASE_POINTS;
  return { score: state.score + pointsEarned, streak: newStreak };
}

export function onWrongAnswer(state: GameState): GameState {
  return { score: state.score - WRONG_ANSWER_PENALTY, streak: 0 };
}
