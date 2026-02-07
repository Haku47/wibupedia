<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useJikan } from '@/composables/useJikan'
import { useLibraryStore } from '@/store/libraryStore'
import { useUserStore } from '@/store/userStore' 
// --- 🛡️ IMPORT RESTORED TO CARDS DIRECTORY ---
import AnimeCard from '@/components/cards/AnimeCard.vue'
import SkeletonCard from '@/components/shared/SkeletonCard.vue'

const router = useRouter()
const libraryStore = useLibraryStore()
const userStore = useUserStore() 
const { items, loading, fetchSeasonal, fetchTrending } = useJikan()

// --- STATES ---
const activeTab = ref('harian')
const topRankItems = ref([])
const trendingRef = ref(null)

// --- COMPUTED ---
const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')
const firstName = computed(() => userStore.profile.name.split(' ')[0])

// --- LOGIC: SCROLL ENGINE ---
const scrollTrending = (direction) => {
  if (trendingRef.value) {
    const scrollAmount = direction === 'left' ? -400 : 400
    trendingRef.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }
}

const loadCategory = async (type) => {
  activeTab.value = type
  if (type === 'harian') await fetchTrending('anime', 1, 'airing')
  else if (type === 'mingguan') await fetchTrending('anime', 1, 'bypopularity')
  else await fetchSeasonal(1)
}

onMounted(async () => {
  await loadCategory('harian')
  const { items: trending, fetchTrending: fetchGlobal } = useJikan()
  await fetchGlobal('anime', 1, 'favorite')
  topRankItems.value = trending.value.slice(0, 10)
})
</script>

<template>
  <main class="min-h-screen pb-40 bg-dark-bg font-outfit selection:bg-white/10 relative">
    
    <div :style="{ backgroundColor: primaryColor }" class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] opacity-[0.03] blur-[120px] pointer-events-none"></div>

    <nav class="max-w-7xl mx-auto px-8 pt-16 pb-12 flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/[0.03]">
      <div class="space-y-1">
        <h1 class="text-3xl font-black text-white tracking-tighter uppercase italic">
          Okaeri, <span :style="{ color: primaryColor }">{{ firstName }}.</span>
        </h1>
        <p class="text-[9px] font-black text-white/20 uppercase tracking-[0.5em]">System Status: Operational</p>
      </div>

      <div class="flex items-center gap-6">
        <div class="flex flex-col text-right">
          <span class="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Vault Size</span>
          <span class="text-xl font-black text-white tabular-nums tracking-tighter">{{ libraryStore.totalItems }} <span class="text-[10px] opacity-20">Titles</span></span>
        </div>
        <button @click="router.push('/library')" 
                class="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all shadow-xl">
          <i class="fa-solid fa-bookmark text-sm"></i>
        </button>
      </div>
    </nav>

    <section class="max-w-7xl mx-auto px-8 pt-16 mb-24 relative group/trending">
      <div class="flex items-center justify-between mb-10">
        <div class="flex items-center gap-4">
           <h2 class="text-sm font-black uppercase tracking-[0.4em] text-white italic">Current Trends.</h2>
           <div class="hidden md:flex items-center gap-2 ml-4">
              <button @click="scrollTrending('left')" class="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                <i class="fa-solid fa-chevron-left text-[10px]"></i>
              </button>
              <button @click="scrollTrending('right')" class="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                <i class="fa-solid fa-chevron-right text-[10px]"></i>
              </button>
           </div>
        </div>
        <RouterLink to="/trending" 
                    class="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">
          See All Rankings
        </RouterLink>
      </div>

      <div ref="trendingRef" class="flex gap-6 overflow-x-auto pb-10 scrollbar-hide snap-x relative z-10">
        <div v-for="(item, idx) in topRankItems" :key="item.mal_id" 
             @click="router.push(`/anime/${item.mal_id}`)"
             class="flex-shrink-0 w-44 md:w-52 snap-start group cursor-pointer relative">
          <div class="relative aspect-[3/4.4] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-xl transition-all duration-500 group-hover:-translate-y-3">
             <img :src="item.images.jpg.large_image_url" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
             <div class="absolute inset-0 bg-gradient-to-t from-dark-bg/90 via-transparent to-transparent opacity-60"></div>
             
             <div class="absolute top-4 left-4 w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center">
                <span class="text-[10px] font-black text-white tabular-nums">#{{ idx + 1 }}</span>
             </div>
          </div>
          <div class="mt-5 px-1">
             <h4 class="text-[12px] font-black text-white uppercase truncate tracking-tight mb-1">{{ item.title }}</h4>
             <div class="flex items-center gap-2">
                <span class="text-[8px] font-bold text-white/20 uppercase tracking-widest">{{ item.type }}</span>
                <div class="w-1 h-1 rounded-full bg-white/10"></div>
                <span class="text-[9px] font-black text-emerald-400 tabular-nums">★ {{ item.score }}</span>
             </div>
          </div>
        </div>
      </div>

      <div class="absolute bottom-6 left-8 right-8 h-[2px] bg-white/[0.03] rounded-full overflow-hidden pointer-events-none">
         <div class="h-full bg-white/10 w-1/4 animate-shimmer-bar"></div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-8">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-16">
        <div class="flex items-center gap-5">
           <div class="w-1.5 h-8 rounded-full" :style="{ backgroundColor: primaryColor }"></div>
           <h3 class="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase italic">Discovery <span class="opacity-20">Catalog.</span></h3>
        </div>

        <div class="flex p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-xl">
           <button v-for="tab in ['harian', 'mingguan', 'bulanan']" :key="tab"
             @click="loadCategory(tab)" 
             :class="activeTab === tab ? 'bg-white text-black shadow-lg' : 'text-white/30 hover:text-white'" 
             class="px-10 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
             {{ tab }}
           </button>
        </div>
      </div>

      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
        <SkeletonCard v-for="n in 12" :key="n" />
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
        <AnimeCard v-for="anime in items" :key="anime.mal_id" :anime="anime" />
      </div>
    </section>

  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.scrollbar-hide::-webkit-scrollbar { display: none; }

@keyframes shimmer-bar {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}
.animate-shimmer-bar {
  animation: shimmer-bar 3s infinite linear;
}
</style>