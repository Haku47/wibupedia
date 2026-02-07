<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  title: {
    type: String,
    default: 'Data Halted'
  },
  description: {
    type: String,
    default: 'Protokol enkripsi tidak menemukan arsip data di koordinat ini.'
  },
  icon: {
    type: String,
    default: 'fa-solid fa-folder-open'
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
  <div class="empty-state-container flex flex-col items-center justify-center py-24 px-6 text-center animate-reveal relative overflow-hidden">
    
    <div class="relative mb-12 group">
      <div class="absolute inset-0 bg-brand-primary/10 blur-[60px] rounded-full group-hover:bg-brand-primary/20 transition-all duration-700 animate-pulse"></div>
      
      <div class="relative w-28 h-28 bg-dark-surface border border-white/5 rounded-[2.5rem] flex items-center justify-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] group-hover:border-brand-primary/30 transition-all duration-500 overflow-hidden">
        <i :class="icon" class="text-4xl text-text-muted group-hover:text-brand-primary transition-colors duration-500 floating-icon"></i>
        
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/5 to-transparent h-full w-full -translate-y-full group-hover:translate-y-full transition-transform duration-[2s] ease-in-out pointer-events-none"></div>
      </div>

      <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-dark-bg border border-white/10 rounded-xl flex items-center justify-center shadow-lg">
        <div class="w-2 h-2 bg-brand-primary rounded-full animate-ping"></div>
      </div>
    </div>

    <h3 class="text-3xl md:text-4xl font-black text-text-main mb-4 tracking-tighter font-outfit uppercase italic">
      {{ title }}
    </h3>
    <p class="text-text-muted max-w-sm mx-auto leading-relaxed mb-12 font-medium opacity-60 text-sm md:text-base italic">
      {{ description }}
    </p>

    <RouterLink 
      v-if="actionLabel" 
      :to="actionPath"
      class="action-btn relative overflow-hidden group/btn px-12 py-5 bg-white text-black font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl transition-all shadow-2xl active:scale-95"
    >
      <div class="relative z-10 flex items-center gap-4 group-hover/btn:text-white transition-colors duration-300">
        {{ actionLabel }}
        <i class="fa-solid fa-arrow-right-long transition-transform group-hover/btn:translate-x-2"></i>
      </div>
      <div class="absolute inset-0 bg-brand-primary translate-x-[-101%] group-hover/btn:translate-x-0 transition-transform duration-500 ease-out"></div>
    </RouterLink>
  </div>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }

.floating-icon {
  animation: floating 5s ease-in-out infinite;
}

@keyframes floating {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
  50% { transform: translateY(-12px) rotate(5deg); opacity: 1; }
}

.animate-reveal {
  animation: reveal 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes reveal {
  from { opacity: 0; transform: scale(0.95) translateY(40px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.action-btn:hover {
  box-shadow: 0 20px 40px -10px rgba(59, 130, 246, 0.5);
}
</style>