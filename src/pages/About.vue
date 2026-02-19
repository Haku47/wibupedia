<script setup>
import { APP_CONFIG } from '@/core/constants/APP_CONFIG'
import { computed, onMounted } from 'vue'
import { useUserStore } from '@/store/userStore.js'

const userStore = useUserStore()
const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <main class="min-h-screen pb-40 pt-28 relative overflow-hidden font-outfit bg-dark-bg text-text-main">
    
    <div :style="{ backgroundColor: primaryColor }" class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] opacity-[0.04] blur-[150px] rounded-full pointer-events-none"></div>

    <header class="max-w-5xl mx-auto text-center mb-32 px-6 relative z-10 animate-fade-in">
      <div class="inline-flex items-center gap-3 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full mb-12 shadow-2xl backdrop-blur-md">
        <div class="w-1.5 h-1.5 rounded-full animate-pulse" :style="{ backgroundColor: primaryColor }"></div>
        <span class="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">The Community Manifesto</span>
      </div>
      
      <h1 class="text-6xl md:text-9xl font-black text-white tracking-tighter mb-12 uppercase  leading-[0.85]">
        Beyond <br/>
        <span :style="{ color: primaryColor }" class="transition-colors duration-1000">Archives.</span>
      </h1>
      
      <p class="text-lg md:text-2xl text-text-muted leading-relaxed font-medium opacity-50 max-w-3xl mx-auto ">
        WibuPedia bukan sekadar katalog. Ini adalah sistem manajemen archive terpadu untuk 5 dimensi hiburan: <span class="text-white">TV Series, Movies, Manga, Light Novels,</span> dan <span class="text-white">Donghua.</span>
      </p>
    </header>

    <section class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-40 relative z-10">
      <div v-for="(feature, index) in [
        { icon: 'fa-microchip', title: 'Elite Engine', desc: 'Infrastruktur cerdas yang mampu mengolah ribuan metadata Jikan API secara instan.' },
        { icon: 'fa-shield-halved', title: 'SFW Protocol', desc: 'Standar kurasi ketat untuk memastikan lingkungan archive yang bersih dan profesional.' },
        { icon: 'fa-chart-pie', title: 'Analytical Insight', desc: 'Algoritma Taste Profile yang merumuskan persona selera Anda secara akurat.' }
      ]" :key="index" class="p-14 bg-dark-surface/50 border border-white/5 rounded-[4rem] hover:border-white/20 transition-all group relative overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        
        <div :style="{ color: primaryColor, backgroundColor: primaryColor + '10' }" 
             class="w-20 h-20 rounded-[2rem] flex items-center justify-center mb-12 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 border border-white/5">
            <i :class="['fa-solid', feature.icon]" class="text-3xl"></i>
        </div>
        
        <h3 class="text-3xl font-black mb-6 tracking-tighter text-white uppercase ">{{ feature.title }}</h3>
        <p class="text-text-muted leading-relaxed font-medium text-base opacity-40 group-hover:opacity-70 transition-opacity">{{ feature.desc }}</p>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-6 mb-40">
      <div class="bg-dark-surface/30 border border-white/5 rounded-[5rem] p-12 md:p-28 relative overflow-hidden group shadow-2xl backdrop-blur-sm">
        <div class="absolute -right-20 -top-20 w-96 h-96 opacity-[0.03] blur-[100px] rounded-full transition-all group-hover:opacity-[0.06]" :style="{ backgroundColor: primaryColor }"></div>
        
        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <div class="flex items-center gap-6 mb-12">
               <div :style="{ backgroundColor: primaryColor }" class="w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl">
                  <i class="fa-solid fa-code-branch text-white text-2xl"></i>
               </div>
               <span class="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Handcrafted Protocol</span>
            </div>

            <h2 class="text-5xl md:text-6xl font-black text-white mb-10 tracking-tighter uppercase  leading-[0.9]">Passion Over<br/>Routine.</h2>
            <p class="text-text-muted leading-relaxed font-medium mb-14 opacity-50 text-lg">
              Arsitektur dikembangkan oleh <b class="text-white">Alviensyah Mohammad</b> di Malang, Indonesia. Dibangun menggunakan teknologi <span class="text-white">reactive state</span> terbaru untuk memberikan kecepatan akses archive yang tak tertandingi oleh platform konvensional.
            </p>
            
            <div class="flex flex-wrap gap-6">
              <a :href="APP_CONFIG.SOCIAL?.github || '#'" target="_blank" 
                 class="px-14 py-6 bg-white text-black font-black rounded-3xl hover:scale-105 active:scale-95 transition-all text-[11px] uppercase tracking-[0.4em] shadow-2xl">
                Open Source
              </a>
              <RouterLink to="/contact" 
                 class="px-14 py-6 bg-white/5 border border-white/10 text-white font-black rounded-3xl hover:bg-white/10 active:scale-95 transition-all text-[11px] uppercase tracking-[0.4em]">
                Get In Touch
              </RouterLink>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div v-for="tech in ['Vue 3.5+', 'Vite Elite', 'Tailwind v3', 'Pinia State']" :key="tech" 
                 class="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center group/tech hover:bg-white/[0.05] transition-all">
              <span class="text-[11px] font-black uppercase tracking-[0.2em] text-white/20 group-hover/tech:text-brand-primary transition-all">{{ tech }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="text-center relative z-10 animate-fade-in px-6">
      <p class="text-[10px] font-black uppercase tracking-[1em] text-white/10 mb-16 ">Engine Core Infrastructure</p>
      
      <div class="flex flex-wrap justify-center gap-16 md:gap-32 opacity-20 hover:opacity-100 transition-all duration-1000 items-center grayscale hover:grayscale-0">
        <i v-for="icon in ['fa-vuejs', 'fa-bolt-lightning', 'fa-layer-group', 'fa-database', 'fa-github']" :key="icon"
           :class="['fa-brands fa-vuejs', 'fa-solid fa-bolt-lightning', 'fa-solid fa-layer-group', 'fa-solid fa-database', 'fa-brands fa-github'].find(i => i.includes(icon))" 
           class="text-5xl transition-all duration-700 hover:scale-125"></i>
      </div>
    </div>

    <div class="mt-40 text-center opacity-20 group">
      <p class="text-[9px] font-black uppercase tracking-[0.5em] mb-4">WibuPedia Community Edition</p>
      <div class="w-12 h-0.5 bg-white/10 mx-auto rounded-full group-hover:w-24 group-hover:bg-brand-primary transition-all duration-1000"></div>
    </div>

  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.animate-fade-in { animation: fadeIn 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
::-webkit-scrollbar { display: none; }
</style>