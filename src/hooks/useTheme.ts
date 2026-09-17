import { useThemeStore } from '../store/useThemeStore';

/**
 * Access the current semantic theme tokens and toggle function.
 */
export const useTheme = () => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = useThemeStore((state) => state.isDark);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return { theme, isDark, toggleTheme };
};
