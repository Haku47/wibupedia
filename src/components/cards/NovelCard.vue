<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/store/userStore.js'
import { useLibraryStore } from '@/store/libraryStore.js'

const props = defineProps({
  novel: {
    type: Object,
    required: true
  }
})

// 🚀 EMIT PROTOCOL: Sinyal untuk Toast di Parent Component
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
  
  const isRemoving = libraryStore.isInLibrary(props.novel.mal_id)
  
  if (isRemoving) {
    libraryStore.removeFromLibrary(props.novel.mal_id)
    emit('action', { message: 'Removed from Collection', type: 'remove' })
  } else {
    libraryStore.addToLibrary({
      ...props.novel,
      category: 'manga', // Novel di Jikan API masuk ke endpoint manga
      addedAt: new Date().toISOString()
    })
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
        libraryStore.isInLibrary(novel.mal_id) 
          ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
          : 'bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:bg-amber-500 hover:text-white'
      ]"
    >
      <i :class="libraryStore.isInLibrary(novel.mal_id) ? 'fa-solid fa-bookmark' : 'fa-solid fa-plus'" class="text-xs"></i>
    </button>

    <RouterLink 
      :to="`/manga/${novel.mal_id}`"
      class="relative flex flex-col bg-dark-surface border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:-translate-y-3 hover:border-amber-500/20 shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
    >
      <div class="relative aspect-[3/4.4] overflow-hidden bg-white/[0.02]">
        <div v-if="!isLoaded" class="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer"></div>

        <div v-if="hasError" class="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/10">
          <i class="fa-solid fa-book-open text-4xl"></i>
          <span class="text-[9px] font-black uppercase tracking-widest text-white/20">Cover Empty</span>
        </div>

        <img 
          :src="novel.images.jpg.large_image_url" 
          :alt="novel.title"
          loading="lazy"
          @load="handleLoad"
          @error="handleError"
          class="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-110"
          :class="[isLoaded && !hasError ? 'opacity-100 blur-0' : 'opacity-0 blur-xl']"
        />
        
        <div class="absolute inset-0 bg-gradient-to-t from-dark-surface via-transparent to-transparent opacity-80 group-hover:opacity-30 transition-opacity"></div>
        <div class="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

        <div v-if="novel.score" 
             class="absolute top-4 left-4 px-2.5 py-1.5 bg-black/60 backdrop-blur-xl rounded-xl flex items-center gap-1.5 border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <i class="fa-solid fa-star text-[9px] text-amber-400"></i>
          <span class="text-white text-[10px] font-black tabular-nums">{{ novel.score }}</span>
        </div>

        <div class="absolute bottom-5 left-5 px-3 py-1.5 bg-amber-500 text-white text-[8px] font-black uppercase tracking-[0.2em] rounded-lg shadow-lg">
          LIGHT NOVEL
        </div>
      </div>

      <div class="p-6 flex flex-col flex-grow relative bg-dark-surface">
        <h3 class="text-[14px] font-black text-white line-clamp-2 leading-tight group-hover:text-amber-400 transition-colors duration-500 uppercase tracking-tight mb-6">
          {{ novel.title }}
        </h3>
        
        <div class="mt-auto pt-5 flex items-center justify-between border-t border-white/5">
          <div class="flex flex-col gap-1">
            <span class="text-[8px] text-text-muted font-black uppercase tracking-[0.2em] opacity-30">Archive</span>
            <span class="text-[12px] font-black text-white tabular-nums">{{ novel.volumes || '?' }} VOLS</span>
          </div>
          
          <div class="flex flex-col gap-1 text-right">
            <span class="text-[8px] text-text-muted font-black uppercase tracking-[0.2em] opacity-30">Status</span>
            <span class="text-[11px] font-black text-white uppercase opacity-60 tracking-tighter">{{ novel.status?.split(' ')[0] }}</span>
          </div>
        </div>
      </div>

      <div class="absolute inset-0 border-2 border-amber-500/20 opacity-0 group-hover:opacity-100 transition-all pointer-events-none rounded-[2.5rem]"></div>
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