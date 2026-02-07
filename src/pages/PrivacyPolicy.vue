<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <main class="min-h-screen pb-32 pt-28 relative overflow-hidden">
    <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/5 blur-[180px] rounded-full pointer-events-none"></div>

    <div class="max-w-4xl mx-auto px-6 relative z-10">
      
      <header class="mb-24 animate-reveal">
        <div class="flex items-center gap-4 mb-8">
          <div class="w-12 h-1.5 bg-brand-primary rounded-full"></div>
          <span class="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary">Security Protocol v1.8</span>
        </div>
        <h1 class="text-6xl md:text-8xl font-black tracking-tighter font-outfit uppercase leading-[0.85] italic">
          Privacy<br/><span class="text-brand-primary">Policy.</span>
        </h1>
        <p class="mt-10 text-text-muted font-medium text-lg leading-relaxed opacity-70 max-w-2xl">
          Komitmen WibuPedia dalam menjaga kedaulatan data digital Anda. Kami mengutamakan transparansi penuh dalam setiap transmisi data di ekosistem katalog kami.
        </p>
        <div class="mt-8 inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
           <span class="text-[9px] font-black uppercase tracking-widest text-text-muted opacity-50 italic">Last Revision: 06 February 2026</span>
        </div>
      </header>

      <div class="space-y-12 animate-reveal-slow">
        
        <section class="p-10 md:p-14 bg-dark-surface border border-dark-border rounded-[3.5rem] shadow-2xl group hover:border-brand-primary/30 transition-all duration-500 relative overflow-hidden">
          <div class="absolute -right-10 -top-10 w-40 h-40 bg-brand-primary/5 rounded-full blur-3xl"></div>
          
          <div class="flex flex-col md:flex-row gap-10">
            <div class="w-16 h-16 bg-brand-primary/10 rounded-[1.5rem] flex items-center justify-center shrink-0 border border-brand-primary/20 shadow-inner">
              <i class="fa-solid fa-vault text-brand-primary text-2xl"></i>
            </div>
            <div>
              <h2 class="text-3xl font-black mb-6 font-outfit uppercase tracking-tighter italic">Kedaulatan Data Vault</h2>
              <p class="text-text-muted leading-relaxed font-medium mb-8 opacity-80 text-base">
                Seluruh data koleksi yang Anda simpan di pilar <b>Anime, Manga, dan Novel</b> dikelola menggunakan arsitektur <i>Browser LocalStorage</i>. Kami memegang teguh prinsip <b>Zero-Server Storage</b>.
              </p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="p-6 bg-dark-bg/60 rounded-[2rem] border border-white/5 group-hover:border-brand-primary/20 transition-colors">
                  <div class="flex items-center gap-3 mb-3 text-brand-primary">
                    <i class="fa-solid fa-microchip text-[10px]"></i>
                    <span class="text-[9px] font-black uppercase tracking-widest">Client-Side Only</span>
                  </div>
                  <p class="text-[11px] text-text-muted leading-relaxed font-medium">Data tersimpan 100% secara lokal di perangkat yang Anda gunakan saat ini.</p>
                </div>
                <div class="p-6 bg-dark-bg/60 rounded-[2rem] border border-white/5 group-hover:border-brand-primary/20 transition-colors">
                   <div class="flex items-center gap-3 mb-3 text-brand-primary">
                    <i class="fa-solid fa-cloud-slash text-[10px]"></i>
                    <span class="text-[9px] font-black uppercase tracking-widest">No Cloud Sync</span>
                  </div>
                  <p class="text-[11px] text-text-muted leading-relaxed font-medium">Tanpa sinkronisasi otomatis ke server pihak ketiga demi menjaga privasi.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="p-10 md:p-14 bg-dark-surface border border-dark-border rounded-[3.5rem] group hover:border-emerald-500/30 transition-all duration-500">
          <div class="flex flex-col md:flex-row gap-10">
            <div class="w-16 h-16 bg-emerald-500/10 rounded-[1.5rem] flex items-center justify-center shrink-0 border border-emerald-500/20">
              <i class="fa-solid fa-satellite-dish text-emerald-500 text-2xl"></i>
            </div>
            <div>
              <h2 class="text-3xl font-black mb-6 font-outfit uppercase tracking-tighter italic text-emerald-500">Log Transmisi</h2>
              <p class="text-text-muted leading-relaxed font-medium mb-8 opacity-80">
                Kami mengumpulkan data non-identifikasi teknis untuk mengoptimalkan performa mesin pencari <b>Triple Pillar</b>:
              </p>
              <ul class="space-y-6">
                <li class="flex items-start gap-5">
                  <div class="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                  <div>
                    <h4 class="text-sm font-black text-text-main uppercase tracking-widest mb-1">Optimasi Latensi</h4>
                    <p class="text-xs text-text-muted leading-relaxed">Memantau kecepatan respons database Jikan API untuk memberikan hasil instan.</p>
                  </div>
                </li>
                <li class="flex items-start gap-5">
                  <div class="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                  <div>
                    <h4 class="text-sm font-black text-text-main uppercase tracking-widest mb-1">Persistence Preferences</h4>
                    <p class="text-xs text-text-muted leading-relaxed">Menyimpan konfigurasi UI (Theme, Accent Color) agar pengalaman tetap personal.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section class="p-10 md:p-14 bg-dark-surface border border-dark-border rounded-[3.5rem] group hover:border-amber-500/30 transition-all duration-500">
          <div class="flex flex-col md:flex-row gap-10">
            <div class="w-16 h-16 bg-amber-500/10 rounded-[1.5rem] flex items-center justify-center shrink-0 border border-amber-500/20">
              <i class="fa-solid fa-network-wired text-amber-500 text-2xl"></i>
            </div>
            <div>
              <h2 class="text-3xl font-black mb-6 font-outfit uppercase tracking-tighter italic text-amber-500">Protokol Pihak Ketiga</h2>
              <p class="text-text-muted leading-relaxed font-medium opacity-80 text-sm md:text-base mb-6">
                WibuPedia memanfaatkan infrastruktur <b>Jikan API</b> (Un-official MyAnimeList API). 
              </p>
              <div class="p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl italic">
                 <p class="text-xs text-amber-200/60 leading-relaxed font-medium">
                  Note: Saat mengakses data, alamat IP Anda mungkin terdeteksi oleh sistem Rate Limiting server Jikan/MAL untuk mencegah serangan DDoS. Kami menyarankan peninjauan berkala pada kebijakan privasi MyAnimeList.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section class="px-10 py-16 bg-white/5 border-2 border-dashed border-dark-border rounded-[4rem] text-center relative overflow-hidden group">
          <div class="absolute inset-0 bg-brand-primary opacity-0 group-hover:opacity-[0.02] transition-opacity"></div>
          <h2 class="text-2xl font-black mb-6 font-outfit uppercase tracking-[0.2em] italic">Hak Kendali Mutlak</h2>
          <p class="text-text-muted font-medium mb-10 max-w-2xl mx-auto opacity-70 text-sm leading-relaxed">
            Anda adalah pemegang kunci utama Vault Anda. Di WibuPedia, kami menyediakan fitur pembersihan total dalam satu klik melalui fungsi <b>"Purge Data"</b>.
          </p>
          <div class="flex flex-wrap justify-center gap-6">
            <RouterLink to="/library" class="px-10 py-4 bg-dark-surface border border-dark-border text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all">Manage Library</RouterLink>
            <RouterLink to="/contact" class="px-10 py-4 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-brand-primary/20 hover:scale-105 transition-all">Security Inquiry</RouterLink>
          </div>
        </section>

      </div>

      <footer class="mt-32 pt-16 border-t border-dark-border/30 text-center">
        <p class="text-xs text-text-muted italic opacity-30 font-medium leading-loose tracking-widest uppercase">
          Kepercayaan Anda adalah prioritas operasional kami. <br/> Built with Integrity in Malang Operations.
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

section { transition: transform 0.5s ease; }
section:hover { transform: translateY(-5px); }
</style>