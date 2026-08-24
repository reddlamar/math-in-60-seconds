import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Operation } from '../types/game';

export type RootStackParamList = {
  Home: undefined;
  Game: { operation: Operation };
  Leaderboard: { operation?: Operation };
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type GameScreenProps = NativeStackScreenProps<RootStackParamList, 'Game'>;
export type LeaderboardScreenProps = NativeStackScreenProps<RootStackParamList, 'Leaderboard'>;
