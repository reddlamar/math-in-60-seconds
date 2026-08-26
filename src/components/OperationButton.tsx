import React from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import { AnimatedPressable } from './AnimatedPressable';
import { operationColors } from '../theme/tokens';
import type { Operation } from '../types/game';

type OperationButtonProps = {
  operation: Operation;
  symbol: string;
  label: string;
  onPress: (operation: Operation) => void;
};

export function OperationButton({ operation, symbol, label, onPress }: OperationButtonProps) {
  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      wrapperStyle={styles.wrapper}
      style={[styles.button, { backgroundColor: operationColors[operation] }]}
      onPress={() => onPress(operation)}
    >
      <Text style={styles.symbol}>{symbol}</Text>
      <Text style={styles.label}>{label}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexBasis: '42%',
    maxWidth: 220,
    aspectRatio: 1,
  },
  button: {
    flex: 1,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  symbol: {
    fontSize: 52,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  label: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
