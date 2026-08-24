import React, { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Operation } from '../types/game';

type SettingsContextValue = {
  lastOperation: Operation | null;
  soundEnabled: boolean;
  setLastOperation: (operation: Operation) => void;
  setSoundEnabled: (enabled: boolean) => void;
};

const STORAGE_KEY = 'math60_settings_v1';

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

type StoredSettings = { lastOperation: Operation | null; soundEnabled: boolean };

export function SettingsProvider({ children }: PropsWithChildren) {
  const [lastOperation, setLastOperationState] = useState<Operation | null>(null);
  const [soundEnabled, setSoundEnabledState] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (!stored) return;
      const parsed = JSON.parse(stored) as StoredSettings;
      setLastOperationState(parsed.lastOperation);
      setSoundEnabledState(parsed.soundEnabled);
    });
  }, []);

  const persist = (next: StoredSettings) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const setLastOperation = (operation: Operation) => {
    setLastOperationState(operation);
    persist({ lastOperation: operation, soundEnabled });
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    persist({ lastOperation, soundEnabled: enabled });
  };

  const value: SettingsContextValue = {
    lastOperation,
    soundEnabled,
    setLastOperation,
    setSoundEnabled,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
