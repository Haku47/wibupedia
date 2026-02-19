import axios from 'axios';
import { API_URL } from '@/core/constants/API_URL';
import { APP_CONFIG } from '@/core/constants/APP_CONFIG';

const jikanClient = axios.create({
  baseURL: API_URL.BASE,
  timeout: 20000, // 🛡️ Host, saya naikkan ke 20 detik agar tidak mudah 504
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  paramsSerializer: {
    indexes: null 
  }
});

// --- ⚡ INTERNAL HELPER: SLEEP ---
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

jikanClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const { config, response } = error;
    const status = response?.status;

    // 🛡️ STRATEGI 1: AUTO-RETRY JIKA KENA RATE LIMIT (429)
    if (status === 429 && !config._retry) {
      config._retry = true;
      console.warn('WibuPedia: Rate Limit Hit. Memperlambat request...');
      await sleep(2000); // Tunggu 2 detik baru coba lagi otomatis
      return jikanClient(config);
    }

    // 🛡️ STRATEGI 2: HANDLING 504 (TIMEOUT)
    if (status === 504) {
      console.error('WibuPedia: Server Jikan sedang sibuk (504). Coba lagi nanti.');
    }

    if (status === 404) console.error('WibuPedia: Data tidak ditemukan.');
    
    return Promise.reject(error);
  }
);

export const animeService = {
  getTopAnime(params = {}) {
    const normalizedParams = typeof params === 'number' ? { page: params } : params;
    return jikanClient.get(API_URL.ANIME.TOP, { 
      params: { 
        limit: APP_CONFIG.API.DEFAULT_PAGE_SIZE,
        sfw: true, // Pastikan SFW aktif agar tidak kena blokir filter
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
  }
};

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