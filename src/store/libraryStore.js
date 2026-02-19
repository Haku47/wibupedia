import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useLibraryStore = defineStore('library', () => {
  // --- Archive Configuration (Community Edition) ---
  const STORAGE_KEY = 'wibupedia_archive_ce'
  const LOG_KEY = 'wibupedia_logs_ce'
  const HISTORY_KEY = 'wibupedia_history_ce'

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
    // Community Limit: Simpan 50 aktivitas terbaru
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
      .slice(0, 5) // CE Update: Pantau 5 genre teratas
      
    return { total, avgScore, topGenres, hasEnoughData: total >= 5 }
  })

  // --- ✨ COMMUNITY TASTE REPORT ENGINE (CE REFINED) ---
  const tasteReport = computed(() => {
    if (!vaultStats.value || vaultStats.value.total < 5) return null

    const stats = vaultStats.value
    const topGenre = stats.topGenres[0][0]
    const avgScore = parseFloat(stats.avgScore)

    // CE Persona Mapping
    let persona = "The Universal Curator"
    let description = "Archive Anda menunjukkan selera yang sangat seimbang. Anda menikmati cerita dari berbagai dimensi tanpa batas genre."

    if (['Action', 'Adventure', 'Fantasy'].includes(topGenre)) {
      persona = "The Mythic Seeker"
      description = "Anda menyukai narasi epik dan pembangunan dunia yang megah. Koleksi Anda didominasi oleh semangat petualangan yang tak padam."
    } else if (['Romance', 'Slice of Life', 'Drama'].includes(topGenre)) {
      persona = "The Soul Archivist"
      description = "Kedalaman emosional adalah prioritas Anda. Setiap judul dalam koleksi ini mencerminkan apresiasi Anda terhadap sisi kemanusiaan."
    } else if (['Mystery', 'Suspense', 'Horror'].includes(topGenre)) {
      persona = "The Shadow Observer"
      description = "Anda tertarik pada teka-teki dan atmosfer yang mendalam. Archive Anda penuh dengan rahasia yang menunggu untuk diungkap."
    }

    // Community Tiering
    const tasteLevel = avgScore >= 8.5 ? "Grandmaster" : (avgScore >= 7.5 ? "Expert" : "Enthusiast")
    
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
        source: 'WibuPedia Community Edition',
        version: '2.6.0',
        exportDate: new Date().toISOString(),
        payload: myLibrary.value
      }, null, 2)
      
      const blob = new Blob([data], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `WibuPedia_Archive_CE_${new Date().toISOString().slice(0, 10)}.json`)
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      
      setTimeout(() => {
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }, 100)
      
      pushLog('EXPORT', 'Archive Backup Created')
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
            pushLog('IMPORT', `Archive Restored (${data.length} items)`)
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
      
      // 🛡️ v2.6.0 CE: Improved Auto-Categorization
      let mainCategory = 'anime'
      const mangaTypes = ['MANGA', 'ONE-SHOT', 'DOUJINSHI', 'MANHWA', 'MANHUA']
      
      if (typeUpper.includes('NOVEL')) {
        mainCategory = 'novel'
      } else if (mangaTypes.includes(typeUpper)) {
        mainCategory = 'manga'
      } else if (typeUpper === 'MOVIE') {
        mainCategory = 'anime' // UI will handle MovieCard
      } else if (typeUpper === 'ONA') {
        mainCategory = 'anime' // UI will handle DonghuaCard
      }

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
    if (confirm('Bersihkan seluruh catatan archive? Tindakan ini tidak bisa dibatalkan.')) {
      pushLog('PURGE', 'Archive Reset')
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