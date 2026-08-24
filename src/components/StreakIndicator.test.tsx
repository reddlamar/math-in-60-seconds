import React from 'react';
import { render } from '@testing-library/react-native';
import { StreakIndicator } from './StreakIndicator';

describe('StreakIndicator', () => {
  it('shows the current streak count', async () => {
    const { getByText } = await render(<StreakIndicator streak={2} />);
    expect(getByText('2')).toBeTruthy();
  });

  it('is not lit below a streak of 3', async () => {
    const { getByTestId } = await render(<StreakIndicator streak={2} />);
    expect(getByTestId('streak-flame').props.accessibilityState).toEqual({ selected: false });
  });

  it('lights up at a streak of 3 or more', async () => {
    const { getByTestId } = await render(<StreakIndicator streak={3} />);
    expect(getByTestId('streak-flame').props.accessibilityState).toEqual({ selected: true });
  });
});
