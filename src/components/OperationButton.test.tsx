import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { OperationButton } from './OperationButton';

describe('OperationButton', () => {
  it('shows the operation symbol and label, and calls onPress with the operation', async () => {
    const onPress = jest.fn();
    const { getByText } = await render(
      <OperationButton operation="addition" symbol="+" label="Addition" onPress={onPress} />
    );
    expect(getByText('+')).toBeTruthy();
    expect(getByText('Addition')).toBeTruthy();

    await fireEvent.press(getByText('+'));
    expect(onPress).toHaveBeenCalledWith('addition');
  });
});
