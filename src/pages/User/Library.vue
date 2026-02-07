<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLibraryStore } from '@/store/libraryStore.js'
import { useUserStore } from '@/store/userStore.js'

// --- 💳 ELITE CARDS IMPORT ---
import AnimeCard from '@/components/cards/AnimeCard.vue'
import MangaCard from '@/components/cards/MangaCard.vue'
import MovieCard from '@/components/cards/MovieCard.vue'
import NovelCard from '@/components/cards/NovelCard.vue'
import DonghuaCard from '@/components/cards/DonghuaCard.vue'

import EmptyState from '@/components/shared/EmptyState.vue'
import VaultAnalytics from '@/components/shared/VaultAnalytics.vue'

const router = useRouter()
const libraryStore = useLibraryStore()
const userStore = useUserStore()

// --- STATES ---
const activeTab = ref('tv') // Options: tv, movie, manga, novel, donghua
const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')

// --- COLLECTION FILTER LOGIC (ADVANCED) ---
const filteredItems = computed(() => {
  return libraryStore.sortedLibrary.filter(item => {
    const type = item.type?.toUpperCase() || ''
    
    if (activeTab.value === 'tv') {
      return item.category === 'anime' && type !== 'MOVIE' && type !== 'ONA'
    }
    if (activeTab.value === 'movie') {
      return item.category === 'anime' && type === 'MOVIE'
    }
    if (activeTab.value === 'donghua') {
      return item.category === 'anime' && type === 'ONA'
    }
    if (activeTab.value === 'manga') {
      return item.category === 'manga' && !type.includes('NOVEL')
    }
    if (activeTab.value === 'novel') {
      return type.includes('NOVEL') || item.category === 'novel'
    }
    return false
  })
})

// --- COLLECTION COUNTERS ---
const stats = computed(() => {
  const lib = libraryStore.myLibrary
  return {
    tv: lib.filter(i => i.category === 'anime' && i.type?.toUpperCase() !== 'MOVIE' && i.type?.toUpperCase() !== 'ONA').length,
    movie: lib.filter(i => i.type?.toUpperCase() === 'MOVIE').length,
    manga: lib.filter(i => i.category === 'manga' && !i.type?.toUpperCase().includes('NOVEL')).length,
    novel: lib.filter(i => i.type?.toUpperCase().includes('NOVEL')).length,
    donghua: lib.filter(i => i.type?.toUpperCase() === 'ONA').length
  }
})

// --- THEME ENGINE ---
const theme = computed(() => {
  const configs = {
    tv: { color: 'text-brand-primary', bg: 'bg-brand-primary' },
    movie: { color: 'text-purple-500', bg: 'bg-purple-500' },
    manga: { color: 'text-emerald-500', bg: 'bg-emerald-500' },
    novel: { color: 'text-amber-500', bg: 'bg-amber-500' },
    donghua: { color: 'text-red-500', bg: 'bg-red-500' }
  }
  return configs[activeTab.value] || configs.tv
})
</script>

<template>
  <main class="min-h-screen pb-40 bg-dark-bg relative overflow-hidden font-outfit">
    <div :class="[theme.bg]" class="absolute -top-40 -left-40 w-[600px] h-[600px] opacity-[0.05] blur-[120px] rounded-full transition-all duration-1000 pointer-events-none"></div>

    <header class="pt-12 md:pt-20 mb-12 px-6 max-w-7xl mx-auto relative z-10">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <span :class="[theme.color, theme.bg]" class="px-3 py-1 bg-opacity-10 text-[9px] font-black uppercase tracking-widest rounded-full border border-current italic">
              Vault System v2.4.0
            </span>
          </div>
          
          <h1 class="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
            My <span :class="theme.color" class="transition-colors duration-700">Archive.</span>
          </h1>

          <div class="flex p-1.5 bg-dark-surface border border-white/5 rounded-2xl shadow-2xl backdrop-blur-3xl overflow-x-auto scrollbar-hide">
            <button v-for="(count, tab) in stats" :key="tab"
              @click="activeTab = tab"
              :class="activeTab === tab ? [theme.bg, 'text-white shadow-xl scale-105'] : 'text-text-muted hover:text-white'"
              class="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-3 whitespace-nowrap"
            >
              {{ tab }} <span class="opacity-40 tabular-nums">{{ count }}</span>
            </button>
          </div>
        </div>

        <div class="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] flex items-center gap-8 backdrop-blur-xl group hover:border-white/10 transition-all shadow-2xl">
          <div class="flex flex-col border-r border-white/5 pr-8">
            <span class="text-[8px] font-black uppercase text-white/20 tracking-widest mb-1">Total Records</span>
            <span class="text-4xl font-black text-white tabular-nums">{{ libraryStore.totalItems }}</span>
          </div>
          <div class="flex flex-col gap-3">
            <button @click="router.push('/report')" class="p-3 rounded-xl bg-white/5 hover:bg-white hover:text-black transition-all group/btn">
              <i class="fa-solid fa-chart-pie text-sm"></i>
            </button>
            <button @click="libraryStore.clearLibrary" class="p-3 rounded-xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all">
              <i class="fa-solid fa-trash-can text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="px-6 max-w-7xl mx-auto relative z-10">
      
      <EmptyState v-if="filteredItems.length === 0"
        :icon="activeTab === 'tv' ? 'fa-solid fa-box-open' : 'fa-solid fa-ghost'"
        :title="`Archive is Empty`"
        :description="`Tidak ada data ${activeTab.toUpperCase()} yang ditemukan dalam koleksi personal Anda.`"
        actionLabel="Cari Koleksi Baru"
        actionPath="/search"
      />

      <div v-else class="mt-12">
        <div class="flex items-center gap-4 mb-10 opacity-30">
          <div class="h-px flex-grow bg-white/10"></div>
          <span class="text-[9px] font-black uppercase tracking-[0.5em] italic">Personal Records List</span>
          <div class="h-px flex-grow bg-white/10"></div>
        </div>

        <TransitionGroup name="vault-list" tag="div" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
          <div v-for="item in filteredItems" :key="item.mal_id" class="relative group">
            
            <AnimeCard v-if="activeTab === 'tv'" :anime="item" />
            <MovieCard v-else-if="activeTab === 'movie'" :movie="item" />
            <MangaCard v-else-if="activeTab === 'manga'" :manga="item" />
            <NovelCard v-else-if="activeTab === 'novel'" :novel="item" />
            <DonghuaCard v-else-if="activeTab === 'donghua'" :donghua="item" />
            
            <div class="absolute top-3 right-3 z-30 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100">
              <button @click="libraryStore.removeFromLibrary(item.mal_id)"
                class="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center shadow-2xl border border-white/10 hover:scale-110 active:scale-90"
              >
                <i class="fa-solid fa-xmark text-xs"></i>
              </button>
            </div>

            <div class="mt-4 px-1 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span class="text-[8px] font-black text-white/20 uppercase tracking-widest">
                {{ new Date(item.addedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) }}
              </span>
              <div :class="[theme.bg]" class="w-1 h-1 rounded-full animate-pulse"></div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.scrollbar-hide::-webkit-scrollbar { display: none; }

/* 🚀 VAULT TRANSITIONS */
.vault-list-move, 
.vault-list-enter-active, 
.vault-list-leave-active {
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.vault-list-enter-from, 
.vault-list-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
  filter: blur(10px);
}
.vault-list-leave-active {
  position: absolute;
  width: calc(50% - 1.5rem); 
}

@media (min-width: 768px) { .vault-list-leave-active { width: calc(25% - 2rem); } }
@media (min-width: 1280px) { .vault-list-leave-active { width: calc(16.66% - 2rem); } }
</style>