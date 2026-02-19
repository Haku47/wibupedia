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
    <div v-if="stats && stats.hasEnoughData" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative z-10 font-outfit">
      
      <div class="bg-dark-surface border border-white/5 p-8 rounded-[3rem] relative overflow-hidden group shadow-2xl">
        <div :class="themeBg" class="absolute -right-10 -top-10 w-32 h-32 opacity-[0.05] blur-3xl rounded-full transition-all group-hover:opacity-10 pointer-events-none"></div>
        
        <p class="text-[10px] font-black uppercase tracking-widest text-text-muted mb-6 opacity-30">Collection Score</p>
        
        <div class="flex items-end gap-4 relative z-10">
          <span class="text-6xl font-black text-white tabular-nums leading-none tracking-tighter italic">
            {{ stats.avgScore }}
          </span>
          <div class="flex flex-col mb-1">
            <span :class="themeColor" class="text-[9px] font-black uppercase tracking-widest opacity-60">Mean Index</span>
            <div class="h-0.5 w-full bg-white/10 mt-1 rounded-full"></div>
          </div>
        </div>
      </div>

      <div class="bg-dark-surface border border-white/5 p-8 rounded-[3rem] relative overflow-hidden group shadow-2xl md:col-span-2">
        <div class="flex items-center justify-between mb-8">
          <p class="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-30">Top Interests</p>
          <div class="flex gap-1.5">
             <div v-for="n in 3" :key="n" :class="themeBg" class="w-1.5 h-1.5 rounded-full opacity-10"></div>
          </div>
        </div>

        <div class="flex flex-wrap gap-3 relative z-10">
          <div v-for="[name, count] in stats.topGenres" :key="name" 
               class="px-5 py-3.5 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center gap-5 group/chip hover:border-white/10 transition-all hover:bg-white/[0.06] cursor-default shadow-sm">
            
            <div class="flex flex-col">
              <span class="text-[11px] font-black text-white uppercase tracking-wider">{{ name }}</span>
              <span class="text-[7px] font-bold text-text-muted uppercase tracking-widest opacity-30">Preferred</span>
            </div>

            <div :class="[themeBg, themeColor]" class="bg-opacity-10 px-3 py-1.5 rounded-xl text-[10px] font-black tabular-nums border border-current border-opacity-20 shadow-lg">
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
  transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1); 
}
.fade-up-enter-from { 
  opacity: 0; 
  transform: translateY(20px); 
  filter: blur(8px); 
}

/* Interaction */
.group\/chip {
  will-change: transform;
}
.group\/chip:hover {
  transform: translateY(-3px) scale(1.02);
}
</style>