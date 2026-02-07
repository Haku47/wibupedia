<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useLibraryStore } from '@/store/libraryStore'
import { useUserStore } from '@/store/userStore'

const libraryStore = useLibraryStore()
const userStore = useUserStore()

const apiStatus = ref('checking') // checking | online | slow | offline
const latency = ref(0)
const lastChecked = ref(null)
const uptime = ref('99.9%')
const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')
const activePillars = ref(['Anime Directory', 'Manga Library', 'Novel Archive'])

// --- 📊 COLLECTION HEALTH ANALYTICS ---
const storageHealth = computed(() => {
  const size = JSON.stringify(libraryStore.myLibrary).length
  if (size < 50000) return { label: 'Optimal', color: 'text-brand-primary', offset: 50 }
  if (size < 150000) return { label: 'Good', color: 'text-emerald-400', offset: 120 }
  return { label: 'Heavy', color: 'text-amber-400', offset: 280 }
})

const checkSystemStatus = async () => {
  apiStatus.value = 'checking'
  const startTime = Date.now()
  
  try {
    // Ping ke Jikan API (V4)
    await axios.get('https://api.jikan.moe/v4/random/anime', { timeout: 8000 })
    latency.value = Date.now() - startTime
    
    if (latency.value > 2000) apiStatus.value = 'slow'
    else apiStatus.value = 'online'
  } catch (err) {
    apiStatus.value = 'offline'
    latency.value = 0
  } finally {
    lastChecked.value = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }
}

onMounted(() => {
  checkSystemStatus()
  const interval = setInterval(checkSystemStatus, 60000)
  return () => clearInterval(interval)
})
</script>

<template>
  <main class="min-h-screen bg-dark-bg text-text-main pb-40 pt-28 relative overflow-hidden font-outfit">
    <div :style="{ backgroundColor: primaryColor }" class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-[0.03] blur-[150px] rounded-full pointer-events-none transition-all duration-1000"></div>

    <div class="max-w-6xl mx-auto px-6 relative z-10">
      
      <header class="mb-20 text-center animate-reveal">
        <div class="inline-flex items-center gap-4 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full mb-10 shadow-sm backdrop-blur-md">
          <span class="relative flex h-2 w-2">
            <span :style="{ backgroundColor: apiStatus === 'online' ? '#10b981' : primaryColor }" class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"></span>
            <span :style="{ backgroundColor: apiStatus === 'online' ? '#10b981' : primaryColor }" class="relative inline-flex rounded-full h-2 w-2 shadow-lg"></span>
          </span>
          <span class="text-[10px] font-black uppercase tracking-widest text-white/40">Network Monitoring</span>
        </div>
        
        <h1 class="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-none text-white">
          Service<br/><span :style="{ color: primaryColor }">Status.</span>
        </h1>
        <p class="text-text-muted mt-10 font-bold opacity-40 max-w-2xl mx-auto text-xs md:text-sm tracking-[0.3em] uppercase">
          Real-time updates on infrastructure and data availability.
        </p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        
        <div class="lg:col-span-2 p-12 bg-dark-surface border border-white/5 rounded-[3.5rem] shadow-2xl relative overflow-hidden group transition-all hover:border-white/10">
          <div class="absolute -right-20 -bottom-20 w-64 h-64 opacity-[0.03] blur-[80px] rounded-full" :style="{ backgroundColor: primaryColor }"></div>
          
          <div class="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div class="flex items-center justify-between mb-12">
                <p class="text-[11px] font-black text-text-muted uppercase tracking-widest opacity-30">Main Database Cluster</p>
                <span class="px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-white/60 tracking-widest uppercase">Jikan API v4</span>
              </div>
              <h3 class="text-5xl font-black uppercase italic tracking-tighter mb-12 text-white">
                {{ apiStatus === 'checking' ? 'Connecting...' : (apiStatus === 'online' ? 'Operational' : (apiStatus === 'slow' ? 'Limited' : 'Offline')) }}
              </h3>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-3 gap-10">
              <div class="space-y-2">
                <p class="text-[9px] font-black text-text-muted uppercase tracking-widest opacity-30">Response Time</p>
                <p class="text-4xl font-black tabular-nums italic" :style="{ color: apiStatus === 'online' ? 'white' : primaryColor }">
                  {{ latency }}<span class="text-xs ml-1 opacity-30">ms</span>
                </p>
              </div>
              <div class="space-y-2">
                <p class="text-[9px] font-black text-text-muted uppercase tracking-widest opacity-30">Global Uptime</p>
                <p class="text-4xl font-black tabular-nums italic text-white">{{ uptime }}</p>
              </div>
              <div class="space-y-2 hidden md:block">
                <p class="text-[9px] font-black text-text-muted uppercase tracking-widest opacity-30">Encryption</p>
                <p class="text-4xl font-black italic text-emerald-500 uppercase tracking-tighter">Standard</p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-12 bg-dark-surface border border-white/5 rounded-[3.5rem] shadow-2xl flex flex-col justify-between backdrop-blur-3xl">
          <p class="text-[11px] font-black text-text-muted uppercase tracking-widest opacity-30 mb-10">Service Hub</p>
          <div class="space-y-5">
            <div v-for="pillar in activePillars" :key="pillar" class="flex items-center justify-between p-5 bg-white/[0.03] border border-white/5 rounded-[2rem] hover:border-white/10 transition-all group">
              <div class="flex items-center gap-4">
                 <div class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: primaryColor }"></div>
                 <span class="text-xs font-bold uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">{{ pillar }}</span>
              </div>
              <i class="fa-solid fa-check text-emerald-500 text-[10px] opacity-40"></i>
            </div>
          </div>
        </div>

        <div class="p-12 bg-dark-surface border border-white/5 rounded-[3.5rem] shadow-2xl transition-all hover:border-white/10">
          <p class="text-[11px] font-black text-text-muted uppercase tracking-widest opacity-30 mb-10">Storage Stability</p>
          <div class="flex flex-col items-center py-6 text-center">
            <div class="relative w-36 h-36 flex items-center justify-center mb-8">
              <svg class="w-full h-full rotate-[-90deg]">
                <circle cx="72" cy="72" r="68" stroke="currentColor" stroke-width="8" fill="transparent" class="text-white/5" />
                <circle cx="72" cy="72" r="68" stroke="currentColor" stroke-width="8" fill="transparent" :class="storageHealth.color" stroke-dasharray="427" :stroke-dashoffset="storageHealth.offset" class="transition-all duration-[1.5s] ease-out" />
              </svg>
              <i class="fa-solid fa-box-archive absolute text-3xl opacity-10" :style="{ color: primaryColor }"></i>
            </div>
            <h4 class="text-3xl font-black uppercase italic tracking-tighter" :class="storageHealth.color">{{ storageHealth.label }}</h4>
            <p class="text-[9px] font-black text-text-muted uppercase tracking-widest mt-3 opacity-40">Local Data State</p>
          </div>
        </div>

        <div class="lg:col-span-2 p-10 md:p-14 bg-white/[0.02] border border-white/5 rounded-[3.5rem] flex flex-wrap items-center justify-between gap-12 backdrop-blur-sm">
          <div class="flex flex-wrap gap-16 items-center">
            <div class="space-y-2">
              <p class="text-[9px] font-black uppercase text-text-muted tracking-widest opacity-30">Last Update</p>
              <p class="text-2xl font-black italic text-white tabular-nums tracking-tighter">{{ lastChecked || 'WAITING...' }}</p>
            </div>
            <div class="space-y-2 border-l border-white/5 pl-12">
              <p class="text-[9px] font-black uppercase text-text-muted tracking-widest opacity-30">Current Node</p>
              <p class="text-2xl font-black italic uppercase tracking-tighter" :style="{ color: primaryColor }">Malang Hub</p>
            </div>
          </div>
          
          <button @click="checkSystemStatus" :disabled="apiStatus === 'checking'"
            class="group relative overflow-hidden px-14 py-6 bg-white text-black rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-95 disabled:opacity-40">
            <div class="relative z-10 flex items-center gap-4 group-hover:text-white transition-colors duration-500">
               <i class="fa-solid fa-rotate transition-transform group-hover:rotate-180 duration-700"></i>
               Refresh Status
            </div>
            <div class="absolute inset-0 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" :style="{ backgroundColor: primaryColor }"></div>
          </button>
        </div>

      </div>

      <div class="flex flex-col items-center gap-4 mt-24 opacity-20">
         <div class="h-px w-20 bg-white/20"></div>
         <p class="text-[9px] text-text-muted font-bold uppercase tracking-[0.6em] text-center">
           Community Service Network • East Java
         </p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }

.animate-reveal {
  animation: revealUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
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