import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnswerButton } from '../components/AnswerButton';
import { TimerBar } from '../components/TimerBar';
import { StreakIndicator } from '../components/StreakIndicator';
import { NameEntryModal } from '../components/NameEntryModal';
import { useGameEngine } from '../game/useGameEngine';
import { light } from '../theme/tokens';
import type { GameScreenProps } from '../navigation/types';
import type { ScoreEntry } from '../types/game';

const GAME_DURATION_MS = 60000;

export function GameScreen({ navigation, route }: GameScreenProps) {
  const { operation } = route.params;
  const engine = useGameEngine(operation);
  const [savedEntry, setSavedEntry] = useState<ScoreEntry | null>(null);

  useEffect(() => {
    engine.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlayAgain = () => {
    setSavedEntry(null);
    engine.start();
  };

  const handleViewLeaderboard = () => {
    navigation.navigate('Leaderboard', { operation });
  };

  if (savedEntry) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Nice work, {savedEntry.name}!</Text>
          <Text style={styles.summaryScore}>{savedEntry.score} points</Text>
          <Pressable
            testID="play-again-button"
            accessibilityRole="button"
            style={styles.primaryButton}
            onPress={handlePlayAgain}
          >
            <Text style={styles.primaryButtonLabel}>Play Again</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={handleViewLeaderboard}>
            <Text style={styles.secondaryButtonLabel}>View Leaderboard</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TimerBar timeLeft={engine.timeLeft} duration={GAME_DURATION_MS} />
        <View style={styles.statsRow}>
          <Text testID="score-value" style={styles.score}>
            {engine.score}
          </Text>
          <StreakIndicator streak={engine.streak} />
        </View>
      </View>

      {engine.problem && (
        <View style={styles.problemArea}>
          <Text testID="problem-question" style={styles.question}>
            {engine.problem.question}
          </Text>
          <View style={styles.choices}>
            {engine.problem.choices.map((choice) => (
              <AnswerButton
                key={choice}
                value={choice}
                onPress={engine.submitAnswer}
                disabled={engine.status !== 'playing'}
              />
            ))}
          </View>
        </View>
      )}

      <NameEntryModal
        visible={engine.status === 'ended'}
        score={engine.score}
        operation={operation}
        onSaved={setSavedEntry}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: light.background,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  score: {
    fontSize: 22,
    fontWeight: '800',
    color: light.textPrimary,
  },
  problemArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  question: {
    fontSize: 40,
    fontWeight: '800',
    color: light.textPrimary,
    marginBottom: 24,
  },
  choices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  summary: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: light.textPrimary,
    marginBottom: 8,
  },
  summaryScore: {
    fontSize: 40,
    fontWeight: '800',
    color: light.accent,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: light.accent,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginBottom: 16,
  },
  primaryButtonLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButtonLabel: {
    color: light.accent,
    fontSize: 16,
    fontWeight: '600',
  },
});
