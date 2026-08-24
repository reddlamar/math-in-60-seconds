import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OperationButton } from '../components/OperationButton';
import { light } from '../theme/tokens';
import type { HomeScreenProps } from '../navigation/types';
import type { Operation } from '../types/game';

const OPERATIONS: { operation: Operation; symbol: string; label: string }[] = [
  { operation: 'addition', symbol: '+', label: 'Addition' },
  { operation: 'subtraction', symbol: '−', label: 'Subtraction' },
  { operation: 'multiplication', symbol: '×', label: 'Multiplication' },
  { operation: 'division', symbol: '÷', label: 'Division' },
];

export function HomeScreen({ navigation }: Readonly<HomeScreenProps>) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Math In 60 Seconds</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View leaderboard"
          onPress={() => navigation.navigate('Leaderboard', {})}
        >
          <Text style={styles.leaderboardIcon}>🏆</Text>
        </Pressable>
      </View>
      <View style={styles.grid}>
        {OPERATIONS.map(({ operation, symbol, label }) => (
          <OperationButton
            key={operation}
            operation={operation}
            symbol={symbol}
            label={label}
            onPress={(op) => navigation.navigate('Game', { operation: op })}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: light.textPrimary,
  },
  leaderboardIcon: {
    fontSize: 28,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
