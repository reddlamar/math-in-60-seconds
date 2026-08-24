import AsyncStorage from '@react-native-async-storage/async-storage';
import { addScore, getAllScores, getTopScores } from './scoresRepository';
import type { ScoreEntry } from '../types/game';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

function makeEntry(overrides: Partial<ScoreEntry>): ScoreEntry {
  return {
    id: 'id',
    name: 'Player',
    score: 0,
    operation: 'addition',
    createdAt: Date.now(),
    ...overrides,
  };
}

describe('scoresRepository', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('returns an empty array when no scores are saved', async () => {
    expect(await getAllScores()).toEqual([]);
    expect(await getTopScores()).toEqual([]);
  });

  it('persists an added score so it can be read back', async () => {
    const entry = makeEntry({ id: '1', name: 'Ada', score: 5 });
    await addScore(entry);
    expect(await getAllScores()).toEqual([entry]);
  });

  it('keeps only the top 10 scores, sorted descending', async () => {
    for (let i = 0; i < 12; i++) {
      await addScore(makeEntry({ id: String(i), name: `P${i}`, score: i }));
    }
    const scores = await getTopScores(10);
    expect(scores).toHaveLength(10);
    expect(scores[0].score).toBe(11);
    expect(scores[9].score).toBe(2);
  });

  it('filters top scores by operation when requested', async () => {
    await addScore(makeEntry({ id: 'a', score: 10, operation: 'addition' }));
    await addScore(makeEntry({ id: 'b', score: 20, operation: 'division' }));
    await addScore(makeEntry({ id: 'c', score: 15, operation: 'addition' }));

    const scores = await getTopScores(10, 'addition');
    expect(scores).toHaveLength(2);
    expect(scores.every((s) => s.operation === 'addition')).toBe(true);
    expect(scores[0].score).toBe(15);
  });
});
