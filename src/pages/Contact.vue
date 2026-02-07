<script setup>
import { ref } from 'vue'
import { APP_CONFIG } from '@/core/constants/APP_CONFIG'

const form = ref({
  name: '',
  email: '',
  subject: 'Feedback',
  message: ''
})

const isSending = ref(false)
const isSuccess = ref(false)

const handleSubmit = () => {
  isSending.value = true
  // Simulasi transmisi data ke Vault Server
  setTimeout(() => {
    isSending.value = false
    isSuccess.value = true
    // Reset form data
    form.value = { name: '', email: '', subject: 'Feedback', message: '' }
    
    // Auto-dismiss success state
    setTimeout(() => {
      isSuccess.value = false
    }, 5000)
  }, 1800)
}
</script>

<template>
  <main class="min-h-screen pb-32 pt-16 relative overflow-hidden">
    <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/5 blur-[180px] rounded-full pointer-events-none"></div>

    <header class="max-w-6xl mx-auto px-6 mb-20 relative z-10 animate-reveal">
      <div class="flex items-center gap-4 mb-6">
        <div class="w-12 h-1.5 bg-brand-primary rounded-full"></div>
        <span class="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary">Terminal Komunikasi</span>
      </div>
      <h1 class="text-6xl md:text-8xl font-black text-text-main tracking-tighter mb-8 font-outfit uppercase italic leading-none">
        Get In <span class="text-brand-primary text-glow">Touch.</span>
      </h1>
      <p class="text-text-muted font-medium text-lg max-w-2xl opacity-70 leading-relaxed">
        Butuh bantuan teknis, laporan bug, atau ingin kolaborasi? Kirimkan transmisi pesan Anda langsung ke pusat operasi <span class="text-brand-primary font-bold">WibuPedia</span>.
      </p>
    </header>

    <section class="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
      
      <div class="lg:col-span-4 space-y-6">
        <div class="p-10 bg-dark-surface border border-dark-border rounded-[3rem] relative overflow-hidden group">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl group-hover:bg-brand-primary/10 transition-colors"></div>
          <h3 class="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted mb-8 opacity-40">Direct Channels</h3>
          
          <div class="space-y-4">
            <a v-for="(url, platform) in APP_CONFIG.SOCIAL" :key="platform" :href="url" target="_blank" 
               class="flex items-center justify-between p-5 bg-dark-bg border border-dark-border rounded-[1.5rem] group/item hover:border-brand-primary transition-all active:scale-[0.97]">
              <div class="flex items-center gap-5">
                <div class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-text-muted group-hover/item:text-brand-primary group-hover/item:bg-brand-primary/10 transition-all">
                  <i :class="`fa-brands fa-${platform.toLowerCase()}`" class="text-xl"></i>
                </div>
                <span class="font-black text-xs text-text-main capitalize tracking-widest">{{ platform }}</span>
              </div>
              <i class="fa-solid fa-chevron-right text-[10px] opacity-20 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all"></i>
            </a>
          </div>
        </div>

        <div class="p-10 bg-brand-primary rounded-[3rem] text-white shadow-2xl shadow-brand-primary/30 relative overflow-hidden group">
          <i class="fa-solid fa-location-dot absolute -right-4 -bottom-4 text-9xl opacity-10 group-hover:scale-110 transition-transform duration-700"></i>
          <h3 class="font-black text-2xl mb-3 font-outfit uppercase italic">Malangan Dev</h3>
          <p class="text-white/80 text-sm font-medium leading-relaxed opacity-90">
            Pusat operasi kami berbasis di Malang, Jawa Timur. Fokus pada pengembangan ekosistem digital yang tajam dan efisien.
          </p>
        </div>
      </div>

      <div class="lg:col-span-8">
        <div class="p-10 md:p-16 bg-dark-surface border border-dark-border rounded-[4rem] relative overflow-hidden shadow-2xl">
          
          <Transition name="fade">
            <div v-if="isSuccess" class="absolute inset-0 bg-dark-surface/95 backdrop-blur-xl z-30 flex flex-col items-center justify-center text-center p-12">
              <div class="relative mb-10">
                <div class="absolute inset-0 bg-green-500/20 blur-[40px] rounded-full animate-pulse"></div>
                <div class="relative w-24 h-24 bg-green-500 text-white rounded-[2.5rem] flex items-center justify-center text-4xl shadow-2xl rotate-6">
                  <i class="fa-solid fa-paper-plane-pulse"></i>
                </div>
              </div>
              <h2 class="text-4xl font-black text-text-main mb-4 font-outfit uppercase italic tracking-tighter">Transmisi Berhasil.</h2>
              <p class="text-text-muted font-medium max-w-sm mx-auto leading-relaxed">Pesan Anda telah dienkripsi dan dikirim ke pusat operasi. Kami akan segera merespons melalui email.</p>
              <button @click="isSuccess = false" class="mt-10 px-10 py-4 border border-brand-primary/30 text-brand-primary font-black rounded-2xl uppercase text-[10px] tracking-[0.3em] hover:bg-brand-primary hover:text-white transition-all active:scale-95">
                Kirim Baru
              </button>
            </div>
          </Transition>

          <form @submit.prevent="handleSubmit" class="space-y-8 relative z-10">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-3">
                <label class="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-4 opacity-50">Identitas</label>
                <input v-model="form.name" type="text" required placeholder="Nama Lengkap"
                       class="w-full bg-dark-bg border border-dark-border rounded-[1.5rem] px-8 py-5 text-text-main focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all font-bold placeholder:text-white/10">
              </div>
              <div class="space-y-3">
                <label class="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-4 opacity-50">Email Balasan</label>
                <input v-model="form.email" type="email" required placeholder="email@vault.com"
                       class="w-full bg-dark-bg border border-dark-border rounded-[1.5rem] px-8 py-5 text-text-main focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all font-bold placeholder:text-white/10">
              </div>
            </div>

            <div class="space-y-3">
              <label class="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-4 opacity-50">Subjek Protokol</label>
              <div class="relative">
                <select v-model="form.subject" class="w-full bg-dark-bg border border-dark-border rounded-[1.5rem] px-8 py-5 text-text-main focus:outline-none focus:border-brand-primary transition-all font-bold appearance-none cursor-pointer">
                  <option value="Feedback">Feedback Aplikasi</option>
                  <option value="Bug">Laporan Bug / Teknis</option>
                  <option value="Partnership">Kerjasama / Partnership</option>
                  <option value="Other">Lainnya</option>
                </select>
                <i class="fa-solid fa-chevron-down absolute right-8 top-1/2 -translate-y-1/2 text-[10px] pointer-events-none opacity-30"></i>
              </div>
            </div>

            <div class="space-y-3">
              <label class="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-4 opacity-50">Isi Transmisi</label>
              <textarea v-model="form.message" rows="5" required placeholder="Jelaskan secara detail..."
                        class="w-full bg-dark-bg border border-dark-border rounded-[2.5rem] px-8 py-6 text-text-main focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all font-bold resize-none placeholder:text-white/10 leading-relaxed"></textarea>
            </div>

            <button type="submit" :disabled="isSending"
                    class="group w-full py-6 bg-brand-primary text-white font-black rounded-[2rem] shadow-2xl shadow-brand-primary/30 hover:bg-brand-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-wait relative overflow-hidden">
              <div v-if="!isSending" class="flex items-center gap-4 relative z-10">
                <i class="fa-solid fa-paper-plane text-sm group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                <span class="uppercase tracking-[0.3em] text-[11px]">Kirim Transmisi</span>
              </div>
              <div v-else class="flex items-center gap-4 relative z-10">
                <div class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span class="uppercase tracking-[0.3em] text-[11px]">Memproses...</span>
              </div>
            </button>
          </form>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.text-glow { text-shadow: 0 0 40px rgba(59, 130, 246, 0.4); }

.animate-reveal {
  animation: revealUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes revealUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-enter-active, .fade-leave-active { transition: all 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; filter: blur(10px); }

/* Custom Select Styling */
select {
  background-image: none;
}
</style>