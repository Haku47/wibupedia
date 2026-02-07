<script setup>
import { onMounted, ref, computed } from 'vue'
import { useLibraryStore } from '@/store/libraryStore'
import { useUserStore } from '@/store/userStore'
import { useRouter } from 'vue-router'

const libraryStore = useLibraryStore()
const userStore = useUserStore()
const router = useRouter()

const alertItem = ref(null)
const isVisible = ref(false)
const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')

const scanSeasonalHighlights = async () => {
  try {
    const response = await fetch('https://api.jikan.moe/v4/seasons/now?limit=15')
    const result = await response.json()
    
    if (result.data) {
      const favGenres = libraryStore.getRecommendedGenreIds
      
      // Cari anime musim ini yang cocok dengan selera Host tapi belum ada di library
      const match = result.data.find(item => {
        const hasGenreMatch = item.genres.some(g => favGenres.includes(g.mal_id.toString()))
        const notInLibrary = !libraryStore.isInLibrary(item.mal_id)
        return hasGenreMatch && notInLibrary && item.score > 7.2
      })

      if (match) {
        alertItem.value = match
        setTimeout(() => { isVisible.value = true }, 1500)
      }
    }
  } catch (err) {
    console.error("Seasonal Highlight Scan Failed", err)
  }
}

onMounted(() => scanSeasonalHighlights())
</script>

<template>
  <Transition name="slide-fade">
    <div v-if="isVisible && alertItem" 
         class="mb-12 bg-dark-surface border-l-4 border-amber-500 p-8 rounded-r-[3rem] relative overflow-hidden group shadow-2xl font-outfit">
      
      <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-500 opacity-[0.03] blur-3xl rounded-full transition-all group-hover:opacity-[0.06]"></div>

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
        <div class="flex items-center gap-6">
          <div class="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <i class="fa-solid fa-star text-amber-500 text-xl animate-pulse"></i>
          </div>
          <div>
            <h4 class="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Seasonal Highlight</h4>
            <p class="text-white text-lg font-black tracking-tight uppercase leading-tight">
              Mungkin Kamu Suka: <span class="text-amber-200/80">{{ alertItem.title }}</span>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <p class="hidden lg:block text-[10px] text-text-muted font-bold uppercase tracking-widest opacity-40 max-w-[220px] text-right">
            Anime ini sesuai dengan genre yang sering kamu simpan di koleksi.
          </p>
          
          <div class="flex items-center gap-3">
            <button @click="router.push(`/anime/${alertItem.mal_id}`)"
                    class="px-8 py-4 bg-amber-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-xl active:scale-95">
              View Details
            </button>
            
            <button @click="isVisible = false" class="w-10 h-10 flex items-center justify-center text-white/10 hover:text-white transition-colors">
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }

.slide-fade-enter-active { 
  transition: all 1s cubic-bezier(0.22, 1, 0.36, 1); 
}
.slide-fade-enter-from { 
  opacity: 0; 
  transform: translateX(-40px); 
}

/* Custom shadow for amber alert */
.bg-dark-surface {
  box-shadow: 0 25px 50px -12px rgba(245, 158, 11, 0.05);
}
</style>