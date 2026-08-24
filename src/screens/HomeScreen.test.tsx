import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HomeScreen } from './HomeScreen';
import type { HomeScreenProps } from '../navigation/types';

function makeNavigation() {
  return { navigate: jest.fn() } as unknown as HomeScreenProps['navigation'];
}

describe('HomeScreen', () => {
  it('shows all four operation buttons', async () => {
    const { getByText } = await render(
      <HomeScreen navigation={makeNavigation()} route={{} as HomeScreenProps['route']} />
    );
    expect(getByText('+')).toBeTruthy();
    expect(getByText('−')).toBeTruthy();
    expect(getByText('×')).toBeTruthy();
    expect(getByText('÷')).toBeTruthy();
  });

  it('navigates to Game with the chosen operation when a button is tapped', async () => {
    const navigation = makeNavigation();
    const { getByText } = await render(
      <HomeScreen navigation={navigation} route={{} as HomeScreenProps['route']} />
    );

    await fireEvent.press(getByText('×'));

    expect(navigation.navigate).toHaveBeenCalledWith('Game', { operation: 'multiplication' });
  });

  it('navigates to the Leaderboard when the leaderboard icon is tapped', async () => {
    const navigation = makeNavigation();
    const { getByLabelText } = await render(
      <HomeScreen navigation={navigation} route={{} as HomeScreenProps['route']} />
    );

    await fireEvent.press(getByLabelText('View leaderboard'));

    expect(navigation.navigate).toHaveBeenCalledWith('Leaderboard', {});
  });
});
