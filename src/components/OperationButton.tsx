import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { light } from '../theme/tokens';
import type { Operation } from '../types/game';

type OperationButtonProps = {
  operation: Operation;
  symbol: string;
  label: string;
  onPress: (operation: Operation) => void;
};

export function OperationButton({ operation, symbol, label, onPress }: OperationButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => onPress(operation)}
      style={({ pressed }) => [styles.button, { opacity: pressed ? 0.7 : 1 }]}
    >
      <Text style={styles.symbol}>{symbol}</Text>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 140,
    height: 140,
    borderRadius: 24,
    backgroundColor: light.surface,
    borderWidth: 2,
    borderColor: light.accent,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  symbol: {
    fontSize: 40,
    fontWeight: '800',
    color: light.accent,
  },
  label: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
    color: light.textPrimary,
  },
});
