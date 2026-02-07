<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useJikan } from '@/composables/useJikan'
import { useLibraryStore } from '@/store/libraryStore'
import { useUserStore } from '@/store/userStore' 
import AnimeCard from '@/components/cards/AnimeCard.vue'
import SkeletonCard from '@/components/shared/SkeletonCard.vue'

const router = useRouter()
const libraryStore = useLibraryStore()
const userStore = useUserStore() 
const { items, loading, fetchSeasonal, fetchTrending } = useJikan()

// --- STATES ---
const activeTab = ref('harian')
const carouselRef = ref(null)
const topTenRef = ref(null)
const currentIndex = ref(0)
const toast = ref({ show: false, message: '' })
const topTenItems = ref([])

let autoSlideInterval = null
let topTenAutoInterval = null

// --- COMPUTED ---
const spotlightItems = computed(() => items.value.slice(0, 6))

const greeting = computed(() => {
  const hour = new Date().getHours()
  const firstName = userStore.profile.name.split(' ')[0]
  let timeStr = hour < 12 ? 'Pagi' : hour < 18 ? 'Siang' : 'Malam'
  return `Okaeri, ${firstName}!` 
})

// --- LOGIC ---
const triggerToast = (msg) => {
  toast.value = { show: true, message: msg }
  setTimeout(() => { toast.value.show = false }, 2000)
}

const rollGacha = () => {
  if (items.value.length === 0) return
  const randomItem = items.value[Math.floor(Math.random() * items.value.length)]
  router.push(`/anime/${randomItem.mal_id}`)
}

const toggleBookmark = (anime) => {
  if (libraryStore.isInLibrary(anime.mal_id)) {
    libraryStore.removeFromLibrary(anime.mal_id)
    triggerToast('Ejected from Archive')
  } else {
    libraryStore.addToLibrary({ ...anime, category: 'anime' })
    triggerToast('Secured in Archive')
  }
}

// --- TOP 10 ENGINE ---
const startTopTenAuto = () => {
  stopTopTenAuto()
  topTenAutoInterval = setInterval(() => {
    if (!topTenRef.value || topTenItems.value.length === 0) return
    const { scrollLeft, scrollWidth, clientWidth } = topTenRef.value
    if (scrollLeft >= (scrollWidth - clientWidth - 10)) {
      topTenRef.value.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
      topTenRef.value.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }, 4000)
}

const stopTopTenAuto = () => clearInterval(topTenAutoInterval)

// --- HERO ENGINE ---
const scrollCarousel = (index) => {
  if (carouselRef.value) {
    const width = carouselRef.value.offsetWidth
    carouselRef.value.scrollTo({ left: width * index, behavior: 'smooth' })
    currentIndex.value = index
  }
}

const startAutoSlide = () => {
  autoSlideInterval = setInterval(() => {
    if (!carouselRef.value || spotlightItems.value.length === 0) return
    currentIndex.value = (currentIndex.value + 1) % spotlightItems.value.length
    scrollCarousel(currentIndex.value)
  }, 8000)
}

const stopAutoSlide = () => clearInterval(autoSlideInterval)

// --- DATA INITIALIZATION ---
const loadData = async (type) => {
  activeTab.value = type
  if (type === 'harian') await fetchTrending('anime', 1, 'airing')
  else if (type === 'mingguan') await fetchTrending('anime', 1, 'bypopularity')
  else await fetchSeasonal(1)
}

onMounted(async () => {
  // 🛡️ Scroll listener removed for Ultra-Lean Build
  startAutoSlide()
  startTopTenAuto()
  
  await Promise.all([
    loadData('harian'),
    (async () => {
      const { items: trending, fetchTrending: fetchGlobal } = useJikan()
      await fetchGlobal('anime', 1, 'favorite')
      topTenItems.value = trending.value.slice(0, 10)
    })()
  ])
})

onUnmounted(() => {
  stopAutoSlide()
  stopTopTenAuto()
})
</script>

<template>
  <main class="min-h-screen pb-20 bg-dark-bg relative overflow-x-hidden selection:bg-brand-primary/30">
    
    <Transition name="toast">
      <div v-if="toast.show" class="fixed top-24 left-1/2 -translate-x-1/2 z-[400] bg-brand-primary px-8 py-3 rounded-2xl shadow-neon text-white font-black text-[10px] uppercase tracking-[0.2em] border border-white/10 flex items-center gap-3 italic">
        <i class="fa-solid fa-shield-check"></i> {{ toast.message }}
      </div>
    </Transition>

    <section v-if="!loading && spotlightItems.length > 0" class="relative mb-12 md:mb-20 overflow-hidden group/hero">
      <div ref="carouselRef" @scroll="e => currentIndex = Math.round(e.target.scrollLeft / e.target.offsetWidth)" 
           class="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth h-[550px] md:h-[780px]">
        
        <div v-for="(anime, index) in spotlightItems" :key="anime.mal_id" 
             class="min-w-full relative snap-center flex items-center justify-center overflow-hidden">
          
          <div class="absolute inset-0 z-0 pointer-events-none">
            <img :src="anime.images.jpg.large_image_url" class="w-full h-full object-cover scale-125 blur-[60px] opacity-20 brightness-50" loading="eager" />
            <div class="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-dark-bg/40"></div>
          </div>

          <div class="max-w-7xl w-full mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-8 text-center lg:text-left">
              <div class="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <span class="px-3 py-1 bg-brand-primary text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-neon italic">Protocol #{{ index + 1 }}</span>
                <span class="text-white/20 text-[9px] font-black uppercase tracking-widest italic opacity-40">Airborne Signal</span>
              </div>
              
              <h1 class="text-3xl md:text-6xl lg:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9] font-outfit uppercase italic drop-shadow-2xl">
                {{ anime.title }}
              </h1>

              <div class="flex items-center justify-center lg:justify-start gap-4 mt-12">
                <RouterLink :to="`/anime/${anime.mal_id}`" 
                            class="px-12 py-5 bg-white text-black font-black rounded-2xl hover:bg-brand-primary hover:text-white transition-all text-[10px] uppercase tracking-[0.3em] shadow-xl active:scale-95 italic">
                  Analyze Entry
                </RouterLink>
                <button @click="toggleBookmark(anime)"
                        class="w-16 h-16 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-primary transition-all active:scale-90">
                  <i :class="libraryStore.isInLibrary(anime.mal_id) ? 'fa-solid fa-check scale-110' : 'fa-regular fa-bookmark'" class="text-xl"></i>
                </button>
              </div>
            </div>

            <div class="lg:col-span-4 hidden lg:flex justify-end animate-float-poster">
              <div class="relative w-[320px] aspect-[3/4.5] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl rotate-2 group-hover/hero:rotate-0 transition-transform duration-1000">
                <img :src="anime.images.jpg.large_image_url" class="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex gap-3 bg-white/5 backdrop-blur-md p-3 rounded-full border border-white/5">
        <button v-for="(n, i) in spotlightItems.length" :key="i" @click="scrollCarousel(i)"
             class="h-1 rounded-full transition-all duration-700" 
             :class="currentIndex === i ? 'w-10 bg-brand-primary shadow-neon' : 'w-2 bg-white/20'"></button>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-6 mb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10">
      <div class="lg:col-span-4 bg-dark-surface border border-dark-border p-10 rounded-[3rem] relative overflow-hidden group shadow-2xl">
        <div class="absolute -right-20 -top-20 w-56 h-56 bg-brand-primary/10 blur-[90px] rounded-full group-hover:bg-brand-primary/20 transition-all duration-1000"></div>
        <div class="relative z-10 flex flex-col justify-between h-full text-white">
          <div>
            <h3 class="text-4xl md:text-5xl font-black font-outfit mb-2 tracking-tighter italic uppercase leading-none break-words">{{ greeting }}</h3>
            <p class="text-text-muted font-black text-[9px] uppercase tracking-[0.5em] opacity-30 italic">Terminal Access Verified</p>
          </div>
          <div class="mt-12 p-8 bg-brand-primary text-white rounded-[2.5rem] shadow-neon">
            <p class="text-[9px] font-black uppercase mb-2 opacity-70 tracking-[0.3em]">Operational Archives</p>
            <div class="flex items-end gap-3">
               <p class="text-5xl md:text-6xl font-black font-outfit tabular-nums leading-none">{{ libraryStore.totalItems }}</p>
               <span class="text-[10px] font-black uppercase mb-1 opacity-50 italic">Items</span>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-8 bg-dark-surface border border-dark-border p-10 rounded-[3rem] overflow-hidden relative group/top shadow-2xl text-white">
        <div class="flex items-center justify-between mb-10">
          <div class="flex items-center gap-5">
             <div class="w-2.5 h-10 bg-brand-primary rounded-full shadow-neon"></div>
             <h3 class="text-xl md:text-2xl font-black uppercase tracking-tighter font-outfit italic">Global Trending</h3>
          </div>
          <button @click="rollGacha" class="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase text-brand-primary tracking-widest hover:bg-brand-primary hover:text-white transition-all italic active:scale-95">Shuffle</button>
        </div>
        <div ref="topTenRef" @mouseenter="stopTopTenAuto" @mouseleave="startTopTenAuto"
             class="flex gap-8 overflow-x-auto pb-6 snap-x scrollbar-hide">
          <div v-for="(item, idx) in topTenItems" :key="item.mal_id" 
               class="relative flex-shrink-0 w-36 md:w-44 snap-start group/card cursor-pointer"
               @click="router.push(`/anime/${item.mal_id}`)">
            <div class="absolute -left-4 bottom-4 z-20 pointer-events-none opacity-10 group-hover/card:opacity-100 transition-all duration-700">
               <span class="text-7xl md:text-9xl font-black text-white italic font-outfit leading-none">{{ idx + 1 }}</span>
            </div>
            <div class="relative z-10 aspect-[2/3.1] rounded-[2.2rem] overflow-hidden border border-white/10 shadow-2xl transition-all duration-700 group-hover/card:scale-90">
              <img :src="item.images.jpg.large_image_url" class="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-6">
      <div class="flex flex-col md:flex-row justify-between items-center gap-10 mb-20 text-white">
        <div>
           <h2 class="text-4xl md:text-6xl font-black tracking-tighter font-outfit uppercase italic leading-none">List <span class="text-brand-primary transition-colors">Catalog</span></h2>
           <p class="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] mt-4 opacity-30 italic">Live Synchronization Protocol</p>
        </div>
        <div class="flex p-1.5 bg-dark-surface border border-white/5 rounded-[2.2rem] shadow-2xl w-full md:w-auto backdrop-blur-xl">
          <button v-for="tab in ['harian', 'mingguan', 'bulanan']" :key="tab"
            @click="loadData(tab)" 
            :class="activeTab === tab ? 'bg-brand-primary text-white shadow-neon' : 'text-text-muted opacity-40 hover:opacity-100'" 
            class="flex-1 md:flex-none px-12 md:px-14 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all italic active:scale-95">{{ tab }}</button>
        </div>
      </div>

      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-10">
        <SkeletonCard v-for="n in 12" :key="n" />
      </div>

      <div v-else>
        <TransitionGroup name="stagger-reveal" tag="div" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-10">
          <div v-for="(anime, idx) in items" :key="anime.mal_id" class="relative group" :style="{ '--delay': `${idx * 0.03}s` }">
            <AnimeCard :anime="anime" />
            <button @click.stop.prevent="toggleBookmark(anime)" 
                    :class="libraryStore.isInLibrary(anime.mal_id) ? 'bg-brand-primary shadow-neon opacity-100 scale-100' : 'bg-dark-bg/80 opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100'" 
                    class="absolute bottom-[95px] right-3 w-12 h-12 rounded-[1.3rem] flex items-center justify-center border border-white/10 z-30 transition-all active:scale-90 shadow-2xl backdrop-blur-md">
              <i :class="libraryStore.isInLibrary(anime.mal_id) ? 'fa-solid fa-check' : 'fa-solid fa-plus'" class="text-white text-sm"></i>
            </button>
          </div>
        </TransitionGroup>
      </div>

      <div class="mt-40 flex flex-col md:flex-row items-center justify-center gap-6 animate-reveal pb-24">
         <button @click="router.push('/search')" class="w-full md:w-auto h-20 md:h-24 px-16 md:px-20 bg-white text-black rounded-[3rem] flex items-center justify-center gap-5 shadow-2xl font-black text-[11px] uppercase tracking-[0.4em] group active:scale-95 transition-all italic">
           <i class="fa-solid fa-magnifying-glass text-xs"></i> Initialize Search
         </button>
         <button @click="rollGacha" class="w-full md:w-auto h-20 md:h-24 px-16 bg-dark-surface border border-white/10 text-white rounded-[3rem] flex items-center justify-center gap-5 shadow-xl font-black text-[11px] uppercase tracking-[0.3em] active:scale-95 transition-all italic">
           <i class="fa-solid fa-dice text-brand-primary text-xs"></i> Protocol Gacha
         </button>
      </div>
    </section>

    </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.shadow-neon { box-shadow: 0 0 20px var(--color-brand-primary); }

/* 🚀 PERFORMANCE ENHANCEMENTS */
.animate-float-poster, .animate-reveal-text {
  will-change: transform, opacity;
}

/* Transitions */
.stagger-reveal-enter-active {
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: var(--delay);
}
.stagger-reveal-enter-from { opacity: 0; transform: translateY(20px); }

.toast-enter-active, .toast-leave-active { transition: all 0.4s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, -20px); }
</style>