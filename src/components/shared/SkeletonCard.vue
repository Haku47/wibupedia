<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/store/userStore.js'

const userStore = useUserStore()
const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')
</script>

<template>
  <div class="skeleton-card flex flex-col h-full bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden animate-reveal relative">
    
    <div class="relative aspect-[3/4.4] overflow-hidden bg-white/[0.03]">
      <div class="skeleton-shimmer absolute inset-0"></div>
      
      <div class="absolute inset-0 flex items-center justify-center opacity-5">
        <i class="fa-solid fa-image text-4xl"></i>
      </div>
    </div>

    <div class="p-6 flex flex-col flex-grow gap-6">
      <div class="space-y-3">
        <div class="relative h-4 bg-white/[0.04] rounded-full overflow-hidden w-full">
          <div class="skeleton-shimmer absolute inset-0"></div>
        </div>
        <div class="relative h-3 bg-white/[0.04] rounded-full overflow-hidden w-2/3 opacity-50">
          <div class="skeleton-shimmer absolute inset-0"></div>
        </div>
      </div>
      
      <div class="mt-auto pt-6 flex items-center justify-between border-t border-white/5">
        <div class="relative h-2 bg-white/[0.04] rounded-full overflow-hidden w-16 opacity-30">
          <div class="skeleton-shimmer absolute inset-0"></div>
        </div>
        <div class="relative h-2 bg-white/[0.04] rounded-full overflow-hidden w-10 opacity-20">
          <div class="skeleton-shimmer absolute inset-0"></div>
        </div>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 right-0 h-0.5 opacity-20 overflow-hidden">
      <div class="h-full w-1/3 animate-scan" :style="{ backgroundColor: primaryColor }"></div>
    </div>
  </div>
</template>

<style scoped>
/* 🚀 SMOOTH LOADING ANIMATIONS */

/* 1. Reveal Transition */
.animate-reveal {
  animation: revealUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes revealUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 2. Zen Shimmer Effect */
.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.03) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite linear;
}

@keyframes shimmer {
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
}

/* 3. Decorative Scan Bar */
@keyframes scan {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(300%); }
}
.animate-scan {
  animation: scan 2.5s cubic-bezier(0.45, 0, 0.55, 1) infinite;
}
</style>