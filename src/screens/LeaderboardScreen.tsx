import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTopScores } from '../storage/scoresRepository';
import { light } from '../theme/tokens';
import type { LeaderboardScreenProps } from '../navigation/types';
import type { Operation, ScoreEntry } from '../types/game';

const FILTERS: { operation?: Operation; label: string }[] = [
  { operation: undefined, label: 'All' },
  { operation: 'addition', label: '+' },
  { operation: 'subtraction', label: '−' },
  { operation: 'multiplication', label: '×' },
  { operation: 'division', label: '÷' },
];

const MEDALS = ['🥇', '🥈', '🥉'];

export function LeaderboardScreen({ navigation, route }: LeaderboardScreenProps) {
  const [operation, setOperation] = useState<Operation | undefined>(route.params?.operation);
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    let cancelled = false;
    getTopScores(10, operation).then((results) => {
      if (!cancelled) {
        setScores(results);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [operation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go to home screen"
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.homeIcon}>🏠</Text>
        </Pressable>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map(({ operation: filterOp, label }) => (
          <Pressable
            key={label}
            accessibilityRole="button"
            style={[styles.filterTab, operation === filterOp && styles.filterTabActive]}
            onPress={() => setOperation(filterOp)}
          >
            <Text style={styles.filterLabel}>{label}</Text>
          </Pressable>
        ))}
      </View>

      {scores.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No scores yet — be the first!</Text>
        </View>
      ) : (
        <FlatList
          data={scores}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text style={styles.rank}>{MEDALS[index] ?? `${index + 1}.`}</Text>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.score}>{item.score}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: light.background,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: light.textPrimary,
  },
  homeIcon: {
    fontSize: 26,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: light.border,
    marginRight: 8,
  },
  filterTabActive: {
    backgroundColor: light.accent,
    borderColor: light.accent,
  },
  filterLabel: {
    color: light.textPrimary,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: light.textSecondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: light.border,
  },
  rank: {
    width: 36,
    fontSize: 16,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: light.textPrimary,
  },
  score: {
    fontSize: 16,
    fontWeight: '700',
    color: light.accent,
  },
});
