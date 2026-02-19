<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/store/userStore.js'
import { useLibraryStore } from '@/store/libraryStore.js'

const props = defineProps({
  anime: {
    type: Object,
    required: true
  }
})

// 🚀 EMIT PROTOCOL: Untuk mengirim sinyal ke Parent (Home.vue)
const emit = defineEmits(['action'])

const userStore = useUserStore()
const libraryStore = useLibraryStore()
const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')

// --- ✨ IMAGE & ACTION STATES ---
const isLoaded = ref(false)
const hasError = ref(false)

const handleLoad = () => { isLoaded.value = true }
const handleError = () => { hasError.value = true; isLoaded.value = true }

// --- ⚡ QUICK BOOKMARK LOGIC ---
const handleQuickAction = (e) => {
  e.preventDefault() 
  e.stopPropagation() 
  
  const isRemoving = libraryStore.isInLibrary(props.anime.mal_id)
  
  if (isRemoving) {
    libraryStore.removeFromLibrary(props.anime.mal_id)
    // Kirim sinyal ke parent untuk memicu Toast merah
    emit('action', { message: 'Removed from Collection', type: 'remove' })
  } else {
    libraryStore.addToLibrary({
      ...props.anime,
      category: 'anime',
      addedAt: new Date().toISOString()
    })
    // Kirim sinyal ke parent untuk memicu Toast hijau
    emit('action', { message: 'Added to Collection', type: 'add' })
  }
}
</script>

<template>
  <div class="relative group font-outfit">
    <button 
      @click="handleQuickAction"
      class="absolute top-4 right-4 z-30 w-10 h-10 rounded-xl backdrop-blur-2xl border border-white/10 flex items-center justify-center transition-all duration-500 active:scale-90 shadow-2xl"
      :class="[
        libraryStore.isInLibrary(anime.mal_id) 
          ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
          : 'bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:bg-white hover:text-black'
      ]"
    >
      <i :class="libraryStore.isInLibrary(anime.mal_id) ? 'fa-solid fa-heart' : 'fa-solid fa-plus'" class="text-xs"></i>
    </button>

    <RouterLink 
      :to="`/anime/${anime.mal_id}`"
      class="relative flex flex-col bg-dark-surface border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:-translate-y-3 hover:border-white/20 shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]"
    >
      <div class="relative aspect-[3/4.4] overflow-hidden bg-white/[0.02]">
        <div v-if="!isLoaded" class="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer"></div>

        <div v-if="hasError" class="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/10">
          <i class="fa-solid fa-image text-4xl"></i>
          <span class="text-[9px] font-black uppercase tracking-widest">Unavailable</span>
        </div>

        <img 
          :src="anime.images.jpg.large_image_url" 
          :alt="anime.title"
          loading="lazy"
          @load="handleLoad"
          @error="handleError"
          class="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-110"
          :class="[isLoaded && !hasError ? 'opacity-100 blur-0' : 'opacity-0 blur-xl']"
        />
        
        <div class="absolute inset-0 bg-gradient-to-t from-dark-surface via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700"></div>
        
        <div v-if="anime.score" 
             class="absolute top-4 left-4 px-2.5 py-1.5 bg-black/60 backdrop-blur-xl rounded-xl flex items-center gap-1.5 border border-white/10 shadow-2xl opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
          <i class="fa-solid fa-star text-[9px]" :style="{ color: primaryColor }"></i>
          <span class="text-white text-[10px] font-black tabular-nums">{{ anime.score }}</span>
        </div>

        <div class="absolute bottom-5 left-5 px-3.5 py-1.5 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-xl shadow-xl">
          {{ anime.type }}
        </div>
      </div>

      <div class="p-6 flex flex-col flex-grow relative bg-dark-surface">
        <h3 class="text-[14px] font-black text-white line-clamp-2 leading-tight group-hover:text-brand-primary transition-colors duration-500 uppercase tracking-tight mb-6">
          {{ anime.title }}
        </h3>
        
        <div class="mt-auto pt-5 flex items-center justify-between border-t border-white/5">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-1.5 rounded-full animate-pulse" :style="{ backgroundColor: primaryColor }"></div>
            <span class="text-[10px] text-text-muted font-black uppercase tracking-widest opacity-40">
              {{ anime.episodes || '?' }} EPS
            </span>
          </div>
          
          <span class="text-[10px] text-text-muted font-bold tracking-widest opacity-20 uppercase">
            {{ anime.year || anime.status?.split(' ')[0] || 'TBA' }}
          </span>
        </div>
      </div>

      <div class="absolute inset-0 border-2 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none rounded-[2.5rem]" 
           :style="{ borderColor: primaryColor }"></div>
    </RouterLink>
  </div>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.animate-shimmer { animation: shimmer 2s infinite linear; }

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes fadeInCard {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.relative.group {
  animation: fadeInCard 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
</style>