/**
 * Konfigurasi Global Aplikasi WibuPedia v1.8.4
 * Seluruh protokol dasar dan kendali sistem terpusat di sini.
 */

export const APP_CONFIG = {
  // --- INFORMASI DASAR (Identity Core) ---
  NAME: import.meta.env.VITE_APP_NAME || 'WibuPedia',
  VERSION: '1.9.9',
  STATUS: 'STABLE', // 'BETA' | 'STABLE' | 'LATEST' | 'MAINTENANCE'
  DESCRIPTION: 'Arsip digital personal untuk eksplorasi anime, manga, dan novel.',
  DEVELOPER: 'Malangan Dev',
  REGION: 'Malang, ID',
  
  // --- PROTOKOL API (Jikan V4 Sync) ---
  API: {
    BASE_URL: 'https://api.jikan.moe/v4',
    TIMEOUT: 12000,       // 12 Detik (Kompensasi Latency)
    RATE_LIMIT_MS: 1200,  // Jeda request (Menghindari 429 Too Many Requests)
    DEFAULT_PAGE_SIZE: 25,
    MAX_SEARCH_RESULTS: 24,
  },

  // --- PARAMETER UI/UX (Interface Engine) ---
  UI: {
    DEFAULT_THEME: 'dark',
    DEBOUNCE_DELAY: 600,      // Penundaan scan input terminal (ms)
    TOAST_DURATION: 3000,     // Durasi pendar notifikasi (ms)
    SCROLL_THRESHOLD: 80,     // Ambang batas scroll navbar cinematic
    AUTO_SLIDE_HERO: 8000,    // Durasi Hero Carousel slide (ms)
    LOADING_SIMULATION: 2500  // Durasi inisialisasi vault (ms)
  },

  // --- FEATURE FLAGS (System Capabilities) ---
  FEATURES: {
    ENABLE_ANIME: true,
    ENABLE_MANGA: true,
    ENABLE_NOVEL: true,       // Pilar Ketiga Aktif
    ENABLE_LIBRARY: true,     // Vault Core Aktif
    ENABLE_QUICK_SEARCH: true, // Shortcut "/" Terminal
    ENABLE_USER_AUTH: false,  // Target v1.9 (Supabase Integration)
    ENABLE_CLOUD_SYNC: false, // Target v1.9
  },

  // --- SOCIAL TRANSMSISSION (External Links) ---
  SOCIAL: {
    GITHUB: 'https://github.com/haku47',
    INSTAGRAM: 'https://instagram.com/alvien1939',
    DISCORD: 'https://discord.gg/wibupedia',
    TWITTER: 'https://twitter.com/wibupedia',
  }
};