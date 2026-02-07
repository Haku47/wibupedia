<script setup>
import { computed, onMounted } from 'vue'
import { useLibraryStore } from '@/store/libraryStore.js'
import { useUserStore } from '@/store/userStore.js'
import { useRouter } from 'vue-router'

const libraryStore = useLibraryStore()
const userStore = useUserStore()
const router = useRouter()

// 🛡️ CE SYNC: Menggunakan tasteReport sesuai struktur libraryStore.js
const report = computed(() => libraryStore.tasteReport)
const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')

// --- 📊 ADVANCED ANALYTICS LOGIC (ACCURATE CE MAPPING) ---
const categoryStats = computed(() => {
  const lib = libraryStore.myLibrary
  const total = lib.length || 1
  
  const stats = [
    { name: 'TV Series', count: lib.filter(i => i.category === 'anime' && i.type?.toUpperCase() !== 'MOVIE' && i.type?.toUpperCase() !== 'ONA').length, color: '#3b82f6' },
    { name: 'Movies', count: lib.filter(i => i.type?.toUpperCase() === 'MOVIE').length, color: '#a855f7' },
    { name: 'Manga', count: lib.filter(i => i.category === 'manga' && !i.type?.toUpperCase().includes('NOVEL')).length, color: '#10b981' },
    { name: 'Novels', count: lib.filter(i => i.category === 'novel' || i.type?.toUpperCase().includes('NOVEL')).length, color: '#f59e0b' },
    { name: 'Donghua', count: lib.filter(i => i.type?.toUpperCase() === 'ONA').length, color: '#ef4444' }
  ]

  // Hanya tampilkan kategori yang ada isinya, urutkan dari yang terbanyak
  return stats.filter(s => s.count > 0).sort((a, b) => b.count - a.count)
})

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <main class="min-h-screen bg-dark-bg text-text-main pt-32 pb-24 px-6 relative overflow-hidden font-outfit">
    <div :style="{ backgroundColor: primaryColor }" class="absolute inset-0 opacity-[0.03] pointer-events-none"></div>

    <div v-if="report" class="max-w-5xl mx-auto relative z-10 animate-reveal">
      <header class="mb-20 text-center">
        <div class="inline-flex items-center gap-3 px-5 py-2 bg-white/[0.03] border border-white/10 rounded-full mb-8 shadow-sm">
          <div class="w-2 h-2 rounded-full animate-pulse" :style="{ backgroundColor: primaryColor }"></div>
          <span class="text-[9px] font-black uppercase tracking-[0.3em] text-white/60">Community Insight v2.6.0 CE</span>
        </div>
        <h1 class="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none">
          Taste<br/><span :style="{ color: primaryColor }">Profile.</span>
        </h1>
        <p class="mt-6 text-text-muted text-xs md:text-sm font-medium opacity-40 uppercase tracking-[0.2em]">WibuPedia Analytical Engine Results</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2 p-12 bg-dark-surface border border-white/5 rounded-[3.5rem] shadow-2xl relative overflow-hidden group transition-all hover:border-white/10">
          <div class="absolute -right-10 -top-10 w-48 h-48 opacity-[0.05] blur-[60px] rounded-full transition-all duration-1000 group-hover:opacity-[0.1]" :style="{ backgroundColor: primaryColor }"></div>
          
          <p class="text-[10px] font-black text-text-muted uppercase tracking-widest mb-10 opacity-30">Archive Persona</p>
          <h2 class="text-4xl md:text-6xl font-black text-white uppercase  mb-8 leading-[0.9] tracking-tighter">{{ report.persona }}</h2>
          <div class="relative">
            <i class="fa-solid fa-quote-left absolute -left-6 -top-4 opacity-10 text-4xl" :style="{ color: primaryColor }"></i>
            <p class="text-base md:text-lg text-text-muted leading-relaxed font-medium opacity-80 pl-2">
              {{ report.description }}
            </p>
          </div>
        </div>

        <div class="p-12 bg-dark-surface border border-white/5 rounded-[3.5rem] shadow-2xl flex flex-col justify-between transition-all hover:border-white/10">
          <div>
            <p class="text-[10px] font-black text-text-muted uppercase tracking-widest mb-12 opacity-30">Collection Quality</p>
            <div class="flex justify-between items-end mb-8">
              <div class="space-y-1">
                <span class="text-[11px] font-bold text-text-muted uppercase tracking-widest">Mean Score</span>
                <p class="text-[9px] font-black uppercase opacity-40" :style="{ color: primaryColor }">Vault Index</p>
              </div>
              <span class="text-6xl md:text-7xl font-black  tabular-nums text-white leading-none tracking-tighter">{{ report.avgScore }}</span>
            </div>
            <div class="h-px bg-white/5 w-full mb-8"></div>
          </div>
          
          <div class="flex justify-between items-center bg-white/[0.02] p-6 rounded-3xl border border-white/5">
            <span class="text-[10px] font-bold text-text-muted uppercase tracking-widest opacity-60">Status</span>
            <span class="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg" 
                  :style="{ backgroundColor: primaryColor + '15', color: primaryColor, border: `1px solid ${primaryColor}30` }">
              {{ report.tasteLevel }}
            </span>
          </div>
        </div>

        <div class="lg:col-span-1 p-12 bg-dark-surface border border-white/5 rounded-[3.5rem] shadow-2xl">
          <p class="text-[10px] font-black text-text-muted uppercase tracking-widest mb-12 opacity-30">Archive Diversity</p>
          <div class="space-y-8">
            <div v-for="stat in categoryStats" :key="stat.name" class="group">
              <div class="flex justify-between items-center mb-3">
                <span class="text-[11px] font-black uppercase tracking-widest text-white">{{ stat.name }}</span>
                <span class="text-[11px] font-bold opacity-30 tabular-nums">{{ stat.count }} items</span>
              </div>
              <div class="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-[1.5s] ease-out" 
                     :style="{ width: `${(stat.count / libraryStore.totalItems) * 100}%`, backgroundColor: stat.color }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 p-12 bg-dark-surface border border-white/5 rounded-[3.5rem] shadow-2xl">
          <div class="flex items-center justify-between mb-16 px-2">
            <p class="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-30">Top Genre Correlations</p>
            <span class="text-[9px] font-bold text-text-muted opacity-20 uppercase tracking-widest">Global Database Match</span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div v-for="[name, count] in report.topGenres" :key="name" class="group">
              <div class="flex justify-between items-center mb-3">
                <div class="flex items-center gap-4">
                  <div class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: primaryColor }"></div>
                  <span class="text-[13px] font-black uppercase text-white tracking-widest">{{ name }}</span>
                </div>
                <span class="text-[10px] font-bold opacity-30 tabular-nums">{{ Math.round((count / report.total) * 100) }}%</span>
              </div>
              <div class="h-1 w-full bg-white/[0.03] rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-[2s] ease-out" 
                     :style="{ width: `${(count / report.total) * 100}%`, backgroundColor: primaryColor }"></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="mt-28 flex flex-col items-center gap-10">
        <button @click="router.push('/library')" 
                class="px-16 py-6 bg-white text-black rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-2xl group flex items-center gap-4">
          <i class="fa-solid fa-arrow-left text-[10px] group-hover:-translate-x-2 transition-transform"></i> 
          Back to Collection
        </button>
        
        <div class="flex flex-col items-center gap-4 text-center">
          <p class="text-[10px] text-text-muted font-bold opacity-30 uppercase tracking-[0.4em]">
            Analysis Finalized: {{ new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) }}
          </p>
          <div class="flex items-center gap-3">
            <span class="w-8 h-px bg-white/10"></span>
            <span class="text-[10px] font-black text-white/10 uppercase tracking-widest ">WibuPedia Community Protocol</span>
            <span class="w-8 h-px bg-white/10"></span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-48 animate-reveal">
      <div class="w-28 h-28 rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 border border-white/5 bg-white/[0.02] shadow-xl">
        <i class="fa-solid fa-brain text-4xl opacity-20" :style="{ color: primaryColor }"></i>
      </div>
      <h2 class="text-4xl md:text-6xl font-black text-white uppercase  tracking-tighter mb-6 leading-none">Need More<br/>Archive Data.</h2>
      <p class="text-sm md:text-base text-text-muted max-w-md mx-auto opacity-50 font-medium leading-relaxed mb-12">
        Analytical engine membutuhkan minimal <span :style="{ color: primaryColor }" class="font-black">5 judul aktif</span> untuk merumuskan profil selera komunitas Anda.
      </p>
      <button @click="router.push('/search')" 
              class="px-10 py-4 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-white hover:text-black transition-all shadow-xl">
        Browse Archive <i class="fa-solid fa-arrow-right ml-3 text-[8px]"></i>
      </button>
    </div>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.animate-reveal { animation: revealUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
@keyframes revealUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
::-webkit-scrollbar { display: none; }
</style>