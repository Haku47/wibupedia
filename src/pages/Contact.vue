<script setup>
import { ref, computed } from 'vue'
import { APP_CONFIG } from '@/core/constants/APP_CONFIG'
import { useUserStore } from '@/store/userStore.js'

const userStore = useUserStore()
const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')

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
  // Simulasi Pengiriman Pesan
  setTimeout(() => {
    isSending.value = false
    isSuccess.value = true
    form.value = { name: '', email: '', subject: 'Feedback', message: '' }
    
    setTimeout(() => {
      isSuccess.value = false
    }, 5000)
  }, 1800)
}
</script>

<template>
  <main class="min-h-screen pb-32 pt-28 relative overflow-hidden font-outfit bg-dark-bg text-text-main">
    <div :style="{ backgroundColor: primaryColor }" class="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.03] blur-[150px] rounded-full pointer-events-none transition-all duration-1000"></div>

    <header class="max-w-6xl mx-auto px-6 mb-20 relative z-10 animate-reveal">
      <div class="flex items-center gap-4 mb-8">
        <div :style="{ backgroundColor: primaryColor }" class="w-10 h-1 rounded-full shadow-lg"></div>
        <span class="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Community Support</span>
      </div>
      <h1 class="text-6xl md:text-8xl font-black tracking-tighter mb-8 uppercase leading-none">
        Get In <span :style="{ color: primaryColor }">Touch.</span>
      </h1>
      <p class="text-text-muted font-medium text-lg max-w-2xl opacity-60 leading-relaxed">
        Punya ide menarik, laporan kendala, atau ingin sekadar menyapa tim pengembang? Kirimkan pesan Anda langsung ke pusat komunitas <span class="text-white font-bold">WibuPedia</span>.
      </p>
    </header>

    <section class="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
      
      <div class="lg:col-span-4 space-y-6">
        <div class="p-10 bg-dark-surface border border-white/5 rounded-[3rem] relative overflow-hidden group shadow-2xl">
          <div class="absolute -right-6 -top-6 w-24 h-24 opacity-[0.05] rounded-full blur-2xl group-hover:opacity-[0.08] transition-opacity" :style="{ backgroundColor: primaryColor }"></div>
          <h3 class="text-[10px] font-black uppercase tracking-widest text-text-muted mb-10 opacity-30">Social Channels</h3>
          
          <div class="space-y-4">
            <a v-for="(url, platform) in APP_CONFIG.SOCIAL" :key="platform" :href="url" target="_blank" 
               class="flex items-center justify-between p-5 bg-black/20 border border-white/5 rounded-2xl group/item hover:border-white/20 transition-all active:scale-[0.98]">
              <div class="flex items-center gap-5">
                <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-text-muted group-hover/item:text-white transition-all shadow-inner"
                     :style="{ '--hover-color': primaryColor }">
                  <i :class="`fa-brands fa-${platform.toLowerCase()}`" class="text-xl"></i>
                </div>
                <span class="font-black text-[11px] text-text-main capitalize tracking-widest">{{ platform }}</span>
              </div>
              <i class="fa-solid fa-arrow-up-right-from-square text-[10px] opacity-10 group-hover/item:opacity-100 transition-all"></i>
            </a>
          </div>
        </div>

        <div class="p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group" :style="{ backgroundColor: primaryColor }">
          <i class="fa-solid fa-heart absolute -right-6 -bottom-6 text-9xl opacity-10 group-hover:scale-110 transition-transform duration-700"></i>
          <h3 class="font-black text-2xl mb-4 uppercase">WibuPedia Team</h3>
          <p class="text-white/80 text-sm font-medium leading-relaxed">
            Berbasis di Malang, Indonesia. Kami berdedikasi membangun ekosistem digital yang modern untuk komunitas anime tanah air.
          </p>
        </div>
      </div>

      <div class="lg:col-span-8">
        <div class="p-10 md:p-16 bg-dark-surface border border-white/5 rounded-[4rem] relative overflow-hidden shadow-2xl">
          
          <Transition name="fade">
            <div v-if="isSuccess" class="absolute inset-0 bg-dark-surface/98 backdrop-blur-2xl z-30 flex flex-col items-center justify-center text-center p-12">
              <div class="relative mb-12">
                <div class="absolute inset-0 opacity-20 blur-[40px] rounded-full animate-pulse" :style="{ backgroundColor: 'rgb(34, 197, 94)' }"></div>
                <div class="relative w-28 h-28 bg-green-500 text-white rounded-[2.5rem] flex items-center justify-center text-5xl shadow-2xl">
                  <i class="fa-solid fa-check"></i>
                </div>
              </div>
              <h2 class="text-5xl font-black text-white mb-6 uppercase tracking-tighter italic">Message Sent.</h2>
              <p class="text-text-muted font-medium max-w-sm mx-auto leading-relaxed opacity-60">Pesan Anda berhasil terkirim. Tim kami akan segera meninjau dan merespons melalui email Anda.</p>
              <button @click="isSuccess = false" class="mt-12 px-12 py-5 border border-white/10 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all shadow-xl">
                Send New Message
              </button>
            </div>
          </Transition>

          <form @submit.prevent="handleSubmit" class="space-y-10 relative z-10">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div class="space-y-3">
                <label class="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1 opacity-50">Full Name</label>
                <input v-model="form.name" type="text" required placeholder="Display Name"
                       class="w-full bg-black/20 border border-white/5 rounded-2xl px-8 py-5 text-white focus:outline-none transition-all font-bold placeholder:text-white/5 shadow-inner"
                       :style="{ focusBorderColor: primaryColor }">
              </div>
              <div class="space-y-3">
                <label class="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1 opacity-50">Email Address</label>
                <input v-model="form.email" type="email" required placeholder="name@example.com"
                       class="w-full bg-black/20 border border-white/5 rounded-2xl px-8 py-5 text-white focus:outline-none transition-all font-bold placeholder:text-white/5 shadow-inner">
              </div>
            </div>

            <div class="space-y-3">
              <label class="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1 opacity-50">Inquiry Subject</label>
              <div class="relative">
                <select v-model="form.subject" class="w-full bg-black/20 border border-white/5 rounded-2xl px-8 py-5 text-white focus:outline-none transition-all font-bold appearance-none cursor-pointer shadow-inner">
                  <option value="Feedback">App Feedback</option>
                  <option value="Bug">Technical Issue / Bug</option>
                  <option value="Partnership">Partnership Inquiry</option>
                  <option value="Other">General Question</option>
                </select>
                <i class="fa-solid fa-chevron-down absolute right-8 top-1/2 -translate-y-1/2 text-[10px] pointer-events-none opacity-20"></i>
              </div>
            </div>

            <div class="space-y-3">
              <label class="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1 opacity-50">Your Message</label>
              <textarea v-model="form.message" rows="6" required placeholder="How can we help you?"
                        class="w-full bg-black/20 border border-white/5 rounded-[2.5rem] px-8 py-6 text-white focus:outline-none transition-all font-bold resize-none placeholder:text-white/5 leading-relaxed shadow-inner"></textarea>
            </div>

            <button type="submit" :disabled="isSending"
                    class="group w-full py-6 text-white font-black rounded-3xl shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-4 disabled:opacity-50"
                    :style="{ backgroundColor: primaryColor }">
              <template v-if="!isSending">
                <i class="fa-solid fa-paper-plane text-xs group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                <span class="uppercase tracking-[0.3em] text-[11px]">Send Message</span>
              </template>
              <template v-else>
                <i class="fa-solid fa-circle-notch animate-spin text-sm"></i>
                <span class="uppercase tracking-[0.3em] text-[11px]">Processing...</span>
              </template>
            </button>
          </form>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }

.animate-reveal {
  animation: revealUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes revealUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-enter-active, .fade-leave-active { transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: scale(0.9); filter: blur(10px); }

select {
  background-image: none;
}

/* Custom Input Focus */
input:focus, select:focus, textarea:focus {
  border-color: v-bind(primaryColor + '40');
  background-color: rgba(255, 255, 255, 0.05);
}
</style>