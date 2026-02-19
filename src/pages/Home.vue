<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useJikan } from '@/composables/useJikan'
import { useLibraryStore } from '@/store/libraryStore'
import { useUserStore } from '@/store/userStore' 

// --- 💳 ELITE CARDS IMPORT ---
import AnimeCard from '@/components/cards/AnimeCard.vue'
import MangaCard from '@/components/cards/MangaCard.vue'
import MovieCard from '@/components/cards/MovieCard.vue'
import NovelCard from '@/components/cards/NovelCard.vue'
import DonghuaCard from '@/components/cards/DonghuaCard.vue'
import SkeletonCard from '@/components/shared/SkeletonCard.vue'

const router = useRouter()
const libraryStore = useLibraryStore()
const userStore = useUserStore() 

// Instance 1: Untuk Discovery Archive (Konten Bawah)
const archiveEngine = useJikan()
const { items, loading, clear } = archiveEngine

// --- STATES ---
const activeTab = ref('tv') 
const activeGenre = ref(null)
const topRankItems = ref([])
const trendingRef = ref(null)

// --- 🏷️ POPULAR GENRES LIST ---
const QUICK_GENRES = [
  { id: 1, name: 'Action' }, { id: 2, name: 'Adventure' }, { id: 4, name: 'Comedy' },
  { id: 8, name: 'Drama' }, { id: 10, name: 'Fantasy' }, { id: 22, name: 'Romance' },
  { id: 37, name: 'Supernatural' }, { id: 62, name: 'Isekai' }
]

// --- 🍞 TOAST SYSTEM ---
const toast = ref({ show: false, message: '', type: 'add' })
const triggerToast = (msg, type = 'add') => {
  toast.value = { show: true, message: msg, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

// --- COMMUNITY THEME ENGINE ---
const theme = computed(() => {
  const configs = {
    tv: { label: 'TV Series', color: 'text-brand-primary', bg: 'bg-brand-primary', hex: '#3b82f6' },
    movie: { label: 'Movies', color: 'text-purple-500', bg: 'bg-purple-500', hex: '#a855f7' },
    manga: { label: 'Manga', color: 'text-emerald-500', bg: 'bg-emerald-500', hex: '#10b981' },
    novel: { label: 'Light Novel', color: 'text-amber-500', bg: 'bg-amber-500', hex: '#f59e0b' },
    donghua: { label: 'Donghua', color: 'text-red-500', bg: 'bg-red-500', hex: '#ef4444' }
  }
  return configs[activeTab.value] || configs.tv
})

const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')
const firstName = computed(() => userStore.profile.name?.split(' ')[0] || 'User')

// --- LOGIC: QUICK BOOKMARK ---
const handleQuickBookmark = (e, item) => {
  e.stopPropagation()
  if (libraryStore.isInLibrary(item.mal_id)) {
    libraryStore.removeFromLibrary(item.mal_id)
    triggerToast('Removed from Collection', 'remove')
  } else {
    const category = (activeTab.value === 'manga' || activeTab.value === 'novel') ? 'manga' : 'anime'
    libraryStore.addToLibrary({ ...item, category, addedAt: new Date().toISOString() })
    triggerToast('Added to Collection', 'add')
  }
}

// --- LOGIC: DATA FETCHING ---
const loadMainContent = async (type, genreId = null) => {
  activeTab.value = type
  activeGenre.value = genreId
  clear() 
  
  const filterParams = genreId ? { genres: genreId.toString() } : {}

  if (type === 'tv') {
    if (genreId) await archiveEngine.search('', 'anime', { ...filterParams, type: 'tv', order_by: 'score' })
    else await archiveEngine.fetchTrending('anime', 1, 'airing')
  } 
  else if (type === 'movie') {
    await archiveEngine.search('', 'anime', { ...filterParams, type: 'movie', order_by: 'score', sort: 'desc' })
  } 
  else if (type === 'manga') {
    if (genreId) await archiveEngine.search('', 'manga', { ...filterParams, type: 'manga', order_by: 'score' })
    else await archiveEngine.fetchTrending('manga', 1, 'bypopularity')
  } 
  else if (type === 'novel') {
    await archiveEngine.search('', 'manga', { ...filterParams, type: 'lightnovel', order_by: 'popularity', sort: 'desc' })
  } 
  else if (type === 'donghua') {
    await archiveEngine.search('', 'anime', { ...filterParams, type: 'ona', order_by: 'popularity', sort: 'desc' })
  }
}

const scrollTrending = (direction) => {
  if (trendingRef.value) {
    const scrollAmount = direction === 'left' ? -400 : 400
    trendingRef.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }
}

// --- 🛡️ IMPROVED LIFECYCLE ---
onMounted(async () => {
  // 1. Load Konten Bawah dulu
  await loadMainContent('tv')
  
  // 2. Jeda agar tidak kena Rate Limit (429)
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 3. Load Hall of Fame pakai Instance terpisah
  const globalEngine = useJikan()
  try {
    const res = await globalEngine.fetchTrending('anime', 1, 'favorite')
    topRankItems.value = res?.slice(0, 10) || []
  } catch (err) {
    console.error("Hall of Fame sync error:", err)
  }
})
</script>

<template>
  <main class="min-h-screen pb-40 bg-dark-bg font-outfit selection:bg-white/10 relative overflow-x-hidden">
    
    <Transition name="toast-slide">
      <div v-if="toast.show" 
           class="fixed top-12 left-1/2 -translate-x-1/2 z-[1000] px-8 py-4 rounded-2xl backdrop-blur-2xl border border-white/10 shadow-2xl flex items-center gap-4 min-w-[320px]"
           :class="toast.type === 'add' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'">
        <div class="w-2 h-2 rounded-full animate-pulse" :class="toast.type === 'add' ? 'bg-emerald-400' : 'bg-red-400'"></div>
        <span class="text-[11px] font-black uppercase tracking-[0.2em] ">{{ toast.message }}</span>
      </div>
    </Transition>

    <div :style="{ backgroundColor: primaryColor }" class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] opacity-[0.03] blur-[120px] pointer-events-none"></div>

    <nav class="max-w-7xl mx-auto px-8 pt-16 pb-12 flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/[0.03] relative z-20">
      <div class="space-y-2">
        <h1 class="text-4xl font-black text-white tracking-tighter uppercase leading-none">
          Okaeri, <span :style="{ color: primaryColor }">{{ firstName }}.</span>
        </h1>
        <p class="text-[9px] font-black text-white/20 uppercase tracking-[0.6em]">WIBUPEDIA SYSTEM</p>
      </div>

      <div class="flex items-center gap-6 bg-white/[0.02] border border-white/5 p-4 rounded-[2rem] backdrop-blur-xl">
        <div class="flex flex-col text-right px-4">
          <span class="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Archived Items</span>
          <span class="text-xl font-black text-white tabular-nums tracking-tighter">{{ libraryStore.totalItems }} <span class="text-[10px] opacity-20 ">Units</span></span>
        </div>
        <button @click="router.push('/library')" 
                :style="{ backgroundColor: primaryColor }"
                class="w-14 h-14 rounded-[1.4rem] flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all shadow-2xl">
          <i class="fa-solid fa-layer-group text-lg"></i>
        </button>
      </div>
    </nav>

    <section class="max-w-7xl mx-auto px-8 pt-16 mb-24 relative group/trending">
      <div class="flex items-center justify-between mb-12">
        <div class="flex items-center gap-4">
           <div class="w-1 h-4 rounded-full bg-white/10"></div>
           <h2 class="text-sm font-black uppercase tracking-[0.5em] text-white/30 ">Hall of Fame</h2>
        </div>
        <div class="flex items-center gap-3">
            <button @click="scrollTrending('left')" class="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
              <i class="fa-solid fa-chevron-left text-xs"></i>
            </button>
            <button @click="scrollTrending('right')" class="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
              <i class="fa-solid fa-chevron-right text-xs"></i>
            </button>
        </div>
      </div>

      <div ref="trendingRef" class="flex gap-8 overflow-x-auto pb-14 scrollbar-hide snap-x relative z-10">
        <template v-if="topRankItems.length === 0">
           <div v-for="n in 5" :key="n" class="flex-shrink-0 w-48 md:w-56 aspect-[3/4.4] rounded-[2.5rem] bg-white/5 animate-pulse"></div>
        </template>

        <div v-else v-for="(item, idx) in topRankItems" :key="item.mal_id" 
             @click="router.push(`/anime/${item.mal_id}`)"
             class="flex-shrink-0 w-48 md:w-56 snap-start group cursor-pointer relative">
          <div class="relative aspect-[3/4.4] rounded-[2.5rem] overflow-hidden border-4 border-white/5 shadow-2xl transition-all duration-700 group-hover:-translate-y-4">
             <img :src="item.images.jpg.large_image_url" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
             <div class="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-90"></div>
             <div class="absolute top-5 left-5 w-10 h-10 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center text-xs font-black text-white">#{{ idx + 1 }}</div>
             <button @click="handleQuickBookmark($event, item)" 
                     class="absolute top-5 right-5 w-12 h-12 rounded-2xl backdrop-blur-2xl border border-white/10 flex items-center justify-center transition-all z-20"
                     :class="libraryStore.isInLibrary(item.mal_id) ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white hover:text-black'">
                <i :class="libraryStore.isInLibrary(item.mal_id) ? 'fa-solid fa-heart' : 'fa-solid fa-plus'" class="text-sm"></i>
             </button>
             <div class="absolute bottom-6 left-6 right-6">
                <p class="text-[9px] font-black text-brand-primary uppercase tracking-[0.3em] mb-2">{{ item.type }}</p>
                <h4 class="text-sm font-black text-white uppercase line-clamp-1 ">{{ item.title }}</h4>
             </div>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-8 relative z-10">
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-12">
        <div class="space-y-4">
           <h3 class="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase  leading-none">
             Discovery <span class="opacity-20 ">Archive.</span>
           </h3>
           <p class="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] flex items-center gap-3">
             <span class="w-6 h-0.5" :class="theme.bg"></span> Engine: Jikan v4
           </p>
        </div>

        <div class="flex p-2 bg-dark-surface border border-white/5 rounded-[2.5rem] shadow-2xl backdrop-blur-2xl overflow-x-auto scrollbar-hide">
           <button v-for="type in ['tv', 'movie', 'manga', 'novel', 'donghua']" :key="type"
             @click="loadMainContent(type)" 
             :class="activeTab === type ? [theme.bg, 'text-white shadow-xl scale-105'] : 'text-text-muted hover:text-white'" 
             class="px-10 md:px-12 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all  whitespace-nowrap">
             {{ type }}
           </button>
        </div>
      </div>

      <div class="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-12 px-2">
        <button @click="loadMainContent(activeTab, null)"
                :class="!activeGenre ? [theme.bg, 'text-white'] : 'bg-white/5 text-white/30'"
                class="px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border border-white/5 whitespace-nowrap">
          All Genres
        </button>
        <button v-for="genre in QUICK_GENRES" :key="genre.id"
                @click="loadMainContent(activeTab, genre.id)"
                :class="activeGenre === genre.id ? [theme.bg, 'text-white shadow-lg'] : 'bg-white/5 text-white/30 hover:text-white hover:bg-white/10'"
                class="px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border border-white/5 whitespace-nowrap">
          {{ genre.name }}
        </button>
      </div>

      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-10">
        <SkeletonCard v-for="n in 12" :key="n" />
      </div>

      <div v-else-if="items.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-10 animate-fade-in">
        <template v-for="item in items" :key="item.mal_id">
          <AnimeCard v-if="activeTab === 'tv'" :anime="item" @action="(p) => triggerToast(p.message, p.type)" />
          <MovieCard v-else-if="activeTab === 'movie'" :movie="item" @action="(p) => triggerToast(p.message, p.type)" />
          <MangaCard v-else-if="activeTab === 'manga'" :manga="item" @action="(p) => triggerToast(p.message, p.type)" />
          <NovelCard v-else-if="activeTab === 'novel'" :novel="item" @action="(p) => triggerToast(p.message, p.type)" />
          <DonghuaCard v-else-if="activeTab === 'donghua'" :donghua="item" @action="(p) => triggerToast(p.message, p.type)" />
        </template>
      </div>

      <div v-else class="py-32 flex flex-col items-center justify-center text-center">
        <i class="fa-solid fa-box-open text-5xl text-white/5 mb-6"></i>
        <p class="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">No Records Found</p>
      </div>
    </section>

  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
.toast-slide-enter-from { opacity: 0; transform: translate(-50%, -60px); }
.toast-slide-leave-to { opacity: 0; transform: translate(-50%, -20px) scale(0.9); }
.line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
</style>