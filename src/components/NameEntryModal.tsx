import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { light } from '../theme/tokens';
import { addScore } from '../storage/scoresRepository';
import type { Operation, ScoreEntry } from '../types/game';

const MAX_NAME_LENGTH = 20;
const DEFAULT_NAME = 'Player';

type NameEntryModalProps = {
  visible: boolean;
  score: number;
  operation: Operation;
  onSaved: (entry: ScoreEntry) => void;
};

export function NameEntryModal({ visible, score, operation, onSaved }: NameEntryModalProps) {
  const [name, setName] = useState('');

  const handleSave = async () => {
    const trimmed = name.trim().slice(0, MAX_NAME_LENGTH);
    const entry: ScoreEntry = {
      id: `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`,
      name: trimmed.length > 0 ? trimmed : DEFAULT_NAME,
      score,
      operation,
      createdAt: Date.now(),
    };
    await addScore(entry);
    setName('');
    onSaved(entry);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{`Time's up! You scored ${score} — what's your name?`}</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            maxLength={MAX_NAME_LENGTH}
            autoCapitalize="words"
          />
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [styles.saveButton, { opacity: pressed ? 0.7 : 1 }]}
            onPress={handleSave}
          >
            <Text style={styles.saveLabel}>Save</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: light.surface,
    borderRadius: 20,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: light.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: light.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    color: light.textPrimary,
  },
  saveButton: {
    backgroundColor: light.accent,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
