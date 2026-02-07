<script setup>
import { computed, onMounted } from 'vue'
import { useLibraryStore } from '@/store/libraryStore.js'
import { useUserStore } from '@/store/userStore.js'
import { useRouter } from 'vue-router'

const libraryStore = useLibraryStore()
const userStore = useUserStore()
const router = useRouter()

const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')

const formatTime = (iso) => {
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const formatDate = (iso) => {
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <main class="min-h-screen bg-dark-bg text-text-main pt-32 pb-40 px-6 relative overflow-hidden font-outfit">
    <div :style="{ backgroundColor: primaryColor }" class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[600px] opacity-[0.04] blur-[150px] rounded-full pointer-events-none transition-all duration-1000"></div>

    <div class="max-w-5xl mx-auto relative z-10">
      
      <header class="mb-24 animate-reveal">
        <div class="flex items-center gap-5 mb-10">
          <div :style="{ backgroundColor: primaryColor }" class="w-16 h-1 shadow-[0_0_20px_rgba(59,130,246,0.5)] rounded-full"></div>
          <span class="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">System Ledger Protocol</span>
        </div>
        
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div>
            <h1 class="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85] ">
              Activity<br/><span :style="{ color: primaryColor }" class="transition-colors duration-700">History.</span>
            </h1>
            <p class="mt-10 text-text-muted font-medium text-lg md:text-xl leading-relaxed opacity-50 max-w-2xl">
              Rekaman jejak digital interaksi Anda dalam sistem WibuPedia. Semua data terenkripsi dan tersimpan secara lokal.
            </p>
          </div>
          
          <div class="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] backdrop-blur-xl flex flex-col items-end">
            <span class="text-[8px] font-black uppercase text-white/20 tracking-widest mb-1">Total Logs</span>
            <span class="text-3xl font-black text-white tabular-nums tracking-tighter">{{ libraryStore.logs.length }}</span>
          </div>
        </div>
      </header>

      <div class="bg-dark-surface/50 border border-white/5 rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.6)] backdrop-blur-3xl">
        <div class="grid grid-cols-12 p-8 bg-white/[0.03] border-b border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
          <div class="col-span-4 md:col-span-3">Chronology</div>
          <div class="col-span-3 md:col-span-2 text-center">Action</div>
          <div class="col-span-5 md:col-span-7 pl-8 md:pl-12">Target / Description</div>
        </div>

        <div class="divide-y divide-white/[0.03] max-h-[50vh] overflow-y-auto scrollbar-hide custom-scroll">
          <div v-for="log in libraryStore.logs" :key="log.id" 
               class="grid grid-cols-12 p-8 hover:bg-white/[0.03] transition-all group items-center">
            
            <div class="col-span-4 md:col-span-3 flex flex-col gap-1">
              <span class="text-[12px] font-black text-white tabular-nums tracking-tight group-hover:text-white transition-colors">{{ formatTime(log.timestamp) }}</span>
              <span class="text-[9px] font-bold text-text-muted uppercase opacity-40">{{ formatDate(log.timestamp) }}</span>
            </div>

            <div class="col-span-3 md:col-span-2 flex items-center justify-center">
              <span :class="{
                'bg-emerald-500/10 text-emerald-400 border-emerald-500/20': log.action === 'ADD',
                'bg-red-500/10 text-red-400 border-red-500/20': log.action === 'REMOVE',
                'bg-blue-500/10 text-blue-400 border-blue-500/20': log.action === 'EXPORT',
                'bg-amber-500/10 text-amber-400 border-amber-500/20': log.action === 'IMPORT',
                'bg-purple-500/10 text-purple-400 border-purple-500/20': log.action === 'PURGE'
              }" class="px-4 py-2 rounded-xl text-[9px] font-black border uppercase tracking-widest shadow-sm">
                {{ log.action }}
              </span>
            </div>

            <div class="col-span-5 md:col-span-7 pl-8 md:pl-12">
              <div class="flex items-center gap-4">
                <div class="w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100" :style="{ backgroundColor: primaryColor }"></div>
                <span class="text-[13px] font-bold text-white/60 group-hover:text-white transition-colors truncate block uppercase tracking-tight">
                  {{ log.target }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="libraryStore.logs.length === 0" class="py-32 text-center">
            <div class="w-24 h-24 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto mb-8">
              <i class="fa-solid fa-wind text-3xl text-white/5 animate-pulse"></i>
            </div>
            <p class="text-[11px] font-black uppercase tracking-[0.4em] text-white/20">The Ledger is Empty</p>
          </div>
        </div>
      </div>

      <div class="mt-16 flex flex-col md:flex-row justify-between items-center gap-8">
        <button @click="router.back()" class="group flex items-center gap-5 px-10 py-5 bg-white text-black rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl">
          <i class="fa-solid fa-arrow-left-long group-hover:-translate-x-2 transition-transform"></i> 
          Back to Hub
        </button>
        
        <div class="flex flex-col items-center md:items-end gap-3 text-center md:text-right">
          <div class="flex items-center gap-3">
             <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
             <p class="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Session Link Encrypted</p>
          </div>
          <p class="text-[9px] font-bold text-text-muted opacity-20 uppercase tracking-[0.4em]">
            Build Version: v2.6.5 CE • Community Integrity
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.scrollbar-hide::-webkit-scrollbar { display: none; }

.custom-scroll::-webkit-scrollbar { width: 5px; }
.custom-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }

.animate-reveal { 
  animation: revealUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; 
}

@keyframes revealUp { 
  from { opacity: 0; transform: translateY(50px); filter: blur(15px); } 
  to { opacity: 1; transform: translateY(0); filter: blur(0); } 
}

.divide-y > * + * {
  border-top-width: 1px;
  border-color: rgba(255, 255, 255, 0.03);
}
</style>