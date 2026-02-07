/**
 * Daftar Genre Anime & Manga Populer
 * Berdasarkan database MyAnimeList / Jikan API
 */

export const ANIME_GENRES = [
  { id: 1, name: 'Action', slug: 'action' },
  { id: 2, name: 'Adventure', slug: 'adventure' },
  { id: 4, name: 'Comedy', slug: 'comedy' },
  { id: 8, name: 'Drama', slug: 'drama' },
  { id: 10, name: 'Fantasy', slug: 'fantasy' },
  { id: 14, name: 'Horror', slug: 'horror' },
  { id: 7, name: 'Mystery', slug: 'mystery' },
  { id: 22, name: 'Romance', slug: 'romance' },
  { id: 24, name: 'Sci-Fi', slug: 'sci-fi' },
  { id: 36, name: 'Slice of Life', slug: 'slice-of-life' },
  { id: 30, name: 'Sports', slug: 'sports' },
  { id: 37, name: 'Supernatural', slug: 'supernatural' },
  { id: 41, name: 'Suspense', slug: 'suspense' },
];

export const THEMES = [
  { id: 52, name: 'Isekai', slug: 'isekai' },
  { id: 19, name: 'Music', slug: 'music' },
  { id: 23, name: 'School', slug: 'school' },
  { id: 31, name: 'Super Power', slug: 'super-power' },
  { id: 11, name: 'Game', slug: 'game' },
  { id: 13, name: 'Historical', slug: 'historical' },
  { id: 38, name: 'Military', slug: 'military' },
];

export const DEMOGRAPHICS = [
  { id: 27, name: 'Shounen', slug: 'shounen' },
  { id: 25, name: 'Shoujo', slug: 'shoujo' },
  { id: 42, name: 'Seinen', slug: 'seinen' },
  { id: 43, name: 'Josei', slug: 'josei' },
];

// Gabungan semua untuk keperluan pencarian global
export const ALL_GENRES = [...ANIME_GENRES, ...THEMES, ...DEMOGRAPHICS];