import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { light } from '../theme/tokens';

const LIT_THRESHOLD = 3;

type StreakIndicatorProps = {
  streak: number;
};

export function StreakIndicator({ streak }: StreakIndicatorProps) {
  const isLit = streak >= LIT_THRESHOLD;

  return (
    <View style={styles.container}>
      <Text
        testID="streak-flame"
        accessibilityState={{ selected: isLit }}
        style={[styles.flame, isLit && styles.flameLit]}
      >
        🔥
      </Text>
      <Text style={styles.count}>{streak}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flame: {
    fontSize: 20,
    opacity: 0.3,
  },
  flameLit: {
    opacity: 1,
  },
  count: {
    marginLeft: 6,
    fontSize: 18,
    fontWeight: '700',
    color: light.textPrimary,
  },
});
