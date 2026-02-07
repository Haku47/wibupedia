<script setup>
defineProps({
  message: {
    type: String,
    default: 'ACCESSING ARCHIVE...'
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
      'flex flex-col items-center justify-center gap-6 transition-opacity duration-500',
      fullScreen ? 'fixed inset-0 bg-dark-bg/95 backdrop-blur-xl z-[300]' : 'py-24 w-full'
    ]"
  >
    <div class="relative flex items-center justify-center h-24 w-24">
      <div class="absolute inset-0 border-[3px] border-white/5 rounded-full"></div>
      
      <div class="absolute inset-0 border-[3px] border-t-brand-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      
      <div class="h-10 w-10 bg-brand-primary/10 rounded-2xl flex items-center justify-center border border-brand-primary/20 animate-pulse rotate-45">
         <div class="h-4 w-4 bg-brand-primary rounded-lg shadow-neon"></div>
      </div>
    </div>

    <div class="flex flex-col items-center gap-3">
      <div class="flex items-center gap-3">
         <span class="w-8 h-px bg-brand-primary/20"></span>
         <p class="text-brand-primary font-black tracking-[0.4em] uppercase text-[10px] italic">
           {{ message }}
         </p>
         <span class="w-8 h-px bg-brand-primary/20"></span>
      </div>
      
      <div class="flex gap-2 h-1 items-center">
        <span class="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span class="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span class="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shadow-neon { box-shadow: 0 0 15px var(--color-brand-primary); }

/* Optimize render with hardware acceleration */
.animate-spin, .animate-pulse, .animate-bounce {
  will-change: transform, opacity;
  backface-visibility: hidden;
}
</style>