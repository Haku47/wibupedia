/**
 * Konfigurasi Base URL untuk API Jikan (MyAnimeList)
 * Menggunakan variabel lingkungan (.env) sebagai prioritas utama
 */
const BASE_URL = import.meta.env.VITE_JIKAN_API || 'https://api.jikan.moe/v4';

export const API_URL = {
  // Base URL
  BASE: BASE_URL,

  // Anime Endpoints
  ANIME: {
    TOP: `${BASE_URL}/top/anime`,
    SEARCH: `${BASE_URL}/anime`,
    DETAILS: (id) => `${BASE_URL}/anime/${id}/full`,
    CHARACTERS: (id) => `${BASE_URL}/anime/${id}/characters`,
    RECOMMENDATIONS: (id) => `${BASE_URL}/anime/${id}/recommendations`,
    SEASONAL: `${BASE_URL}/seasons/now`,
  },

  // Manga Endpoints
  MANGA: {
    TOP: `${BASE_URL}/top/manga`,
    SEARCH: `${BASE_URL}/manga`,
    DETAILS: (id) => `${BASE_URL}/manga/${id}/full`,
  },

  // Other Endpoints
  GENRES: `${BASE_URL}/genres/anime`,
  SCHEDULE: `${BASE_URL}/schedules`,
};