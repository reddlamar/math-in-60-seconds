import React from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import { AnimatedPressable } from './AnimatedPressable';

type AnswerButtonProps = {
  value: number;
  onPress: (value: number) => void;
  disabled?: boolean;
  color?: string;
};

export function AnswerButton({ value, onPress, disabled, color = '#5B4FCF' }: AnswerButtonProps) {
  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={`Answer ${value}`}
      disabled={disabled}
      onPress={() => onPress(value)}
      wrapperStyle={styles.wrapper}
      style={[styles.button, { backgroundColor: color }, disabled && styles.disabled]}
    >
      <Text testID="answer-choice" style={styles.label}>
        {value}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    margin: 8,
  },
  button: {
    minWidth: 92,
    minHeight: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.16,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
