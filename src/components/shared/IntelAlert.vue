<script setup>
import { onMounted, ref } from 'vue'
import { useLibraryStore } from '@/store/libraryStore'
import { useRouter } from 'vue-router'

const libraryStore = useLibraryStore()
const router = useRouter()
const alertItem = ref(null)
const isVisible = ref(false)

const scanSeasonalIntel = async () => {
  try {
    // Ambil anime terpopuler musim ini
    const response = await fetch('https://api.jikan.moe/v4/seasons/now?limit=10')
    const result = await response.json()
    
    if (result.data) {
      const favGenres = libraryStore.getRecommendedGenreIds
      
      // Cari 1 anime yang genrenya cocok dengan favorit Host tapi BELUM ada di library
      const match = result.data.find(item => {
        const hasGenreMatch = item.genres.some(g => favGenres.includes(g.mal_id.toString()))
        const notInLibrary = !libraryStore.isInLibrary(item.mal_id)
        return hasGenreMatch && notInLibrary && item.score > 7.5
      })

      if (match) {
        alertItem.value = match
        setTimeout(() => { isVisible.value = true }, 2000) // Delay biar dramatis
      }
    }
  } catch (err) {
    console.error("Intel Scan Failed", err)
  }
}

onMounted(() => scanSeasonalIntel())
</script>

<template>
  <Transition name="slide-fade">
    <div v-if="isVisible && alertItem" 
         class="mb-12 bg-gradient-to-r from-amber-500/20 to-transparent border-l-4 border-amber-500 p-6 rounded-r-[2rem] relative overflow-hidden group">
      
      <i class="fa-solid fa-radiation absolute -right-4 -bottom-4 text-8xl opacity-[0.03] -rotate-12 group-hover:rotate-0 transition-transform duration-1000"></i>

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div class="flex items-center gap-5">
          <div class="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)] animate-pulse">
            <i class="fa-solid fa-satellite-dish text-white text-xl"></i>
          </div>
          <div>
            <h4 class="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1 italic">Seasonal Intel Alert</h4>
            <p class="text-white text-sm font-bold tracking-tight uppercase">
              Target Terdeteksi: <span class="text-amber-200">{{ alertItem.title }}</span>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <p class="hidden lg:block text-[9px] text-text-muted font-bold uppercase tracking-widest opacity-50 max-w-[200px] text-right italic">
            Anime ini memiliki kecocokan DNA genre tinggi dengan koleksi Host.
          </p>
          <button @click="router.push(`/anime/${alertItem.mal_id}`)"
                  class="px-6 py-3 bg-amber-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-amber-600 transition-all shadow-lg active:scale-95">
            Analyze Target
          </button>
          <button @click="isVisible = false" class="text-white/20 hover:text-white transition-colors">
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-fade-enter-active { transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
.slide-fade-enter-from { opacity: 0; transform: translateX(-50px); }
</style>