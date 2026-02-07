<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

defineProps({
  anime: {
    type: Object,
    required: true
  }
})

// --- 🛡️ IMAGE GUARDIAN STATES ---
const isLoaded = ref(false)
const hasError = ref(false)

const handleLoad = () => {
  isLoaded.value = true
}

const handleError = () => {
  hasError.value = true
  isLoaded.value = true // Matikan shimmer tetap tampilkan state error
}
</script>

<template>
  <RouterLink 
    :to="`/anime/${anime.mal_id}`"
    class="group relative flex flex-col bg-dark-surface border border-white/5 rounded-[2rem] overflow-hidden transition-all duration-700 hover:-translate-y-3 hover:border-brand-primary/40 hover:shadow-[0_30px_60px_rgba(0,0,0,0.6),0_0_20px_rgba(59,130,246,0.1)]"
  >
    <div class="relative aspect-[3/4.2] overflow-hidden bg-white/5">
      
      <div v-if="!isLoaded" class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer bg-[length:200%_100%]"></div>

      <div v-if="hasError" class="absolute inset-0 flex flex-col items-center justify-center bg-dark-surface gap-3">
        <i class="fa-solid fa-image-slash text-white/10 text-2xl"></i>
        <span class="text-[8px] font-black uppercase text-white/20 tracking-widest">Archive Corrupted</span>
      </div>

      <img 
        :src="anime.images.jpg.large_image_url" 
        :alt="anime.title"
        loading="lazy"
        @load="handleLoad"
        @error="handleError"
        class="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
        :class="[
          isLoaded && !hasError ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-2xl scale-110',
          'rendering-pixelated' 
        ]"
      />
      
      <div class="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-700"></div>

      <div v-if="anime.score" class="absolute top-4 right-4 px-2.5 py-1.5 bg-dark-bg/80 backdrop-blur-md rounded-xl flex items-center gap-1.5 border border-white/10 shadow-2xl opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 transition-all duration-500">
        <i class="fa-solid fa-star text-brand-primary text-[10px] shadow-neon"></i>
        <span class="text-white text-[11px] font-black tabular-nums">{{ anime.score }}</span>
      </div>

      <div class="absolute bottom-4 left-4 px-3 py-1 bg-brand-primary text-[8px] font-black uppercase tracking-[0.2em] text-white rounded-lg shadow-neon animate-reveal-tag">
        {{ anime.type }}
      </div>
    </div>

    <div class="p-5 flex flex-col flex-grow">
      <h3 class="text-[14px] font-bold text-text-main line-clamp-2 leading-tight group-hover:text-brand-primary transition-colors duration-500 font-outfit uppercase tracking-tight">
        {{ anime.title }}
      </h3>
      
      <div class="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
        <div class="flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse"></div>
          <span class="text-[10px] text-text-muted font-black uppercase tracking-widest opacity-60">
            {{ anime.episodes || '?' }} EPS
          </span>
        </div>
        
        <span class="text-[10px] text-text-muted font-bold tracking-tighter opacity-40 italic">
          {{ anime.year || 'TBA' }}
        </span>
      </div>
    </div>

    <div class="absolute inset-0 border-[1.5px] border-brand-primary rounded-[2rem] opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
  </RouterLink>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.shadow-neon { filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.5)); }

/* 🛡️ SHIMMER ANIMATION */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.animate-shimmer {
  animation: shimmer 2.5s infinite linear;
}

/* REVEAL ANIMATIONS */
@keyframes revealTag {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}
.animate-reveal-tag {
  animation: revealTag 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Optimized Fade In for List Rendering */
@keyframes fadeInCard {
  from { opacity: 0; transform: translateY(20px); filter: blur(10px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

.group {
  animation: fadeInCard 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
</style>