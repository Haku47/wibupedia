import { ref } from 'vue'
import { animeService, mangaService } from '@/api/jikan'

// Singleton States (Shared across components)
let abortController = null
const characterCache = new Map()
const staffCache = new Map()

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

  // 🛡️ v2.0.0 NSFW Blocklist
  const BLACKLIST_GENRES = '12,49,28,26'

  // --- ⚡ INTERNAL REQUEST ENGINE ---
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
      error.value = err.response?.data?.message || 'Gagal terhubung ke database Jikan.'
      console.error("Jikan API Error:", err)
      return null
    } finally {
      loading.value = false
    }
  }

  // --- 🏗️ METHODS ---

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
    const hasActiveFilters = filterParams.genres?.length > 0 || filterParams.status || filterParams.rating
    if (!query && !hasActiveFilters) { clear(); return }
    if (query && query.length < 3 && !hasActiveFilters) return

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
    } catch (err) {
      error.value = `Gagal memuat detail.`
    } finally {
      loading.value = false
    }
  }

  // --- 👥 NEW: ENHANCED DATA METHODS ---
  // Fungsi helper untuk delay demi mencegah 429
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const fetchCharacters = async (id, type = 'anime') => {
    const cacheKey = `${type}-${id}`
    if (characterCache.has(cacheKey)) return characterCache.get(cacheKey)

    try {
      await sleep(500) // ⏳ Jeda 500ms untuk anti-spam
      const res = await fetch(`https://api.jikan.moe/v4/${type}/${id}/characters`)
      const json = await res.json()
      characterCache.set(cacheKey, json.data || [])
      return json.data || []
    } catch (e) { return [] }
  }

  const fetchStaff = async (id, type = 'anime') => {
    const cacheKey = `${type}-${id}`
    if (staffCache.has(cacheKey)) return staffCache.get(cacheKey)

    try {
      await sleep(1000) // ⏳ Jeda lebih lama untuk staff
      const res = await fetch(`https://api.jikan.moe/v4/${type}/${id}/staff`)
      const json = await res.json()
      staffCache.set(cacheKey, json.data || [])
      return json.data || []
    } catch (e) { return [] }
  }

  const clear = () => {
    if (abortController) abortController.abort()
    items.value = []
    selectedItem.value = null
  }

  return {
    items, selectedItem, pagination, loading, error,
    fetchTrending, fetchSeasonal, search, fetchDetail, fetchCharacters, fetchStaff, clear
  }
}