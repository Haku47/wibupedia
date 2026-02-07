<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useLibraryStore } from '@/store/libraryStore'

const libraryStore = useLibraryStore()

const apiStatus = ref('checking') // checking | online | slow | offline
const latency = ref(0)
const lastChecked = ref(null)
const uptime = ref('99.9%')
const activePillars = ref(['Anime Database', 'Manga Terminal', 'Novel Archives'])

// --- 🛡️ v1.9.8.1 VAULT ANALYTICS ---
const vaultHealth = computed(() => {
  const size = JSON.stringify(libraryStore.myLibrary).length
  if (size < 50000) return { label: 'Optimal', color: 'text-brand-primary', offset: 50 }
  if (size < 150000) return { label: 'Nominal', color: 'text-emerald-400', offset: 120 }
  return { label: 'Critical', color: 'text-amber-400', offset: 280 }
})

const checkSystemStatus = async () => {
  apiStatus.value = 'checking'
  const startTime = Date.now()
  
  try {
    // Ping ke Jikan API (V4) - Dedicated Throughput Test
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
  <main class="min-h-screen bg-dark-bg text-text-main pb-40 pt-28 relative overflow-hidden">
    <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none"></div>
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-brand-primary/5 blur-[180px] rounded-full pointer-events-none transition-colors duration-1000"></div>

    <div class="max-w-6xl mx-auto px-6 relative z-10">
      
      <header class="mb-20 text-center animate-reveal">
        <div class="inline-flex items-center gap-4 px-6 py-3 bg-dark-surface/50 border border-white/10 rounded-full mb-10 shadow-2xl backdrop-blur-xl">
          <span class="relative flex h-2.5 w-2.5">
            <span :class="apiStatus === 'online' ? 'bg-emerald-500' : 'bg-brand-primary'" class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"></span>
            <span :class="apiStatus === 'online' ? 'bg-emerald-500' : 'bg-brand-primary'" class="relative inline-flex rounded-full h-2.5 w-2.5 shadow-neon"></span>
          </span>
          <span class="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted italic">System Telemetry Active</span>
        </div>
        
        <h1 class="text-6xl md:text-9xl font-black tracking-tighter font-outfit uppercase italic leading-none text-white">
          Intelligence<br/><span class="text-brand-primary transition-colors duration-700">Status.</span>
        </h1>
        <p class="text-text-muted mt-10 font-bold opacity-40 max-w-2xl mx-auto text-sm tracking-widest uppercase italic">
          Monitoring Real-time Infrastructure & Data Transmission Stabilities.
        </p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        
        <div class="lg:col-span-2 p-12 bg-dark-surface/40 border border-dark-border rounded-[4rem] shadow-2xl relative overflow-hidden group backdrop-blur-xl transition-all hover:border-brand-primary/20">
          <div class="absolute -right-20 -bottom-20 w-64 h-64 bg-brand-primary/5 blur-[80px] rounded-full"></div>
          
          <div class="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div class="flex items-center justify-between mb-10">
                <p class="text-[11px] font-black text-text-muted uppercase tracking-[0.4em] opacity-40 italic">Main API Cluster</p>
                <span class="px-4 py-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded-xl text-[9px] font-black text-brand-primary italic">JIKAN V4 CORE</span>
              </div>
              <h3 class="text-5xl font-black font-outfit uppercase italic tracking-tighter mb-12 text-white">
                {{ apiStatus === 'checking' ? 'Decrypting...' : (apiStatus === 'online' ? 'Operational' : (apiStatus === 'slow' ? 'High Latency' : 'Connection Lost')) }}
              </h3>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-3 gap-10">
              <div class="space-y-3">
                <p class="text-[9px] font-black text-text-muted uppercase tracking-widest opacity-30 italic leading-none">Response Latency</p>
                <p class="text-4xl font-black tabular-nums italic" :class="apiStatus === 'online' ? 'text-white' : 'text-brand-primary'">
                  {{ latency }}<span class="text-xs ml-1 opacity-40 uppercase">ms</span>
                </p>
              </div>
              <div class="space-y-3">
                <p class="text-[9px] font-black text-text-muted uppercase tracking-widest opacity-30 italic leading-none">Global Uptime</p>
                <p class="text-4xl font-black tabular-nums italic text-white">{{ uptime }}</p>
              </div>
              <div class="space-y-3 hidden md:block">
                <p class="text-[9px] font-black text-text-muted uppercase tracking-widest opacity-30 italic leading-none">Security Layer</p>
                <p class="text-4xl font-black italic text-emerald-500 uppercase">AES-256</p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-12 bg-dark-surface/40 border border-dark-border rounded-[4rem] shadow-2xl flex flex-col justify-between group backdrop-blur-xl">
          <p class="text-[11px] font-black text-text-muted uppercase tracking-[0.4em] opacity-40 italic mb-10">Active Pillars</p>
          <div class="space-y-6">
            <div v-for="pillar in activePillars" :key="pillar" class="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-[2rem] hover:border-brand-primary/30 transition-all group/pillar">
              <div class="flex items-center gap-4">
                 <div class="w-2 h-2 rounded-full bg-brand-primary shadow-neon"></div>
                 <span class="text-xs font-black uppercase tracking-widest italic">{{ pillar }}</span>
              </div>
              <i class="fa-solid fa-satellite text-brand-primary text-[10px] animate-pulse"></i>
            </div>
          </div>
        </div>

        <div class="p-12 bg-dark-surface/40 border border-dark-border rounded-[4rem] shadow-2xl transition-all hover:border-emerald-500/20 backdrop-blur-xl">
          <p class="text-[11px] font-black text-text-muted uppercase tracking-[0.4em] opacity-40 italic mb-10">Vault Integrity</p>
          <div class="flex flex-col items-center py-6">
            <div class="relative w-32 h-32 flex items-center justify-center mb-8">
              <svg class="w-full h-full rotate-[-90deg]">
                <circle cx="64" cy="64" r="60" stroke="currentColor" stroke-width="8" fill="transparent" class="text-white/5" />
                <circle cx="64" cy="64" r="60" stroke="currentColor" stroke-width="8" fill="transparent" :class="vaultHealth.color" stroke-dasharray="377" :stroke-dashoffset="vaultHealth.offset" class="transition-all duration-1000" />
              </svg>
              <i class="fa-solid fa-microchip absolute text-3xl opacity-20 text-brand-primary"></i>
            </div>
            <h4 class="text-2xl font-black font-outfit uppercase italic tracking-tighter" :class="vaultHealth.color">{{ vaultHealth.label }}</h4>
            <p class="text-[9px] font-black text-text-muted uppercase tracking-widest mt-2 opacity-50 italic">Local Core Stability</p>
          </div>
        </div>

        <div class="lg:col-span-2 p-10 bg-dark-surface/20 border border-dark-border rounded-[4rem] flex flex-wrap items-center justify-between gap-12 px-16 backdrop-blur-md">
          <div class="flex gap-16">
            <div class="space-y-3">
              <p class="text-[9px] font-black uppercase text-text-muted tracking-widest opacity-30 italic">Last Handshake</p>
              <p class="text-xl font-black italic text-white tabular-nums">{{ lastChecked || 'WAITING...' }}</p>
            </div>
            <div class="space-y-3 border-l border-white/5 pl-16">
              <p class="text-[9px] font-black uppercase text-text-muted tracking-widest opacity-30 italic">Research Center</p>
              <p class="text-xl font-black italic text-brand-primary uppercase tracking-tighter">MALANG • 2026</p>
            </div>
          </div>
          
          <button @click="checkSystemStatus" :disabled="apiStatus === 'checking'"
            class="group relative overflow-hidden px-12 py-6 bg-white text-black rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-95 disabled:opacity-50 italic">
            <div class="relative z-10 flex items-center gap-4 transition-colors group-hover:text-white">
               <i class="fa-solid fa-bolt-lightning transition-transform group-hover:rotate-[360deg] duration-1000"></i>
               Initialize Protocol
            </div>
            <div class="absolute inset-0 bg-brand-primary translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
          </button>
        </div>

      </div>

      <div class="flex flex-col items-center gap-4 mt-20 opacity-20">
         <div class="h-px w-20 bg-brand-primary"></div>
         <p class="text-[10px] text-text-muted font-black uppercase tracking-[0.6em] italic">
           Distributed Intelligence Hub — East Java Network
         </p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.shadow-neon { box-shadow: 0 0 15px var(--color-brand-primary); }
.animate-reveal { animation: revealUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }

@keyframes revealUp {
  from { opacity: 0; transform: translateY(60px); filter: blur(10px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

/* Custom button state transition */
button:hover :deep(i) { color: white; }
</style>