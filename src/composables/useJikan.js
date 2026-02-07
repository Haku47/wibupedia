import { ref } from 'vue'
import { animeService, mangaService } from '@/api/jikan'

// Singleton States: Bertahan meskipun ganti halaman (Persistent Cache)
let abortController = null
const cache = {
  characters: new Map(),
  staff: new Map(),
  recommendations: new Map(),
  videos: new Map()
}

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

  // 🛡️ v2.5.0 Strict Security: Blokir total genre 18+ (Hentai, Erotica, BL/GL Explicit)
  const BLACKLIST_GENRES = '12,49,9,28,26'

  // --- ⚡ INTERNAL CORE ENGINE ---
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const executeRequest = async (requestPromise, append = false) => {
    if (abortController) abortController.abort()
    abortController = new AbortController()
    
    loading.value = true
    error.value = null

    try {
      const response = await requestPromise
      const rawData = response.data || []
      
      items.value = append ? [...items.value, ...rawData] : rawData

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
      error.value = err.response?.data?.message || 'Archive Connection Failed.'
      console.error("Jikan API Error:", err)
      return null
    } finally {
      loading.value = false
    }
  }

  // --- 🏗️ COLLECTION METHODS ---

  const fetchTrending = (type = 'anime', page = 1, filterType = 'airing', append = false) => {
    const params = { page, filter: filterType, sfw: true }
    const service = type === 'anime' ? animeService.getTopAnime(params) : mangaService.getTopManga(params)
    return executeRequest(service, append)
  }

  const fetchSeasonal = (page = 1, append = false) => {
    const params = { page, sfw: true, filter: 'tv' }
    return executeRequest(animeService.getSeasonalAnime(params), append)
  }

  const search = (query, type = 'anime', filterParams = {}, page = 1, append = false) => {
    const hasActiveFilters = filterParams.genres?.length > 0 || filterParams.status || filterParams.rating || filterParams.type
    if (!query && !hasActiveFilters) { clear(); return }
    
    const flatParams = {
      q: query || undefined,
      page: page,
      sfw: true,
      genres_exclude: BLACKLIST_GENRES,
      ...filterParams
    }

    const service = type === 'anime' ? animeService.searchAnime(flatParams) : mangaService.searchManga(flatParams)
    return executeRequest(service, append)
  }

  // --- 💎 DETAIL & ENHANCED DATA METHODS ---

  const fetchDetail = async (id, type = 'anime') => {
    loading.value = true
    error.value = null
    selectedItem.value = null
    try {
      const response = type === 'anime' 
        ? await animeService.getAnimeDetails(id) 
        : await mangaService.getMangaDetails(id)
      
      const rating = response.data?.rating || ''
      if (rating.includes('Rx') || rating.includes('R+')) {
        error.value = 'Access Denied: Safety Protocol.'
        return
      }
      selectedItem.value = response.data
      return response.data
    } catch (err) {
      error.value = `Failed to fetch record details.`
    } finally {
      loading.value = false
    }
  }

  const fetchCharacters = async (id, type = 'anime') => {
    const key = `${type}-${id}`
    if (cache.characters.has(key)) return cache.characters.get(key)
    try {
      await sleep(400) // Anti-RateLimit 1
      const res = await fetch(`https://api.jikan.moe/v4/${type}/${id}/characters`)
      const json = await res.json()
      cache.characters.set(key, json.data || [])
      return json.data || []
    } catch (e) { return [] }
  }

  const fetchStaff = async (id, type = 'anime') => {
    if (type === 'manga') return [] // Manga tidak memiliki staff di endpoint ini
    const key = `anime-${id}`
    if (cache.staff.has(key)) return cache.staff.get(key)
    try {
      await sleep(800) // Anti-RateLimit 2
      const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/staff`)
      const json = await res.json()
      cache.staff.set(key, json.data || [])
      return json.data || []
    } catch (e) { return [] }
  }

  const fetchRecommendations = async (id, type = 'anime') => {
    const key = `${type}-${id}`
    if (cache.recommendations.has(key)) return cache.recommendations.get(key)
    try {
      await sleep(500)
      const res = await fetch(`https://api.jikan.moe/v4/${type}/${id}/recommendations`)
      const json = await res.json()
      cache.recommendations.set(key, json.data || [])
      return json.data || []
    } catch (e) { return [] }
  }

  const fetchVideos = async (id) => {
    if (cache.videos.has(id)) return cache.videos.get(id)
    try {
      await sleep(300)
      const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/videos`)
      const json = await res.json()
      cache.videos.set(id, json.data || {})
      return json.data || {}
    } catch (e) { return {} }
  }

  const clear = () => {
    if (abortController) abortController.abort()
    items.value = []
    selectedItem.value = null
    error.value = null
  }

  return {
    items, selectedItem, pagination, loading, error,
    fetchTrending, fetchSeasonal, search, fetchDetail, 
    fetchCharacters, fetchStaff, fetchRecommendations, fetchVideos, clear
  }
}