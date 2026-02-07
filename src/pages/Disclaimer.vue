<script setup>
import { onMounted, computed } from 'vue'
import { useUserStore } from '@/store/userStore.js'

const userStore = useUserStore()
const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <main class="min-h-screen bg-dark-bg text-text-main pb-32 pt-28 relative overflow-hidden font-outfit">
    <div :style="{ backgroundColor: primaryColor }" class="absolute top-0 left-0 w-[600px] h-[600px] opacity-[0.03] blur-[150px] rounded-full pointer-events-none transition-all duration-1000"></div>

    <div class="max-w-4xl mx-auto px-6 relative z-10">
      
      <header class="mb-24 animate-reveal">
        <div class="flex items-center gap-4 mb-8">
          <div :style="{ backgroundColor: primaryColor }" class="w-10 h-1 rounded-full shadow-lg"></div>
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Community Guidelines</span>
        </div>
        <h1 class="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] italic">
          Dis<span :style="{ color: primaryColor }">claimer.</span>
        </h1>
        <p class="mt-10 text-text-muted font-medium text-lg leading-relaxed opacity-60 max-w-2xl">
          Pernyataan batas tanggung jawab dan kebijakan penggunaan konten di dalam platform komunitas WibuPedia.
        </p>
      </header>

      <div class="space-y-10 animate-reveal-slow">
        
        <section class="p-10 md:p-12 bg-dark-surface border border-white/5 rounded-[3.5rem] shadow-2xl group transition-all duration-500 relative overflow-hidden">
          <div class="absolute -right-10 -top-10 w-40 h-40 opacity-[0.03] rounded-full blur-3xl" :style="{ backgroundColor: primaryColor }"></div>
          
          <h2 class="text-2xl font-black mb-8 uppercase tracking-tighter italic flex items-center gap-5">
            <div :style="{ color: primaryColor, backgroundColor: primaryColor + '10' }" class="w-12 h-12 rounded-2xl flex items-center justify-center border border-current shadow-inner">
              <i class="fa-solid fa-database text-lg"></i>
            </div>
            Data Source
          </h2>
          <p class="text-text-muted leading-relaxed font-medium opacity-70 text-base">
            WibuPedia adalah platform katalog independen yang menyajikan data dari <a href="https://jikan.moe/" target="_blank" class="font-bold hover:underline" :style="{ color: primaryColor }">Jikan API</a> (MyAnimeList). Kami tidak memiliki kendali atas akurasi, kelengkapan, atau ketersediaan data dari sumber tersebut. Seluruh informasi disediakan untuk tujuan referensi komunitas tanpa jaminan mutlak.
          </p>
        </section>

        <section class="p-10 md:p-12 bg-dark-surface border border-white/5 rounded-[3.5rem] shadow-2xl">
          <h2 class="text-2xl font-black mb-10 uppercase tracking-tighter italic">Member Responsibility</h2>
          <div class="grid grid-cols-1 gap-6">
            <div v-for="(text, index) in [
              'Konten dapat berubah sewaktu-waktu tanpa pemberitahuan, mengikuti pembaruan otomatis dari database MyAnimeList.',
              'WibuPedia tidak bertanggung jawab atas hilangnya data koleksi personal (Local Storage) akibat pembersihan browser atau kerusakan perangkat.',
              'Penggunaan fitur ekspor/impor data sepenuhnya merupakan tanggung jawab pengguna untuk cadangan informasi pribadi.'
            ]" :key="index" class="flex gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-white/10 transition-all">
              <div :style="{ color: primaryColor }" class="text-xs font-black opacity-40 group-hover:opacity-100 tabular-nums">0{{ index + 1 }}</div>
              <p class="text-sm text-text-muted font-medium leading-relaxed opacity-80">{{ text }}</p>
            </div>
          </div>
        </section>

        <section class="p-10 md:p-12 bg-dark-surface border border-white/5 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
          <div class="absolute inset-0 opacity-0 group-hover:opacity-[0.02] transition-opacity" :style="{ backgroundColor: primaryColor }"></div>
          <h2 class="text-2xl font-black mb-8 uppercase tracking-tighter italic flex items-center gap-5" :style="{ color: primaryColor }">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center border border-current shadow-inner" :style="{ backgroundColor: primaryColor + '10' }">
              <i class="fa-solid fa-copyright text-lg"></i>
            </div>
            Copyright
          </h2>
          <p class="text-text-muted leading-relaxed font-medium opacity-70">
            Semua gambar, poster, dan judul yang ditampilkan adalah milik dari masing-masing pemegang hak cipta, studio produksi, dan kreator aslinya. WibuPedia hanya berfungsi sebagai alat manajemen koleksi personal dan media informasi tanpa tujuan komersialisasi langsung atas aset-aset tersebut.
          </p>
        </section>

        <section class="px-8 py-4 border-l-4 rounded-r-2xl bg-white/[0.02]" :style="{ borderColor: primaryColor }">
          <p class="text-xs text-text-muted font-bold opacity-40 uppercase tracking-widest leading-loose">
            Last Updated: 07 February 2026 • Dengan menggunakan layanan ini, Anda setuju dengan ketentuan yang berlaku.
          </p>
        </section>

      </div>

      <footer class="mt-28 text-center animate-reveal">
        <RouterLink to="/" class="inline-flex items-center gap-4 px-14 py-6 bg-white text-black font-black rounded-3xl text-[11px] uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-2xl group">
          <i class="fa-solid fa-check text-[10px] group-hover:scale-125 transition-transform"></i> 
          I Understand, Return Home
        </RouterLink>
      </footer>

    </div>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }

.animate-reveal {
  animation: reveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.animate-reveal-slow {
  animation: reveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes reveal {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

section { transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
section:hover { transform: translateY(-6px); }

/* Chrome/Safari Hide scrollbar */
::-webkit-scrollbar {
  display: none;
}
</style>