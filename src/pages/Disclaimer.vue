<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <main class="min-h-screen bg-dark-bg text-text-main pb-32 pt-28">
    <div class="max-w-4xl mx-auto px-6">
      <header class="mb-16 animate-reveal">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-12 h-1.5 bg-brand-primary rounded-full"></div>
          <span class="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary">Legal Documentation</span>
        </div>
        <h1 class="text-5xl md:text-7xl font-black tracking-tighter font-outfit uppercase leading-none">
          Dis<span class="text-brand-primary">claimer.</span>
        </h1>
        <p class="mt-8 text-text-muted font-medium text-lg opacity-60">
          Pernyataan penyangkalan tanggung jawab penggunaan layanan WibuPedia.
        </p>
      </header>

      <div class="space-y-12 animate-reveal-slow">
        
        <section class="p-8 md:p-10 bg-dark-surface border border-dark-border rounded-[2.5rem] shadow-2xl">
          <h2 class="text-xl font-black mb-6 flex items-center gap-4 font-outfit uppercase">
            <i class="fa-solid fa-database text-brand-primary"></i> Sumber Data
          </h2>
          <p class="text-text-muted leading-relaxed font-medium opacity-90">
            WibuPedia adalah platform katalog pihak ketiga yang menggunakan data dari <a href="https://jikan.moe/" target="_blank" class="text-brand-primary hover:underline font-bold">Jikan API</a> (MyAnimeList). Kami tidak memiliki kendali atas akurasi, kelengkapan, atau ketersediaan data yang disediakan oleh sumber tersebut. Segala informasi mengenai anime, manga, dan novel disediakan "apa adanya" tanpa jaminan apa pun.
          </p>
        </section>

        <section class="px-4">
          <h2 class="text-xl font-black mb-6 font-outfit uppercase">Tanggung Jawab Pengguna</h2>
          <div class="space-y-6">
            <div class="flex gap-6">
              <div class="w-10 h-10 shrink-0 bg-white/5 border border-dark-border rounded-xl flex items-center justify-center text-brand-primary">1</div>
              <p class="text-text-muted font-medium leading-relaxed">
                Pengguna memahami bahwa konten yang ditampilkan di platform ini dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya mengikuti pembaruan dari database MyAnimeList.
              </p>
            </div>
            <div class="flex gap-6">
              <div class="w-10 h-10 shrink-0 bg-white/5 border border-dark-border rounded-xl flex items-center justify-center text-brand-primary">2</div>
              <p class="text-text-muted font-medium leading-relaxed">
                WibuPedia tidak bertanggung jawab atas kerugian materiil maupun non-materiil yang timbul akibat kesalahan informasi, gangguan layanan, atau hilangnya data koleksi lokal (localStorage) di perangkat pengguna.
              </p>
            </div>
          </div>
        </section>

        <section class="p-8 md:p-10 bg-brand-primary/5 border border-brand-primary/20 rounded-[2.5rem]">
          <h2 class="text-xl font-black mb-6 flex items-center gap-4 font-outfit uppercase text-brand-primary">
            <i class="fa-solid fa-copyright"></i> Hak Cipta
          </h2>
          <p class="text-text-muted leading-relaxed font-medium">
            Semua gambar, poster, dan judul adalah milik masing-masing pemegang hak cipta dan studio produksi. WibuPedia hanya menampilkan konten tersebut untuk tujuan edukasi, informasi, dan dokumentasi pribadi tanpa tujuan komersial langsung atas aset media tersebut.
          </p>
        </section>

        <section class="px-4 border-l-2 border-dark-border py-2">
          <p class="text-sm text-text-muted italic opacity-50">
            Terakhir diperbarui pada: 06 Februari 2026. Dengan melanjutkan penggunaan platform ini, Anda dianggap telah menyetujui seluruh poin disclaimer di atas.
          </p>
        </section>

      </div>

      <footer class="mt-20 flex justify-center animate-reveal">
        <RouterLink to="/" class="px-12 py-5 bg-dark-surface border border-dark-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-main hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all active:scale-95 shadow-2xl">
          Saya Mengerti, Kembali ke Beranda
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
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>