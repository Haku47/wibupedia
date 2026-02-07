<script setup>
import { APP_CONFIG } from '@/core/constants/APP_CONFIG'
</script>

<template>
  <main class="min-h-screen pb-32 pt-16 relative overflow-hidden">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-primary/5 blur-[150px] rounded-full pointer-events-none"></div>

    <header class="max-w-4xl mx-auto text-center mb-24 px-6 relative z-10">
      <div class="inline-flex items-center gap-3 px-5 py-2 bg-brand-primary/10 border border-brand-primary/20 rounded-full mb-10 animate-fade-in shadow-xl">
        <span class="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></span>
        <span class="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary">Project Manifesto</span>
      </div>
      
      <h1 class="text-6xl md:text-8xl font-black text-text-main tracking-tighter mb-10 font-outfit uppercase italic leading-none">
        The Future Of <br/>
        <span class="text-brand-primary text-glow italic">Otaku Vault.</span>
      </h1>
      
      <p class="text-lg md:text-xl text-text-muted leading-relaxed font-medium opacity-70 max-w-2xl mx-auto">
        WibuPedia bukan sekadar katalog. Ini adalah sistem manajemen data anime, manga, dan novel yang dirancang untuk kecepatan, presisi, dan kedaulatan informasi komunitas.
      </p>
    </header>

    <section class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 relative z-10">
      <div v-for="(feature, index) in [
        { icon: 'fa-bolt-lightning', color: 'text-brand-primary', title: 'Performa v1.8', desc: 'Optimasi memori hingga 135MB lebih ringan dengan Single-Engine Animation.' },
        { icon: 'fa-shield-halved', color: 'text-emerald-500', title: 'Data Resilient', desc: 'Sistem Error Boundary yang cerdas untuk menangani limitasi API secara elegan.' },
        { icon: 'fa-database', color: 'text-amber-500', title: 'Triple Pillar', desc: 'Klasifikasi data terpadu untuk ekosistem Anime, Manga, dan Light Novel.' }
      ]" :key="index" class="p-10 bg-dark-surface border border-dark-border rounded-[3rem] hover:border-brand-primary/40 transition-all group relative overflow-hidden">
        <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
           <i :class="['fa-solid', feature.icon]" class="text-8xl"></i>
        </div>
        
        <div :class="['w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform', feature.color]">
           <i :class="['fa-solid', feature.icon]" class="text-xl"></i>
        </div>
        
        <h3 class="text-xl font-black mb-4 tracking-tight font-outfit text-text-main uppercase">{{ feature.title }}</h3>
        <p class="text-text-muted leading-relaxed font-medium text-sm opacity-60">{{ feature.desc }}</p>
      </div>
    </section>

    <section class="max-w-5xl mx-auto px-6">
      <div class="bg-dark-surface border border-dark-border rounded-[4rem] p-10 md:p-20 relative overflow-hidden group">
        <div class="absolute -right-20 -top-20 w-80 h-80 bg-brand-primary/5 blur-[120px] rounded-full group-hover:bg-brand-primary/10 transition-colors"></div>
        
        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div class="w-20 h-20 bg-brand-primary rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl shadow-brand-primary/30 -rotate-6 group-hover:rotate-0 transition-transform duration-500">
               <i class="fa-solid fa-code text-white text-3xl"></i>
            </div>
            <h2 class="text-4xl font-black text-text-main mb-6 tracking-tight font-outfit uppercase italic">Deep Core Logic</h2>
            <p class="text-text-muted leading-relaxed font-medium mb-10 opacity-70">
              Dikembangkan oleh <b>Malangan Dev</b> dengan filosofi <i>Clean Architecture</i>. Proyek ini mencicipi berbagai teknologi modern untuk menghadirkan standar baru dalam web komunitas anime di Indonesia.
            </p>
            
            <div class="flex flex-wrap gap-4">
              <a :href="APP_CONFIG.SOCIAL?.github || '#'" target="_blank" class="px-10 py-4 bg-white text-black font-black rounded-2xl hover:bg-brand-primary hover:text-white transition-all active:scale-95 text-[10px] uppercase tracking-[0.2em] shadow-xl">
                Open Source
              </a>
              <RouterLink to="/contact" class="px-10 py-4 bg-dark-bg border border-dark-border text-text-main font-black rounded-2xl hover:border-brand-primary transition-all active:scale-95 text-[10px] uppercase tracking-[0.2em]">
                Protocol Contact
              </RouterLink>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div v-for="tech in ['Vue 3', 'Vite', 'Tailwind', 'Jikan API']" :key="tech" class="p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-center text-center">
              <span class="text-[9px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">{{ tech }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="text-center mt-32 relative z-10">
      <p class="text-[9px] font-black uppercase tracking-[0.6em] text-text-muted opacity-30 mb-10">Operational Subsystems</p>
      <div class="flex flex-wrap justify-center gap-12 opacity-40 hover:opacity-100 transition-opacity duration-700">
        <i class="fa-brands fa-vuejs text-4xl hover:text-brand-primary transition-colors" title="Vue.js Framework"></i>
        <i class="fa-solid fa-bolt text-4xl hover:text-amber-500 transition-colors" title="Vite Build Tool"></i>
        <i class="fa-solid fa-database text-4xl hover:text-emerald-500 transition-colors" title="Jikan API Engine"></i>
        <i class="fa-brands fa-github text-4xl hover:text-white transition-colors" title="GitHub Repository"></i>
      </div>
    </div>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.text-glow { text-shadow: 0 0 40px rgba(59, 130, 246, 0.4); }

.animate-fade-in {
  animation: fadeIn 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>