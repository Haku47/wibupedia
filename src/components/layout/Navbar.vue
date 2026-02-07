<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useLibraryStore } from '@/store/libraryStore.js'
import { useUserStore } from '@/store/userStore.js'
import { useJikan } from '@/composables/useJikan.js' 
import Notification from './Notification.vue'

const router = useRouter()
const libraryStore = useLibraryStore()
const userStore = useUserStore()
const { items: suggestions, search: instantSearch, loading: isSearching } = useJikan()

// --- STATES ---
const isSearchFocused = ref(false)
const searchQuery = ref('')
const isNotifOpen = ref(false)
const isProfileOpen = ref(false)
const showSuggestions = ref(false)

// 🛡️ v2.0.9: Store Logic
const isLoggedIn = computed(() => userStore.isLoggedIn)
const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')

// --- COMMUNITY STATS ---
const animeCount = computed(() => libraryStore.myLibrary.filter(i => i.category === 'anime').length)
const mangaCount = computed(() => libraryStore.myLibrary.filter(i => i.category === 'manga').length)
const novelCount = computed(() => libraryStore.myLibrary.filter(i => i.type?.toUpperCase().includes('NOVEL')).length)

// --- SEARCH ENGINE ---
const createDebounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => { func.apply(null, args); }, delay);
  };
};

const executeInstantSearch = async (query) => {
  if (query.trim().length >= 3) {
    try {
      await instantSearch(query, 'anime', { limit: 5 })
      showSuggestions.value = true
    } catch (err) { console.warn("Search: Connection Interrupted"); }
  } else { showSuggestions.value = false }
}

const debouncedSearch = createDebounce(executeInstantSearch, 600)
watch(searchQuery, (newVal) => debouncedSearch(newVal))

// --- HANDLERS ---
const onSearch = () => {
  if (searchQuery.value.trim().length >= 3) {
    showSuggestions.value = false
    router.push({ path: '/search', query: { q: searchQuery.value } })
    searchQuery.value = '' 
    isSearchFocused.value = false
  }
}

const toggleProfile = () => {
  isProfileOpen.value = !isProfileOpen.value
  if (isProfileOpen.value) isNotifOpen.value = false
}

const handleLogout = () => {
  userStore.logout()
  isProfileOpen.value = false
  router.push('/')
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
  <nav class="sticky top-0 z-[100] bg-dark-bg/80 backdrop-blur-2xl border-b border-white/5 font-outfit">
    <div class="max-w-[1600px] mx-auto px-6 h-16 md:h-20 flex items-center justify-between gap-8">
      
      <div class="flex items-center gap-4 shrink-0">
        <RouterLink to="/" class="flex items-center gap-4 group">
          <div :style="{ backgroundColor: primaryColor }" 
               class="w-10 h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center border border-white/10 transition-all duration-700 shadow-xl group-hover:rotate-6">
            <span class="text-white font-black text-xl italic uppercase">W</span>
          </div>
          <div class="hidden sm:flex flex-col text-white">
            <h1 class="text-lg font-black tracking-tighter leading-none uppercase italic">
              Wibu<span :style="{ color: primaryColor }">Pedia</span>
            </h1>
            <span class="text-[8px] font-black uppercase tracking-[0.3em] mt-1 opacity-40">Community Hub</span>
          </div>
        </RouterLink>
      </div>

      <div class="flex-grow max-w-md hidden md:block search-container relative transition-all duration-500" :class="{ 'max-w-xl': isSearchFocused }">
        <form @submit.prevent="onSearch" class="relative group">
          <input v-model="searchQuery" type="text" placeholder="Search archive..." @focus="isSearchFocused = true" 
                 class="w-full bg-white/[0.04] border border-white/5 rounded-2xl py-3 pl-12 pr-32 text-xs font-bold text-text-main focus:outline-none transition-all shadow-inner"
                 :style="isSearchFocused ? { borderColor: primaryColor, boxShadow: `0 0 0 4px ${primaryColor}10` } : {}" />
          <i class="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-xs opacity-20" :style="isSearchFocused ? { color: primaryColor, opacity: 1 } : {}"></i>
          
          <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none opacity-0 transition-opacity duration-300" :class="{ 'opacity-100': isSearchFocused && !searchQuery }">
             <span class="text-[8px] font-black text-white/20 uppercase tracking-widest">Global Search</span>
          </div>
        </form>

        <Transition name="fade-slide">
          <div v-if="showSuggestions && suggestions.length > 0 && isSearchFocused" 
               class="absolute top-full left-0 right-0 mt-3 bg-dark-surface border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-[120]">
            <div class="p-4 bg-white/[0.02] border-b border-white/5">
               <span class="text-[9px] font-black uppercase tracking-widest text-white/30">Top Matches</span>
            </div>
            <div class="max-h-80 overflow-y-auto scrollbar-hide">
              <div v-for="item in suggestions" :key="item.mal_id" @click="router.push(`/anime/${item.mal_id}`); showSuggestions=false"
                   class="p-4 hover:bg-white/[0.03] flex items-center gap-4 cursor-pointer transition-colors group/item border-b border-white/5 last:border-0">
                <div class="w-10 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                   <img :src="item.images?.jpg?.small_image_url" class="w-full h-full object-cover" />
                </div>
                <div class="flex-grow overflow-hidden text-left">
                  <h4 class="text-[10px] font-black text-white truncate uppercase group-hover/item:text-brand-primary transition-colors">{{ item.title }}</h4>
                  <p class="text-[8px] font-bold text-text-muted opacity-40 mt-1 uppercase">{{ item.type }} • {{ item.score || 'N/A' }}</p>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <div class="flex items-center gap-3 md:gap-4 shrink-0">
        
        <div class="flex items-center gap-2 md:gap-3">
          <div class="relative notif-wrapper">
            <button @click="isNotifOpen = !isNotifOpen" 
                    class="p-2.5 text-text-muted hover:bg-white/5 rounded-2xl transition-all"
                    :style="isNotifOpen ? { color: primaryColor, backgroundColor: `${primaryColor}10` } : {}">
              <i class="fa-solid fa-bell text-lg"></i>
            </button>
            <Transition name="fade-slide">
              <Notification v-if="isNotifOpen" @close="isNotifOpen = false" />
            </Transition>
          </div>

          <RouterLink to="/library" class="relative p-2.5 bg-white/[0.03] border border-white/5 rounded-2xl group active:scale-95">
            <i class="fa-solid fa-bookmark text-lg text-text-muted group-hover:text-white transition-colors"></i>
            <div v-if="libraryStore.totalItems > 0" :style="{ backgroundColor: primaryColor }"
                 class="absolute -top-1 -right-1 min-w-[18px] h-4.5 px-1.5 text-white text-[8px] font-black flex items-center justify-center rounded-lg border-2 border-dark-bg tabular-nums shadow-lg">
              {{ libraryStore.totalItems }}
            </div>
          </RouterLink>
        </div>

        <div class="h-8 w-px bg-white/5 mx-1 hidden sm:block"></div>

        <div class="relative profile-wrapper">
          <RouterLink v-if="!isLoggedIn" to="/auth" 
                      class="flex items-center gap-3 px-6 py-3 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/10 transition-all active:scale-95 group shadow-lg">
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-white">Join Community</span>
          </RouterLink>

          <div v-else @click="toggleProfile" 
               class="flex items-center gap-4 pl-4 pr-2 py-2 bg-white/[0.03] border border-white/5 rounded-2xl cursor-pointer hover:bg-white/[0.06] transition-all active:scale-95 group shadow-lg"
               :style="isProfileOpen ? { borderColor: primaryColor } : {}">
            
            <div class="hidden lg:flex flex-col items-end">
              <span class="text-[10px] font-black text-white uppercase tracking-tighter leading-none">{{ userStore.profile.name }}</span>
              <span class="text-[7px] font-black uppercase tracking-[0.2em] mt-1 opacity-40" :style="{ color: primaryColor }">Member</span>
            </div>

            <div class="w-9 h-9 md:w-10 md:h-10 rounded-xl border-2 p-[2px] transition-all"
                 :style="{ borderColor: isProfileOpen ? primaryColor : 'rgba(255,255,255,0.1)' }">
              <div class="w-full h-full rounded-lg overflow-hidden bg-dark-surface">
                 <img :src="userStore.profile.avatar" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <Transition name="fade-slide">
            <div v-if="isProfileOpen && isLoggedIn" class="absolute top-full right-0 mt-4 w-64 bg-dark-surface border border-white/10 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden backdrop-blur-3xl z-[110]">
              <div class="p-8 bg-white/[0.02] border-b border-white/5 text-center relative">
                <div :style="{ backgroundColor: primaryColor }" class="absolute top-0 left-0 w-full h-0.5 opacity-40"></div>
                <h3 class="text-lg font-black text-text-main uppercase tracking-tighter truncate">{{ userStore.profile.name }}</h3>
                <p :style="{ color: primaryColor }" class="text-[9px] font-black uppercase tracking-[0.2em] mt-1 opacity-60">{{ userStore.profile.role }}</p>
              </div>

              <div class="px-4 py-4 grid grid-cols-3 gap-1 border-b border-white/5 bg-black/20">
                <div class="text-center">
                  <p class="text-xs font-black text-white">{{ animeCount }}</p>
                  <p class="text-[6px] font-black text-text-muted uppercase opacity-40">Anime</p>
                </div>
                <div class="text-center border-x border-white/5">
                  <p class="text-xs font-black text-white">{{ mangaCount }}</p>
                  <p class="text-[6px] font-black text-text-muted uppercase opacity-40">Manga</p>
                </div>
                <div class="text-center">
                  <p class="text-xs font-black text-white">{{ novelCount }}</p>
                  <p class="text-[6px] font-black text-text-muted uppercase opacity-40">Novel</p>
                </div>
              </div>

              <div class="p-3 space-y-1">
                <button @click="router.push('/settings'); isProfileOpen = false" class="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-white/5 rounded-2xl transition-all group text-left">
                  <i class="fa-solid fa-gear text-[11px] opacity-30 group-hover:opacity-100 transition-all" :style="{ color: primaryColor }"></i>
                  <span class="text-[9px] font-black uppercase tracking-widest text-text-muted group-hover:text-white">Preferences</span>
                </button>
                <button @click="router.push('/activity'); isProfileOpen = false" class="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-white/5 rounded-2xl transition-all group text-left">
                  <i class="fa-solid fa-clock-rotate-left text-[11px] opacity-30 group-hover:opacity-100 transition-all" :style="{ color: primaryColor }"></i>
                  <span class="text-[9px] font-black uppercase tracking-widest text-text-muted group-hover:text-white">Activity Log</span>
                </button>
              </div>

              <button @click="handleLogout" class="w-full flex items-center justify-center gap-2 p-5 bg-red-500/5 hover:bg-red-600 hover:text-white transition-all text-red-500 font-black text-[9px] uppercase tracking-widest group">
                <i class="fa-solid fa-right-from-bracket group-hover:translate-x-1 transition-transform"></i> Sign Out
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
.scrollbar-hide::-webkit-scrollbar { display: none; }

/* Clean Transition */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(15px) scale(0.96); }
</style>