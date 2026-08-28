import { Platform } from 'react-native';

type CardShadowConfig = {
  elevation: number;
  opacity: number;
  radius: number;
  offsetHeight?: number;
};

/**
 * A raised-card shadow that matches on both platforms: iOS gets a shadow,
 * Android gets its native elevation. `offsetHeight` defaults to `elevation`
 * since that's visually correct for most cards; pass it explicitly to
 * override.
 */
export function cardShadow({ elevation, opacity, radius, offsetHeight = elevation }: CardShadowConfig) {
  return Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: offsetHeight },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: {
      elevation,
    },
  });
}
