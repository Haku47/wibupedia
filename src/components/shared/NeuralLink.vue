<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useLibraryStore } from '@/store/libraryStore'
import { useUserStore } from '@/store/userStore'
import { useRouter } from 'vue-router'

const libraryStore = useLibraryStore()
const userStore = useUserStore()
const router = useRouter()

const recommendations = ref([])
const isLoading = ref(false)
const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')

const fetchPersonalizedData = async () => {
  const genreIds = libraryStore.getRecommendedGenreIds
  
  // Jika genre tidak terdeteksi, hentikan proses (atau bisa fallback ke trending)
  if (!genreIds || genreIds.length === 0) return

  isLoading.value = true
  try {
    const params = new URLSearchParams({
      genres: genreIds.join(','),
      order_by: 'score',
      sort: 'desc',
      limit: '10',
      sfw: 'true'
    })

    const response = await fetch(`https://api.jikan.moe/v4/anime?${params}`)
    const result = await response.json()
    
    if (result.data) {
      // Filter: Hanya tampilkan yang belum ada di koleksi
      recommendations.value = result.data
        .filter(item => !libraryStore.isInLibrary(item.mal_id))
        .slice(0, 3) 
    }
  } catch (err) {
    console.error("Discovery Connection Interrupted:", err)
  } finally {
    isLoading.value = false
  }
}

// Re-scan jika jumlah koleksi berubah
watch(() => libraryStore.totalItems, () => {
  fetchPersonalizedData()
})

onMounted(() => {
  fetchPersonalizedData()
})
</script>

<template>
  <div v-if="recommendations.length > 0" class="mt-16 mb-20 animate-reveal font-outfit">
    <div class="flex items-center justify-between mb-10 px-4">
      <div class="flex items-center gap-5">
        <div class="relative flex h-2 w-2">
          <span :style="{ backgroundColor: primaryColor }" class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"></span>
          <span :style="{ backgroundColor: primaryColor }" class="relative inline-flex rounded-full h-2 w-2 shadow-lg"></span>
        </div>
        <h3 class="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
          Personal Discoveries
        </h3>
      </div>
      <div class="h-px flex-grow mx-8 bg-white/5"></div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div v-for="item in recommendations" :key="item.mal_id"
           @click="router.push(`/anime/${item.mal_id}`)"
           class="group bg-dark-surface/60 backdrop-blur-3xl border border-white/5 p-5 rounded-[2.5rem] flex items-center gap-6 cursor-pointer hover:border-white/20 transition-all duration-500 shadow-2xl relative overflow-hidden">
        
        <div class="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity pointer-events-none" :style="{ backgroundColor: primaryColor }"></div>

        <div class="w-20 h-28 rounded-2xl overflow-hidden flex-shrink-0 border border-white/5 shadow-xl relative z-10">
          <img :src="item.images.jpg.large_image_url" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
        </div>

        <div class="flex-grow overflow-hidden relative z-10">
          <div class="flex items-center gap-3 mb-2">
             <span class="text-[8px] font-black uppercase px-2.5 py-1 rounded-lg border shadow-sm" 
                   :style="{ color: primaryColor, backgroundColor: primaryColor + '10', borderColor: primaryColor + '20' }">
               Tailored
             </span>
             <span class="text-[10px] font-bold text-text-muted tabular-nums opacity-60">★ {{ item.score || 'N/A' }}</span>
          </div>
          
          <h4 class="text-[13px] font-black text-white uppercase truncate mb-2 tracking-tight group-hover:text-brand-primary transition-colors leading-tight">
            {{ item.title }}
          </h4>
          
          <p class="text-[9px] text-text-muted font-bold uppercase tracking-widest opacity-30 truncate">
            {{ item.genres?.map(g => g.name).slice(0, 2).join(' • ') }}
          </p>
        </div>

        <div class="shrink-0 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
          <i class="fa-solid fa-chevron-right text-[10px] text-text-muted"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }

.animate-reveal { 
  animation: revealUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; 
}

@keyframes revealUp { 
  from { opacity: 0; transform: translateY(30px); filter: blur(10px); } 
  to { opacity: 1; transform: translateY(0); filter: blur(0); } 
}
</style>