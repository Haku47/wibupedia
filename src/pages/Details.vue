<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJikan } from '@/composables/useJikan'
import { useLibraryStore } from '@/store/libraryStore'
import { formatScore } from '@/core/utils/formatters'
import Loader from '@/components/shared/Loader.vue'

const route = useRoute()
const router = useRouter()
const libraryStore = useLibraryStore()

const { selectedItem, loading, error, fetchDetail } = useJikan()

// --- STATES ---
const category = computed(() => route.params.type || 'anime')
const toast = ref({ show: false, message: '' })

// --- DYNAMIC IDENTITY SYSTEM ---
const theme = computed(() => {
  if (category.value === 'anime') return {
    bg: 'bg-brand-primary',
    text: 'text-brand-primary',
    glow: 'shadow-[0_0_25px_rgba(59,130,246,0.3)]'
  }
  if (category.value === 'manga') return {
    bg: 'bg-emerald-500',
    text: 'text-emerald-400',
    glow: 'shadow-[0_0_25px_rgba(16,185,129,0.3)]'
  }
  return {
    bg: 'bg-amber-500',
    text: 'text-amber-400',
    glow: 'shadow-[0_0_25px_rgba(245,158,11,0.3)]'
  }
})

const triggerToast = (msg) => {
  toast.value = { show: true, message: msg }
  setTimeout(() => { toast.value.show = false }, 3000)
}

onMounted(() => {
  const apiType = category.value === 'anime' ? 'anime' : 'manga'
  fetchDetail(route.params.id, apiType)
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

const handleLibraryAction = () => {
  if (!selectedItem.value) return
  if (libraryStore.isInLibrary(selectedItem.value.mal_id)) {
    libraryStore.removeFromLibrary(selectedItem.value.mal_id)
    triggerToast('Ejected from Library')
  } else {
    const dataToSave = {
      ...selectedItem.value,
      category: category.value,
      type: category.value === 'novel' ? 'Light Novel' : selectedItem.value.type
    }
    libraryStore.addToLibrary(dataToSave)
    triggerToast(`Secured in Library`)
  }
}
</script>

<template>
  <main class="min-h-screen bg-dark-bg text-text-main pb-32 overflow-x-hidden relative selection:bg-brand-primary/30">
    
    <Transition name="toast-slide">
      <div v-if="toast.show" 
           :class="[theme.bg, theme.glow]"
           class="fixed top-8 right-6 md:right-12 z-[100] px-8 py-4 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 border border-white/10 backdrop-blur-md shadow-2xl">
        <i class="fa-solid fa-shield-check"></i>
        {{ toast.message }}
      </div>
    </Transition>

    <Loader v-if="loading" fullScreen :message="`Decrypting ${category} archives...`" />

    <div v-else-if="selectedItem" class="animate-reveal">
      <div class="relative h-[45vh] md:h-[65vh] w-full overflow-hidden">
        <img :src="selectedItem.images.jpg.large_image_url" class="w-full h-full object-cover blur-[80px] opacity-20 scale-110" />
        <div class="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/60 to-transparent"></div>
        
        <div class="absolute top-12 left-6 md:left-12 z-50">
          <button @click="router.back()" 
            class="flex items-center gap-3 px-6 py-3.5 bg-dark-bg/40 backdrop-blur-xl border border-white/5 rounded-2xl hover:border-white/20 text-text-muted hover:text-white transition-all group active:scale-95 shadow-2xl">
            <i class="fa-solid fa-chevron-left group-hover:-translate-x-1 transition-transform"></i>
            <span class="text-[9px] font-black uppercase tracking-[0.2em] font-outfit">Return to Base</span>
          </button>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-6 -mt-40 md:-mt-64 relative z-10">
        <div class="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          <div class="w-full lg:w-[320px] flex-shrink-0">
            <div class="sticky top-24">
              <div class="relative aspect-[3/4.4] overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/10 bg-dark-surface group">
                <img :src="selectedItem.images.jpg.large_image_url" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" :alt="selectedItem.title" />
                <div :class="[theme.bg]" class="absolute top-6 right-6 px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-white shadow-xl">
                  {{ selectedItem.type || category.toUpperCase() }}
                </div>
              </div>
              
              <button @click="handleLibraryAction"
                :class="[
                  libraryStore.isInLibrary(selectedItem.mal_id) 
                    ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white' 
                    : `${theme.bg} text-white shadow-neon hover:scale-[1.02]`
                ]"
                class="w-full mt-8 py-5 rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 active:scale-95 shadow-xl italic"
              >
                <i :class="libraryStore.isInLibrary(selectedItem.mal_id) ? 'fa-solid fa-box-archive' : 'fa-solid fa-plus'"></i>
                <span>{{ libraryStore.isInLibrary(selectedItem.mal_id) ? 'Archive Stored' : `Add to Library` }}</span>
              </button>
            </div>
          </div>

          <div class="flex-grow pt-8 lg:pt-32">
            <div class="flex flex-wrap gap-2.5 mb-8">
              <span v-for="genre in selectedItem.genres" :key="genre.mal_id" 
                class="px-4 py-1.5 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black tracking-widest uppercase text-text-muted hover:border-white/20 transition-colors">
                {{ genre.name }}
              </span>
            </div>

            <h1 class="text-4xl md:text-6xl font-black mb-4 tracking-tighter leading-tight font-outfit uppercase italic">{{ selectedItem.title }}</h1>
            <p class="text-lg md:text-xl text-text-muted mb-12 font-medium opacity-30 font-outfit italic tracking-tight">{{ selectedItem.title_japanese }}</p>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 p-10 bg-dark-surface/50 border border-white/5 rounded-[2.5rem] mb-10 shadow-xl backdrop-blur-xl">
              <div>
                <p class="text-[8px] text-text-muted uppercase tracking-[0.3em] font-black mb-2 opacity-30 italic">Score</p>
                <p class="text-4xl font-black tracking-tighter tabular-nums" :class="theme.text">{{ formatScore(selectedItem.score) }}</p>
              </div>
              <div>
                <p class="text-[8px] text-text-muted uppercase tracking-[0.3em] font-black mb-2 opacity-30 italic">Ranking</p>
                <p class="text-4xl font-black tracking-tighter tabular-nums text-white">#{{ selectedItem.rank || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-[8px] text-text-muted uppercase tracking-[0.3em] font-black mb-2 opacity-30 italic">Status</p>
                <p class="text-xl font-black tracking-tighter uppercase text-white truncate">{{ selectedItem.status }}</p>
              </div>
              <div>
                <p class="text-[8px] text-text-muted uppercase tracking-[0.3em] font-black mb-2 opacity-30 italic">
                  {{ category === 'anime' ? 'Episodes' : 'Chapters' }}
                </p>
                <p class="text-4xl font-black tracking-tighter tabular-nums text-white">
                  {{ (category === 'anime' ? selectedItem.episodes : selectedItem.chapters) || '?' }}
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
              <div v-for="info in [
                { icon: 'fa-shield-halved', label: 'Rating', val: selectedItem.rating || 'N/A' },
                { icon: 'fa-broadcast-tower', label: 'Source', val: selectedItem.source || 'N/A' },
                { icon: 'fa-calendar-day', label: 'Season', val: `${selectedItem.season || '?'} ${selectedItem.year || ''}` }
              ]" :key="info.label" class="flex items-center gap-4 p-6 bg-white/5 border border-white/5 rounded-2xl group hover:bg-white/10 transition-all">
                <i :class="[`fa-solid ${info.icon}`, theme.text]" class="text-xl opacity-20 group-hover:opacity-100 transition-opacity"></i>
                <div>
                  <p class="text-[8px] font-black uppercase text-text-muted opacity-40 tracking-widest mb-0.5 italic">{{ info.label }}</p>
                  <p class="text-xs font-black uppercase text-white truncate max-w-[140px]">{{ info.val }}</p>
                </div>
              </div>
            </div>

            <section class="mb-20">
              <div class="flex items-center gap-4 mb-8">
                <div :class="[theme.bg]" class="w-1.5 h-8 rounded-full shadow-neon"></div>
                <h3 class="text-2xl font-black tracking-tighter font-outfit uppercase italic text-white">Synopsis</h3>
              </div>
              <p class="text-text-muted leading-[1.8] text-base md:text-lg font-medium opacity-70 whitespace-pre-line text-justify italic font-outfit">
                {{ selectedItem.synopsis || 'Archives are currently encrypted or unavailable in the Jikan Database.' }}
              </p>
            </section>

            <section v-if="category === 'anime' && selectedItem.trailer?.embed_url" class="mb-10">
              <h3 class="text-2xl font-black mb-8 tracking-tighter font-outfit uppercase italic text-white">Visual <span :class="theme.text">Transmission</span></h3>
              <div class="aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-black group relative">
                <iframe :src="selectedItem.trailer.embed_url" class="w-full h-full relative z-0" frameborder="0" allowfullscreen></iframe>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.shadow-neon { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }

.animate-reveal { animation: reveal 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
@keyframes reveal { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }

/* 🛡️ REFINED TOAST ANIMATION: SLIDE FROM RIGHT TO PREVENT NAV CONFLICT */
.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-slide-enter-from { opacity: 0; transform: translateX(100px); }
.toast-slide-leave-to { opacity: 0; transform: scale(0.9); }

/* Theme Helpers */
.bg-brand-primary { background-color: var(--color-brand-primary); }
.bg-emerald-500 { background-color: #10b981; }
.bg-amber-500 { background-color: #f59e0b; }
.text-brand-primary { color: var(--color-brand-primary); }
.text-emerald-400 { color: #34d399; }
.text-amber-400 { color: #fbbf24; }
</style>