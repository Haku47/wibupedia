<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLibraryStore } from '@/store/libraryStore.js'
import AnimeCard from '@/components/cards/AnimeCard.vue'
import MangaCard from '@/components/cards/MangaCard.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import VaultAnalytics from '@/components/shared/VaultAnalytics.vue'

const router = useRouter()
const libraryStore = useLibraryStore()
const activeTab = ref('anime')

// --- COLLECTION FILTER LOGIC ---
const filteredItems = computed(() => {
  return libraryStore.sortedLibrary.filter(item => {
    const typeUpper = item.type?.toUpperCase() || ''
    const isMangaEntity = item.category === 'manga' || item.type === 'Manga'
    const isNovelEntity = typeUpper.includes('NOVEL') || item.category === 'novel'

    if (activeTab.value === 'anime') return item.category === 'anime' && !isNovelEntity
    if (activeTab.value === 'novel') return isNovelEntity
    if (activeTab.value === 'manga') return isMangaEntity && !isNovelEntity
    return false
  })
})

const hasItems = computed(() => filteredItems.value.length > 0)

// --- COLLECTION COUNTERS ---
const animeCount = computed(() => libraryStore.myLibrary.filter(i => {
    const type = i.type?.toUpperCase() || ''
    return i.category === 'anime' && !type.includes('NOVEL')
}).length)

const mangaCount = computed(() => libraryStore.myLibrary.filter(i => {
    const type = i.type?.toUpperCase() || ''
    return i.category === 'manga' && !type.includes('NOVEL')
}).length)

const novelCount = computed(() => libraryStore.myLibrary.filter(i => {
    const type = i.type?.toUpperCase() || ''
    return i.category === 'novel' || type.includes('NOVEL')
}).length)

// --- COMMUNITY THEME ENGINE ---
const theme = computed(() => {
  if (activeTab.value === 'anime') return { color: 'text-brand-primary', bg: 'bg-brand-primary' }
  if (activeTab.value === 'manga') return { color: 'text-emerald-500', bg: 'bg-emerald-500' }
  return { color: 'text-amber-500', bg: 'bg-amber-500' }
})
</script>

<template>
  <main class="min-h-screen pb-40 bg-dark-bg relative overflow-hidden font-outfit">
    <div :class="[theme.bg]" class="absolute -top-40 -left-40 w-[600px] h-[600px] opacity-[0.05] blur-[120px] rounded-full transition-all duration-1000 pointer-events-none"></div>

    <header class="pt-16 md:pt-28 mb-12 px-6 max-w-7xl mx-auto relative z-10">
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
        
        <div class="flex-grow">
          <div class="flex items-center gap-4 mb-8">
            <span :class="[theme.color, theme.bg]" class="px-4 py-1.5 bg-opacity-10 text-[10px] font-black uppercase tracking-widest rounded-full border border-current transition-all shadow-sm">
              Collection Archive v2.1.2
            </span>
            <div class="h-px w-12 bg-white/10"></div>
          </div>
          
          <h1 class="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase italic">
            My <span :class="theme.color" class="transition-colors duration-700">Collection.</span>
          </h1>
          
          <div class="flex mt-12 p-2 bg-dark-surface border border-white/5 rounded-[2.5rem] shadow-2xl w-full md:w-fit backdrop-blur-3xl overflow-x-auto scrollbar-hide">
            <button v-for="(count, tab) in { anime: animeCount, manga: mangaCount, novel: novelCount }" :key="tab"
              @click="activeTab = tab"
              :class="activeTab === tab ? [theme.bg, 'text-white shadow-xl scale-105'] : 'text-text-muted hover:text-white'"
              class="flex-1 md:flex-none px-10 py-4 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-3 whitespace-nowrap active:scale-95"
            >
              {{ tab }} <span class="px-2.5 py-0.5 bg-black/20 rounded-lg text-[10px] tabular-nums font-bold">{{ count }}</span>
            </button>
          </div>
        </div>

        <div v-if="libraryStore.totalItems > 0" 
             class="w-full lg:w-[350px] bg-dark-surface border border-white/5 p-10 rounded-[3rem] flex flex-col gap-8 shadow-2xl relative overflow-hidden group transition-all hover:border-white/10">
          <div class="flex items-center justify-between">
            <div class="flex flex-col pr-8 border-r border-white/5">
              <p class="text-[9px] text-text-muted uppercase font-black tracking-widest mb-2 opacity-40">Saved Titles</p>
              <p :class="theme.color" class="text-5xl font-black tabular-nums leading-none">{{ libraryStore.totalItems }}</p>
            </div>
            <div class="flex-1 pl-6">
              <p class="text-[11px] text-white font-black uppercase tracking-widest mb-1">Archive Status</p>
              <div class="flex items-center gap-2">
                <div :class="theme.bg" class="w-2 h-2 rounded-full animate-pulse"></div>
                <span class="text-[9px] text-text-muted font-black uppercase tracking-widest opacity-50">Synchronized</span>
              </div>
            </div>
          </div>
          
          <button @click="router.push('/report')" 
                  class="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg">
            View Collection Insights
          </button>
        </div>
      </div>
    </header>

    <div class="relative px-6 max-w-7xl mx-auto z-10">
      
      <VaultAnalytics 
        v-if="libraryStore.vaultStats?.hasEnoughData" 
        :theme-color="theme.color" 
        :theme-bg="theme.bg" 
        class="mb-20"
      />

      <EmptyState v-if="!hasItems"
        :icon="activeTab === 'anime' ? 'fa-solid fa-folder-open' : (activeTab === 'manga' ? 'fa-solid fa-book' : 'fa-solid fa-bookmark')"
        :title="`${activeTab.toUpperCase()} List Empty`"
        :description="`Mulai tambahkan ${activeTab} favoritmu ke dalam koleksi personal hari ini.`"
        actionLabel="Cari Anime & Manga"
        actionPath="/search"
      />

      <div v-else class="mt-20">
        <div class="flex items-center justify-between mb-12 px-4">
          <h2 class="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] flex items-center gap-6 opacity-40 italic">
            <span class="w-12 h-0.5 rounded-full" :class="theme.bg"></span>
            Personal Archive
          </h2>
          <button @click="libraryStore.clearLibrary"
            class="text-[10px] font-black text-red-500/40 hover:text-red-500 transition-all uppercase tracking-widest px-5 py-2 border border-red-500/10 rounded-full hover:bg-red-500/5"
          >
            Clear Archive
          </button>
        </div>

        <div class="relative">
          <TransitionGroup name="vault-list" tag="div" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 md:gap-10">
            <div v-for="item in filteredItems" :key="item.mal_id" class="relative group">
              <AnimeCard v-if="activeTab === 'anime'" :anime="item" />
              <MangaCard v-else :manga="item" />
              
              <div class="absolute top-3 right-3 z-30 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100">
                <button @click="libraryStore.removeFromLibrary(item.mal_id)"
                  class="w-11 h-11 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 hover:scale-110 active:scale-90"
                >
                  <i class="fa-solid fa-xmark text-sm"></i>
                </button>
              </div>

              <div class="absolute -bottom-2 left-4 right-4 z-40 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-2 group-hover:translate-y-0 hidden md:block">
                 <div class="bg-dark-surface border border-white/5 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center justify-between">
                   <div class="flex flex-col">
                     <span class="text-[7px] font-black uppercase tracking-widest opacity-40">Added On</span>
                     <span class="text-[10px] font-black text-white uppercase tabular-nums">{{ new Date(item.addedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) }}</span>
                   </div>
                   <div :class="[theme.bg]" class="w-1.5 h-1.5 rounded-full shadow-lg"></div>
                 </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.scrollbar-hide::-webkit-scrollbar { display: none; }

/* Grid Item Transitions */
.vault-list-move, 
.vault-list-enter-active, 
.vault-list-leave-active {
  transition: all 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.vault-list-enter-from, 
.vault-list-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(30px);
  filter: blur(15px);
}

.vault-list-leave-active {
  position: absolute;
  width: calc(50% - 2rem); 
}

@media (min-width: 768px) { .vault-list-leave-active { width: calc(25% - 2.5rem); } }
@media (min-width: 1280px) { .vault-list-leave-active { width: calc(16.66% - 2.5rem); } }
</style>