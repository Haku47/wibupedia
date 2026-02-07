<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useJikan } from '@/composables/useJikan'
import { useUserStore } from '@/store/userStore'
import AnimeCard from '@/components/cards/AnimeCard.vue'
import SkeletonCard from '@/components/shared/SkeletonCard.vue'

const router = useRouter()
const userStore = useUserStore()
const { items, loading, error, fetchTrending } = useJikan()

const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')

onMounted(async () => {
  window.scrollTo(0, 0)
  // Fetch top 24 most popular anime
  await fetchTrending('anime', 1, 'bypopularity')
})
</script>

<template>
  <main class="min-h-screen bg-dark-bg text-text-main pb-40 pt-32 relative overflow-hidden font-outfit">
    <div :style="{ backgroundColor: primaryColor }" class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] opacity-[0.04] blur-[150px] pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-8 relative z-10">
      
      <header class="mb-24 animate-reveal">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div class="space-y-6">
            <div class="flex items-center gap-4">
              <div :style="{ backgroundColor: primaryColor }" class="w-12 h-1.5 rounded-full shadow-lg"></div>
              <span class="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Global Hall of Fame</span>
            </div>
            <h1 class="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none italic">
              Trending<span :style="{ color: primaryColor }">Rank.</span>
            </h1>
            <p class="text-text-muted text-lg font-medium opacity-50 max-w-xl leading-relaxed">
              Daftar anime paling populer di seluruh dunia berdasarkan data komunitas MyAnimeList. Temukan judul-judul yang mendominasi sejarah industri.
            </p>
          </div>

          <button @click="router.back()" class="group flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl active:scale-95">
            <i class="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Return Back
          </button>
        </div>
      </header>

      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-12">
        <SkeletonCard v-for="n in 18" :key="n" />
      </div>

      <div v-else-if="error" class="py-40 text-center">
         <i class="fa-solid fa-circle-exclamation text-4xl text-red-500/40 mb-6"></i>
         <p class="text-white font-black uppercase tracking-widest text-xs">Gagal memuat data ranking</p>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-20">
        <div v-for="(anime, idx) in items" :key="anime.mal_id" class="relative group animate-reveal-item" :style="{ '--delay': `${idx * 0.05}s` }">
          
          <div class="absolute -top-10 -left-4 z-0 pointer-events-none transition-all duration-700 group-hover:-translate-y-2">
            <span class="text-7xl font-black text-white/[0.03] group-hover:text-white/[0.08] italic tabular-nums leading-none">
              {{ idx + 1 }}
            </span>
          </div>

          <div class="relative z-10">
            <AnimeCard :anime="anime" />
          </div>

        </div>
      </div>

      <div class="mt-40 flex flex-col items-center gap-6 opacity-20 border-t border-white/5 pt-20">
         <div class="h-px w-20 bg-white"></div>
         <p class="text-[9px] font-black text-text-muted uppercase tracking-[0.6em] text-center italic">
           WibuPedia Global Intelligence Network • Data Synchronized 2026
         </p>
      </div>

    </div>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }

/* 🚀 ANIMATION ENGINE */
.animate-reveal {
  animation: revealUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.animate-reveal-item {
  opacity: 0;
  animation: revealUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--delay);
}

@keyframes revealUp {
  from { opacity: 0; transform: translateY(40px); filter: blur(10px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

/* Chrome/Safari Hide scrollbar */
::-webkit-scrollbar {
  display: none;
}
</style>