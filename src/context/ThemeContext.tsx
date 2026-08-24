import React, { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tokens, type ColorTokens } from '../theme/tokens';

export type ThemePreference = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  preference: ThemePreference;
  colors: ColorTokens;
  setPreference: (preference: ThemePreference) => void;
};

const STORAGE_KEY = 'math60_theme_preference_v1';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function resolveColors(preference: ThemePreference): ColorTokens {
  const scheme = preference === 'system' ? Appearance.getColorScheme() ?? 'light' : preference;
  return scheme === 'dark' ? tokens.dark : tokens.light;
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setPreferenceState(stored);
      }
    });
  }, []);

  const setPreference = (next: ThemePreference) => {
    setPreferenceState(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  };

  const value: ThemeContextValue = {
    preference,
    colors: resolveColors(preference),
    setPreference,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
