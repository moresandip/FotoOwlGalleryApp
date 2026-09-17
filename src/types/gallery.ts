export interface PicsumImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
  // Optional client-side augmented properties
  isFavorite?: boolean;
  addedToFavoritesAt?: string;
}

export type FilterCategory = 'ALL' | 'A-M' | 'N-Z';

export interface GalleryStoreState {
  favorites: PicsumImage[];
  favoritesCount: number;
  isInitialized: boolean;
  loadFavorites: () => Promise<void>;
  toggleFavorite: (image: PicsumImage) => Promise<boolean>;
  isFavorite: (id: string) => boolean;
  removeFavorite: (id: string) => Promise<void>;
  clearAllFavorites: () => Promise<void>;
}
