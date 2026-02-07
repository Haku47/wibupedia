<script setup>
import { computed } from 'vue'
import { useLibraryStore } from '@/store/libraryStore'

const libraryStore = useLibraryStore()
const stats = computed(() => libraryStore.vaultStats)

defineProps({
  themeColor: String,
  themeBg: String
})
</script>

<template>
  <Transition name="fade-up">
    <div v-if="stats && stats.hasEnoughData" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative z-10">
      
      <div class="bg-dark-surface border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-xl">
        <div :class="themeBg" class="absolute -right-10 -top-10 w-32 h-32 opacity-10 blur-3xl rounded-full transition-all group-hover:opacity-20 pointer-events-none"></div>
        
        <p class="text-[9px] font-black uppercase tracking-[0.4em] text-text-muted mb-4 opacity-40 italic">Quality Index</p>
        
        <div class="flex items-end gap-3 relative z-10">
          <span class="text-5xl font-black font-outfit text-white italic drop-shadow-2xl tabular-nums leading-none">
            {{ stats.avgScore }}
          </span>
          <div class="flex flex-col mb-1">
            <span :class="themeColor" class="text-[8px] font-black uppercase tracking-widest italic opacity-70">Mean Score</span>
            <div class="h-px w-full bg-white/10 mt-1"></div>
          </div>
        </div>
      </div>

      <div class="bg-dark-surface border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-xl md:col-span-2">
        <div class="flex items-center justify-between mb-6">
          <p class="text-[9px] font-black uppercase tracking-[0.4em] text-text-muted opacity-40 italic">Dominant Data (Top Genres)</p>
          <div class="flex gap-1">
             <div v-for="n in 3" :key="n" :class="themeBg" class="w-1 h-1 rounded-full opacity-20"></div>
          </div>
        </div>

        <div class="flex flex-wrap gap-3 relative z-10">
          <div v-for="[name, count] in stats.topGenres" :key="name" 
               class="px-5 py-3 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 group/chip hover:border-white/10 transition-all hover:bg-white/[0.07] cursor-default">
            
            <div class="flex flex-col">
              <span class="text-[10px] font-black text-white uppercase tracking-widest italic">{{ name }}</span>
              <span class="text-[6px] font-black text-text-muted uppercase tracking-[0.2em] opacity-30">Genetic Match</span>
            </div>

            <div :class="[themeBg, themeColor]" class="bg-opacity-10 px-3 py-1.5 rounded-xl text-[10px] font-black tabular-nums italic border border-current border-opacity-20 shadow-lg">
              {{ count }}
            </div>
          </div>
        </div>
      </div>

    </div>
  </Transition>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }

.fade-up-enter-active { 
  transition: all 1s cubic-bezier(0.22, 1, 0.36, 1); 
}
.fade-up-enter-from { 
  opacity: 0; 
  transform: translateY(30px); 
  filter: blur(10px); 
}

/* Tooltip style vibe */
.group\/chip:hover {
  transform: translateY(-2px);
}
</style>