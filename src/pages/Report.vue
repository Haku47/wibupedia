<script setup>
import { computed, onMounted } from 'vue'
import { useLibraryStore } from '@/store/libraryStore'
import { useRouter } from 'vue-router'

const libraryStore = useLibraryStore()
const router = useRouter()

const report = computed(() => libraryStore.intelligenceReport)

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <main class="min-h-screen bg-dark-bg text-text-main pt-32 pb-20 px-6 relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-brand-primary/10 via-transparent to-transparent pointer-events-none animate-pulse"></div>
    <div class="absolute top-0 left-0 w-full h-1 bg-brand-primary/20 shadow-neon animate-scan"></div>

    <div v-if="report" class="max-w-4xl mx-auto relative z-10 animate-reveal">
      <header class="mb-16 text-center">
        <div class="inline-flex items-center gap-3 px-4 py-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded-full mb-6">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
          </span>
          <span class="text-[9px] font-black uppercase tracking-[0.4em] text-brand-primary italic">Intelligence Summary v1.9.9</span>
        </div>
        <h1 class="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic font-outfit leading-none">
          Persona<br/><span class="text-brand-primary">Dossier.</span>
        </h1>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="p-10 bg-dark-surface/60 border border-white/5 rounded-[3.5rem] shadow-2xl relative overflow-hidden group backdrop-blur-xl">
          <div class="absolute -right-10 -top-10 w-40 h-40 bg-brand-primary/10 blur-[60px] rounded-full group-hover:bg-brand-primary/20 transition-all duration-1000"></div>
          <p class="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] mb-8 opacity-40 italic">Psychographic Mapping</p>
          <h2 class="text-4xl font-black text-white uppercase italic font-outfit mb-6 leading-tight">{{ report.persona }}</h2>
          <p class="text-sm text-text-muted leading-relaxed italic opacity-80 border-l-2 border-brand-primary/30 pl-6">
            "{{ report.description }}"
          </p>
        </div>

        <div class="p-10 bg-dark-surface/60 border border-white/5 rounded-[3.5rem] shadow-2xl backdrop-blur-xl">
          <p class="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] mb-10 opacity-40 italic">Quality Assessment</p>
          <div class="space-y-10">
            <div class="flex justify-between items-end">
              <div class="space-y-1">
                <span class="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none">Mean Score Index</span>
                <p class="text-[8px] text-brand-primary uppercase font-black italic">Database Average</p>
              </div>
              <span class="text-5xl font-black italic tabular-nums text-white leading-none">{{ report.avgScore }}</span>
            </div>
            <div class="h-px bg-white/5 w-full"></div>
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-bold text-text-muted uppercase tracking-widest">Critic Tier</span>
              <span class="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-[10px] font-black uppercase italic tracking-tighter">
                {{ report.qualityTier }}
              </span>
            </div>
          </div>
        </div>

        <div class="md:col-span-2 p-12 bg-dark-surface/60 border border-white/5 rounded-[3.5rem] shadow-2xl backdrop-blur-xl">
          <div class="flex items-center justify-between mb-12">
            <p class="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] opacity-40 italic">Genetic Genre Distribution</p>
            <span class="text-[8px] font-bold text-text-muted opacity-20 uppercase tracking-widest">Total Samples: {{ report.total }}</span>
          </div>
          <div class="grid grid-cols-1 gap-10">
            <div v-for="[name, count] in report.topGenres" :key="name" class="space-y-4">
              <div class="flex justify-between items-center px-2">
                <div class="flex items-center gap-4">
                  <div class="w-1.5 h-1.5 rounded-full bg-brand-primary shadow-neon"></div>
                  <span class="text-xs font-black uppercase italic text-white tracking-widest">{{ name }}</span>
                </div>
                <span class="text-[10px] font-black text-brand-primary italic opacity-60 tabular-nums">{{ count }} ENTRIES</span>
              </div>
              <div class="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
                <div class="h-full bg-brand-primary rounded-full shadow-neon transition-all duration-[1.5s] ease-out" 
                     :style="{ width: `${(count / report.total) * 100}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-24 flex flex-col items-center gap-8">
        <button @click="router.push('/library')" 
                class="px-12 py-5 bg-white text-black rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] hover:bg-brand-primary hover:text-white transition-all duration-500 shadow-2xl italic active:scale-95">
          <i class="fa-solid fa-chevron-left mr-3"></i> Return to Terminal
        </button>
        <p class="text-[9px] text-text-muted font-bold opacity-20 uppercase tracking-[0.5em] italic leading-none">
          Data finalized at {{ new Date().toLocaleDateString() }} • Malang Research Center
        </p>
      </div>
    </div>

    <div v-else class="text-center py-40 animate-reveal">
      <div class="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-brand-primary/20">
        <i class="fa-solid fa-triangle-exclamation text-3xl text-brand-primary animate-pulse"></i>
      </div>
      <h2 class="text-3xl md:text-5xl font-black text-white uppercase italic font-outfit tracking-tighter mb-4">Insufficient Samples.</h2>
      <p class="text-sm text-text-muted max-w-sm mx-auto opacity-50 italic leading-relaxed">
        Sistem memerlukan minimal <span class="text-brand-primary font-black">5 target aktif</span> di dalam Library untuk melakukan analisis psikografis dan pemetaan DNA Persona.
      </p>
      <button @click="router.push('/search')" class="mt-12 text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary hover:text-white transition-colors italic">
        Initialize Target Acquisition <i class="fa-solid fa-arrow-right ml-2"></i>
      </button>
    </div>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.shadow-neon { box-shadow: 0 0 15px var(--color-brand-primary); }

@keyframes scan {
  0% { transform: translateY(0); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(100vh); opacity: 0; }
}
.animate-scan { animation: scan 4s linear infinite; }

.animate-reveal { animation: revealUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
@keyframes revealUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
</style>