export type ColorTokens = {
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  success: string;
  error: string;
  accent: string;
  border: string;
};

export const light: ColorTokens = {
  background: '#FFF9F0',
  surface: '#FFFFFF',
  textPrimary: '#1F2933',
  textSecondary: '#5A6672',
  success: '#2E9E5B',
  error: '#E4572E',
  accent: '#5B4FCF',
  border: '#E6E1D6',
};

export const dark: ColorTokens = {
  background: '#161B22',
  surface: '#1F2530',
  textPrimary: '#F0F5F1',
  textSecondary: '#AEC0BB',
  success: '#3FC79A',
  error: '#FF8A7C',
  accent: '#9C93F5',
  border: '#2A313C',
};

export const tokens = { light, dark };
