<script setup>
import { computed } from 'vue'
import { APP_CONFIG } from '@/core/constants/APP_CONFIG'
import { useUserStore } from '@/store/userStore.js'

const userStore = useUserStore()
const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')

defineProps({
  isLoading: Boolean
})
</script>

<template>
  <Transition name="zen-fade">
    <div v-if="isLoading" class="fixed inset-0 z-[999] bg-dark-bg flex flex-col items-center justify-center overflow-hidden font-outfit">
      
      <div class="absolute inset-0 z-0">
        <div :style="{ backgroundColor: primaryColor }" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03] blur-[180px] rounded-full"></div>
        <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light pointer-events-none"></div>
      </div>
      
      <div class="relative z-10 flex flex-col items-center">
        <div class="relative w-40 h-40 flex items-center justify-center mb-16">
          <div v-for="n in 3" :key="n" 
               :style="{ borderColor: primaryColor, animationDelay: `${n * 0.4}s` }"
               class="absolute inset-0 border border-current rounded-full animate-ripple opacity-0"></div>
          
          <div :style="{ backgroundColor: primaryColor }" 
               class="w-20 h-20 rounded-[2.5rem] flex items-center justify-center shadow-2xl relative z-10 animate-float-zen">
            <span class="text-4xl font-black text-white italic tracking-tighter">W</span>
            <div class="absolute inset-0 rounded-[2.5rem] shadow-[inset_0_0_20px_rgba(255,255,255,0.3)]"></div>
          </div>
        </div>

        <div class="text-center space-y-4">
          <div class="overflow-hidden">
            <h2 class="text-sm font-black text-white uppercase tracking-[0.8em] animate-slide-up">
              WibuPedia
            </h2>
          </div>
          
          <div class="flex items-center justify-center gap-3">
            <span class="w-1 h-1 rounded-full animate-pulse" :style="{ backgroundColor: primaryColor }"></span>
            <p class="text-[9px] font-bold text-text-muted uppercase tracking-[0.4em] opacity-40">
              Synchronizing Archive
            </p>
            <span class="w-1 h-1 rounded-full animate-pulse delay-150" :style="{ backgroundColor: primaryColor }"></span>
          </div>
        </div>
      </div>

      <div class="absolute bottom-16 flex flex-col items-center gap-4 animate-fade-in-slow">
        <span class="text-[8px] font-black text-white/10 uppercase tracking-[1em] mb-2">
          Powered by WibuPedia Identity Core
        </span>
        <div class="flex items-center gap-6">
          <div class="h-px w-8 bg-white/5"></div>
          <span class="text-[10px] font-bold text-text-muted/30 uppercase tracking-widest">
            WibuPedia v{{ APP_CONFIG.VERSION }}
          </span>
          <div class="h-px w-8 bg-white/5"></div>
        </div>
      </div>

    </div>
  </Transition>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }

/* 🚀 ZEN ANIMATION ENGINE */

/* Ripple Effect: Lingkaran yang memancar keluar */
@keyframes ripple {
  0% { transform: scale(0.5); opacity: 0; }
  50% { opacity: 0.2; }
  100% { transform: scale(1.5); opacity: 0; }
}
.animate-ripple {
  animation: ripple 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
}

/* Floating Zen: Gerakan melayang halus */
@keyframes float-zen {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
}
.animate-float-zen {
  animation: float-zen 4s ease-in-out infinite;
}

/* Slide Up: Munculnya teks dari bawah */
@keyframes slide-up {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-up {
  animation: slide-up 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

/* Slow Fade In */
@keyframes fade-in-slow {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in-slow {
  animation: fade-in-slow 2s ease-out forwards;
}

/* 🎬 ULTRA SMOOTH EXIT */
.zen-fade-leave-active {
  transition: all 0.8s cubic-bezier(0.65, 0, 0.35, 1);
}
.zen-fade-leave-to {
  opacity: 0;
  filter: blur(40px);
  transform: scale(1.15);
}
</style>