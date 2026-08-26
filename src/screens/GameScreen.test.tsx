import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { GameScreen } from './GameScreen';
import * as scoresRepository from '../storage/scoresRepository';
import type { GameScreenProps } from '../navigation/types';

jest.mock('../storage/scoresRepository');

function makeNavigation() {
  return { navigate: jest.fn() } as unknown as GameScreenProps['navigation'];
}

function makeRoute(): GameScreenProps['route'] {
  return { key: 'Game', name: 'Game', params: { operation: 'addition' } };
}

describe('GameScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.mocked(scoresRepository.addScore).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('auto-starts and shows a problem with answer choices', async () => {
    const { getByTestId, findAllByTestId } = await render(
      <GameScreen navigation={makeNavigation()} route={makeRoute()} />
    );

    expect(getByTestId('problem-question')).toBeTruthy();
    const choices = await findAllByTestId('answer-choice');
    expect(choices.length).toBeGreaterThanOrEqual(3);
  });

  it('updates the score after a correct answer', async () => {
    const { getByTestId, findAllByTestId } = await render(
      <GameScreen navigation={makeNavigation()} route={makeRoute()} />
    );

    const questionText = getByTestId('problem-question').props.children as string;
    const [a, b] = questionText.split('+').map((n: string) => Number(n.trim()));
    const correctAnswer = a + b;

    const choices = await findAllByTestId('answer-choice');
    const correctChoice = choices.find((c) => c.props.children === correctAnswer)!;

    await fireEvent.press(correctChoice);

    expect(getByTestId('score-value').props.children).toBe(1);
  });

  it('pauses the game, hiding the choices, and resumes on tap', async () => {
    const { getByTestId, findAllByTestId, queryAllByTestId } = await render(
      <GameScreen navigation={makeNavigation()} route={makeRoute()} />
    );
    await findAllByTestId('answer-choice');

    await fireEvent.press(getByTestId('pause-button'));

    expect(getByTestId('resume-button')).toBeTruthy();
    expect(queryAllByTestId('answer-choice').length).toBe(0);

    await fireEvent.press(getByTestId('resume-button'));

    const choices = await findAllByTestId('answer-choice');
    expect(choices.length).toBeGreaterThanOrEqual(3);
  });

  it('does not advance the timer while paused', async () => {
    const { getByTestId } = await render(
      <GameScreen navigation={makeNavigation()} route={makeRoute()} />
    );

    await fireEvent.press(getByTestId('pause-button'));
    const secondsAtPause = getByTestId('timer-bar-fill').props.accessibilityValue.now;

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    expect(getByTestId('timer-bar-fill').props.accessibilityValue.now).toBe(secondsAtPause);
  });

  it('restarts the game in place, resetting score and the timer without leaving the screen', async () => {
    const { getByTestId, findAllByTestId } = await render(
      <GameScreen navigation={makeNavigation()} route={makeRoute()} />
    );

    const questionText = getByTestId('problem-question').props.children as string;
    const [a, b] = questionText.split('+').map((n: string) => Number(n.trim()));
    const choices = await findAllByTestId('answer-choice');
    const correctChoice = choices.find((c) => c.props.children === a + b)!;
    await fireEvent.press(correctChoice);
    expect(getByTestId('score-value').props.children).toBe(1);

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    await fireEvent.press(getByTestId('restart-button'));

    expect(getByTestId('score-value').props.children).toBe(0);
    expect(getByTestId('timer-bar-fill').props.accessibilityValue.now).toBe(100);
    expect(await findAllByTestId('answer-choice')).toHaveLength(choices.length);
  });

  it('restarting while paused resumes normal play', async () => {
    const { getByTestId, findAllByTestId, queryAllByTestId } = await render(
      <GameScreen navigation={makeNavigation()} route={makeRoute()} />
    );
    await findAllByTestId('answer-choice');

    await fireEvent.press(getByTestId('pause-button'));
    expect(queryAllByTestId('answer-choice').length).toBe(0);

    await fireEvent.press(getByTestId('restart-button'));

    expect(await findAllByTestId('answer-choice')).not.toHaveLength(0);
    expect(getByTestId('score-value').props.children).toBe(0);
  });

  it('shows the name entry modal once the timer runs out, then a summary after saving', async () => {
    const navigation = makeNavigation();
    const { getByTestId, getByText, getByPlaceholderText } = await render(
      <GameScreen navigation={navigation} route={makeRoute()} />
    );

    await act(async () => {
      jest.advanceTimersByTime(60000);
    });

    expect(getByText(/Time's up!/)).toBeTruthy();

    await fireEvent.changeText(getByPlaceholderText('Your name'), 'Ada');
    await fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(getByTestId('play-again-button')).toBeTruthy();
    });

    await fireEvent.press(getByText('View Leaderboard'));
    expect(navigation.navigate).toHaveBeenCalledWith('Leaderboard', { operation: 'addition' });
  });
});
