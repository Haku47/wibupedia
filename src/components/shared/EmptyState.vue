<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/store/userStore.js'

const userStore = useUserStore()
const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')

defineProps({
  title: {
    type: String,
    default: 'Nothing Here'
  },
  description: {
    type: String,
    default: 'Belum ada konten yang ditemukan di halaman ini.'
  },
  icon: {
    type: String,
    default: 'fa-solid fa-leaf'
  },
  actionLabel: {
    type: String,
    default: ''
  },
  actionPath: {
    type: String,
    default: '/'
  }
})
</script>

<template>
  <div class="empty-state-root flex flex-col items-center justify-center py-28 px-6 text-center animate-reveal relative font-outfit">
    
    <div class="relative mb-14 group">
      <div :style="{ backgroundColor: primaryColor }" class="absolute inset-0 opacity-[0.08] blur-[70px] rounded-full group-hover:opacity-[0.15] transition-all duration-1000 animate-pulse"></div>
      
      <div class="relative w-32 h-32 bg-dark-surface border border-white/5 rounded-[3rem] flex items-center justify-center shadow-2xl group-hover:border-white/10 transition-all duration-700">
        <i :class="icon" class="text-4xl text-white/20 group-hover:text-white transition-all duration-700 floating-icon" :style="{ '--icon-color': primaryColor }"></i>
        
        <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-scan-down"></div>
      </div>

      <div class="absolute -bottom-1 -right-1 w-10 h-10 bg-dark-bg border border-white/5 rounded-2xl flex items-center justify-center shadow-2xl">
        <div class="w-2.5 h-2.5 rounded-full animate-pulse" :style="{ backgroundColor: primaryColor }"></div>
      </div>
    </div>

    <h3 class="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter uppercase italic">
      {{ title }}
    </h3>
    <p class="text-text-muted max-w-sm mx-auto leading-relaxed mb-14 font-medium opacity-50 text-base">
      {{ description }}
    </p>

    <RouterLink 
      v-if="actionLabel" 
      :to="actionPath"
      class="group/btn relative px-14 py-6 bg-white text-black font-black text-[11px] uppercase tracking-[0.4em] rounded-3xl transition-all shadow-2xl hover:scale-105 active:scale-95 overflow-hidden"
    >
      <div class="relative z-10 flex items-center gap-5 group-hover/btn:text-white transition-colors duration-500">
        {{ actionLabel }}
        <i class="fa-solid fa-arrow-right transition-transform group-hover/btn:translate-x-2"></i>
      </div>
      <div class="absolute inset-0 translate-x-[-101%] group-hover/btn:translate-x-0 transition-transform duration-500 ease-out" :style="{ backgroundColor: primaryColor }"></div>
    </RouterLink>

  </div>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }

/* 🚀 ANIMATION ENGINE */

.floating-icon {
  animation: zen-float 6s ease-in-out infinite;
}

@keyframes zen-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(10deg); color: var(--icon-color); opacity: 0.8; }
}

.animate-scan-down {
  animation: scan-down 3s linear infinite;
}

@keyframes scan-down {
  0% { transform: translateY(0); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(128px); opacity: 0; }
}

.animate-reveal {
  animation: revealUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes revealUp {
  from { opacity: 0; transform: scale(0.9) translateY(40px); filter: blur(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
}
</style>