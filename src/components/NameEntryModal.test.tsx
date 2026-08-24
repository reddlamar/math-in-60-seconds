import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NameEntryModal } from './NameEntryModal';
import * as scoresRepository from '../storage/scoresRepository';

jest.mock('../storage/scoresRepository');

describe('NameEntryModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(scoresRepository.addScore).mockResolvedValue(undefined);
  });

  it("greets the player with their score", async () => {
    const { getByText } = await render(
      <NameEntryModal visible score={7} operation="addition" onSaved={jest.fn()} />
    );
    expect(getByText(/You scored 7/)).toBeTruthy();
  });

  it('saves the entered name and calls onSaved with the new entry', async () => {
    const onSaved = jest.fn();
    const { getByPlaceholderText, getByText } = await render(
      <NameEntryModal visible score={7} operation="addition" onSaved={onSaved} />
    );

    await fireEvent.changeText(getByPlaceholderText('Your name'), 'Ada');
    await fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(scoresRepository.addScore).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Ada', score: 7, operation: 'addition' })
      );
    });
    expect(onSaved).toHaveBeenCalled();
  });

  it('defaults to "Player" when the name is left blank', async () => {
    const onSaved = jest.fn();
    const { getByText } = await render(
      <NameEntryModal visible score={3} operation="division" onSaved={onSaved} />
    );

    await fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(scoresRepository.addScore).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Player' })
      );
    });
  });

  it('truncates names longer than 20 characters', async () => {
    const onSaved = jest.fn();
    const { getByPlaceholderText, getByText } = await render(
      <NameEntryModal visible score={3} operation="division" onSaved={onSaved} />
    );

    await fireEvent.changeText(
      getByPlaceholderText('Your name'),
      'ThisNameIsWayTooLongForALeaderboard'
    );
    await fireEvent.press(getByText('Save'));

    await waitFor(() => {
      const savedEntry = jest.mocked(scoresRepository.addScore).mock.calls[0][0];
      expect(savedEntry.name.length).toBeLessThanOrEqual(20);
    });
  });
});
