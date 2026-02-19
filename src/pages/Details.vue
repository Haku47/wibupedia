<script setup>
import { onMounted, computed, ref, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJikan } from '@/composables/useJikan'
import { useLibraryStore } from '@/store/libraryStore'
import { useUserStore } from '@/store/userStore'
import { formatScore } from '@/core/utils/formatters'
import Loader from '@/components/shared/Loader.vue'

const route = useRoute()
const router = useRouter()
const libraryStore = useLibraryStore()
const userStore = useUserStore()

const { selectedItem, loading, fetchDetail } = useJikan()

// --- 🎞️ ENGINE STATES ---
const gallery = ref([])
const characters = ref([])
const staff = ref([])
const activeGalleryIdx = ref(0)
const category = computed(() => route.params.type || 'anime')
const toast = ref({ show: false, message: '' })
const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')
let carouselTimer = null

const accentColor = computed(() => {
  if (category.value === 'manga' || category.value === 'novel') return '#10b981'
  return primaryColor.value
})

const triggerToast = (msg) => {
  toast.value = { show: true, message: msg }
  setTimeout(() => { toast.value.show = false }, 3000)
}

onMounted(async () => {
  const apiType = category.value === 'manga' || category.value === 'novel' ? 'manga' : 'anime'
  const id = route.params.id

  // 1. Fetch Core Data
  await fetchDetail(id, apiType)
  
  // 2. Parallel Fetch: Gallery, Characters, Staff
  try {
    const [resGallery, resChars, resStaff] = await Promise.all([
      fetch(`https://api.jikan.moe/v4/${apiType}/${id}/pictures`),
      fetch(`https://api.jikan.moe/v4/${apiType}/${id}/characters`),
      fetch(`https://api.jikan.moe/v4/${apiType}/${id}/staff`)
    ])

    const [dataG, dataC, dataS] = await Promise.all([
      resGallery.json(), resChars.json(), resStaff.json()
    ])

    gallery.value = dataG.data?.map(img => ({ url: img.jpg?.large_image_url || img.image_url })).slice(0, 8) || []
    characters.value = dataC.data?.slice(0, 12) || []
    staff.value = dataS.data?.slice(0, 8) || []
  } catch (e) { 
    console.error("Encyclopedia Sync Offline") 
  }

  window.scrollTo({ top: 0, behavior: 'smooth' })
  
  carouselTimer = setInterval(() => {
    if (gallery.value.length > 0) {
      activeGalleryIdx.value = (activeGalleryIdx.value + 1) % gallery.value.length
    }
  }, 7000)
})

onUnmounted(() => {
  if (carouselTimer) clearInterval(carouselTimer)
})

const handleLibraryAction = () => {
  if (!selectedItem.value) return
  if (libraryStore.isInLibrary(selectedItem.value.mal_id)) {
    libraryStore.removeFromLibrary(selectedItem.value.mal_id)
    triggerToast('Removed from Collection')
  } else {
    libraryStore.addToLibrary({ ...selectedItem.value, category: category.value, addedAt: new Date().toISOString() })
    triggerToast(`Added to Collection`)
  }
}
</script>

<template>
  <main class="min-h-screen bg-dark-bg text-text-main pb-40 relative font-outfit selection:bg-white/10 overflow-x-hidden">
    
    <div class="fixed inset-0 z-0 pointer-events-none">
      <div :style="{ backgroundColor: accentColor }" class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] opacity-[0.03] blur-[120px]"></div>
    </div>

    <Transition name="toast-pop">
      <div v-if="toast.show" 
           class="fixed top-8 left-1/2 -translate-x-1/2 z-[1000] px-8 py-3.5 rounded-full bg-white text-black font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3">
        <i class="fa-solid fa-check-circle"></i> {{ toast.message }}
      </div>
    </Transition>

    <Loader v-if="loading" fullScreen :message="`Accessing archive...`" />

    <div v-else-if="selectedItem" class="relative z-10 animate-reveal">
      
      <section class="relative h-[50vh] md:h-[60vh] w-full overflow-hidden bg-black border-b border-white/5">
        <div v-if="gallery.length === 0" class="absolute inset-0">
           <img :src="selectedItem.images.jpg.large_image_url" class="w-full h-full object-cover opacity-25 scale-105 saturate-[0.8]" />
           <div class="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent"></div>
        </div>

        <TransitionGroup name="fade-gallery">
          <div v-for="(pic, idx) in gallery" 
               :key="idx" v-show="activeGalleryIdx === idx"
               class="absolute inset-0">
            <img :src="pic.url" 
                 class="w-full h-full object-cover opacity-[0.35] saturate-[0.9] transition-transform duration-[7000ms] ease-out" 
                 :class="activeGalleryIdx === idx ? 'scale-110' : 'scale-100'" />
            <div class="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent"></div>
          </div>
        </TransitionGroup>

        <div class="max-w-7xl mx-auto px-8 relative h-full z-20 py-10 flex flex-col justify-between">
          <button @click="router.back()" class="group flex items-center gap-3 w-fit px-5 py-2.5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl hover:bg-white hover:text-black transition-all">
            <i class="fa-solid fa-arrow-left text-xs"></i>
            <span class="text-[9px] font-black uppercase tracking-widest">Back</span>
          </button>

          <div v-if="gallery.length > 1" class="flex justify-end gap-2.5">
            <div v-for="(n, i) in gallery.length" :key="i"
                 class="h-1 rounded-full transition-all duration-1000"
                 :class="activeGalleryIdx === i ? 'w-12 bg-white' : 'w-4 bg-white/10'"></div>
          </div>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-8 -mt-24 relative z-30">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div class="lg:col-span-4 space-y-8">
            <div class="relative group aspect-[3/4.4] rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)] border-8 border-white/5 bg-dark-surface">
               <img :src="selectedItem.images.jpg.large_image_url" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            </div>

            <button @click="handleLibraryAction"
                    :style="!libraryStore.isInLibrary(selectedItem.mal_id) ? { backgroundColor: accentColor } : {}"
                    :class="libraryStore.isInLibrary(selectedItem.mal_id) ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'text-white'"
                    class="w-full py-6 rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 border border-transparent shadow-xl">
              <i :class="libraryStore.isInLibrary(selectedItem.mal_id) ? 'fa-solid fa-minus' : 'fa-solid fa-plus'" class="mr-3"></i>
              {{ libraryStore.isInLibrary(selectedItem.mal_id) ? 'Remove Collection' : 'Add to Collection' }}
            </button>

            <div class="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-8 backdrop-blur-md">
               <div v-for="info in [
                  { label: 'Score', val: formatScore(selectedItem.score), color: accentColor },
                  { label: 'Rank', val: '#' + (selectedItem.rank || '??') },
                  { label: 'Popular', val: '#' + (selectedItem.popularity || '??') }
               ]" :key="info.label" class="flex justify-between items-center border-b border-white/5 pb-6 last:border-0 last:pb-0">
                  <span class="text-[9px] font-black text-white/20 uppercase tracking-widest">{{ info.label }}</span>
                  <span class="text-xl font-black italic tracking-tighter tabular-nums" :style="{ color: info.color || 'white' }">{{ info.val }}</span>
               </div>
            </div>

            <div v-if="staff.length" class="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6">
               <h4 class="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Production Staff</h4>
               <div class="space-y-4">
                  <div v-for="person in staff" :key="person.person.mal_id" class="flex items-center gap-4">
                     <img :src="person.person.images.jpg.image_url" class="w-10 h-10 rounded-full object-cover grayscale hover:grayscale-0 transition-all" />
                     <div class="overflow-hidden">
                        <p class="text-[11px] font-black text-white truncate">{{ person.person.name }}</p>
                        <p class="text-[9px] text-white/30 truncate uppercase">{{ person.positions[0] }}</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          <div class="lg:col-span-8 space-y-16 lg:pt-16">
            <div class="space-y-6">
               <div class="flex items-center gap-4">
                  <span :style="{ color: accentColor }" class="text-[10px] font-black uppercase tracking-[0.6em]">{{ selectedItem.type }}</span>
                  <div class="w-8 h-px bg-white/10"></div>
                  <span class="text-[10px] font-black uppercase tracking-[0.6em] text-white/20">{{ selectedItem.status }}</span>
               </div>
               <h1 class="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic leading-tight max-w-2xl">
                 {{ selectedItem.title }}
               </h1>
               <p class="text-lg font-bold uppercase tracking-[0.4em] text-white/10">{{ selectedItem.title_japanese }}</p>
            </div>

            <div class="space-y-8">
              <div class="flex items-center gap-4">
                 <h2 class="text-xs font-black uppercase tracking-[0.5em] text-white/30 italic">Narrative Archive</h2>
                 <div class="flex-grow h-px bg-white/5"></div>
              </div>
              <p class="text-text-muted leading-[1.8] text-lg font-medium opacity-70 whitespace-pre-line max-w-4xl">
                {{ selectedItem.synopsis || 'Sinopsis belum tersedia.' }}
              </p>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
               <div v-for="stat in [
                  { label: category === 'anime' ? 'Episodes' : 'Chapters', val: (category === 'anime' ? selectedItem.episodes : selectedItem.chapters) || 'TBA' },
                  { label: 'Source', val: selectedItem.source || 'Original' },
                  { label: 'Rating', val: selectedItem.rating?.split(' ')[0] || 'General' },
                  { label: 'Season', val: (selectedItem.season || '') + ' ' + (selectedItem.year || '') }
               ]" :key="stat.label" class="p-6 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
                  <p class="text-[8px] font-black text-white/20 uppercase tracking-widest mb-2 group-hover:text-white/40">{{ stat.label }}</p>
                  <p class="text-xs font-black text-white uppercase tracking-tight">{{ stat.val }}</p>
               </div>
            </div>

            <div v-if="characters.length" class="space-y-8 pt-6">
               <div class="flex items-center gap-4">
                 <h2 class="text-xs font-black uppercase tracking-[0.5em] text-white/30 italic">Characters Hub</h2>
                 <div class="flex-grow h-px bg-white/5"></div>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                 <div v-for="char in characters" :key="char.character.mal_id" class="group/char relative">
                    <div class="aspect-[1/1.2] rounded-[1.5rem] overflow-hidden border border-white/5 mb-3 bg-dark-surface shadow-lg">
                       <img :src="char.character.images.webp.image_url" class="w-full h-full object-cover group-hover/char:scale-110 transition-transform duration-700 saturate-50 group-hover/char:saturate-100" />
                    </div>
                    <p class="text-[11px] font-black text-white uppercase truncate">{{ char.character.name }}</p>
                    <p class="text-[9px] text-white/30 uppercase tracking-widest">{{ char.role }}</p>
                 </div>
              </div>
            </div>

            <div v-if="category === 'anime' && selectedItem.trailer?.embed_url" class="space-y-8 pt-6">
               <h2 class="text-xs font-black uppercase tracking-[0.5em] text-white/30 italic">Media Showcase</h2>
               <div class="aspect-video rounded-[3rem] overflow-hidden border border-white/5 bg-black shadow-2xl">
                 <iframe :src="selectedItem.trailer.embed_url" class="w-full h-full" frameborder="0" allowfullscreen></iframe>
               </div>
            </div>

            <div class="space-y-8">
               <h2 class="text-xs font-black uppercase tracking-[0.5em] text-white/30 italic">Genre DNA</h2>
               <div class="flex flex-wrap gap-2.5">
                  <span v-for="genre in selectedItem.genres" :key="genre.mal_id"
                        class="px-5 py-2.5 bg-white/[0.03] border border-white/5 rounded-full text-[9px] font-black text-white/40 uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                    {{ genre.name }}
                  </span>
               </div>
            </div>
          </div>

        </div>
      </section>

      <footer class="max-w-7xl mx-auto px-8 mt-48 pt-20 border-t border-white/5 flex justify-between items-center opacity-10">
         <p class="text-[9px] font-black uppercase tracking-[1em]">WibuPedia Digital Archive</p>
         <p class="text-[9px] font-black uppercase tracking-[0.5em]">System Build 2026</p>
      </footer>

    </div>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }

.fade-gallery-enter-active { transition: opacity 2s ease-in-out; }
.fade-gallery-leave-active { transition: opacity 1.5s ease-in-out; }
.fade-gallery-enter-from, .fade-gallery-leave-to { opacity: 0; }

.animate-reveal { animation: revealUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
@keyframes revealUp { 
  from { opacity: 0; transform: translateY(40px); } 
  to { opacity: 1; transform: translateY(0); } 
}

.toast-pop-enter-active, .toast-pop-leave-active { transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-pop-enter-from { opacity: 0; transform: translate(-50%, -40px); }

/* Custom Scrollbar for better UI */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
</style>