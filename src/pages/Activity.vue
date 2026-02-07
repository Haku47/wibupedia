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
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
}

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <main class="min-h-screen bg-dark-bg text-text-main pt-32 pb-24 px-6 relative overflow-hidden font-outfit">
    <div :style="{ backgroundColor: primaryColor }" class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-[0.03] blur-[150px] rounded-full pointer-events-none transition-all duration-1000"></div>

    <div class="max-w-4xl mx-auto relative z-10">
      
      <header class="mb-16 animate-reveal">
        <div class="flex items-center gap-4 mb-8">
          <div :style="{ backgroundColor: primaryColor }" class="w-10 h-1 rounded-full shadow-lg"></div>
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">History Logs</span>
        </div>
        <h1 class="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none italic">
          Activity<br/><span :style="{ color: primaryColor }">History.</span>
        </h1>
        <p class="mt-10 text-text-muted font-medium text-lg leading-relaxed opacity-60 max-w-2xl">
          Pantau riwayat interaksi Anda di dalam platform, mulai dari penambahan koleksi hingga pembaruan profil secara real-time.
        </p>
      </header>

      <div class="bg-dark-surface border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-3xl">
        <div class="grid grid-cols-12 p-8 bg-white/[0.03] border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-white/30">
          <div class="col-span-3">Timestamp</div>
          <div class="col-span-2 text-center">Action</div>
          <div class="col-span-7 pl-8">Details</div>
        </div>

        <div class="divide-y divide-white/5 max-h-[55vh] overflow-y-auto scrollbar-hide">
          <div v-for="log in libraryStore.logs" :key="log.id" 
               class="grid grid-cols-12 p-8 hover:bg-white/[0.02] transition-all group items-center">
            
            <div class="col-span-3 flex flex-col">
              <span class="text-[11px] font-black text-white tabular-nums tracking-tight">{{ formatTime(log.timestamp) }}</span>
              <span class="text-[9px] font-bold text-text-muted uppercase opacity-40">{{ formatDate(log.timestamp) }}</span>
            </div>

            <div class="col-span-2 flex items-center justify-center">
              <span :class="{
                'bg-emerald-500/10 text-emerald-500 border-emerald-500/20': log.action === 'ADD',
                'bg-red-500/10 text-red-500 border-red-500/20': log.action === 'REMOVE',
                'bg-brand-primary/10 text-brand-primary border-brand-primary/20': log.action === 'EXPORT',
                'bg-amber-500/10 text-amber-500 border-amber-500/20': log.action === 'IMPORT'
              }" class="px-3 py-1.5 rounded-xl text-[8px] font-black border uppercase tracking-wider">
                {{ log.action }}
              </span>
            </div>

            <div class="col-span-7 pl-8">
              <span class="text-[12px] font-bold text-white/70 group-hover:text-white transition-colors truncate block uppercase tracking-tight">
                {{ log.target }}
              </span>
            </div>
          </div>

          <div v-if="libraryStore.logs.length === 0" class="p-24 text-center">
            <div class="w-16 h-16 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto mb-6">
              <i class="fa-solid fa-clock-rotate-left text-2xl text-white/10"></i>
            </div>
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-30">No recent activity detected</p>
          </div>
        </div>
      </div>

      <div class="mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <button @click="router.back()" class="group flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl active:scale-95">
          <i class="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Return to Profile
        </button>
        <p class="text-[9px] font-bold text-text-muted opacity-20 uppercase tracking-[0.4em]">
          Session Integrity Active • v2.2.5
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.scrollbar-hide::-webkit-scrollbar { display: none; }

.animate-reveal { 
  animation: revealUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; 
}

@keyframes revealUp { 
  from { opacity: 0; transform: translateY(40px); filter: blur(10px); } 
  to { opacity: 1; transform: translateY(0); filter: blur(0); } 
}

/* Custom divide opacity */
.divide-y > * + * {
  border-top-width: 1px;
  border-color: rgba(255, 255, 255, 0.05);
}
</style>