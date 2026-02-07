<script setup>
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { APP_CONFIG } from '@/core/constants/APP_CONFIG'

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
         class="pwa-toast fixed bottom-6 left-6 right-6 md:left-auto md:right-10 md:w-96 z-[9999] bg-dark-surface/90 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.8)] overflow-hidden group">
      
      <div class="absolute -right-20 -top-20 w-40 h-40 bg-brand-primary/10 blur-[80px] rounded-full group-hover:bg-brand-primary/20 transition-all"></div>

      <div class="relative z-10">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center border border-brand-primary/20">
            <i class="fa-solid fa-cloud-arrow-down text-brand-primary text-xl animate-bounce"></i>
          </div>
          <div>
            <h4 class="text-sm font-black text-white uppercase tracking-tighter font-outfit italic leading-none">
              {{ needRefresh ? 'System Update Available' : 'Vault Ready Offline' }}
            </h4>
            <p class="text-[9px] font-black text-brand-primary uppercase tracking-[0.3em] mt-1 opacity-60">
              Protocol v{{ APP_CONFIG.VERSION }}
            </p>
          </div>
        </div>

        <p class="text-xs text-text-muted font-medium mb-8 leading-relaxed italic opacity-70">
          {{ needRefresh 
            ? 'Inteligensi baru telah dideploy ke cloud. Segarkan sistem untuk sinkronisasi pilar data terbaru.' 
            : 'Aplikasi telah terenkripsi dalam cache lokal. WibuPedia siap diakses tanpa koneksi internet.' 
          }}
        </p>

        <div class="flex gap-3">
          <button v-if="needRefresh" 
                  @click="updateServiceWorker()"
                  class="flex-1 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-primary hover:text-white transition-all active:scale-95 italic shadow-2xl shadow-white/5">
            Sync Now
          </button>
          <button @click="close"
                  class="px-8 py-4 bg-white/5 border border-white/5 text-text-muted rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all italic">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }

.pwa-toast {
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
}

/* Animations */
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(100px) scale(0.9);
  filter: blur(10px);
}
</style>