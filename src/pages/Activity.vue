<script setup>
import { computed } from 'vue'
import { useLibraryStore } from '@/store/libraryStore'
import { useRouter } from 'vue-router'

const libraryStore = useLibraryStore()
const router = useRouter()

const formatTime = (iso) => {
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const formatDate = (iso) => {
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
}
</script>

<template>
  <main class="min-h-screen bg-dark-bg text-text-main pt-32 pb-20 px-6 relative overflow-hidden">
    <div class="absolute inset-0 opacity-[0.02] pointer-events-none font-mono text-[8px] overflow-hidden leading-none break-all">
      {{ JSON.stringify(libraryStore.logs) }}
    </div>

    <div class="max-w-4xl mx-auto relative z-10">
      <header class="mb-16 animate-reveal">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-10 h-1 bg-brand-primary rounded-full shadow-neon"></div>
          <span class="text-[9px] font-black uppercase tracking-[0.4em] text-brand-primary">Black Box Archive</span>
        </div>
        <h1 class="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic font-outfit leading-none">
          System<br/>Activity.
        </h1>
      </header>

      <div class="bg-dark-surface border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div class="grid grid-cols-12 p-6 bg-white/5 border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-text-muted opacity-40">
          <div class="col-span-3">Timestamp</div>
          <div class="col-span-2 text-center">Protocol</div>
          <div class="col-span-7 pl-6">Operation Target</div>
        </div>

        <div class="divide-y divide-white/5 max-h-[60vh] overflow-y-auto scrollbar-hide">
          <div v-for="log in libraryStore.logs" :key="log.id" 
               class="grid grid-cols-12 p-6 hover:bg-white/[0.02] transition-colors group">
            
            <div class="col-span-3 flex flex-col justify-center">
              <span class="text-[10px] font-bold text-white tabular-nums tracking-tight">{{ formatTime(log.timestamp) }}</span>
              <span class="text-[8px] font-medium text-text-muted uppercase opacity-40">{{ formatDate(log.timestamp) }}</span>
            </div>

            <div class="col-span-2 flex items-center justify-center">
              <span :class="{
                'bg-emerald-500/10 text-emerald-500 border-emerald-500/20': log.action === 'ADD',
                'bg-red-500/10 text-red-500 border-red-500/20': log.action === 'REMOVE',
                'bg-brand-primary/10 text-brand-primary border-brand-primary/20': log.action === 'EXPORT',
                'bg-amber-500/10 text-amber-500 border-amber-500/20': log.action === 'IMPORT'
              }" class="px-3 py-1 rounded-md text-[8px] font-black border uppercase italic">
                {{ log.action }}
              </span>
            </div>

            <div class="col-span-7 pl-6 flex items-center">
              <span class="text-[11px] font-black text-white/80 group-hover:text-white transition-colors truncate uppercase italic tracking-tight">
                {{ log.target }}
              </span>
            </div>
          </div>

          <div v-if="libraryStore.logs.length === 0" class="p-20 text-center">
            <i class="fa-solid fa-ghost text-4xl text-white/5 mb-4"></i>
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-20 italic">No recorded activity in memory core...</p>
          </div>
        </div>
      </div>

      <div class="mt-12 flex justify-between items-center">
        <button @click="router.back()" class="text-[9px] font-black text-text-muted hover:text-white uppercase tracking-widest transition-all italic">
          <i class="fa-solid fa-chevron-left mr-2"></i> Return to Terminal
        </button>
        <p class="text-[8px] font-bold text-text-muted opacity-30 uppercase tracking-[0.3em]">
          End of Log Session v1.9.4
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.animate-reveal { animation: revealUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
@keyframes revealUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
</style>