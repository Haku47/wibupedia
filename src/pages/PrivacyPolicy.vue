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
  <main class="min-h-screen pb-32 pt-28 relative overflow-hidden font-outfit bg-dark-bg text-text-main">
    <div :style="{ backgroundColor: primaryColor }" class="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.03] blur-[150px] rounded-full pointer-events-none transition-all duration-1000"></div>

    <div class="max-w-4xl mx-auto px-6 relative z-10">
      
      <header class="mb-24 animate-reveal">
        <div class="flex items-center gap-4 mb-8">
          <div :style="{ backgroundColor: primaryColor }" class="w-10 h-1 rounded-full shadow-lg"></div>
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Data Transparency</span>
        </div>
        <h1 class="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] ">
          Privacy<br/><span :style="{ color: primaryColor }">Policy.</span>
        </h1>
        <p class="mt-10 text-text-muted font-medium text-lg leading-relaxed opacity-60 max-w-2xl">
          Komitmen WibuPedia dalam menjaga data Anda tetap aman dan personal. Kami mengutamakan transparansi penuh tentang bagaimana data dikelola di dalam ekosistem komunitas kami.
        </p>
        <div class="mt-10 inline-flex items-center gap-3 px-5 py-2 bg-white/5 border border-white/10 rounded-2xl shadow-sm">
           <i class="fa-solid fa-clock-rotate-left text-[10px] opacity-40"></i>
           <span class="text-[9px] font-black uppercase tracking-widest text-white/40">Last Updated: 07 February 2026</span>
        </div>
      </header>

      <div class="space-y-10 animate-reveal-slow">
        
        <section class="p-10 md:p-14 bg-dark-surface border border-white/5 rounded-[3.5rem] shadow-2xl group transition-all duration-500 relative overflow-hidden">
          <div class="absolute -right-10 -top-10 w-40 h-40 opacity-[0.03] rounded-full blur-3xl" :style="{ backgroundColor: primaryColor }"></div>
          
          <div class="flex flex-col md:flex-row gap-12">
            <div :style="{ color: primaryColor, backgroundColor: primaryColor + '10' }" 
                 class="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-current shadow-inner transition-transform group-hover:scale-110">
              <i class="fa-solid fa-database text-2xl"></i>
            </div>
            <div>
              <h2 class="text-3xl font-black mb-6 uppercase tracking-tighter ">Personal Collection</h2>
              <p class="text-text-muted leading-relaxed font-medium mb-10 opacity-70 text-base">
                Seluruh data koleksi yang Anda simpan di kategori <b>Anime, Manga, dan Novel</b> dikelola menggunakan teknologi <i>Browser LocalStorage</i>. Kami tidak menyimpan data Anda di server kami sendiri.
              </p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="p-8 bg-black/20 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
                  <div class="flex items-center gap-3 mb-4" :style="{ color: primaryColor }">
                    <i class="fa-solid fa-microchip text-xs"></i>
                    <span class="text-[10px] font-black uppercase tracking-widest">Local Storage</span>
                  </div>
                  <p class="text-xs text-text-muted leading-relaxed opacity-60">Data tersimpan 100% di perangkat Anda, bukan di cloud pihak ketiga.</p>
                </div>
                <div class="p-8 bg-black/20 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
                   <div class="flex items-center gap-3 mb-4 text-emerald-500">
                    <i class="fa-solid fa-shield-halved text-xs"></i>
                    <span class="text-[10px] font-black uppercase tracking-widest">Zero Tracking</span>
                  </div>
                  <p class="text-xs text-text-muted leading-relaxed opacity-60">Kami tidak melacak aktivitas browsing personal Anda untuk kepentingan iklan.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="p-10 md:p-14 bg-dark-surface border border-white/5 rounded-[3.5rem] shadow-2xl group transition-all duration-500 relative overflow-hidden">
          <div class="flex flex-col md:flex-row gap-12">
            <div class="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-500/20 shadow-inner group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-server text-2xl"></i>
            </div>
            <div>
              <h2 class="text-3xl font-black mb-6 uppercase tracking-tighter  text-emerald-500">Service Performance</h2>
              <p class="text-text-muted leading-relaxed font-medium mb-8 opacity-70">
                Kami menggunakan data teknis anonim untuk memastikan pengalaman eksplorasi Anda tetap lancar dan responsif:
              </p>
              <div class="space-y-6">
                <div class="flex items-start gap-5">
                  <div class="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-lg"></div>
                  <div>
                    <h4 class="text-sm font-black text-white uppercase tracking-widest mb-1">Latency Optimization</h4>
                    <p class="text-xs text-text-muted leading-relaxed opacity-60">Memantau kecepatan akses Jikan API agar hasil pencarian tampil seketika.</p>
                  </div>
                </div>
                <div class="flex items-start gap-5">
                  <div class="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-lg"></div>
                  <div>
                    <h4 class="text-sm font-black text-white uppercase tracking-widest mb-1">Theme Preferences</h4>
                    <p class="text-xs text-text-muted leading-relaxed opacity-60">Menyimpan warna aksen dan tata letak pilihan Anda secara lokal.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="p-10 md:p-14 bg-dark-surface border border-white/5 rounded-[3.5rem] shadow-2xl group transition-all duration-500 relative overflow-hidden">
          <div class="flex flex-col md:flex-row gap-12">
            <div class="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center shrink-0 border border-amber-500/20 shadow-inner group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-link text-2xl"></i>
            </div>
            <div>
              <h2 class="text-3xl font-black mb-6 uppercase tracking-tighter  text-amber-500">Third-Party Archive</h2>
              <p class="text-text-muted leading-relaxed font-medium opacity-70 text-base mb-8">
                WibuPedia menggunakan infrastruktur <b>Jikan API</b> (Un-official MyAnimeList API) untuk menyajikan data katalog terlengkap.
              </p>
              <div class="p-8 bg-amber-500/5 border border-amber-500/10 rounded-[2rem]">
                 <p class="text-xs text-amber-200/50 leading-relaxed font-medium">
                  Informasi Penting: Saat mencari data, alamat IP Anda mungkin terdeteksi oleh sistem MyAnimeList/Jikan untuk kebutuhan pembatasan frekuensi akses (Rate Limiting). Kami menyarankan Anda untuk meninjau Kebijakan Privasi MyAnimeList secara berkala.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section class="px-10 py-20 bg-white/[0.02] border-2 border-dashed border-white/10 rounded-[4rem] text-center relative overflow-hidden group">
          <div class="absolute inset-0 opacity-0 group-hover:opacity-[0.02] transition-opacity" :style="{ backgroundColor: primaryColor }"></div>
          <h2 class="text-4xl font-black mb-6 uppercase tracking-tighter ">Total User Control</h2>
          <p class="text-text-muted font-medium mb-12 max-w-2xl mx-auto opacity-60 text-base leading-relaxed">
            Anda adalah pemilik tunggal atas data koleksi Anda. WibuPedia menyediakan fitur penghapusan data secara instan melalui menu Pengaturan.
          </p>
          <div class="flex flex-wrap justify-center gap-6">
            <RouterLink to="/settings" class="px-10 py-5 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
              Go to Settings
            </RouterLink>
            <RouterLink to="/about" class="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
              Learn More
            </RouterLink>
          </div>
        </section>

      </div>

      <footer class="mt-32 pt-16 border-t border-white/5 text-center">
        <p class="text-xs text-text-muted opacity-30 font-bold leading-loose tracking-[0.2em] uppercase">
          Safe & Transparent • Built with Passion in Malang, Indonesia
        </p>
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

section { transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
section:hover { transform: translateY(-8px); }

/* Chrome/Safari Hide scrollbar */
::-webkit-scrollbar {
  display: none;
}
</style>