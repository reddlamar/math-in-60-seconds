import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Operation, ScoreEntry } from '../types/game';

const KEY = 'math60_scores_v1';

export async function getAllScores(): Promise<ScoreEntry[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as ScoreEntry[]) : [];
}

export async function addScore(entry: ScoreEntry): Promise<void> {
  const scores = await getAllScores();
  scores.push(entry);
  await AsyncStorage.setItem(KEY, JSON.stringify(scores));
}

export async function getTopScores(limit = 10, operation?: Operation): Promise<ScoreEntry[]> {
  const scores = await getAllScores();
  return scores
    .filter((entry) => !operation || entry.operation === operation)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
