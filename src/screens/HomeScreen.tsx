import React, { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedPressable } from '../components/AnimatedPressable';
import { OperationButton } from '../components/OperationButton';
import { getTopScores } from '../storage/scoresRepository';
import { light, operationColors } from '../theme/tokens';
import type { HomeScreenProps } from '../navigation/types';
import type { Operation, ScoreEntry } from '../types/game';

const OPERATIONS: { operation: Operation; symbol: string; label: string }[] = [
  { operation: 'addition', symbol: '+', label: 'Addition' },
  { operation: 'subtraction', symbol: '−', label: 'Subtraction' },
  { operation: 'multiplication', symbol: '×', label: 'Multiplication' },
  { operation: 'division', symbol: '÷', label: 'Division' },
];

export function HomeScreen({ navigation }: Readonly<HomeScreenProps>) {
  const [topScore, setTopScore] = useState<ScoreEntry | null>(null);

  useEffect(() => {
    let cancelled = false;
    getTopScores(1).then(([entry]) => {
      if (!cancelled) {
        setTopScore(entry ?? null);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/home-header-banner.png')}
          style={styles.headerBanner}
          resizeMode="contain"
        />
        <AnimatedPressable
          accessibilityRole="button"
          accessibilityLabel="View leaderboard"
          onPress={() => navigation.navigate('Leaderboard', {})}
        >
          <Text style={styles.leaderboardIcon}>🏆</Text>
        </AnimatedPressable>
      </View>
      <View style={styles.content}>
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
        <AnimatedPressable
          accessibilityRole="button"
          accessibilityLabel="View top score on the leaderboard"
          style={[
            styles.topScoreCard,
            { borderColor: topScore ? operationColors[topScore.operation] : light.border },
          ]}
          onPress={() => navigation.navigate('Leaderboard', {})}
        >
          <Text style={styles.topScoreIcon}>🏆</Text>
          {topScore ? (
            <View>
              <Text style={styles.topScoreLabel}>Top Score</Text>
              <Text style={[styles.topScoreValue, { color: operationColors[topScore.operation] }]}>
                {topScore.name} · {topScore.score}
              </Text>
            </View>
          ) : (
            <Text style={styles.topScoreLabel}>No scores yet — be the first!</Text>
          )}
        </AnimatedPressable>
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
  headerBanner: {
    width: 252,
    height: 36,
  },
  leaderboardIcon: {
    fontSize: 28,
  },
  content: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  topScoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    padding: 18,
    borderRadius: 24,
    backgroundColor: light.surface,
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  topScoreIcon: {
    fontSize: 30,
    marginRight: 14,
  },
  topScoreLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  topScoreValue: {
    fontSize: 18,
    fontWeight: '700',
    color: light.textPrimary,
    marginTop: 2,
  },
});
