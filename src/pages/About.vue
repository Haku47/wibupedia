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
  <main class="min-h-screen pb-32 pt-24 relative overflow-hidden font-outfit bg-dark-bg text-text-main">
    
    <div :style="{ backgroundColor: primaryColor }" class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-[0.05] blur-[120px] rounded-full pointer-events-none"></div>

    <header class="max-w-4xl mx-auto text-center mb-28 px-6 relative z-10">
      <div class="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full mb-10 shadow-sm transition-all hover:border-brand-primary/30 group">
        <div class="w-2 h-2 rounded-full animate-pulse" :style="{ backgroundColor: primaryColor }"></div>
        <span class="text-[10px] font-black uppercase tracking-widest text-white/60">Our Mission</span>
      </div>
      
      <h1 class="text-6xl md:text-8xl font-black text-white tracking-tighter mb-10 uppercase italic leading-[0.9]">
        The Future Of <br/>
        <span :style="{ color: primaryColor }">Community.</span>
      </h1>
      
      <p class="text-lg md:text-xl text-text-muted leading-relaxed font-medium opacity-60 max-w-2xl mx-auto">
        WibuPedia adalah rumah bagi para pecinta anime, manga, dan novel. Sebuah platform yang dirancang untuk membantu Anda menemukan cerita baru dan mengelola koleksi personal dengan cara yang paling modern.
      </p>
    </header>

    <section class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 mb-32 relative z-10">
      <div v-for="(feature, index) in [
        { icon: 'fa-bolt-lightning', title: 'Lightweight', desc: 'Akses instan dan performa tinggi tanpa membebani perangkat Anda.' },
        { icon: 'fa-users', title: 'Community First', desc: 'Fitur yang dirancang berdasarkan kebutuhan nyata para penggemar anime Indonesia.' },
        { icon: 'fa-box-archive', title: 'Smart Archive', desc: 'Kelola ribuan judul Anime, Manga, dan Novel dalam satu ruang terpadu.' }
      ]" :key="index" class="p-12 bg-dark-surface border border-white/5 rounded-[3.5rem] hover:border-white/20 transition-all group relative overflow-hidden shadow-2xl">
        
        <div :style="{ color: primaryColor, backgroundColor: primaryColor + '10' }" 
             class="w-16 h-16 rounded-2xl flex items-center justify-center mb-10 shadow-lg group-hover:scale-110 transition-transform border border-current">
            <i :class="['fa-solid', feature.icon]" class="text-2xl"></i>
        </div>
        
        <h3 class="text-2xl font-black mb-4 tracking-tighter text-white uppercase">{{ feature.title }}</h3>
        <p class="text-text-muted leading-relaxed font-medium text-sm opacity-50">{{ feature.desc }}</p>
      </div>
    </section>

    <section class="max-w-5xl mx-auto px-6">
      <div class="bg-dark-surface border border-white/5 rounded-[4rem] p-12 md:p-24 relative overflow-hidden group shadow-[0_40px_100px_rgba(0,0,0,0.4)]">
        <div class="absolute -right-20 -top-20 w-80 h-80 opacity-[0.05] blur-[120px] rounded-full transition-all group-hover:opacity-[0.08]" :style="{ backgroundColor: primaryColor }"></div>
        
        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div :style="{ backgroundColor: primaryColor }" 
                 class="w-20 h-20 rounded-[2.5rem] flex items-center justify-center mb-12 shadow-2xl transition-transform duration-700 group-hover:rotate-12">
               <i class="fa-solid fa-code text-white text-3xl"></i>
            </div>
            <h2 class="text-5xl font-black text-white mb-8 tracking-tighter uppercase italic">Handcrafted with Passion.</h2>
            <p class="text-text-muted leading-relaxed font-medium mb-12 opacity-60">
              Dikembangkan oleh <b class="text-white">Malangan Dev</b> dengan dedikasi tinggi pada pengalaman pengguna. Kami menggunakan teknologi web terkini untuk memastikan standar kualitas terbaik bagi komunitas.
            </p>
            
            <div class="flex flex-wrap gap-5">
              <a :href="APP_CONFIG.SOCIAL?.github || '#'" target="_blank" 
                 class="px-12 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all text-[11px] uppercase tracking-widest shadow-xl">
                Open Source
              </a>
              <RouterLink to="/contact" 
                 class="px-12 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-[11px] uppercase tracking-widest">
                Get In Touch
              </RouterLink>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-5">
            <div v-for="tech in ['Vue 3', 'Vite JS', 'Tailwind', 'Jikan API']" :key="tech" 
                 class="p-8 bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col items-center justify-center text-center group/tech hover:border-white/20 transition-all shadow-inner">
              <span class="text-[10px] font-black uppercase tracking-widest opacity-30 group-hover/tech:opacity-100 group-hover/tech:text-brand-primary transition-all">{{ tech }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="text-center mt-40 relative z-10 animate-fade-in" style="animation-delay: 0.4s">
      <p class="text-[10px] font-black uppercase tracking-[0.8em] text-white/20 mb-12">Powered by</p>
      
      <div class="flex flex-wrap justify-center gap-16 md:gap-24 opacity-30 hover:opacity-100 transition-opacity duration-1000 items-center">
        
        <div class="group/icon flex flex-col items-center gap-4">
          <i class="fa-brands fa-vuejs text-5xl hover:text-[#42b883] transition-all duration-500 hover:scale-110"></i>
          <span class="text-[8px] font-black uppercase tracking-widest opacity-0 group-hover/icon:opacity-100 transition-opacity">Vue Engine</span>
        </div>

        <div class="group/icon flex flex-col items-center gap-4">
          <i class="fa-solid fa-bolt-lightning text-5xl hover:text-[#ffbb2c] transition-all duration-500 hover:scale-110"></i>
          <span class="text-[8px] font-black uppercase tracking-widest opacity-0 group-hover/icon:opacity-100 transition-opacity">Vite Build</span>
        </div>

        <div class="group/icon flex flex-col items-center gap-4">
          <i class="fa-solid fa-layer-group text-5xl hover:text-[#38bdf8] transition-all duration-500 hover:scale-110"></i>
          <span class="text-[8px] font-black uppercase tracking-widest opacity-0 group-hover/icon:opacity-100 transition-opacity">Tailwind CSS</span>
        </div>

        <div class="group/icon flex flex-col items-center gap-4">
          <i class="fa-solid fa-database text-5xl hover:text-[#10b981] transition-all duration-500 hover:scale-110"></i>
          <span class="text-[8px] font-black uppercase tracking-widest opacity-0 group-hover/icon:opacity-100 transition-opacity">Jikan API</span>
        </div>

        <div class="group/icon flex flex-col items-center gap-4">
          <i class="fa-brands fa-github text-5xl hover:text-white transition-all duration-500 hover:scale-110"></i>
          <span class="text-[8px] font-black uppercase tracking-widest opacity-0 group-hover/icon:opacity-100 transition-opacity">Open Source</span>
        </div>

      </div>
    </div>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }

.animate-fade-in {
  animation: fadeIn 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Hide scrollbar for Chrome, Safari and Opera */
::-webkit-scrollbar {
  display: none;
}
</style>