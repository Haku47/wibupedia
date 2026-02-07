<script setup>
import { onMounted } from 'vue'

const updates = [
  {
    version: 'v1.9.9',
    date: '07 Februari 2026',
    status: 'Latest',
    title: 'The Persona Dossier',
    description: 'Finalisasi Intelligence Suite dengan analisis psikografis dan optimasi performa Ghost Frame.',
    changes: [
      'Intelligence Summary: Halaman rapor persona wibu (/report) berbasis metadata genre.',
      'Performance 1.9.9.x: Optimasi LCP ekstrem dan hardware acceleration.',
      'Core Refactoring: Implementasi lazy-loading komponen kartu.',
      'Oracle Eye: Sinkronisasi database 1.4M+ pada sistem pencarian instan.'
    ],
    isMajor: true
  },
  {
    version: 'v1.9.4',
    date: '07 Februari 2026',
    status: 'Stable',
    title: 'Black Box & Security',
    description: 'Implementasi logging otomatis dan aktivasi protokol keamanan konten (SFW).',
    changes: [
      'Automatic Logging: Pencatatan riwayat ADD/REMOVE/EXPORT secara real-time.',
      'Safe Protocol: Pemblokiran genre NSFW dan rating Rx secara global.',
      'Radar Intelligence: Radar musiman (IntelAlert) berdasarkan DNA library.'
    ],
    isMajor: true
  },
  {
    version: 'v1.8.4',
    date: '06 Februari 2026',
    status: 'Legacy',
    title: 'Bio-Metric & Identity',
    description: 'Manajemen aset personal dan sinkronisasi identitas visual.',
    changes: [
      'Avatar Engine: Integrasi upload foto lokal (Base64) dan URL eksternal.',
      'Dynamic Accent: Sinkronisasi warna primer sistem di seluruh modul.',
      'Identity Matrix: Pembaruan UI Settings untuk kontrol identitas.'
    ]
  },
  {
    version: 'v1.8.0',
    date: '06 Februari 2026',
    status: 'Legacy',
    title: 'Cinematic Evolution',
    description: 'Lompatan besar pada estetika antarmuka dengan Hero Carousel 2.0.',
    changes: [
      'Hero Carousel 2.0: Parallax Layering dan Backdrop Cinematic.',
      'Bento Matrix: Layout dashboard dengan radius ekstrim (rounded-4rem).',
      'FA6 Migration: Penggunaan sistem ikon Font Awesome v6 secara penuh.'
    ],
    isMajor: true
  },
  {
    version: 'v1.5.0',
    date: '04 Februari 2026',
    status: 'Legacy',
    title: 'Data Protocol',
    description: 'Penyempurnaan arsitektur penyimpanan lokal dan ekspor data.',
    changes: [
      'Export/Import Engine: Protokol backup JSON untuk migrasi library.',
      'Search Hub: Perombakan filter pencarian lanjutan (genre, status, rating).',
      'Pagination Logic: Perbaikan sinkronisasi load-more pada search hasil Jikan.'
    ]
  },
  {
    version: 'v1.0.0',
    date: '01 Februari 2026',
    status: 'Legacy',
    title: 'Initial Alpha Release',
    description: 'Inisialisasi core sistem WibuPedia dengan infrastruktur Jikan API v4.',
    changes: [
      'Core Architecture: Setup Vue 3 + Pinia + Tailwind CSS.',
      'Jikan Integration: Koneksi awal ke database MyAnimeList.',
      'Basic Vault: Fitur tambah/hapus library sederhana.'
    ],
    isMajor: true
  }
]

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <main class="min-h-screen bg-dark-bg text-text-main pb-32 pt-28 relative overflow-hidden selection:bg-brand-primary/30">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-brand-primary/5 blur-[180px] rounded-full pointer-events-none transition-colors duration-1000"></div>

    <div class="max-w-4xl mx-auto px-6 relative z-10">
      
      <header class="mb-24 animate-reveal text-center md:text-left">
        <div class="flex items-center justify-center md:justify-start gap-4 mb-8">
          <div class="w-12 h-1.5 bg-brand-primary rounded-full shadow-neon"></div>
          <span class="text-[10px] font-black uppercase tracking-[0.5em] text-brand-primary italic">System Chronology</span>
        </div>
        <h1 class="text-6xl md:text-9xl font-black tracking-tighter font-outfit uppercase leading-[0.8] italic text-white">
          Change<br/><span class="text-brand-primary transition-colors duration-500">log.</span>
        </h1>
        <p class="mt-12 text-text-muted font-medium text-lg md:text-xl opacity-50 max-w-2xl leading-relaxed italic">
          Arsip evolusi infrastruktur WibuPedia dari inisialisasi hingga <span class="text-text-main font-black underline decoration-brand-primary decoration-4">v1.9.9-Latest</span>.
        </p>
      </header>

      <div class="relative mb-40">
        <div class="absolute left-0 md:left-10 top-0 bottom-0 w-[1px] bg-gradient-to-b from-brand-primary/40 via-white/5 to-transparent"></div>

        <div class="space-y-24">
          <section v-for="(update, index) in updates" :key="update.version" 
                   class="relative pl-10 md:pl-28 animate-reveal-item"
                   :style="{ animationDelay: `${index * 0.1}s` }">
            
            <div class="absolute left-[-5px] md:left-[35px] top-3 w-3 h-3 rounded-full border-4 border-dark-bg transition-all duration-700"
                 :style="update.status === 'Latest' ? { backgroundColor: 'var(--color-brand-primary)', boxShadow: '0 0 20px var(--color-brand-primary)' } : { backgroundColor: 'rgba(255,255,255,0.1)' }"
                 :class="{ 'scale-150': update.status === 'Latest' }"></div>

            <div class="flex flex-col md:flex-row md:items-center gap-5 mb-8">
              <span class="text-4xl font-black font-outfit tracking-tighter italic tabular-nums leading-none text-white">{{ update.version }}</span>
              <div class="flex flex-wrap gap-3">
                <span class="px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-text-muted italic">
                  {{ update.date }}
                </span>
                <span v-if="update.status === 'Latest'" class="px-4 py-1.5 bg-brand-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-neon animate-pulse">
                  {{ update.status }}
                </span>
              </div>
            </div>

            <div class="p-10 md:p-12 bg-dark-surface/40 border border-white/5 rounded-[3.5rem] shadow-2xl group hover:border-brand-primary/30 transition-all duration-700 backdrop-blur-xl relative overflow-hidden">
               <div class="absolute -right-20 -top-20 w-64 h-64 bg-brand-primary/5 blur-[80px] rounded-full group-hover:bg-brand-primary/10 transition-colors"></div>

              <div class="flex items-center gap-4 mb-6 relative z-10">
                <h2 class="text-2xl md:text-3xl font-black font-outfit uppercase tracking-tighter italic group-hover:text-brand-primary transition-colors duration-500 text-white">
                  {{ update.title }}
                </h2>
                <i v-if="update.isMajor" class="fa-solid fa-bolt-lightning text-brand-primary text-sm animate-bounce shadow-neon"></i>
              </div>

              <p class="text-text-muted leading-relaxed font-medium mb-10 opacity-60 text-base md:text-lg italic relative z-10">
                {{ update.description }}
              </p>

              <div class="space-y-5 relative z-10">
                <div v-for="change in update.changes" :key="change" class="flex gap-5 group/item">
                  <div class="mt-2 w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0 shadow-neon opacity-40 group-hover/item:opacity-100 transition-opacity"></div>
                  <p class="text-sm md:text-base text-text-muted font-bold opacity-50 leading-snug group-hover/item:opacity-100 transition-opacity italic">{{ change }}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer class="mt-32 text-center animate-reveal">
        <RouterLink to="/" class="inline-flex items-center gap-4 px-14 py-6 bg-white text-black font-black rounded-[2.5rem] text-[11px] uppercase tracking-[0.4em] hover:bg-brand-primary hover:text-white transition-all active:scale-95 shadow-2xl group italic">
          <i class="fa-solid fa-chevron-left group-hover:-translate-x-2 transition-transform"></i> Archives Complete
        </RouterLink>
      </footer>

    </div>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.shadow-neon { box-shadow: 0 0 15px var(--color-brand-primary); }

.animate-reveal { animation: revealUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
.animate-reveal-item { opacity: 0; animation: revealUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }

@keyframes revealUp {
  from { opacity: 0; transform: translateY(40px); filter: blur(10px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

section { transition: transform 0.6s ease; }
section:hover { transform: translateX(10px); }
</style>