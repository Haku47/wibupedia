<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLibraryStore } from '@/store/libraryStore'
import AnimeCard from '@/components/cards/AnimeCard.vue'
import MangaCard from '@/components/cards/MangaCard.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import VaultAnalytics from '@/components/shared/VaultAnalytics.vue'
import NeuralLink from '@/components/shared/NeuralLink.vue'
import IntelAlert from '@/components/shared/IntelAlert.vue'
import DataControl from '@/components/shared/DataControl.vue'

const router = useRouter()
const libraryStore = useLibraryStore()
const activeTab = ref('anime')

// --- PRECISE FILTER LOGIC v1.9.9 ---
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

// --- SYNCED COUNTING LOGIC ---
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

// --- DYNAMIC IDENTITY THEME ---
const theme = computed(() => {
  if (activeTab.value === 'anime') return { color: 'text-brand-primary', bg: 'bg-brand-primary', glow: 'shadow-brand-primary/20' }
  if (activeTab.value === 'manga') return { color: 'text-emerald-500', bg: 'bg-emerald-500', glow: 'shadow-emerald-500/20' }
  return { color: 'text-amber-500', bg: 'bg-amber-500', glow: 'shadow-amber-500/20' }
})
</script>

<template>
  <main class="min-h-screen pb-40 bg-dark-bg relative overflow-hidden selection:bg-brand-primary/30">
    <div :class="[theme.bg]" class="absolute -top-40 -left-40 w-[500px] h-[500px] opacity-[0.03] blur-[120px] rounded-full transition-all duration-700 pointer-events-none"></div>

    <header class="pt-12 md:pt-24 mb-10 px-6 max-w-7xl mx-auto relative z-10">
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        
        <div class="flex-grow">
          <div class="flex items-center gap-3 mb-6 animate-fade-in">
            <span :class="[theme.color, theme.bg]" class="px-3 py-1 bg-opacity-10 text-[9px] font-black uppercase tracking-[0.3em] rounded-lg border border-current transition-all italic">
              Intelligence Hub v1.9.9
            </span>
            <div class="h-[1px] w-10 bg-white/10"></div>
          </div>
          
          <h1 class="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] font-outfit uppercase italic">
            Private<br/>
            <span :class="theme.color" class="transition-colors duration-700">Library.</span>
          </h1>
          
          <div class="flex mt-10 p-1.5 bg-dark-surface border border-dark-border rounded-[2rem] shadow-xl w-full md:w-fit backdrop-blur-3xl overflow-x-auto scrollbar-hide">
            <button v-for="(count, tab) in { anime: animeCount, manga: mangaCount, novel: novelCount }" :key="tab"
              @click="activeTab = tab"
              :class="activeTab === tab ? [theme.bg, 'text-white shadow-lg'] : 'text-text-muted hover:text-white'"
              class="flex-1 md:flex-none px-8 md:px-10 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 italic whitespace-nowrap active:scale-95"
            >
              {{ tab }} <span class="px-2 py-0.5 bg-black/30 rounded-md text-[9px] tabular-nums font-bold">{{ count }}</span>
            </button>
          </div>
        </div>

        <div v-if="libraryStore.totalItems > 0" 
             class="w-full lg:w-[320px] bg-dark-surface border border-dark-border p-8 rounded-[2.5rem] flex flex-col gap-6 shadow-xl relative overflow-hidden group">
          <div class="flex items-center justify-between gap-6">
            <div class="flex flex-col items-center pr-6 border-r border-white/5">
              <p class="text-[8px] text-text-muted uppercase font-black tracking-[0.3em] mb-2 opacity-30">Capacity</p>
              <p :class="theme.color" class="text-4xl font-black tabular-nums leading-none transition-colors duration-700">{{ libraryStore.totalItems }}</p>
            </div>
            <div class="flex-1">
              <p class="text-[11px] text-text-main font-black uppercase tracking-tighter font-outfit italic mb-1">Secure Core</p>
              <div class="flex items-center gap-2">
                <span :class="theme.bg" class="w-1.5 h-1.5 rounded-full animate-pulse shadow-neon"></span>
                <span class="text-[8px] text-text-muted font-black uppercase tracking-[0.2em] opacity-40">Operational</span>
              </div>
            </div>
          </div>
          
          <button @click="router.push('/report')" 
                  class="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] hover:bg-brand-primary hover:text-white transition-all italic shadow-2xl">
            Analyze Persona Report
          </button>
        </div>
      </div>
    </header>

    <div class="relative px-6 max-w-7xl mx-auto z-10">
      
      <VaultAnalytics 
        v-if="libraryStore.vaultStats?.hasEnoughData" 
        :theme-color="theme.color" 
        :theme-bg="theme.bg" 
      />

      <NeuralLink />

      <IntelAlert v-if="hasItems" />

      <EmptyState v-if="!hasItems"
        :icon="activeTab === 'anime' ? 'fa-solid fa-ghost' : (activeTab === 'manga' ? 'fa-solid fa-book-open-reader' : 'fa-solid fa-book-bookmark')"
        :title="`${activeTab.toUpperCase()} Empty.`"
        :description="`Protokol penyimpanan belum mendeteksi adanya arsip ${activeTab} di dalam Library Host.`"
        actionLabel="Inisialisasi Search"
        actionPath="/search"
      />

      <div v-else class="mt-16">
        <div class="flex items-center justify-between mb-10 px-2">
          <h2 class="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] flex items-center gap-4 opacity-30 font-outfit italic">
            <span class="w-10 h-px" :class="theme.bg"></span>
            Operational Archive
          </h2>
          <button @click="libraryStore.clearLibrary"
            class="text-[9px] font-black text-red-500/30 hover:text-red-500 transition-all uppercase tracking-[0.2em] px-4 py-2 hover:italic"
          >
            Purge All Data
          </button>
        </div>

        <div class="relative">
          <TransitionGroup name="vault-list" tag="div" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
            <div v-for="item in filteredItems" :key="item.mal_id" class="relative group">
              <AnimeCard v-if="activeTab === 'anime'" :anime="item" />
              <MangaCard v-else :manga="item" />
              
              <div class="absolute bottom-20 right-3 z-30 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                <button @click="libraryStore.removeFromLibrary(item.mal_id)"
                  class="w-10 h-10 bg-red-600/90 backdrop-blur-md text-white rounded-xl flex items-center justify-center shadow-xl border border-white/10 hover:bg-red-600 active:scale-90"
                >
                  <i class="fa-solid fa-trash-arrow-up text-[11px]"></i>
                </button>
              </div>

              <div class="absolute -bottom-1 left-3 right-3 z-40 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-2 group-hover:translate-y-0 hidden md:block">
                 <div class="bg-dark-surface/95 backdrop-blur-xl border border-white/5 px-3 py-2 rounded-xl shadow-2xl flex items-center justify-between">
                   <div class="flex flex-col">
                     <span class="text-[6px] font-black uppercase tracking-widest opacity-40 italic">Log Entry</span>
                     <span class="text-[9px] font-black uppercase text-white tracking-tighter">{{ new Date(item.addedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) }}</span>
                   </div>
                   <div :class="[theme.bg]" class="w-1 h-1 rounded-full shadow-neon"></div>
                 </div>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <DataControl :theme-color="theme.color" :theme-bg="theme.bg" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.shadow-neon { box-shadow: 0 0 15px rgba(59, 130, 246, 0.4); }

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

@keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
</style>