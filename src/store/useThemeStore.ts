import { create } from 'zustand';
import { Storage, STORAGE_KEYS } from '../utils/storage';
import { darkTheme, lightTheme, ThemeColors } from '../theme/colors';

interface ThemeStoreState {
  isDark: boolean;
  theme: ThemeColors;
  toggleTheme: () => Promise<void>;
  loadThemePreference: () => Promise<void>;
}

export const useThemeStore = create<ThemeStoreState>((set, get) => ({
  isDark: true, // Default to sleek dark mode
  theme: darkTheme,

  toggleTheme: async () => {
    const nextIsDark = !get().isDark;
    const nextTheme = nextIsDark ? darkTheme : lightTheme;
    set({ isDark: nextIsDark, theme: nextTheme });
    await Storage.setItem(STORAGE_KEYS.THEME_MODE, nextIsDark ? 'dark' : 'light');
  },

  loadThemePreference: async () => {
    const saved = await Storage.getItem<'dark' | 'light'>(STORAGE_KEYS.THEME_MODE);
    if (saved) {
      const isDark = saved === 'dark';
      set({ isDark, theme: isDark ? darkTheme : lightTheme });
    }
  },
}));
