import React, { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import { SettingsProvider } from './src/context/SettingsContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

// Android 12+ only allows a small centered icon in the native splash, so we
// hide it as soon as possible and hold this matching centered logo in its place.
const SPLASH_MIN_DURATION_MS = 1000;

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  const onSplashLayout = useCallback(() => {
    // onLayout only guarantees layout is done, not that this view has actually
    // painted yet — hiding the native splash too early exposes a frame of the
    // real content underneath. Waiting two frames guarantees a paint happened.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        SplashScreen.hideAsync().catch(() => {});
      });
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsSplashVisible(false), SPLASH_MIN_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SettingsProvider>
          <RootNavigator />
          <StatusBar style="auto" />
        </SettingsProvider>
      </ThemeProvider>
      {isSplashVisible && (
        <View style={styles.splash} onLayout={onSplashLayout}>
          <Image
            source={require('./assets/splash-icon.png')}
            style={styles.splashImage}
            resizeMode="contain"
          />
        </View>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0A1F44',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashImage: {
    width: 340,
    height: 340,
  },
});
