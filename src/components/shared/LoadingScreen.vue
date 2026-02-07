<script setup>
import { APP_CONFIG } from '@/core/constants/APP_CONFIG'

defineProps({
  isLoading: Boolean
})
</script>

<template>
  <Transition name="fade-overlay">
    <div v-if="isLoading" class="fixed inset-0 z-[999] bg-dark-bg flex flex-col items-center justify-center overflow-hidden">
      <div class="absolute w-[500px] h-[500px] bg-brand-primary/10 blur-[120px] rounded-full animate-soft-pulse pointer-events-none"></div>
      
      <div class="relative z-10 flex flex-col items-center">
        <div class="mb-8 relative flex items-center justify-center">
          <div class="w-20 h-20 border-[3px] border-brand-primary/10 border-t-brand-primary rounded-[2.5rem] animate-spin-tactical"></div>
          <div class="absolute flex items-center justify-center">
            <span class="text-3xl font-black text-white font-outfit italic tracking-tighter">W</span>
          </div>
        </div>

        <div class="text-center">
          <h2 class="text-[10px] font-black text-white uppercase tracking-[0.6em] mb-4 animate-opacity-pulse italic">
            Initializing Vault
          </h2>
          
          <div class="w-56 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
            <div class="absolute inset-0 bg-brand-primary animate-scanning-bar shadow-neon"></div>
          </div>
          
          <div class="flex flex-col gap-1 mt-6 opacity-30">
            <p class="text-[8px] font-black text-text-muted uppercase tracking-[0.4em]">
              Core v{{ APP_CONFIG.VERSION }} — {{ APP_CONFIG.STATUS || 'SECURE' }}
            </p>
          </div>
        </div>
      </div>

      <div class="absolute bottom-12 flex items-center gap-4">
        <div class="w-1.5 h-1.5 bg-brand-primary rounded-full animate-ping"></div>
        <span class="text-[9px] font-black text-text-muted uppercase tracking-[0.5em] italic opacity-40">
          {{ APP_CONFIG.DEVELOPER || 'Malangan' }} Research Center
        </span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.shadow-neon { box-shadow: 0 0 10px var(--color-brand-primary); }

/* 🚀 PERFORMANCE-FIRST ANIMATIONS (GPU ACCELERATED) */

/* Spin Tactical: Menggunakan ease-in-out yang lebih halus namun ringan */
.animate-spin-tactical {
  animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  will-change: transform;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Scanning Bar: Optimal transform-only animation */
.animate-scanning-bar {
  width: 40%;
  animation: scan 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  will-change: transform;
}

@keyframes scan {
  0% { transform: translateX(-150%); }
  100% { transform: translateX(250%); }
}

/* Soft Pulse for Background */
.animate-soft-pulse {
  animation: softPulse 4s ease-in-out infinite;
  will-change: opacity, transform;
}

@keyframes softPulse {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

/* Opacity Pulse for Text */
.animate-opacity-pulse {
  animation: opacPulse 2s ease-in-out infinite;
  will-change: opacity;
}

@keyframes opacPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Cinematic Exit Transition */
.fade-overlay-leave-active {
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.fade-overlay-leave-to {
  opacity: 0;
  filter: blur(20px);
  transform: scale(1.05);
}
</style>