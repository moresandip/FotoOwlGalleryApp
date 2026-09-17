import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchPicsumImages } from '../api/picsumApi';
import { PicsumImage } from '../types/gallery';

const PAGE_SIZE = 20;

export interface UseFetchImagesReturn {
  images: PicsumImage[];
  loading: boolean;
  loadingMore: boolean;
  refreshing: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  retry: () => void;
}

export const useFetchImages = (): UseFetchImagesReturn => {
  const [images, setImages] = useState<PicsumImage[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Critical requirement: useRef guard flag to strictly prevent parallel duplicate API calls
  const isFetchingRef = useRef<boolean>(false);

  const fetchPage = useCallback(async (targetPage: number, isRefresh = false) => {
    // Prevent duplicate calls if already executing a network request
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;

    if (isRefresh) {
      setRefreshing(true);
      setError(null);
    } else if (targetPage === 1) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }

    try {
      const data = await fetchPicsumImages(targetPage, PAGE_SIZE);

      if (data.length < PAGE_SIZE) {
        setHasMore(false);
      }

      setImages((prev) => {
        if (isRefresh || targetPage === 1) {
          return data;
        }

        // Deduplicate items by ID to prevent any duplicate key errors in FlatList
        const existingIds = new Set(prev.map((img) => img.id));
        const newUniqueItems = data.filter((img) => !existingIds.has(img.id));
        return [...prev, ...newUniqueItems];
      });

      setError(null);
    } catch (err) {
      console.error('[useFetchImages] Failed to fetch:', err);
      setError('Unable to load images. Please check your network and try again.');
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  // Load more pagination handler for FlatList onEndReached
  const loadMore = useCallback(() => {
    if (isFetchingRef.current || loading || loadingMore || !hasMore) {
      return;
    }

    const nextPage = page + 1;
    setPage(nextPage);
    fetchPage(nextPage, false);
  }, [page, loading, loadingMore, hasMore, fetchPage]);

  // Pull-to-refresh handler for FlatList onRefresh
  const refresh = useCallback(() => {
    if (isFetchingRef.current) {
      return; // Guard duplicate pull gesture
    }

    setPage(1);
    setHasMore(true);
    fetchPage(1, true);
  }, [fetchPage]);

  const retry = useCallback(() => {
    setPage(1);
    fetchPage(1, false);
  }, [fetchPage]);

  return {
    images,
    loading,
    loadingMore,
    refreshing,
    error,
    page,
    hasMore,
    loadMore,
    refresh,
    retry,
  };
};
