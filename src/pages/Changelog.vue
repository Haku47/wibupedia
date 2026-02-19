<script setup>
import { onMounted, computed } from 'vue'
import { useUserStore } from '@/store/userStore.js'

const userStore = useUserStore()
const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')

const updates = [
  {
    version: 'v2.0.7',
    date: '07 Feb 2026',
    status: 'Latest',
    title: 'Notification System Overhaul',
    description: 'Implementasi sistem notifikasi komunitas yang cerdas dan fungsional.',
    changes: [
      'Interactive Alerts: Notifikasi kini dapat diklik untuk navigasi langsung ke detail konten.',
      'Category Intelligence: Label otomatis (New Airing, Hot Movie, New ONA) pada setiap intel.',
      'Compact Console: Redesign panel notifikasi agar lebih ramping dan efisien ruang.',
      'Clean Architecture: Optimasi state management untuk sinkronisasi status baca (read/unread).'
    ],
    isMajor: false
  },
  {
    version: 'v2.0.5',
    date: '07 Feb 2026',
    status: 'Legacy',
    title: 'The Big Refactor (CE)',
    description: 'Perombakan total arsitektur data dan standarisasi visual Community Edition.',
    changes: [
      'Universal Archive: Implementasi sistem 5 pilar (TV, Movie, Manga, Novel, Donghua).',
      'Branding Alignment: Standarisasi logo "W" dan tipografi tegak lurus sesuai protokol komunitas.',
      'Elite Component Switcher: Redesign sistem kartu adaptif (MovieCard, NovelCard, DonghuaCard).',
      'Advanced Search: Implementasi console pencarian lintas kategori dengan sistem real-time matching.'
    ],
    isMajor: true
  },
  {
    version: 'v2.0.0',
    date: '07 Feb 2026',
    status: 'Legacy',
    title: 'The Community Hub Release',
    description: 'Transformasi masif infrastruktur visual dan fungsional menjadi standar industri modern.',
    changes: [
      'Cinematic Hero: Implementasi HD Gallery Carousel dengan sistem Ken Burns effect.',
      'Bento Architecture: Reorganisasi layout informasi detail dengan grid yang lebih presisi.',
      'HD Asset Engine: Optimasi filter gambar untuk memastikan kualitas High-Definition di seluruh UI.'
    ],
    isMajor: true
  },
  {
    version: 'v1.5.0',
    date: '04 Feb 2026',
    status: 'Legacy',
    title: 'Data Management',
    description: 'Penyempurnaan fitur ekspor koleksi dan sistem penyimpanan lokal.',
    changes: [
      'Archive Tools: Fitur Backup/Restore koleksi via file JSON.',
      'Search Overhaul: Implementasi filter pencarian multi-kategori.',
      'Core Logic: Peningkatan stabilitas state management Pinia.'
    ]
  },
  {
    version: 'v1.0.0',
    date: '01 Feb 2026',
    status: 'Legacy',
    title: 'Initial Architecture',
    description: 'Inisialisasi core sistem WibuPedia menggunakan infrastruktur Jikan API v4.',
    changes: [
      'Foundation: Setup Vue 3 + Tailwind CSS + Pinia.',
      'API Core: Integrasi penuh dengan database MyAnimeList.',
      'Collection Alpha: Fitur dasar pustaka anime dan manga.'
    ],
    isMajor: true
  }
]

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <main class="min-h-screen bg-dark-bg text-text-main pb-40 pt-28 relative overflow-hidden font-outfit">
    <div :style="{ backgroundColor: primaryColor }" class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-[0.03] blur-[150px] rounded-full pointer-events-none"></div>

    <div class="max-w-4xl mx-auto px-6 relative z-10">
      
      <header class="mb-32 animate-reveal">
        <div class="flex items-center gap-5 mb-10">
          <div :style="{ backgroundColor: primaryColor }" class="w-12 h-1.5 rounded-full shadow-2xl"></div>
          <span class="text-[10px] font-black uppercase tracking-[0.6em] text-white/30">System Evolution</span>
        </div>
        <h1 class="text-7xl md:text-7xl font-black tracking-tighter uppercase leading-[0.8] text-white">
          Version<br/><span :style="{ color: primaryColor }">History.</span>
        </h1>
        <p class="mt-12 text-text-muted font-medium text-lg md:text-xl opacity-50 max-w-2xl leading-relaxed ">
          Dokumentasi teknis perkembangan platform WibuPedia dari inisialisasi hingga <span class="text-white font-black">Stable Release v2.0.7</span>.
        </p>
      </header>

      <div class="relative">
        <div class="absolute left-0 md:left-10 top-0 bottom-0 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent"></div>

        <div class="space-y-32">
          <section v-for="(update, index) in updates" :key="update.version" 
                   class="relative pl-12 md:pl-32 animate-reveal-item group/section"
                   :style="{ animationDelay: `${index * 0.15}s` }">
            
            <div class="absolute left-[-4px] md:left-[36px] top-4 w-2 h-2 rounded-full border-4 border-dark-bg transition-all duration-700"
                 :style="update.status === 'Latest' ? { backgroundColor: primaryColor, boxShadow: `0 0 30px ${primaryColor}`, transform: 'scale(1.8)' } : { backgroundColor: 'rgba(255,255,255,0.1)' }"></div>

            <div class="flex flex-col md:flex-row md:items-center gap-6 mb-12">
              <span class="text-5xl font-black tracking-tighter tabular-nums leading-none text-white transition-transform group-hover/section:-translate-x-2">
                {{ update.version }}
              </span>
              <div class="flex flex-wrap gap-3">
                <span class="px-5 py-2 bg-white/[0.03] border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/30">
                  {{ update.date }}
                </span>
                <span v-if="update.status === 'Latest'" 
                      :style="{ backgroundColor: primaryColor }"
                      class="px-5 py-2 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl animate-pulse">
                  {{ update.status }}
                </span>
              </div>
            </div>

            <div class="p-10 md:p-14 bg-dark-surface/50 border border-white/5 rounded-[4rem] backdrop-blur-3xl shadow-2xl transition-all duration-700 relative overflow-hidden group-hover/section:border-white/10 group-hover/section:translate-y-[-10px]">
              <div class="absolute -right-20 -top-20 w-80 h-80 opacity-[0.02] blur-[100px] rounded-full transition-all group-hover/section:opacity-[0.05]" :style="{ backgroundColor: primaryColor }"></div>

              <div class="flex items-center gap-6 mb-10 relative z-10">
                <h2 class="text-3xl font-black uppercase tracking-tighter text-white group-hover/section:text-brand-primary transition-colors">
                  {{ update.title }}
                </h2>
                <div v-if="update.isMajor" class="w-10 h-[1px] bg-white/10"></div>
                <i v-if="update.isMajor" class="fa-solid fa-crown text-amber-500 text-xs drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]"></i>
              </div>

              <p class="text-text-muted leading-relaxed font-medium mb-16 opacity-60 text-base md:text-lg relative z-10">
                {{ update.description }}
              </p>

              <div class="space-y-8 relative z-10">
                <div v-for="change in update.changes" :key="change" class="flex gap-6 group/item">
                  <div class="mt-2.5 w-1.5 h-1.5 rounded-full bg-white/10 shrink-0 transition-all group-hover/item:scale-150 group-hover/item:bg-white"></div>
                  <p class="text-sm md:text-base text-text-muted font-bold opacity-30 leading-snug group-hover/item:opacity-100 group-hover/item:text-white transition-all">{{ change }}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer class="mt-40 text-center animate-reveal">
        <button @click="$router.push('/')" class="group relative px-20 py-7 bg-white text-black rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.5em] shadow-2xl hover:scale-105 active:scale-95 transition-all">
          <span class="relative z-10 flex items-center justify-center gap-6">
            <i class="fa-solid fa-chevron-left text-[10px] group-hover:-translate-x-2 transition-transform"></i> 
            Return to Home
          </span>
        </button>
      </footer>

    </div>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.animate-reveal { animation: revealUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
.animate-reveal-item { opacity: 0; animation: revealUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
@keyframes revealUp {
  from { opacity: 0; transform: translateY(60px); filter: blur(15px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}
::-webkit-scrollbar { display: none; }
</style>