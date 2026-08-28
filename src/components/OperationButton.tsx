import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedPressable } from './AnimatedPressable';
import { operationColors } from '../theme/tokens';
import { cardShadow } from '../theme/shadow';
import type { Operation } from '../types/game';

type OperationButtonProps = {
  operation: Operation;
  symbol: string;
  label: string;
  locked?: boolean;
  onPress: (operation: Operation) => void;
};

export function OperationButton({
  operation,
  symbol,
  label,
  locked = false,
  onPress,
}: OperationButtonProps) {
  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={locked ? `${label} (locked, unlock to play)` : label}
      wrapperStyle={styles.wrapper}
      style={[
        styles.button,
        { backgroundColor: operationColors[operation] },
        locked && styles.buttonLocked,
      ]}
      onPress={() => onPress(operation)}
    >
      <Text style={styles.symbol}>{symbol}</Text>
      <Text style={styles.label}>{label}</Text>
      {locked && (
        <View style={styles.lockBadge}>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>
      )}
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
    ...cardShadow({ elevation: 6, opacity: 0.18, radius: 8 }),
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
  buttonLocked: {
    opacity: 0.55,
  },
  lockBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  lockIcon: {
    fontSize: 18,
  },
});
