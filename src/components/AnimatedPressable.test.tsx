import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import { AnimatedPressable } from './AnimatedPressable';

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: { Light: 'light' },
}));

describe('AnimatedPressable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fires a light haptic impact as soon as the press starts', async () => {
    const { getByText } = await render(
      <AnimatedPressable accessibilityRole="button">
        <Text>Press me</Text>
      </AnimatedPressable>
    );

    fireEvent(getByText('Press me'), 'pressIn');

    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });

  it('still calls the caller-supplied onPressIn alongside the haptic', async () => {
    const onPressIn = jest.fn();
    const { getByText } = await render(
      <AnimatedPressable accessibilityRole="button" onPressIn={onPressIn}>
        <Text>Press me</Text>
      </AnimatedPressable>
    );

    fireEvent(getByText('Press me'), 'pressIn');

    expect(onPressIn).toHaveBeenCalledTimes(1);
  });

  it('calls the caller-supplied onPressOut when the press ends', async () => {
    const onPressOut = jest.fn();
    const { getByText } = await render(
      <AnimatedPressable accessibilityRole="button" onPressOut={onPressOut}>
        <Text>Press me</Text>
      </AnimatedPressable>
    );

    fireEvent(getByText('Press me'), 'pressOut');

    expect(onPressOut).toHaveBeenCalledTimes(1);
  });

  it('does not fire a haptic when disabled', async () => {
    const { getByText } = await render(
      <AnimatedPressable accessibilityRole="button" disabled>
        <Text>Press me</Text>
      </AnimatedPressable>
    );

    fireEvent(getByText('Press me'), 'pressIn');

    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });
});
