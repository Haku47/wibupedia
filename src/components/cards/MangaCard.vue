<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  manga: {
    type: Object,
    required: true
  }
})

// --- ✨ IMAGE STATES ---
const isLoaded = ref(false)
const hasError = ref(false)

const handleLoad = () => {
  isLoaded.value = true
}

const handleError = () => {
  hasError.value = true
  isLoaded.value = true 
}
</script>

<template>
  <RouterLink 
    :to="`/manga/${manga.mal_id}`"
    class="group relative flex flex-col bg-dark-surface border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:-translate-y-3 hover:border-emerald-500/20 shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] font-outfit"
  >
    <div class="relative aspect-[3/4.4] overflow-hidden bg-white/[0.02]">
      
      <div v-if="!isLoaded" class="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer"></div>

      <div v-if="hasError" class="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <i class="fa-solid fa-book text-white/5 text-4xl"></i>
        <span class="text-[9px] font-black uppercase text-white/10 tracking-widest">Cover Unavailable</span>
      </div>

      <img 
        :src="manga.images.jpg.large_image_url" 
        :alt="manga.title"
        loading="lazy"
        @load="handleLoad"
        @error="handleError"
        class="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-110"
        :class="isLoaded && !hasError ? 'opacity-100 blur-0' : 'opacity-0 blur-xl'"
      />
      
      <div class="absolute inset-0 bg-gradient-to-t from-dark-surface via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700"></div>
      <div class="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

      <div v-if="manga.score" 
           class="absolute top-5 right-5 px-3 py-2 bg-black/60 backdrop-blur-xl rounded-2xl flex items-center gap-2 border border-white/10 shadow-2xl opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
        <i class="fa-solid fa-star text-emerald-500 text-[10px]"></i>
        <span class="text-white text-[12px] font-black tabular-nums">{{ manga.score }}</span>
      </div>

      <div 
        :class="manga.status === 'Publishing' ? 'bg-emerald-500 text-white shadow-[0_10px_20px_rgba(16,185,129,0.3)]' : 'bg-white text-black'"
        class="absolute bottom-5 left-5 px-3.5 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-transform group-hover:scale-110 origin-left"
      >
        {{ manga.status }}
      </div>
    </div>

    <div class="p-6 flex flex-col flex-grow relative bg-dark-surface">
      <h3 class="text-[15px] font-black text-white line-clamp-2 leading-tight group-hover:text-emerald-400 transition-colors duration-500 uppercase tracking-tight mb-6">
        {{ manga.title }}
      </h3>
      
      <div class="mt-auto pt-5 flex items-center justify-between border-t border-white/5">
        <div class="flex flex-col gap-1">
          <span class="text-[8px] text-text-muted font-black uppercase tracking-[0.2em] opacity-30">Chapters</span>
          <span class="text-[13px] font-black text-white tabular-nums">{{ manga.chapters || '?' }}</span>
        </div>
        
        <div class="flex flex-col gap-1 text-right">
          <span class="text-[8px] text-text-muted font-black uppercase tracking-[0.2em] opacity-30">Volumes</span>
          <span class="text-[13px] font-black text-white tabular-nums opacity-60">{{ manga.volumes || '?' }}</span>
        </div>
      </div>
    </div>

    <div class="absolute inset-0 border-2 border-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none rounded-[2.5rem]"></div>
  </RouterLink>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }

/* 🚀 ANIMATION ENGINE */

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.animate-shimmer {
  animation: shimmer 2s infinite linear;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Fluid Entrance */
@keyframes fadeInCard {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.group {
  animation: fadeInCard 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
</style>