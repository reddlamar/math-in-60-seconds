import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { light } from '../theme/tokens';

type AnswerButtonProps = {
  value: number;
  onPress: (value: number) => void;
  disabled?: boolean;
};

export function AnswerButton({ value, onPress, disabled }: AnswerButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Answer ${value}`}
      disabled={disabled}
      onPress={() => onPress(value)}
      style={({ pressed }) => [
        styles.button,
        { opacity: pressed ? 0.7 : 1 },
        disabled && styles.disabled,
      ]}
    >
      <Text testID="answer-choice" style={styles.label}>
        {value}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 88,
    minHeight: 64,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: light.accent,
    backgroundColor: light.surface,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontSize: 24,
    fontWeight: '700',
    color: light.textPrimary,
  },
});
