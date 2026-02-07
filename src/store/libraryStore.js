import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useLibraryStore = defineStore('library', () => {
  // --- Constants ---
  const STORAGE_KEY = 'wibupedia_lib_v1'
  const HISTORY_KEY = 'wibupedia_history'
  const LOG_KEY = 'wibupedia_logs'

  // --- Initial State ---
  const getInitialLibrary = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch (e) { return [] }
  }

  const myLibrary = ref(getInitialLibrary())
  const logs = ref(JSON.parse(localStorage.getItem(LOG_KEY) || '[]'))

  // --- Persistence Logic ---
  watch(myLibrary, (newList) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList))
  }, { deep: true })

  watch(logs, (newLogs) => {
    localStorage.setItem(LOG_KEY, JSON.stringify(newLogs.slice(0, 50)))
  }, { deep: true })

  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      myLibrary.value = JSON.parse(event.newValue)
    }
  })

  // --- GETTERS: ANALYTICS ---
  const sortedLibrary = computed(() => {
    return [...myLibrary.value].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
  })

  const totalItems = computed(() => myLibrary.value.length)

  const vaultStats = computed(() => {
    const total = myLibrary.value.length
    if (total === 0) return null
    const totalScore = myLibrary.value.reduce((acc, item) => acc + (Number(item.score) || 0), 0)
    const avgScore = total > 0 ? (totalScore / total).toFixed(2) : '0.00'
    const genreCounts = {}
    myLibrary.value.forEach(item => {
      const genres = item.genres || []
      genres.forEach(g => { if (g.name) genreCounts[g.name] = (genreCounts[g.name] || 0) + 1 })
    })
    const topGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 3)
    return { total, avgScore, topGenres, hasEnoughData: topGenres.length > 0 }
  })

  // --- 🧠 v1.9.9: INTELLIGENCE SUMMARY REPORT ENGINE ---
  const intelligenceReport = computed(() => {
    if (myLibrary.value.length < 5) return null

    const stats = vaultStats.value
    const topGenre = stats.topGenres[0][0]
    const avgScore = parseFloat(stats.avgScore)

    // Persona Logic Mapping
    let persona = "The Generalist"
    let description = "Koleksi Host menunjukkan selera yang sangat seimbang. Host adalah tipe penikmat yang terbuka pada berbagai narasi."

    if (topGenre === 'Action' || topGenre === 'Adventure') {
      persona = "The Vanguard"
      description = "Host menyukai adrenalin, konflik intens, dan narasi kepahlawanan. Database Host didominasi oleh energi tinggi."
    } else if (topGenre === 'Romance' || topGenre === 'Slice of Life' || topGenre === 'Drama') {
      persona = "The Soul Searcher"
      description = "Host cenderung mencari kedalaman emosional dan realita kehidupan. Database ini adalah refleksi dari empati Host."
    } else if (topGenre === 'Fantasy' || topGenre === 'Sci-Fi') {
      persona = "The World Builder"
      description = "Host terpaku pada imajinasi tanpa batas dan struktur dunia yang kompleks. Realita saja tidak cukup untuk Host."
    } else if (topGenre === 'Comedy') {
      persona = "The Optimist"
      description = "Database Host adalah sumber dopamin. Host memprioritaskan hiburan yang ringan dan menyegarkan suasana."
    }

    // Quality Tier Mapping
    const qualityTier = avgScore > 8.5 ? "Elite Critic" : (avgScore > 7.5 ? "Selective Enthusiast" : "Casual Consumer")
    
    return { 
      persona, 
      description, 
      qualityTier, 
      avgScore,
      total: stats.total,
      topGenres: stats.topGenres 
    }
  })

  // --- GETTERS: UTILITY ---
  const getRecommendedGenreIds = computed(() => {
    if (myLibrary.value.length === 0) return []
    const genreCounts = {}
    myLibrary.value.forEach(item => {
      const genres = item.genres || []
      genres.forEach(g => { if (g.mal_id) genreCounts[g.mal_id] = (genreCounts[g.mal_id] || 0) + 1 })
    })
    return Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([id]) => id.toString())
  })

  const seasonalIntel = computed(() => {
    if (myLibrary.value.length === 0) return null
    return { favoriteGenreIds: getRecommendedGenreIds.value, scanYear: 2026, scanSeason: 'winter' }
  })

  // --- INTERNAL HELPER: LOGGING ---
  const pushLog = (action, target) => {
    logs.value.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action,
      target
    })
  }

  // --- ACTIONS ---
  const exportLibrary = () => {
    try {
      const data = JSON.stringify({
        appName: 'WibuPedia',
        version: '1.9.9',
        exportDate: new Date().toISOString(),
        payload: myLibrary.value
      }, null, 2)
      const blob = new Blob([data], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `WibuPedia_Backup_${new Date().toISOString().slice(0, 10)}.json`)
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      setTimeout(() => {
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }, 100)
      pushLog('EXPORT', 'Intelligence Report & Database Backed Up')
      return true
    } catch (err) { return false }
  }

  const importLibrary = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = JSON.parse(e.target.result)
          const data = content.payload || content
          if (Array.isArray(data)) {
            myLibrary.value = data
            pushLog('IMPORT', `Memory Restored (${data.length} items)`)
            resolve(true)
          } else { reject(new Error("Invalid format")) }
        } catch (err) { reject(err) }
      }
      reader.readAsText(file)
    })
  }

  const addToLibrary = (item) => {
    if (!item || !item.mal_id) return
    if (!isInLibrary(item.mal_id)) {
      const typeUpper = item.type?.toUpperCase() || ''
      const isNovel = typeUpper.includes('NOVEL')
      const isMangaEntity = ['MANGA', 'ONE-SHOT', 'DOUJINSHI', 'MANHWA', 'MANHUA'].includes(typeUpper) || !!item.chapters
      let mainCategory = isNovel ? 'novel' : (isMangaEntity ? 'manga' : 'anime')

      const normalizedData = {
        mal_id: item.mal_id,
        title: item.title,
        title_japanese: item.title_japanese,
        images: { jpg: { large_image_url: item.images?.jpg?.large_image_url || item.image } },
        score: Number(item.score) || 0,
        genres: Array.isArray(item.genres) ? item.genres : [],
        type: item.type,
        category: mainCategory,
        addedAt: new Date().toISOString()
      }
      myLibrary.value.unshift(normalizedData)
      saveToHistory(normalizedData)
      pushLog('ADD', normalizedData.title)
    }
  }

  const removeFromLibrary = (id) => {
    const item = myLibrary.value.find(i => i.mal_id === id)
    if (item) {
      pushLog('REMOVE', item.title)
      myLibrary.value = myLibrary.value.filter(i => i.mal_id !== id)
    }
  }

  const isInLibrary = (id) => myLibrary.value.some(item => item.mal_id === id)

  const clearLibrary = () => {
    if (confirm('Bersihkan seluruh isi Library?')) {
      pushLog('PURGE', 'Identity Wipe Initiated')
      myLibrary.value = []
    }
  }

  const saveToHistory = (item) => {
    try {
      const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
      const filteredHistory = history.filter(h => h.mal_id !== item.mal_id)
      filteredHistory.unshift({ 
        mal_id: item.mal_id, 
        title: item.title, 
        image: item.images?.jpg?.large_image_url || item.image, 
        category: item.category, 
        viewedAt: new Date().toISOString() 
      })
      localStorage.setItem(HISTORY_KEY, JSON.stringify(filteredHistory.slice(0, 10)))
    } catch (e) {}
  }

  return { 
    myLibrary, sortedLibrary, totalItems, vaultStats,
    getRecommendedGenreIds, seasonalIntel, logs, intelligenceReport,
    addToLibrary, removeFromLibrary, isInLibrary, 
    clearLibrary, saveToHistory, exportLibrary, importLibrary 
  }
})