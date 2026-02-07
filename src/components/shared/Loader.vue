<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/store/userStore.js'

const userStore = useUserStore()
const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')

defineProps({
  message: {
    type: String,
    default: 'DISCOVERING CONTENT...'
  },
  fullScreen: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div 
    :class="[
      'flex flex-col items-center justify-center gap-10 transition-all duration-700 font-outfit',
      fullScreen ? 'fixed inset-0 bg-dark-bg/98 backdrop-blur-2xl z-[300]' : 'py-32 w-full'
    ]"
  >
    <div class="relative flex items-center justify-center h-28 w-28">
      <div class="absolute inset-0 border-[3px] border-white/5 rounded-full"></div>
      
      <div class="absolute inset-0 border-[3px] border-transparent border-t-current rounded-full animate-spin-smooth"
           :style="{ color: primaryColor }"></div>
      
      <div class="h-12 w-12 rounded-[1.2rem] flex items-center justify-center border transition-all duration-700 animate-pulse-soft"
           :style="{ backgroundColor: primaryColor + '15', borderColor: primaryColor + '30' }">
         <div class="h-3 w-3 rounded-full shadow-lg animate-ping"
              :style="{ backgroundColor: primaryColor }"></div>
      </div>
    </div>

    <div class="flex flex-col items-center gap-6">
      <div class="flex items-center gap-4">
         <div class="w-8 h-px opacity-20" :style="{ backgroundColor: primaryColor }"></div>
         <p class="font-black tracking-[0.6em] uppercase text-[10px] text-white/40">
            {{ message }}
         </p>
         <div class="w-8 h-px opacity-20" :style="{ backgroundColor: primaryColor }"></div>
      </div>
      
      <div class="flex gap-3 h-1.5 items-center">
        <span class="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.3s]" :style="{ backgroundColor: primaryColor }"></span>
        <span class="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.15s]" :style="{ backgroundColor: primaryColor }"></span>
        <span class="w-1.5 h-1.5 rounded-full animate-bounce" :style="{ backgroundColor: primaryColor }"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }

/* 🚀 PERFORMANCE OPTIMIZED ANIMATIONS */

.animate-spin-smooth {
  animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  will-change: transform;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-pulse-soft {
  animation: pulse-soft 3s ease-in-out infinite;
}

@keyframes pulse-soft {
  0%, 100% { opacity: 0.5; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.1); }
}

/* Optimize Hardware Acceleration */
.animate-spin-smooth, .animate-pulse-soft, .animate-bounce, .animate-ping {
  will-change: transform, opacity;
  backface-visibility: hidden;
}
</style>