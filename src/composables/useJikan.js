import { ref } from 'vue'
import { animeService, mangaService } from '@/api/jikan'

// Singleton Controller untuk Abort Protocol
let abortController = null

export function useJikan() {
  const items = ref([])
  const selectedItem = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  const pagination = ref({
    currentPage: 1,
    hasNextPage: false,
    lastVisiblePage: 1
  })

  // 🛡️ v1.9.6 EXPLICIT GENRE EXCLUSION (NSFW Blocklist)
  // 12: Hentai, 49: Erotica, 28: Boys Love, 26: Girls Love
  const BLACKLIST_GENRES = '12,49,28,26'

  // --- INTERNAL CORE ENGINE ---
  const executeRequest = async (requestPromise, append = false) => {
    if (abortController) {
      abortController.abort()
    }
    
    abortController = new AbortController()
    loading.value = true
    error.value = null

    try {
      const response = await requestPromise
      const rawData = response.data || []
      
      if (append) {
        items.value = [...items.value, ...rawData]
      } else {
        items.value = rawData
      }

      if (response.pagination) {
        pagination.value = {
          currentPage: response.pagination.current_page,
          hasNextPage: response.pagination.has_next_page,
          lastVisiblePage: response.pagination.last_visible_page
        }
      }
      return rawData
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return null
      error.value = err.response?.data?.message || 'Gagal terhubung ke database Jikan.'
      console.error("Jikan API Error:", err)
      throw err 
    } finally {
      loading.value = false
    }
  }

  // --- METHODS (ENFORCED SAFE PROTOCOL) ---
  
  const fetchTrending = (type = 'anime', page = 1, filterType = 'airing', append = false) => {
    // 🛡️ FIX: Inject SFW & Explicit Exclusion
    const params = { 
      page, 
      filter: filterType,
      sfw: true // Force Safe For Work
    }
    
    const service = type === 'anime' 
      ? animeService.getTopAnime(params) 
      : mangaService.getTopManga(params)
      
    return executeRequest(service, append)
  }

  const fetchSeasonal = (page = 1, append = false) => {
    // 🛡️ FIX: Inject SFW global
    const params = { 
      page, 
      sfw: true,
      filter: 'tv' // Biasanya seasonal lebih aman difilter ke tipe TV
    }
    return executeRequest(animeService.getSeasonalAnime(params), append)
  }

  const search = (query, type = 'anime', filterParams = {}, page = 1, append = false) => {
    const hasActiveFilters = filterParams.genres?.length > 0 || filterParams.status || filterParams.rating
    
    if (!query && !hasActiveFilters) {
      clear()
      return
    }

    if (query && query.length < 3 && !hasActiveFilters) return

    // 🛡️ SHIELD: Flatting all params + Enforce SFW & Exclusion
    const flatParams = {
      q: query || undefined,
      page: page,
      sfw: true, // 🛡️ GLOBAL SAFEGUARD
      genres_exclude: BLACKLIST_GENRES, // 🛡️ EXPLICIT EXCLUSION
      ...filterParams
    }

    const service = type === 'anime' 
      ? animeService.searchAnime(flatParams) 
      : mangaService.searchManga(flatParams)
      
    return executeRequest(service, append)
  }

  const fetchDetail = async (id, type = 'anime') => {
    loading.value = true
    error.value = null
    selectedItem.value = null
    try {
      const response = type === 'anime' 
        ? await animeService.getAnimeDetails(id) 
        : await mangaService.getMangaDetails(id)
      
      // 🛡️ DETAIL GUARD: Jika data mengandung rating NSFW, batalkan display
      const rating = response.data?.rating || ''
      if (rating.includes('Rx') || rating.includes('R+')) {
        error.value = 'Access Denied: Content violates safety protocol.'
        return
      }

      selectedItem.value = response.data
    } catch (err) {
      error.value = `Gagal memuat detail ${type}.`
    } finally {
      loading.value = false
    }
  }

  const clear = () => {
    if (abortController) abortController.abort()
    items.value = []
    selectedItem.value = null
    error.value = null
  }

  return {
    items, selectedItem, pagination, loading, error,
    fetchTrending, fetchSeasonal, search, fetchDetail, clear
  }
}