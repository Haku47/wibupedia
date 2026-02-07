<script setup>
import { computed } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { APP_CONFIG } from '@/core/constants/APP_CONFIG'
import { useUserStore } from '@/store/userStore.js'

const userStore = useUserStore()
const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW()

const close = () => {
  offlineReady.value = false
  needRefresh.value = false
}
</script>

<template>
  <Transition name="slide-up">
    <div v-if="offlineReady || needRefresh" 
         class="fixed bottom-6 left-6 right-6 md:left-auto md:right-10 md:w-[400px] z-[9999] bg-dark-surface/90 backdrop-blur-3xl border border-white/10 p-10 rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden group font-outfit">
      
      <div :style="{ backgroundColor: primaryColor }" class="absolute -right-20 -top-20 w-48 h-48 opacity-[0.08] blur-[80px] rounded-full group-hover:opacity-[0.12] transition-all"></div>

      <div class="relative z-10">
        <div class="flex items-center gap-6 mb-8">
          <div :style="{ backgroundColor: primaryColor + '15', color: primaryColor, borderColor: primaryColor + '20' }"
               class="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg">
            <i class="fa-solid fa-cloud-arrow-down text-xl animate-bounce"></i>
          </div>
          <div>
            <h4 class="text-base font-black text-white uppercase tracking-tighter italic leading-none">
              {{ needRefresh ? 'New Update Ready' : 'Ready Offline' }}
            </h4>
            <p class="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] mt-2 opacity-40">
              Community Build v{{ APP_CONFIG.VERSION }}
            </p>
          </div>
        </div>

        <p class="text-[13px] text-text-muted font-medium mb-10 leading-relaxed opacity-60">
          {{ needRefresh 
            ? 'Fitur dan pembaruan terbaru sudah tersedia. Segarkan aplikasi sekarang untuk mendapatkan pengalaman terbaik.' 
            : 'Aplikasi sudah tersimpan di memori browser. WibuPedia kini dapat kamu akses meskipun tanpa koneksi internet.' 
          }}
        </p>

        <div class="flex gap-4">
          <button v-if="needRefresh" 
                  @click="updateServiceWorker()"
                  class="flex-1 py-5 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
            Update Now
          </button>
          <button @click="close"
                  class="flex-1 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all">
            Later
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }

/* 🚀 SMOOTH TRANSITIONS */
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(60px) scale(0.95);
  filter: blur(20px);
}

/* Chrome/Safari Hide scrollbar */
::-webkit-scrollbar {
  display: none;
}
</style>