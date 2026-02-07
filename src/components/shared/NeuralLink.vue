<script setup>
import { onMounted, ref, watch } from 'vue'
import { useLibraryStore } from '@/store/libraryStore'
import { useJikan } from '@/composables/useJikan' // Gunakan composable agar seragam
import { useRouter } from 'vue-router'

const libraryStore = useLibraryStore()
const router = useRouter()
const { fetchTrending } = useJikan()

const recommendations = ref([])
const isLoading = ref(false)

const fetchNeuralData = async () => {
  const genreIds = libraryStore.getRecommendedGenreIds
  
  // Jika genre tidak terdeteksi, kita ambil Global Trending sebagai fallback
  if (!genreIds || genreIds.length === 0) {
    console.log("Neural Link: No DNA detected, falling back to Global Favorites.");
    // Logika fallback: ambil anime paling favorit yang belum ada di library
    return; 
  }

  isLoading.value = true
  try {
    // Protokol Pencarian Berbasis DNA Genre
    // Menggunakan Jikan API: /anime?genres=1,2&order_by=score&sort=desc
    const params = new URLSearchParams({
      genres: genreIds.join(','),
      order_by: 'score',
      sort: 'desc',
      limit: '10', // Ambil lebih banyak untuk difilter
      sfw: 'true'
    })

    const response = await fetch(`https://api.jikan.moe/v4/anime?${params}`)
    const result = await response.json()
    
    if (result.data) {
      // Filter: Hanya tampilkan yang BELUM ada di library Host
      recommendations.value = result.data
        .filter(item => !libraryStore.isInLibrary(item.mal_id))
        .slice(0, 3) // Tampilkan top 3 saja agar layout tetap clean
    }
  } catch (err) {
    console.error("Neural Link Connection Interrupted:", err)
  } finally {
    isLoading.value = false
  }
}

// Re-scan jika library berubah (misal Host baru saja hapus/tambah anime)
watch(() => libraryStore.totalItems, () => {
  fetchNeuralData()
})

onMounted(() => {
  fetchNeuralData()
})
</script>

<template>
  <div v-if="recommendations.length > 0" class="mt-12 mb-16 animate-reveal">
    <div class="flex items-center justify-between mb-8 px-2">
      <div class="flex items-center gap-4">
        <div class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-brand-primary shadow-neon"></span>
        </div>
        <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-white italic opacity-80">
          Neural Link: Suggested DNA
        </h3>
      </div>
      <div class="h-px flex-grow mx-6 bg-white/5"></div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="item in recommendations" :key="item.mal_id"
           @click="router.push(`/anime/${item.mal_id}`)"
           class="group bg-dark-surface/40 backdrop-blur-md border border-white/5 p-4 rounded-[2rem] flex items-center gap-5 cursor-pointer hover:border-brand-primary/30 transition-all duration-500 shadow-xl">
        
        <div class="w-20 h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-white/5 shadow-lg">
          <img :src="item.images.jpg.large_image_url" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        </div>

        <div class="flex-grow overflow-hidden">
          <div class="flex items-center gap-2 mb-1">
             <span class="text-[7px] font-black uppercase px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded-md italic">Match</span>
             <span class="text-[9px] font-bold text-text-muted tabular-nums">★ {{ item.score || 'N/A' }}</span>
          </div>
          <h4 class="text-[11px] font-black text-white uppercase truncate mb-2 italic tracking-tight group-hover:text-brand-primary transition-colors">
            {{ item.title }}
          </h4>
          <p class="text-[8px] text-text-muted font-bold uppercase tracking-widest opacity-40 truncate">
            {{ item.genres?.map(g => g.name).slice(0, 2).join(' • ') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shadow-neon { box-shadow: 0 0 15px var(--color-brand-primary); }
.animate-reveal { animation: revealUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
@keyframes revealUp { from { opacity: 0; transform: translateY(20px); filter: blur(10px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
</style>