<script setup>
import { ref, watch, onMounted, computed, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJikan } from '@/composables/useJikan'
import { useLibraryStore } from '@/store/libraryStore'
import AnimeCard from '@/components/cards/AnimeCard.vue'
import MangaCard from '@/components/cards/MangaCard.vue'
import SkeletonCard from '@/components/shared/SkeletonCard.vue'
import EmptyState from '@/components/shared/EmptyState.vue'

const route = useRoute()
const router = useRouter()
const libraryStore = useLibraryStore()
const { items, loading, search, clear } = useJikan()

// --- STATES ---
const searchType = ref(route.query.type || 'anime')
const searchQuery = ref(route.query.q || '')
const isFilterOpen = ref(false)
const toast = ref({ show: false, message: '' })
let debounceTimer = null

// --- DYNAMIC THEME ENGINE ---
const theme = computed(() => {
  const configs = {
    anime: { color: 'text-brand-primary', bg: 'bg-brand-primary', border: 'focus:border-brand-primary', glow: 'shadow-brand-primary/40', ring: 'focus:ring-brand-primary/10' },
    manga: { color: 'text-emerald-500', bg: 'bg-emerald-500', border: 'focus:border-emerald-500', glow: 'shadow-emerald-500/40', ring: 'focus:ring-emerald-500/10' },
    novel: { color: 'text-amber-500', bg: 'bg-amber-500', border: 'focus:border-amber-500', glow: 'shadow-amber-500/40', ring: 'focus:ring-amber-500/10' }
  }
  return configs[searchType.value] || configs.anime
})

// --- FILTER OPTIONS ---
const filters = ref({ genres: [], status: '', rating: '', order_by: 'score', sort: 'desc' })
const GENRE_OPTIONS = [
  { id: 1, name: 'Action' }, { id: 2, name: 'Adventure' }, { id: 4, name: 'Comedy' },
  { id: 8, name: 'Drama' }, { id: 10, name: 'Fantasy' }, { id: 14, name: 'Horror' },
  { id: 7, name: 'Mystery' }, { id: 22, name: 'Romance' }, { id: 24, name: 'Sci-Fi' },
  { id: 36, name: 'Slice of Life' }, { id: 37, name: 'Supernatural' }
]

// --- LOGIC: TOAST & LIBRARY SYNC ---
const triggerToast = (msg) => {
  toast.value = { show: true, message: msg }
  setTimeout(() => toast.value.show = false, 3000)
}

const handleToggleVault = (item) => {
  if (libraryStore.isInLibrary(item.mal_id)) {
    libraryStore.removeFromLibrary(item.mal_id)
    triggerToast('Ejected from Vault')
  } else {
    // Pastikan kategori tersimpan sesuai tab yang aktif
    libraryStore.addToLibrary({ ...item, category: searchType.value })
    triggerToast('Secured in Vault')
  }
}

const toggleGenre = (id) => {
  const index = filters.value.genres.indexOf(id)
  if (index > -1) filters.value.genres.splice(index, 1)
  else filters.value.genres.push(id)
}

const executeSearch = () => {
  const apiType = searchType.value === 'novel' ? 'manga' : searchType.value
  const genreString = filters.value.genres.length > 0 ? filters.value.genres.join(',') : undefined

  search(searchQuery.value, apiType, {
    genres: genreString,
    status: filters.value.status || undefined,
    rating: filters.value.rating || undefined,
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
  <main class="min-h-screen pb-40 bg-dark-bg transition-colors duration-700 relative overflow-x-hidden">
    
    <div :class="[theme.bg]" class="absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.03] blur-[120px] rounded-full pointer-events-none transition-all duration-1000"></div>

    <Transition name="slide">
      <div v-if="isFilterOpen" class="fixed inset-y-0 right-0 w-full md:w-[420px] bg-dark-surface/95 z-[200] border-l border-white/5 shadow-[-20px_0_60px_rgba(0,0,0,0.8)] backdrop-blur-3xl flex flex-col">
        <div class="p-8 flex items-center justify-between border-b border-white/5 shrink-0">
          <div class="flex items-center gap-4">
            <div :class="[theme.bg]" class="w-2 h-8 rounded-full shadow-neon"></div>
            <h3 class="text-xl font-black font-outfit uppercase tracking-tighter italic text-white">Parameters.</h3>
          </div>
          <button @click="isFilterOpen = false" class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 hover:bg-white/10 transition-all"><i class="fa-solid fa-xmark text-lg"></i></button>
        </div>

        <div class="flex-grow overflow-y-auto p-8 space-y-10 custom-scrollbar">
          <div>
            <label class="text-[9px] font-black uppercase tracking-[0.3em] text-text-muted mb-5 block opacity-40">System Genres</label>
            <div class="grid grid-cols-2 gap-2.5">
              <button v-for="genre in GENRE_OPTIONS" :key="genre.id" @click="toggleGenre(genre.id)" :class="filters.genres.includes(genre.id) ? [theme.bg, 'text-white border-transparent shadow-lg'] : 'bg-white/5 border-white/5 text-text-muted hover:border-white/10'" class="px-4 py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all">{{ genre.name }}</button>
            </div>
          </div>
          <div class="space-y-8">
            <div v-for="field in [{ label: 'Archive Status', model: 'status', options: ['airing', 'complete', 'upcoming'] }, { label: 'Rating Limit', model: 'rating', options: [{v:'g', l:'General'}, {v:'pg13', l:'PG-13'}, {v:'r17', l:'17+'}] }]" :key="field.label">
              <label class="text-[9px] font-black uppercase tracking-[0.3em] text-text-muted mb-4 block opacity-40">{{ field.label }}</label>
              <div class="relative group">
                <select v-model="filters[field.model]" class="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-[9px] font-black uppercase tracking-widest text-text-main outline-none focus:border-brand-primary appearance-none cursor-pointer">
                  <option value="">No Restrictions</option>
                  <option v-for="opt in field.options" :key="typeof opt === 'string' ? opt : opt.v" :value="typeof opt === 'string' ? opt : opt.v">{{ typeof opt === 'string' ? opt.toUpperCase() : opt.l.toUpperCase() }}</option>
                </select>
                <i class="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-[9px] opacity-20 pointer-events-none"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="p-8 border-t border-white/5 bg-dark-surface/90 shrink-0">
          <div class="grid grid-cols-2 gap-4">
            <button @click="resetFilters" class="py-4 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-text-muted hover:bg-white/5 transition-all">Reset</button>
            <button @click="applyFilters" :class="[theme.bg, theme.glow]" class="py-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Initialize Scan</button>
          </div>
        </div>
      </div>
    </Transition>

    <div v-if="isFilterOpen" @click="isFilterOpen = false" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"></div>

    <section class="max-w-7xl mx-auto px-6 pt-12 relative z-10">
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
        <div>
          <div class="flex items-center gap-3 mb-6"><span :class="[theme.color, theme.bg]" class="px-3 py-1 bg-opacity-10 text-[9px] font-black uppercase tracking-[0.3em] rounded-lg border border-current italic">Entry v1.8.6</span><div class="h-px w-10 bg-white/10"></div></div>
          <h1 class="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] font-outfit uppercase italic">Analyze<br/><span :class="theme.color" class="transition-colors duration-700">{{ searchType }}.</span></h1>
        </div>
        <div class="flex p-1.5 bg-dark-surface border border-white/5 rounded-[2rem] shadow-xl backdrop-blur-3xl">
          <button v-for="type in ['anime', 'manga', 'novel']" :key="type" @click="toggleType(type)" :class="searchType === type ? [theme.bg, 'text-white shadow-lg'] : 'text-text-muted hover:text-white'" class="px-8 md:px-12 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all italic">{{ type }}</button>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-4 max-w-5xl mx-auto mb-24">
        <div class="relative flex-grow group/input">
          <input v-model="searchQuery" type="text" :placeholder="`Initiate scan for ${searchType}...`" @input="handleSearchInput($event.target.value)" class="w-full bg-dark-surface/50 border border-white/5 rounded-[2rem] py-6 pl-16 pr-8 text-lg font-bold text-text-main focus:outline-none transition-all shadow-xl placeholder:text-white/10" :class="[theme.border, theme.ring]" />
          <i class="fa-solid fa-terminal absolute left-7 top-1/2 -translate-y-1/2 text-xl opacity-20 transition-all" :class="theme.color"></i>
        </div>
        <button @click="isFilterOpen = true" class="h-20 px-10 bg-dark-surface/50 border border-white/5 rounded-[2rem] flex items-center gap-4 text-text-muted hover:text-white transition-all shadow-xl group active:scale-95"><i class="fa-solid fa-sliders text-xl transition-transform group-hover:rotate-90 duration-500" :class="filters.genres.length > 0 ? theme.color : ''"></i><span class="text-[10px] font-black uppercase tracking-widest italic">Parameters</span></button>
      </div>

      <div class="relative min-h-[500px] z-10">
        <EmptyState v-if="!searchQuery && !loading" :icon="searchType === 'anime' ? 'fa-solid fa-satellite-dish' : 'fa-solid fa-book-bookmark'" title="Ready to scan." :description="`Protokol siaga. Masukkan transmisi untuk memindai database ${searchType}.`" />
        <div v-else-if="loading && items.length === 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8"><SkeletonCard v-for="n in 12" :key="n" /></div>
        <div v-else>
          <div class="flex items-center justify-between mb-12 px-2">
            <h2 class="text-[9px] font-black text-text-muted uppercase tracking-[0.5em] flex items-center gap-4 opacity-30 italic"><span class="w-10 h-px" :class="theme.bg"></span>Scan Results</h2>
            <span class="text-[9px] font-black px-4 py-1.5 rounded-xl border border-white/5 bg-dark-surface/50 italic text-text-muted tabular-nums">{{ items.length }} Files</span>
          </div>
          <TransitionGroup name="stagger-list" tag="div" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-10">
            <div v-for="(item, idx) in items" :key="item.mal_id" class="relative group" :style="{ '--delay': `${idx * 0.05}s` }">
              <AnimeCard v-if="searchType === 'anime'" :anime="item" />
              <MangaCard v-else :manga="item" />
              
              <button @click.stop.prevent="handleToggleVault(item)" 
                      :class="libraryStore.isInLibrary(item.mal_id) ? [theme.bg, theme.glow, 'scale-100 opacity-100 shadow-neon'] : 'bg-dark-surface/90 scale-50 opacity-0 group-hover:opacity-100 group-hover:scale-100'" 
                      class="absolute top-4 right-4 w-12 h-12 rounded-xl flex items-center justify-center shadow-xl border border-white/10 z-30 transition-all duration-500 active:scale-90">
                <i :class="libraryStore.isInLibrary(item.mal_id) ? 'fa-solid fa-check' : 'fa-solid fa-plus'" class="text-white text-sm"></i>
              </button>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </section>

    <Transition name="toast">
      <div v-if="toast.show" :class="[theme.bg, theme.glow]" class="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] px-10 py-4 rounded-2xl shadow-2xl text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-4 border border-white/10 backdrop-blur-md">
        <i class="fa-solid fa-vault text-base"></i> {{ toast.message }}
      </div>
    </Transition>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.shadow-neon { box-shadow: 0 0 25px rgba(59, 130, 246, 0.4); }

.slide-enter-active, .slide-leave-active { transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }

.stagger-list-enter-active { transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1); transition-delay: var(--delay); }
.stagger-list-enter-from { opacity: 0; transform: translateY(20px); filter: blur(10px); }

.toast-enter-active, .toast-leave-active { transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 60px); }

.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
</style>