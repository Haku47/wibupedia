import axios from 'axios';
import { API_URL } from '@/core/constants/API_URL';
import { APP_CONFIG } from '@/core/constants/APP_CONFIG';

// 1. Inisialisasi Instance dengan Serializer Fix
const jikanClient = axios.create({
  baseURL: API_URL.BASE,
  timeout: APP_CONFIG.API.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // 🛡️ SHIELD: Paksa Axios tidak menggunakan format bracket [] untuk nested objects
  paramsSerializer: {
    indexes: null 
  }
});

// 2. Interceptor Request
jikanClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// 3. Interceptor Response (Data Flattening)
jikanClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    if (status === 429) console.error('WibuPedia: Rate Limit Hit! Harap tunggu.');
    else if (status === 404) console.error('WibuPedia: Data tidak ditemukan.');
    return Promise.reject(error);
  }
);

// 4. Anime Service
export const animeService = {
  /**
   * FIX: Menerima object params agar support filter & page dari useJikan
   * params bisa berupa { page, filter }
   */
  getTopAnime(params = {}) {
    // Jika Host mengirim angka (bukan object), kita bungkus jadi object
    const normalizedParams = typeof params === 'number' ? { page: params } : params;
    
    return jikanClient.get(API_URL.ANIME.TOP, { 
      params: { 
        limit: APP_CONFIG.API.DEFAULT_PAGE_SIZE,
        ...normalizedParams 
      } 
    });
  },

  searchAnime(searchParams) {
    return jikanClient.get(API_URL.ANIME.SEARCH, { 
      params: { 
        limit: APP_CONFIG.API.MAX_SEARCH_RESULTS,
        sfw: true,
        ...searchParams 
      } 
    });
  },

  getAnimeDetails(id) {
    return jikanClient.get(API_URL.ANIME.DETAILS(id));
  },

  getSeasonalAnime(params = {}) {
    const normalizedParams = typeof params === 'number' ? { page: params } : params;
    return jikanClient.get(API_URL.ANIME.SEASONAL, { 
      params: { ...normalizedParams } 
    });
  },

  getRecommendations(id) {
    return jikanClient.get(API_URL.ANIME.RECOMMENDATIONS(id));
  }
};

// 5. Manga Service
export const mangaService = {
  getTopManga(params = {}) {
    const normalizedParams = typeof params === 'number' ? { page: params } : params;
    return jikanClient.get(API_URL.MANGA.TOP, { 
      params: { ...normalizedParams } 
    });
  },
  
  searchManga(searchParams) {
    return jikanClient.get(API_URL.MANGA.SEARCH, { 
      params: { 
        limit: APP_CONFIG.API.MAX_SEARCH_RESULTS,
        sfw: true,
        ...searchParams 
      } 
    });
  },

  getMangaDetails(id) {
    return jikanClient.get(API_URL.MANGA.DETAILS(id));
  }
};