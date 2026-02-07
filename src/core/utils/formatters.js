/**
 * Memformat tanggal dari API (ISO/String) ke format lokal Indonesia
 * Contoh: 2024-01-27 -> 27 Jan 2024
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'TBA';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

/**
 * Memformat angka skor agar selalu memiliki satu desimal
 * Contoh: 8.5 -> 8.50 atau 9 -> 9.0
 */
export const formatScore = (score) => {
  if (!score) return 'N/A';
  return Number(score).toFixed(1);
};

/**
 * Memformat angka besar (Populeritas/Members) menjadi ringkas
 * Contoh: 1500000 -> 1.5M
 */
export const formatCompactNumber = (number) => {
  if (!number) return '0';
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(number);
};

/**
 * Memotong teks yang terlalu panjang (Truncate)
 * Digunakan jika CSS line-clamp tidak memungkinkan
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Mengubah status Jikan API menjadi bahasa yang lebih ramah
 * Contoh: "Currently Airing" -> "Sedang Tayang"
 */
export const formatStatus = (status) => {
  const statusMap = {
    'Currently Airing': 'Sedang Tayang',
    'Finished Airing': 'Selesai',
    'Not yet aired': 'Belum Tayang',
    'Publishing': 'Berlanjut',
    'Finished': 'Tamat',
    'On Hiatus': 'Hiatus'
  };
  return statusMap[status] || status;
};