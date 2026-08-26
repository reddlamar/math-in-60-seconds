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
    <View style={[styles.container, isLit && styles.containerLit]}>
      <Text
        testID="streak-flame"
        accessibilityState={{ selected: isLit }}
        style={[styles.flame, isLit && styles.flameLit]}
      >
        🔥
      </Text>
      <Text style={[styles.count, isLit && styles.countLit]}>{streak}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  containerLit: {
    backgroundColor: '#FFF1E6',
  },
  flame: {
    fontSize: 20,
    opacity: 0.3,
  },
  flameLit: {
    fontSize: 26,
    opacity: 1,
  },
  count: {
    marginLeft: 6,
    fontSize: 18,
    fontWeight: '700',
    color: light.textPrimary,
  },
  countLit: {
    color: '#FF9F45',
  },
});
