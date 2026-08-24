import React from 'react';
import { render } from '@testing-library/react-native';
import { TimerBar } from './TimerBar';

describe('TimerBar', () => {
  it('shows the remaining time in whole seconds', async () => {
    const { getByText } = await render(<TimerBar timeLeft={45300} duration={60000} />);
    expect(getByText('46')).toBeTruthy();
  });

  it('rounds a fully-expired timer down to 0', async () => {
    const { getByText } = await render(<TimerBar timeLeft={0} duration={60000} />);
    expect(getByText('0')).toBeTruthy();
  });

  it('exposes the remaining fraction for the visual bar via accessibility value', async () => {
    const { getByTestId } = await render(<TimerBar timeLeft={30000} duration={60000} />);
    const bar = getByTestId('timer-bar-fill');
    expect(bar.props.accessibilityValue).toEqual({ min: 0, max: 100, now: 50 });
  });
});
