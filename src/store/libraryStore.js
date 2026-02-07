import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useLibraryStore = defineStore('library', () => {
  // --- Configuration ---
  const STORAGE_KEY = 'wibupedia_lib_v2'
  const LOG_KEY = 'wibupedia_logs'
  const HISTORY_KEY = 'wibupedia_recent_views'

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
    // Keep only the last 50 activities to save space
    localStorage.setItem(LOG_KEY, JSON.stringify(newLogs.slice(0, 50)))
  }, { deep: true })

  // Cross-tab synchronization
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
      genres.forEach(g => { 
        if (g.name) genreCounts[g.name] = (genreCounts[g.name] || 0) + 1 
      })
    })
    
    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      
    return { total, avgScore, topGenres, hasEnoughData: topGenres.length > 0 }
  })

  // --- ✨ COMMUNITY TASTE REPORT ENGINE ---
  const tasteReport = computed(() => {
    if (myLibrary.value.length < 5) return null

    const stats = vaultStats.value
    const topGenre = stats.topGenres[0][0]
    const avgScore = parseFloat(stats.avgScore)

    // Modern Persona Mapping
    let persona = "The Multi-Genre Explorer"
    let description = "Koleksi Anda menunjukkan selera yang sangat beragam. Anda tipe penikmat cerita yang terbuka pada segala jenis petualangan."

    if (topGenre === 'Action' || topGenre === 'Adventure') {
      persona = "The Thrill Seeker"
      description = "Anda sangat menyukai adrenalin dan narasi penuh semangat. Koleksi Anda didominasi oleh kisah-kisah yang membangkitkan energi."
    } else if (topGenre === 'Romance' || topGenre === 'Slice of Life' || topGenre === 'Drama') {
      persona = "The Emotionally Driven"
      description = "Anda cenderung mencari kedalaman emosional dan makna dalam kehidupan sehari-hari. Koleksi ini adalah cerminan dari empati Anda."
    } else if (topGenre === 'Fantasy' || topGenre === 'Sci-Fi') {
      persona = "The Imaginative Dreamer"
      description = "Dunia nyata saja tidak cukup untuk Anda. Anda sangat mengagumi pembangunan dunia yang kompleks dan imajinasi tanpa batas."
    } else if (topGenre === 'Comedy') {
      persona = "The Lighthearted Soul"
      description = "Bagi Anda, hiburan adalah obat terbaik. Koleksi Anda dipenuhi oleh keceriaan yang mampu mencerahkan suasana."
    }

    // Quality Leveling
    const tasteLevel = avgScore > 8.5 ? "Master Curator" : (avgScore > 7.5 ? "Dedicated Fan" : "Casual Enthusiast")
    
    return { 
      persona, 
      description, 
      tasteLevel, 
      avgScore,
      total: stats.total,
      topGenres: stats.topGenres 
    }
  })

  // --- GETTERS: RECOMMENDATION HELPERS ---
  const getRecommendedGenreIds = computed(() => {
    if (myLibrary.value.length === 0) return []
    const genreCounts = {}
    myLibrary.value.forEach(item => {
      const genres = item.genres || []
      genres.forEach(g => { 
        if (g.mal_id) genreCounts[g.mal_id] = (genreCounts[g.mal_id] || 0) + 1 
      })
    })
    return Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([id]) => id.toString())
  })

  // --- INTERNAL HELPER: ACTIVITY LOGS ---
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
        source: 'WibuPedia Community Hub',
        version: '2.6.0',
        exportDate: new Date().toISOString(),
        payload: myLibrary.value
      }, null, 2)
      
      const blob = new Blob([data], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `WibuPedia_Collection_${new Date().toISOString().slice(0, 10)}.json`)
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      
      setTimeout(() => {
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }, 100)
      
      pushLog('EXPORT', 'Koleksi Berhasil Dicadangkan')
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
            pushLog('IMPORT', `Koleksi Dipulihkan (${data.length} item)`)
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
    if (confirm('Hapus seluruh koleksi di dalam Library?')) {
      pushLog('PURGE', 'Pembersihan Seluruh Koleksi')
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
    getRecommendedGenreIds, logs, tasteReport,
    addToLibrary, removeFromLibrary, isInLibrary, 
    clearLibrary, saveToHistory, exportLibrary, importLibrary 
  }
})