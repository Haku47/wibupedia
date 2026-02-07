<script setup>
import { ref, watch, onMounted, computed, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJikan } from '@/composables/useJikan'
import { useLibraryStore } from '@/store/libraryStore'

// --- 💳 ELITE CARDS IMPORT ---
import AnimeCard from '@/components/cards/AnimeCard.vue'
import MangaCard from '@/components/cards/MangaCard.vue'
import MovieCard from '@/components/cards/MovieCard.vue'
import NovelCard from '@/components/cards/NovelCard.vue'
import DonghuaCard from '@/components/cards/DonghuaCard.vue'

import SkeletonCard from '@/components/shared/SkeletonCard.vue'
import EmptyState from '@/components/shared/EmptyState.vue'

const route = useRoute()
const router = useRouter()
const libraryStore = useLibraryStore()
const { items, loading, search, clear } = useJikan()

// --- STATES ---
const searchType = ref(route.query.type || 'tv') 
const searchQuery = ref(route.query.q || '')
const isFilterOpen = ref(false)
const toast = ref({ show: false, message: '', type: 'add' })
let debounceTimer = null

// --- COMMUNITY THEME ENGINE ---
const theme = computed(() => {
  const configs = {
    tv: { label: 'TV Series', color: 'text-brand-primary', bg: 'bg-brand-primary', border: 'focus:border-brand-primary' },
    movie: { label: 'Movies', color: 'text-purple-500', bg: 'bg-purple-500', border: 'focus:border-purple-500' },
    manga: { label: 'Manga', color: 'text-emerald-500', bg: 'bg-emerald-500', border: 'focus:border-emerald-500' },
    novel: { label: 'Light Novel', color: 'text-amber-500', bg: 'bg-amber-500', border: 'focus:border-amber-500' },
    donghua: { label: 'Donghua', color: 'text-red-500', bg: 'bg-red-500', border: 'focus:border-red-500' }
  }
  return configs[searchType.value] || configs.tv
})

// --- FILTER OPTIONS (CE v2.6.0 COMPLETE) ---
const filters = ref({ genres: [], status: '', rating: '', order_by: 'score', sort: 'desc' })

const GENRE_OPTIONS = [
  { id: 1, name: 'Action' }, { id: 2, name: 'Adventure' }, { id: 5, name: 'Avant Garde' },
  { id: 46, name: 'Award Winning' }, { id: 4, name: 'Comedy' }, { id: 8, name: 'Drama' },
  { id: 10, name: 'Fantasy' }, { id: 47, name: 'Gourmet' }, { id: 14, name: 'Horror' },
  { id: 7, name: 'Mystery' }, { id: 22, name: 'Romance' }, { id: 24, name: 'Sci-Fi' },
  { id: 36, name: 'Slice of Life' }, { id: 30, name: 'Sports' }, { id: 37, name: 'Supernatural' },
  { id: 41, name: 'Suspense' }, { id: 11, name: 'Game' }, { id: 13, name: 'Historical' },
  { id: 62, name: 'Isekai' }, { id: 67, name: 'Martial Arts' }, { id: 68, name: 'Mecha' },
  { id: 38, name: 'Military' }, { id: 19, name: 'Music' }, { id: 40, name: 'Psychological' },
  { id: 75, name: 'Reincarnation' }, { id: 23, name: 'School' }, { id: 31, name: 'Super Power' },
  { id: 27, name: 'Shounen' }, { id: 25, name: 'Shoujo' }, { id: 42, name: 'Seinen' }
]

// --- LOGIC ---
const triggerToast = (msg, type = 'add') => {
  toast.value = { show: true, message: msg, type }
  setTimeout(() => toast.value.show = false, 3000)
}

const handleToggleLibrary = (item) => {
  const isBookmarked = libraryStore.isInLibrary(item.mal_id)
  if (isBookmarked) {
    libraryStore.removeFromLibrary(item.mal_id)
    triggerToast('Removed from Collection', 'remove')
  } else {
    const categoryMap = { tv: 'anime', movie: 'anime', donghua: 'anime', manga: 'manga', novel: 'manga' }
    libraryStore.addToLibrary({ ...item, category: categoryMap[searchType.value] })
    triggerToast('Added to Collection', 'add')
  }
}

const toggleGenre = (id) => {
  const index = filters.value.genres.indexOf(id)
  if (index > -1) filters.value.genres.splice(index, 1)
  else filters.value.genres.push(id)
}

const executeSearch = () => {
  let apiMainType = 'anime'
  let subTypeFilter = undefined

  if (searchType.value === 'manga') apiMainType = 'manga'
  else if (searchType.value === 'novel') { apiMainType = 'manga'; subTypeFilter = 'lightnovel' }
  else if (searchType.value === 'movie') subTypeFilter = 'movie'
  else if (searchType.value === 'tv') subTypeFilter = 'tv'
  else if (searchType.value === 'donghua') subTypeFilter = 'ona'

  const genreString = filters.value.genres.length > 0 ? filters.value.genres.join(',') : undefined

  search(searchQuery.value, apiMainType, {
    genres: genreString,
    status: filters.value.status || undefined,
    rating: filters.value.rating || undefined,
    type: subTypeFilter,
    order_by: filters.value.order_by,
    sort: filters.value.sort
  })
}

const handleSearchInput = (val) => {
  clearTimeout(debounceTimer)
  router.replace({ query: { ...route.query, q: val || undefined, type: searchType.value } })
  if (!val || val.length < 3) { clear(); return }
  debounceTimer = setTimeout(() => executeSearch(), 600)
}

const toggleType = (type) => {
  if (searchType.value === type) return
  searchType.value = type
  clear()
  router.replace({ query: { ...route.query, type } })
  if (searchQuery.value.length >= 3) executeSearch()
}

const applyFilters = () => {
  isFilterOpen.value = false
  executeSearch()
}

const resetFilters = () => {
  filters.value = { genres: [], status: '', rating: '', order_by: 'score', sort: 'desc' }
  applyFilters()
}

onMounted(() => { if (searchQuery.value && searchQuery.value.length >= 3) executeSearch() })
onUnmounted(() => { clearTimeout(debounceTimer); clear() })
</script>

<template>
  <main class="min-h-screen pb-40 bg-dark-bg relative overflow-x-hidden font-outfit">
    
    <div :class="[theme.bg]" class="absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.03] blur-[120px] rounded-full pointer-events-none transition-all duration-1000"></div>

    <Transition name="slide">
      <div v-if="isFilterOpen" class="fixed inset-y-0 right-0 w-full md:w-[420px] bg-dark-surface/98 z-[200] border-l border-white/10 shadow-2xl backdrop-blur-3xl flex flex-col">
        <div class="p-8 flex items-center justify-between border-b border-white/5 shrink-0">
          <div class="flex items-center gap-4">
            <div :class="[theme.bg]" class="w-1.5 h-7 rounded-full shadow-lg"></div>
            <h3 class="text-xl font-black uppercase tracking-tighter text-white italic">Archive Filter.</h3>
          </div>
          <button @click="isFilterOpen = false" class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 hover:bg-white/10 transition-all">
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <div class="flex-grow overflow-y-auto p-8 space-y-10 custom-scrollbar">
          <div>
            <label class="text-[9px] font-black uppercase tracking-widest text-text-muted mb-5 block opacity-50">Select Target Genres</label>
            <div class="grid grid-cols-2 gap-2">
              <button v-for="genre in GENRE_OPTIONS" :key="genre.id" @click="toggleGenre(genre.id)" 
                      :class="filters.genres.includes(genre.id) ? [theme.bg, 'text-white border-transparent shadow-lg'] : 'bg-white/5 border-white/5 text-text-muted hover:border-white/10'" 
                      class="px-4 py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all text-left truncate">
                <i v-if="filters.genres.includes(genre.id)" class="fa-solid fa-check mr-2"></i>
                {{ genre.name }}
              </button>
            </div>
          </div>

          <div class="space-y-8">
            <div v-for="field in [{ label: 'Release Status', model: 'status', options: ['airing', 'complete', 'upcoming'] }]" :key="field.label">
              <label class="text-[9px] font-black uppercase tracking-widest text-text-muted mb-4 block opacity-50">{{ field.label }}</label>
              <select v-model="filters[field.model]" class="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-[9px] font-black uppercase tracking-[0.2em] text-text-main outline-none focus:border-brand-primary appearance-none cursor-pointer">
                <option value="">Any Status</option>
                <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt.toUpperCase() }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="p-8 border-t border-white/5 bg-dark-surface/90 backdrop-blur-md">
          <div class="grid grid-cols-2 gap-4">
            <button @click="resetFilters" class="py-4 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-text-muted hover:bg-white/5 transition-all">Reset All</button>
            <button @click="applyFilters" :class="[theme.bg]" class="py-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Apply Filter</button>
          </div>
        </div>
      </div>
    </Transition>

    <div v-if="isFilterOpen" @click="isFilterOpen = false" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"></div>

    <section class="max-w-7xl mx-auto px-6 pt-12 relative z-10">
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <span :class="[theme.color, theme.bg]" class="px-3 py-1 bg-opacity-10 text-[9px] font-black uppercase tracking-widest rounded-full border border-current italic transition-all">Archive Protocol v2.6.5</span>
            <div class="h-px w-8 bg-white/10"></div>
          </div>
          <h1 class="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase italic">
            Global<br/><span :class="theme.color" class="transition-colors duration-700">{{ theme.label }}.</span>
          </h1>
        </div>
        
        <div class="flex p-1.5 bg-dark-surface border border-white/5 rounded-[2rem] shadow-xl backdrop-blur-xl shrink-0 overflow-x-auto scrollbar-hide">
          <button v-for="type in ['tv', 'movie', 'manga', 'novel', 'donghua']" :key="type" @click="toggleType(type)" 
                  :class="searchType === type ? [theme.bg, 'text-white shadow-xl scale-105'] : 'text-text-muted hover:text-white'" 
                  class="px-8 md:px-10 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all italic whitespace-nowrap">{{ type }}</button>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-4 max-w-5xl mb-24">
        <div class="relative flex-grow group">
          <input v-model="searchQuery" type="text" :placeholder="`Scan for ${theme.label} titles...`" @input="handleSearchInput($event.target.value)" 
                 class="w-full bg-dark-surface/50 border border-white/5 rounded-[2rem] py-7 pl-16 pr-8 text-xl font-bold text-text-main focus:outline-none transition-all shadow-2xl placeholder:text-white/10" 
                 :class="[theme.border]" />
          <i class="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-xl opacity-20 transition-all group-focus-within:opacity-100" :class="theme.color"></i>
        </div>
        <button @click="isFilterOpen = true" class="h-[82px] px-10 bg-dark-surface border border-white/5 rounded-[2rem] flex items-center gap-4 text-text-muted hover:text-white transition-all shadow-xl active:scale-95 group">
          <div class="relative">
             <i class="fa-solid fa-sliders text-xl transition-transform group-hover:rotate-180 duration-700" :class="filters.genres.length > 0 ? theme.color : ''"></i>
             <div v-if="filters.genres.length > 0" :class="theme.bg" class="absolute -top-2 -right-2 w-2 h-2 rounded-full animate-ping"></div>
          </div>
          <span class="text-[10px] font-black uppercase tracking-widest">Configuration</span>
        </button>
      </div>

      <div class="relative min-h-[500px] z-10">
        <EmptyState v-if="!searchQuery && !loading" icon="fa-solid fa-satellite-dish" 
                    title="Initialize Scan" :description="`Gunakan konsol di atas untuk memindai archive ${theme.label} Malangan.`" />
        
        <div v-else-if="loading && items.length === 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
          <SkeletonCard v-for="n in 12" :key="n" />
        </div>

        <div v-else>
          <div class="flex items-center justify-between mb-10 px-4">
            <h2 class="text-[10px] font-black text-text-muted uppercase tracking-[0.5em] flex items-center gap-4 opacity-40 italic">
              <span class="w-10 h-0.5 rounded-full" :class="theme.bg"></span>
              Discovery Results
            </h2>
            <div class="px-5 py-2 rounded-full border border-white/5 bg-dark-surface/50 text-[10px] font-black text-text-muted tabular-nums shadow-lg">
              {{ items.length }} Matches Found
            </div>
          </div>

          <TransitionGroup name="stagger-list" tag="div" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
            <div v-for="(item, idx) in items" :key="item.mal_id" class="relative group" :style="{ '--delay': `${idx * 0.04}s` }">
              
              <AnimeCard v-if="searchType === 'tv'" :anime="item" />
              <MovieCard v-else-if="searchType === 'movie'" :movie="item" />
              <MangaCard v-else-if="searchType === 'manga'" :manga="item" />
              <NovelCard v-else-if="searchType === 'novel'" :novel="item" />
              <DonghuaCard v-else-if="searchType === 'donghua'" :donghua="item" />
              
              <button @click.stop.prevent="handleToggleLibrary(item)" 
                      :class="libraryStore.isInLibrary(item.mal_id) ? [theme.bg, 'scale-105 opacity-100 shadow-lg'] : 'bg-dark-bg/90 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100'" 
                      class="absolute top-4 right-4 w-11 h-11 rounded-2xl flex items-center justify-center border border-white/10 z-30 transition-all duration-500 active:scale-90 shadow-2xl">
                <i :class="libraryStore.isInLibrary(item.mal_id) ? 'fa-solid fa-heart' : 'fa-solid fa-plus'" class="text-white text-xs"></i>
              </button>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </section>

    <Transition name="toast">
      <div v-if="toast.show" 
           class="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] px-10 py-5 rounded-[2rem] shadow-2xl backdrop-blur-2xl border border-white/10 flex items-center gap-4 min-w-[300px]"
           :class="toast.type === 'add' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'">
        <div class="w-2 h-2 rounded-full animate-pulse" :class="toast.type === 'add' ? 'bg-emerald-400' : 'bg-red-400'"></div>
        <span class="text-[11px] font-black uppercase tracking-[0.2em] italic">{{ toast.message }}</span>
      </div>
    </Transition>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.scrollbar-hide::-webkit-scrollbar { display: none; }

.slide-enter-active, .slide-leave-active { transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }

.stagger-list-enter-active { transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1); transition-delay: var(--delay); }
.stagger-list-enter-from { opacity: 0; transform: translateY(20px); filter: blur(8px); }

.toast-enter-active, .toast-leave-active { transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 40px) scale(0.9); }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
</style>