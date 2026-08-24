import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AnswerButton } from './AnswerButton';

describe('AnswerButton', () => {
  it('calls onPress with its value when tapped', async () => {
    const onPress = jest.fn();
    const { getByText } = await render(<AnswerButton value={9} onPress={onPress} />);
    await fireEvent.press(getByText('9'));
    expect(onPress).toHaveBeenCalledWith(9);
  });

  it('does not call onPress when disabled', async () => {
    const onPress = jest.fn();
    const { getByText } = await render(<AnswerButton value={9} onPress={onPress} disabled />);
    await fireEvent.press(getByText('9'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
