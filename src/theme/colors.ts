/**
 * Application Theme & Design Tokens
 * Handcrafted palette supporting both Dark and Light modes with high contrast,
 * modern glassmorphism tones, and consistent spacing.
 */

export interface ThemeColors {
  isDark: boolean;
  background: string;
  surface: string;
  surfaceSubtle: string;
  surfaceElevated: string;
  border: string;
  borderSubtle: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  danger: string;
  dangerSurface: string;
  success: string;
  successSurface: string;
  warning: string;
  favorite: string;
  cardShadow: string;
  tabBarBackground: string;
  tabBarBorder: string;
  inputBackground: string;
  headerBackground: string;
}

export const lightTheme: ThemeColors = {
  isDark: false,
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',
  surfaceElevated: '#FFFFFF',
  border: '#E2E8F0',
  borderSubtle: '#EEF2F6',
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  primary: '#4F46E5', // Indigo 600
  primaryLight: '#EEF2FF',
  primaryDark: '#3730A3',
  accent: '#06B6D4',
  danger: '#EF4444',
  dangerSurface: '#FEF2F2',
  success: '#10B981',
  successSurface: '#ECFDF5',
  warning: '#F59E0B',
  favorite: '#F43F5E', // Rose 500
  cardShadow: 'rgba(15, 23, 42, 0.08)',
  tabBarBackground: '#FFFFFF',
  tabBarBorder: '#E2E8F0',
  inputBackground: '#F8FAFC',
  headerBackground: '#FFFFFF',
};

export const darkTheme: ThemeColors = {
  isDark: true,
  background: '#0B0F19', // Deep interstellar slate
  surface: '#131B2E',
  surfaceSubtle: '#1C2640',
  surfaceElevated: '#243050',
  border: '#232E4A',
  borderSubtle: '#1A2338',
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#64748B',
  primary: '#6366F1', // Indigo 500
  primaryLight: 'rgba(99, 102, 241, 0.15)',
  primaryDark: '#4338CA',
  accent: '#22D3EE',
  danger: '#F87171',
  dangerSurface: 'rgba(239, 68, 68, 0.12)',
  success: '#34D399',
  successSurface: 'rgba(16, 185, 129, 0.12)',
  warning: '#FBBF24',
  favorite: '#FB7185',
  cardShadow: 'rgba(0, 0, 0, 0.45)',
  tabBarBackground: '#111827',
  tabBarBorder: '#1F2937',
  inputBackground: '#161F33',
  headerBackground: '#0F172A',
};
