import { create } from 'zustand';
import { Storage, STORAGE_KEYS } from '../utils/storage';
import { GalleryStoreState, PicsumImage } from '../types/gallery';

export const useGalleryStore = create<GalleryStoreState>((set, get) => ({
  favorites: [],
  favoritesCount: 0,
  isInitialized: false,

  loadFavorites: async () => {
    try {
      const persisted = await Storage.getItem<PicsumImage[]>(STORAGE_KEYS.GALLERY_FAVORITES);
      const list = persisted || [];
      set({
        favorites: list,
        favoritesCount: list.length,
        isInitialized: true,
      });
    } catch (error) {
      console.error('[GalleryStore] Failed to load favorites:', error);
      set({ isInitialized: true });
    }
  },

  isFavorite: (id: string) => {
    return get().favorites.some((item) => item.id === id);
  },

  toggleFavorite: async (image: PicsumImage) => {
    try {
      const current = get().favorites;
      const exists = current.some((item) => item.id === image.id);

      let updatedList: PicsumImage[];
      let isNowFavorited: boolean;

      if (exists) {
        updatedList = current.filter((item) => item.id !== image.id);
        isNowFavorited = false;
      } else {
        const enriched: PicsumImage = {
          ...image,
          isFavorite: true,
          addedToFavoritesAt: new Date().toISOString(),
        };
        updatedList = [enriched, ...current];
        isNowFavorited = true;
      }

      set({
        favorites: updatedList,
        favoritesCount: updatedList.length,
      });

      await Storage.setItem(STORAGE_KEYS.GALLERY_FAVORITES, updatedList);
      return isNowFavorited;
    } catch (error) {
      console.error('[GalleryStore] Toggle favorite failed:', error);
      return false;
    }
  },

  removeFavorite: async (id: string) => {
    try {
      const updated = get().favorites.filter((item) => item.id !== id);
      set({
        favorites: updated,
        favoritesCount: updated.length,
      });
      await Storage.setItem(STORAGE_KEYS.GALLERY_FAVORITES, updated);
    } catch (error) {
      console.error('[GalleryStore] Remove favorite failed:', error);
    }
  },

  clearAllFavorites: async () => {
    try {
      set({ favorites: [], favoritesCount: 0 });
      await Storage.removeItem(STORAGE_KEYS.GALLERY_FAVORITES);
    } catch (error) {
      console.error('[GalleryStore] Clear favorites failed:', error);
    }
  },
}));
