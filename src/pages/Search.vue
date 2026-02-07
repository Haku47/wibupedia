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

// --- COMMUNITY THEME ENGINE ---
const theme = computed(() => {
  const configs = {
    anime: { color: 'text-brand-primary', bg: 'bg-brand-primary', border: 'focus:border-brand-primary', glow: 'shadow-brand-primary/20' },
    manga: { color: 'text-emerald-500', bg: 'bg-emerald-500', border: 'focus:border-emerald-500', glow: 'shadow-emerald-500/20' },
    novel: { color: 'text-amber-500', bg: 'bg-amber-500', border: 'focus:border-amber-500', glow: 'shadow-amber-500/20' }
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

// --- LOGIC ---
const triggerToast = (msg) => {
  toast.value = { show: true, message: msg }
  setTimeout(() => toast.value.show = false, 3000)
}

const handleToggleLibrary = (item) => {
  if (libraryStore.isInLibrary(item.mal_id)) {
    libraryStore.removeFromLibrary(item.mal_id)
    triggerToast('Removed from Collection')
  } else {
    libraryStore.addToLibrary({ ...item, category: searchType.value })
    triggerToast('Saved to Collection')
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
  <main class="min-h-screen pb-40 bg-dark-bg relative overflow-x-hidden font-outfit">
    
    <div :class="[theme.bg]" class="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.04] blur-[150px] rounded-full pointer-events-none transition-all duration-1000"></div>

    <Transition name="slide">
      <div v-if="isFilterOpen" class="fixed inset-y-0 right-0 w-full md:w-[450px] bg-dark-surface/95 z-[200] border-l border-white/5 shadow-2xl backdrop-blur-3xl flex flex-col">
        <div class="p-10 flex items-center justify-between border-b border-white/5 shrink-0">
          <div class="flex items-center gap-5">
            <div :class="[theme.bg]" class="w-2.5 h-10 rounded-full shadow-lg"></div>
            <h3 class="text-2xl font-black uppercase tracking-tighter text-white italic">Discovery Filters.</h3>
          </div>
          <button @click="isFilterOpen = false" class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 hover:bg-white/10 transition-all">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="flex-grow overflow-y-auto p-10 space-y-12 custom-scrollbar">
          <div>
            <label class="text-[10px] font-black uppercase tracking-widest text-text-muted mb-6 block opacity-50">Select Genres</label>
            <div class="flex flex-wrap gap-2.5">
              <button v-for="genre in GENRE_OPTIONS" :key="genre.id" @click="toggleGenre(genre.id)" 
                      :class="filters.genres.includes(genre.id) ? [theme.bg, 'text-white border-transparent shadow-lg'] : 'bg-white/5 border-white/5 text-text-muted hover:border-white/10'" 
                      class="px-5 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all">
                {{ genre.name }}
              </button>
            </div>
          </div>

          <div class="space-y-10">
            <div v-for="field in [{ label: 'Release Status', model: 'status', options: ['airing', 'complete', 'upcoming'] }, { label: 'Age Rating', model: 'rating', options: [{v:'g', l:'General'}, {v:'pg13', l:'Teens (13+)'}, {v:'r17', l:'Adult (17+)'}] }]" :key="field.label">
              <label class="text-[10px] font-black uppercase tracking-widest text-text-muted mb-5 block opacity-50">{{ field.label }}</label>
              <div class="relative">
                <select v-model="filters[field.model]" class="w-full bg-dark-bg border border-white/5 rounded-2xl p-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-main outline-none focus:border-brand-primary appearance-none cursor-pointer">
                  <option value="">All Categories</option>
                  <option v-for="opt in field.options" :key="typeof opt === 'string' ? opt : opt.v" :value="typeof opt === 'string' ? opt : opt.v">
                    {{ typeof opt === 'string' ? opt.toUpperCase() : opt.l.toUpperCase() }}
                  </option>
                </select>
                <i class="fa-solid fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-[10px] opacity-20 pointer-events-none"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="p-10 border-t border-white/5 bg-dark-surface/90">
          <div class="grid grid-cols-2 gap-5">
            <button @click="resetFilters" class="py-5 rounded-3xl border border-white/5 text-[11px] font-black uppercase tracking-widest text-text-muted hover:bg-white/5 transition-all">Reset All</button>
            <button @click="applyFilters" :class="[theme.bg, theme.glow]" class="py-5 rounded-3xl text-white text-[11px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Apply Filters</button>
          </div>
        </div>
      </div>
    </Transition>

    <div v-if="isFilterOpen" @click="isFilterOpen = false" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"></div>

    <section class="max-w-7xl mx-auto px-6 pt-16 relative z-10">
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
        <div>
          <div class="flex items-center gap-4 mb-8">
            <span :class="[theme.color, theme.bg]" class="px-4 py-1.5 bg-opacity-10 text-[10px] font-black uppercase tracking-widest rounded-full border border-current italic">Archive v2.1.6</span>
            <div class="h-px w-12 bg-white/10"></div>
          </div>
          <h1 class="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none uppercase italic">Discovery<br/><span :class="theme.color" class="transition-colors duration-700">{{ searchType }}.</span></h1>
        </div>
        <div class="flex p-2 bg-dark-surface border border-white/5 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
          <button v-for="type in ['anime', 'manga', 'novel']" :key="type" @click="toggleType(type)" 
                  :class="searchType === type ? [theme.bg, 'text-white shadow-xl scale-105'] : 'text-text-muted hover:text-white'" 
                  class="px-10 md:px-14 py-4 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all italic">{{ type }}</button>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-5 max-w-5xl mx-auto mb-32">
        <div class="relative flex-grow">
          <input v-model="searchQuery" type="text" :placeholder="`Search for ${searchType} titles...`" @input="handleSearchInput($event.target.value)" 
                 class="w-full bg-dark-surface/50 border border-white/5 rounded-[2.5rem] py-8 pl-20 pr-10 text-xl font-bold text-text-main focus:outline-none transition-all shadow-2xl placeholder:text-white/10" 
                 :class="[theme.border]" />
          <i class="fa-solid fa-search absolute left-8 top-1/2 -translate-y-1/2 text-2xl opacity-20" :class="theme.color"></i>
        </div>
        <button @click="isFilterOpen = true" class="h-24 px-12 bg-dark-surface border border-white/5 rounded-[2.5rem] flex items-center gap-5 text-text-muted hover:text-white transition-all shadow-xl active:scale-95 group">
          <i class="fa-solid fa-sliders text-2xl transition-transform group-hover:rotate-180 duration-700" :class="filters.genres.length > 0 ? theme.color : ''"></i>
          <span class="text-[11px] font-black uppercase tracking-widest italic">Filters</span>
        </button>
      </div>

      <div class="relative min-h-[600px] z-10">
        <EmptyState v-if="!searchQuery && !loading" :icon="searchType === 'anime' ? 'fa-solid fa-magnifying-glass' : 'fa-solid fa-book-open'" 
                    title="Start Discovering" :description="`Gunakan kolom pencarian di atas untuk mulai menjelajahi archive ${searchType} kami.`" />
        
        <div v-else-if="loading && items.length === 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-10">
          <SkeletonCard v-for="n in 12" :key="n" />
        </div>

        <div v-else>
          <div class="flex items-center justify-between mb-16 px-4">
            <h2 class="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] flex items-center gap-6 opacity-40 italic">
              <span class="w-12 h-0.5 rounded-full" :class="theme.bg"></span>
              Discovery Results
            </h2>
            <div class="px-6 py-2 rounded-full border border-white/5 bg-dark-surface/50 text-[10px] font-black text-text-muted tabular-nums shadow-lg">
              {{ items.length }} Titles Found
            </div>
          </div>

          <TransitionGroup name="stagger-list" tag="div" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-10">
            <div v-for="(item, idx) in items" :key="item.mal_id" class="relative group" :style="{ '--delay': `${idx * 0.05}s` }">
              <AnimeCard v-if="searchType === 'anime'" :anime="item" />
              <MangaCard v-else :manga="item" />
              
              <button @click.stop.prevent="handleToggleLibrary(item)" 
                      :class="libraryStore.isInLibrary(item.mal_id) ? [theme.bg, theme.glow, 'scale-105 opacity-100 shadow-lg'] : 'bg-dark-bg/90 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100'" 
                      class="absolute top-4 right-4 w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 z-30 transition-all duration-500 active:scale-90 shadow-2xl">
                <i :class="libraryStore.isInLibrary(item.mal_id) ? 'fa-solid fa-bookmark' : 'fa-solid fa-plus'" class="text-white text-sm"></i>
              </button>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </section>

    <Transition name="toast">
      <div v-if="toast.show" :class="[theme.bg, theme.glow]" class="fixed bottom-12 left-1/2 -translate-x-1/2 z-[300] px-12 py-5 rounded-3xl shadow-2xl text-white font-black text-[11px] uppercase tracking-widest flex items-center gap-4 border border-white/10 backdrop-blur-xl">
        <i class="fa-solid fa-circle-check text-xl"></i> {{ toast.message }}
      </div>
    </Transition>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.scrollbar-hide::-webkit-scrollbar { display: none; }

/* Transitions */
.slide-enter-active, .slide-leave-active { transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }

.stagger-list-enter-active { transition: all 0.7s cubic-bezier(0.22, 1, 0.36, 1); transition-delay: var(--delay); }
.stagger-list-enter-from { opacity: 0; transform: translateY(30px); filter: blur(15px); }

.toast-enter-active, .toast-leave-active { transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 80px) scale(0.8); }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
</style>