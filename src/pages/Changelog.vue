<script setup>
import { onMounted, computed } from 'vue'
import { useUserStore } from '@/store/userStore.js'

const userStore = useUserStore()
const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')

const updates = [
  {
    version: 'v2.2.0',
    date: '07 Feb 2026',
    status: 'Latest',
    title: 'Community Edition Release',
    description: 'Transformasi total antarmuka menjadi lebih ramah komunitas dan profesional.',
    changes: [
      'UI/UX Overhaul: Redesign seluruh halaman dengan tema Community yang hangat.',
      'Standardized Icons: Penggunaan Font Awesome v6 secara konsisten di seluruh modul.',
      'Auth Sync: Integrasi login/logout real-time dengan status Member baru.',
      'Refined Typography: Pembersihan italic berlebihan untuk legibilitas maksimal.'
    ],
    isMajor: true
  },
  {
    version: 'v1.9.9',
    date: '07 Feb 2026',
    status: 'Stable',
    title: 'Taste Profile Engine',
    description: 'Finalisasi fitur analitik selera pengguna berbasis metadata genre.',
    changes: [
      'Member Persona: Halaman laporan selera (/report) yang lebih personal.',
      'Speed Boost: Optimasi performa render untuk daftar koleksi yang panjang.',
      'Smart Suggestions: Perbaikan logika pencarian instan pada Navbar.'
    ],
    isMajor: true
  },
  {
    version: 'v1.8.4',
    date: '06 Feb 2026',
    status: 'Legacy',
    title: 'Personal Identity',
    description: 'Pembaruan sistem profil dan sinkronisasi warna tema.',
    changes: [
      'Profile Management: Fitur ganti foto profil via upload lokal atau URL.',
      'Color Palette: Penambahan pilihan warna aksen primer di menu Settings.',
      'Responsive Navbar: Optimalisasi tampilan menu pada perangkat mobile.'
    ]
  },
  {
    version: 'v1.5.0',
    date: '04 Feb 2026',
    status: 'Legacy',
    title: 'Data Management',
    description: 'Penyempurnaan fitur ekspor data dan filter pencarian.',
    changes: [
      'Export/Import: Fitur backup koleksi ke file JSON untuk migrasi data.',
      'Search Filters: Penambahan filter genre, rating, dan status rilis.',
      'Local Storage: Penguatan sistem penyimpanan data koleksi di browser.'
    ]
  },
  {
    version: 'v1.0.0',
    date: '01 Feb 2026',
    status: 'Legacy',
    title: 'Initial Alpha Release',
    description: 'Inisialisasi core sistem WibuPedia dengan infrastruktur Jikan API.',
    changes: [
      'Core Architecture: Setup Vue 3 + Pinia + Tailwind CSS.',
      'MAL Integration: Koneksi awal ke database melalui Jikan API v4.',
      'Collection Alpha: Fitur dasar tambah dan hapus judul ke Library.'
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
      
      <header class="mb-28 animate-reveal text-center md:text-left">
        <div class="flex items-center justify-center md:justify-start gap-4 mb-8">
          <div :style="{ backgroundColor: primaryColor }" class="w-10 h-1 rounded-full shadow-lg"></div>
          <span class="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Journey History</span>
        </div>
        <h1 class="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] italic text-white">
          Update<br/><span :style="{ color: primaryColor }">Logs.</span>
        </h1>
        <p class="mt-12 text-text-muted font-medium text-lg md:text-xl opacity-60 max-w-2xl leading-relaxed">
          Catatan perjalanan pengembangan WibuPedia dari inisialisasi hingga <span class="text-white font-black underline decoration-brand-primary decoration-4">v2.2.0-Latest</span>.
        </p>
      </header>

      <div class="relative mb-40">
        <div class="absolute left-0 md:left-10 top-0 bottom-0 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent"></div>

        <div class="space-y-32">
          <section v-for="(update, index) in updates" :key="update.version" 
                   class="relative pl-12 md:pl-32 animate-reveal-item"
                   :style="{ animationDelay: `${index * 0.1}s` }">
            
            <div class="absolute left-[-4px] md:left-[36px] top-3 w-2 h-2 rounded-full border-4 border-dark-bg transition-all duration-700"
                 :style="update.status === 'Latest' ? { backgroundColor: primaryColor, boxShadow: `0 0 20px ${primaryColor}` } : { backgroundColor: 'rgba(255,255,255,0.1)' }"
                 :class="{ 'scale-150': update.status === 'Latest' }"></div>

            <div class="flex flex-col md:flex-row md:items-center gap-6 mb-10">
              <span class="text-5xl font-black tracking-tighter italic tabular-nums leading-none text-white">{{ update.version }}</span>
              <div class="flex flex-wrap gap-3">
                <span class="px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40">
                  {{ update.date }}
                </span>
                <span v-if="update.status === 'Latest'" class="px-4 py-1.5 bg-brand-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg animate-pulse">
                  {{ update.status }}
                </span>
              </div>
            </div>

            <div class="p-10 md:p-14 bg-dark-surface border border-white/5 rounded-[3.5rem] shadow-2xl group transition-all duration-700 relative overflow-hidden">
              <div class="absolute -right-20 -top-20 w-64 h-64 opacity-[0.03] blur-[80px] rounded-full group-hover:opacity-[0.06] transition-all" :style="{ backgroundColor: primaryColor }"></div>

              <div class="flex items-center gap-5 mb-8 relative z-10">
                <h2 class="text-3xl font-black uppercase tracking-tighter italic text-white group-hover:text-brand-primary transition-colors">
                  {{ update.title }}
                </h2>
                <i v-if="update.isMajor" class="fa-solid fa-star text-amber-500 text-xs shadow-lg"></i>
              </div>

              <p class="text-text-muted leading-relaxed font-medium mb-12 opacity-80 text-base md:text-lg relative z-10">
                {{ update.description }}
              </p>

              <div class="space-y-6 relative z-10">
                <div v-for="change in update.changes" :key="change" class="flex gap-6 group/item">
                  <div class="mt-2.5 w-1.5 h-1.5 rounded-full bg-white/10 shrink-0 group-hover/item:bg-brand-primary transition-colors"></div>
                  <p class="text-sm md:text-base text-text-muted font-bold opacity-50 leading-snug group-hover/item:opacity-100 transition-opacity">{{ change }}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer class="mt-32 text-center animate-reveal">
        <RouterLink to="/" class="inline-flex items-center gap-5 px-16 py-6 bg-white text-black font-black rounded-3xl text-[11px] uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-2xl group">
          <i class="fa-solid fa-arrow-left text-[10px] group-hover:-translate-x-2 transition-transform"></i> Return Home
        </RouterLink>
      </footer>

    </div>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }

.animate-reveal { animation: revealUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
.animate-reveal-item { opacity: 0; animation: revealUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }

@keyframes revealUp {
  from { opacity: 0; transform: translateY(40px); filter: blur(10px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

section { transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
section:hover { transform: translateX(12px); }

::-webkit-scrollbar { display: none; }
</style>