import axios from 'axios';
import { PicsumImage } from '../types/gallery';

const BASE_URL = 'https://picsum.photos/v2';
const DEFAULT_PAGE_LIMIT = 20;

export const picsumApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchPicsumImages = async (
  page = 1,
  limit = DEFAULT_PAGE_LIMIT
): Promise<PicsumImage[]> => {
  try {
    const response = await picsumApiClient.get<PicsumImage[]>('/list', {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `[PicsumAPI] Request failed: ${error.message} (Status: ${error.response?.status})`
      );
    } else {
      console.error('[PicsumAPI] Unexpected error:', error);
    }
    throw error;
  }
};
