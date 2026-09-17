import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  USER_SESSION: '@user_session',
  REGISTERED_USERS: '@registered_users',
  GALLERY_FAVORITES: '@gallery_favorites',
  THEME_MODE: '@app_theme_mode',
} as const;

/**
 * Robust, typed wrapper around AsyncStorage with JSON serialization
 * and defensive error handling.
 */
export const Storage = {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      console.warn(`[Storage] Failed to read key: ${key}`, error);
      return null;
    }
  },

  async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      await AsyncStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.warn(`[Storage] Failed to write key: ${key}`, error);
      return false;
    }
  },

  async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`[Storage] Failed to delete key: ${key}`, error);
      return false;
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.warn('[Storage] Failed to clear storage', error);
    }
  },
};
