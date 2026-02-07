<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useLibraryStore } from '@/store/libraryStore'
import { useUserStore } from '@/store/userStore'
import { useJikan } from '@/composables/useJikan' 
import Notification from './Notification.vue'

const router = useRouter()
const libraryStore = useLibraryStore()
const userStore = useUserStore()
const { items: suggestions, search: instantSearch, loading: isSearching } = useJikan()

const isSearchFocused = ref(false)
const searchQuery = ref('')
const isNotifOpen = ref(false)
const isProfileOpen = ref(false)
const isLoggedIn = ref(true) 
const showSuggestions = ref(false)

const primaryColor = computed(() => userStore.preferences.primaryColor || '#3b82f6')

// --- HIGH-PRECISION STATS SYNC ---
const animeCount = computed(() => libraryStore.myLibrary.filter(i => {
    const type = i.type?.toUpperCase() || ''
    return i.category === 'anime' && !type.includes('NOVEL')
}).length)

const mangaCount = computed(() => libraryStore.myLibrary.filter(i => {
    const type = i.type?.toUpperCase() || ''
    return i.category === 'manga' && !type.includes('NOVEL')
}).length)

const novelCount = computed(() => libraryStore.myLibrary.filter(i => {
    const type = i.type?.toUpperCase() || ''
    return i.category === 'novel' || type.includes('NOVEL')
}).length)

// --- 🛡️ NATIVE DEBOUNCE (ANTI-ERROR 500) ---
const createDebounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

const executeInstantSearch = async (query) => {
  if (query.trim().length >= 3) {
    try {
      await instantSearch(query, 'anime', { limit: 5 })
      showSuggestions.value = true
    } catch (err) {
      console.warn("Oracle Eye: Connection Interrupted");
    }
  } else {
    showSuggestions.value = false
  }
}

const debouncedSearch = createDebounce(executeInstantSearch, 600)

watch(searchQuery, (newVal) => {
  debouncedSearch(newVal)
})

const onSearch = () => {
  if (searchQuery.value.trim().length >= 3) {
    showSuggestions.value = false
    router.push({ path: '/search', query: { q: searchQuery.value } })
    searchQuery.value = '' 
    isSearchFocused.value = false
  }
}

const selectSuggestion = (id) => {
  showSuggestions.value = false
  searchQuery.value = ''
  isSearchFocused.value = false
  router.push(`/anime/${id}`)
}

const toggleProfile = () => {
  isProfileOpen.value = !isProfileOpen.value
  if (isProfileOpen.value) isNotifOpen.value = false
}

const closeDropdowns = (e) => {
  if (!e.target.closest('.notif-wrapper') && !e.target.closest('.profile-wrapper') && !e.target.closest('.search-container')) {
    isNotifOpen.value = false
    isProfileOpen.value = false
    showSuggestions.value = false
  }
}

onMounted(() => window.addEventListener('click', closeDropdowns))
onUnmounted(() => window.removeEventListener('click', closeDropdowns))
</script>

<template>
  <nav class="sticky top-0 z-[100] bg-dark-bg/80 backdrop-blur-2xl border-b border-white/5">
    <div class="max-w-[1600px] mx-auto px-6 h-16 md:h-20 flex items-center justify-between gap-8">
      
      <div class="flex items-center gap-4 shrink-0">
        <RouterLink to="/" class="flex items-center gap-4 group">
          <div :style="{ backgroundColor: primaryColor }" 
               class="brand-logo w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center border border-white/10 transition-all duration-700 shadow-2xl group-hover:rotate-12">
            <span class="text-white font-black text-xl font-outfit italic">W</span>
          </div>
          <div class="hidden sm:flex flex-col">
            <h1 class="text-lg font-black tracking-tighter text-text-main font-outfit leading-none uppercase italic">
              Wibu<span :style="{ color: primaryColor }">Pedia</span>
            </h1>
            <span class="text-[8px] font-black uppercase tracking-[0.4em] mt-1 opacity-40 italic" :style="{ color: primaryColor }">Oracle v1.9.8.2</span>
          </div>
        </RouterLink>
      </div>

      <div class="flex-grow max-w-sm hidden md:block search-container relative transition-all duration-500" :class="{ 'max-w-xl': isSearchFocused }">
        <form @submit.prevent="onSearch" class="relative group">
          <input v-model="searchQuery" type="text" placeholder="Access database..." @focus="isSearchFocused = true" 
                 class="search-input w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-12 pr-32 text-xs font-bold text-text-main focus:outline-none transition-all italic"
                 :style="isSearchFocused ? { borderColor: primaryColor, boxShadow: `0 0 0 4px ${primaryColor}15` } : {}" />
          
          <i class="fa-solid fa-terminal absolute left-4 top-1/2 -translate-y-1/2 text-xs opacity-20" :style="isSearchFocused ? { color: primaryColor, opacity: 1 } : {}"></i>
          
          <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none transition-opacity duration-500" :class="searchQuery.length > 0 ? 'opacity-0' : 'opacity-100'">
             <span class="text-[7px] font-mono font-black text-brand-primary tracking-[0.2em] bg-brand-primary/10 px-2 py-1 rounded border border-brand-primary/20 uppercase italic">
                1.4M+ Data Acc
             </span>
          </div>
        </form>

        <Transition name="fade-slide">
          <div v-if="showSuggestions && suggestions.length > 0 && isSearchFocused" 
               class="absolute top-full left-0 right-0 mt-3 bg-dark-surface/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden z-[120]">
            <div class="p-3 bg-white/5 border-b border-white/5 flex items-center justify-between">
              <span class="text-[8px] font-black uppercase tracking-[0.3em] text-text-muted opacity-50 italic">Oracle Suggestions</span>
              <div v-if="isSearching" class="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" :style="{ color: primaryColor }"></div>
            </div>
            <div class="max-h-80 overflow-y-auto scrollbar-hide">
              <div v-for="item in suggestions" :key="item.mal_id" @click="selectSuggestion(item.mal_id)"
                   class="p-4 hover:bg-white/[0.03] flex items-center gap-4 cursor-pointer transition-colors group/item border-b border-white/5 last:border-0">
                <div class="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-white/5 shadow-lg">
                   <img :src="item.images?.jpg?.small_image_url" class="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                </div>
                <div class="flex-grow overflow-hidden">
                  <h4 class="text-[10px] font-black text-white truncate uppercase italic group-hover/item:text-brand-primary transition-colors">{{ item.title }}</h4>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-[8px] font-bold text-brand-primary italic" :style="{ color: primaryColor }">★ {{ item.score || 'N/A' }}</span>
                    <span class="text-[8px] font-bold text-text-muted opacity-40 italic uppercase">{{ item.type }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <div class="flex items-center gap-3 md:gap-5 shrink-0">
        <div class="relative notif-wrapper">
          <button @click="isNotifOpen = !isNotifOpen" 
                  class="relative p-2.5 text-text-muted hover:bg-white/5 rounded-xl transition-all"
                  :style="isNotifOpen ? { color: primaryColor, backgroundColor: `${primaryColor}10` } : {}">
            <i class="fa-solid fa-satellite-dish text-lg"></i>
            <span class="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-dark-bg animate-ping"></span>
          </button>
          <Transition name="fade-slide">
            <Notification v-if="isNotifOpen" @close="isNotifOpen = false" />
          </Transition>
        </div>

        <RouterLink to="/library" class="relative p-2.5 bg-dark-surface border border-white/5 rounded-xl group active:scale-95">
          <i class="fa-solid fa-box-archive text-lg text-text-muted group-hover:text-white transition-colors"></i>
          <div v-if="libraryStore.totalItems > 0" :style="{ backgroundColor: primaryColor }"
               class="absolute -top-1.5 -right-1.5 min-w-[18px] h-4.5 px-1.5 text-white text-[8px] font-black flex items-center justify-center rounded-md border-2 border-dark-bg shadow-lg tabular-nums">
            {{ libraryStore.totalItems }}
          </div>
        </RouterLink>

        <div class="relative profile-wrapper">
          <div v-if="isLoggedIn" @click="toggleProfile" 
               class="w-10 h-10 md:w-11 md:h-11 rounded-xl border-2 p-[2px] cursor-pointer hover:scale-105 transition-all shadow-xl active:scale-95"
               :style="{ borderColor: isProfileOpen ? primaryColor : 'rgba(255,255,255,0.05)' }">
            <div class="w-full h-full rounded-lg overflow-hidden bg-dark-surface">
               <img :src="userStore.profile.avatar" class="w-full h-full object-cover" />
            </div>
          </div>

          <Transition name="fade-slide">
            <div v-if="isProfileOpen && isLoggedIn" class="absolute top-full right-0 mt-4 w-64 bg-dark-surface/95 border border-white/10 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-3xl z-[110]">
              <div class="p-6 bg-white/5 border-b border-white/5 text-center relative overflow-hidden">
                <div :style="{ backgroundColor: primaryColor }" class="absolute top-0 left-0 w-full h-0.5 opacity-40"></div>
                <h3 class="text-lg font-black text-text-main font-outfit uppercase tracking-tighter truncate italic">{{ userStore.profile.name }}</h3>
                <p :style="{ color: primaryColor }" class="text-[9px] font-black uppercase tracking-[0.2em] mt-1 opacity-70 italic">{{ userStore.profile.role }}</p>
              </div>

              <div class="px-4 py-3 grid grid-cols-3 gap-1 border-b border-white/5 bg-black/20">
                <div class="text-center">
                  <p class="text-xs font-black text-white tabular-nums">{{ animeCount }}</p>
                  <p class="text-[6px] font-black text-text-muted uppercase opacity-40 italic">Anime</p>
                </div>
                <div class="text-center border-x border-white/5">
                  <p class="text-xs font-black text-white tabular-nums">{{ mangaCount }}</p>
                  <p class="text-[6px] font-black text-text-muted uppercase opacity-40 italic">Manga</p>
                </div>
                <div class="text-center">
                  <p class="text-xs font-black text-white tabular-nums">{{ novelCount }}</p>
                  <p class="text-[6px] font-black text-text-muted uppercase opacity-40 italic">Novel</p>
                </div>
              </div>

              <div class="p-2 space-y-1">
                <button @click="router.push('/settings'); isProfileOpen = false" class="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-all group">
                  <i class="fa-solid fa-sliders text-[10px] opacity-30 group-hover:opacity-100 transition-all" :style="{ color: primaryColor }"></i>
                  <span class="text-[9px] font-black uppercase tracking-widest text-text-muted group-hover:text-white">System Settings</span>
                </button>
                <button @click="router.push('/activity'); isProfileOpen = false" class="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-all group">
                  <i class="fa-solid fa-terminal text-[10px] opacity-30 group-hover:opacity-100 transition-all" :style="{ color: primaryColor }"></i>
                  <span class="text-[9px] font-black uppercase tracking-widest text-text-muted group-hover:text-white">Activity Log</span>
                </button>
              </div>

              <button @click="isLoggedIn = false; isProfileOpen = false" class="w-full flex items-center justify-center gap-2 p-4 bg-red-500/5 hover:bg-red-600 hover:text-white transition-all text-red-500 font-black text-[9px] uppercase tracking-widest italic group">
                <i class="fa-solid fa-power-off group-hover:rotate-90 transition-transform"></i> System Logout
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.search-input { background-color: rgba(255, 255, 255, 0.02); }
.scrollbar-hide::-webkit-scrollbar { display: none; }

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(15px) scale(0.98); }
</style>