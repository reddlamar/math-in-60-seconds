import { onCorrectAnswer, onWrongAnswer } from './scoring';

describe('scoring', () => {
  it('awards 1 point each for the first three correct answers in a row', () => {
    let state = { score: 0, streak: 0 };
    state = onCorrectAnswer(state);
    expect(state).toEqual({ score: 1, streak: 1 });
    state = onCorrectAnswer(state);
    expect(state).toEqual({ score: 2, streak: 2 });
    state = onCorrectAnswer(state);
    expect(state).toEqual({ score: 3, streak: 3 });
  });

  it('awards 3 points starting on the 4th consecutive correct answer', () => {
    let state = { score: 3, streak: 3 };
    state = onCorrectAnswer(state);
    expect(state).toEqual({ score: 6, streak: 4 }); // 4th in a row
    state = onCorrectAnswer(state);
    expect(state).toEqual({ score: 9, streak: 5 }); // 5th in a row
  });

  it('deducts 1 point and resets the streak on a wrong answer', () => {
    const state = { score: 9, streak: 5 };
    expect(onWrongAnswer(state)).toEqual({ score: 8, streak: 0 });
  });

  it('returns to the base 1-point rate after a streak reset', () => {
    let state = onWrongAnswer({ score: 9, streak: 5 });
    state = onCorrectAnswer(state);
    expect(state).toEqual({ score: 9, streak: 1 });
  });

  it('allows score to go negative on repeated wrong answers', () => {
    let state = { score: 0, streak: 0 };
    state = onWrongAnswer(state);
    expect(state).toEqual({ score: -1, streak: 0 });
    state = onWrongAnswer(state);
    expect(state).toEqual({ score: -2, streak: 0 });
  });

  it('does not mutate the input state', () => {
    const state = { score: 0, streak: 0 };
    onCorrectAnswer(state);
    expect(state).toEqual({ score: 0, streak: 0 });
  });
});
