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
const { items: suggestions, search: instantSearch, loading: isSearching, clear: clearSearch } = useJikan()

// --- STATES ---
const isSearchFocused = ref(false)
const searchQuery = ref('')
const isNotifOpen = ref(false)
const isProfileOpen = ref(false)
const showSuggestions = ref(false)

const isLoggedIn = computed(() => userStore.isLoggedIn)
const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')

// --- COMMUNITY STATS (SYNCED WITH CE ENGINE) ---
const stats = computed(() => {
  const lib = libraryStore.myLibrary
  return [
    { val: lib.filter(i => i.category === 'anime' && i.type?.toUpperCase() !== 'MOVIE' && i.type?.toUpperCase() !== 'ONA').length, label: 'TV', icon: 'fa-solid fa-tv' },
    { val: lib.filter(i => i.type?.toUpperCase() === 'MOVIE').length, label: 'Movie', icon: 'fa-solid fa-film' },
    { val: lib.filter(i => i.category === 'manga' && !i.type?.toUpperCase().includes('NOVEL')).length, label: 'Manga', icon: 'fa-solid fa-book-open' },
    { val: lib.filter(i => i.type?.toUpperCase().includes('NOVEL')).length, label: 'Novel', icon: 'fa-solid fa-scroll' },
    { val: lib.filter(i => i.type?.toUpperCase() === 'ONA').length, label: 'Donghua', icon: 'fa-solid fa-dragon' }
  ]
})

// --- ADVANCED SEARCH ENGINE ---
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
    } catch (err) { console.warn("Archive: Sync Interrupted"); }
  } else { showSuggestions.value = false }
}

const debouncedSearch = createDebounce(executeInstantSearch, 500)
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
  <nav class="sticky top-0 z-[100] bg-dark-bg/80 backdrop-blur-3xl border-b border-white/[0.05] font-outfit">
    <div class="max-w-[1600px] mx-auto px-6 h-16 md:h-24 flex items-center justify-between gap-12">
      
      <div class="flex items-center gap-4 shrink-0">
        <RouterLink to="/" class="flex items-center gap-4 group">
          <div :style="{ backgroundColor: primaryColor }" 
               class="w-11 h-11 md:w-12 md:h-12 rounded-[1.2rem] flex items-center justify-center border border-white/10 transition-all duration-700 shadow-2xl group-hover:rotate-[10deg]">
            <span class="text-white font-black text-2xl leading-none select-none">W</span>
          </div>
          <div class="hidden sm:flex flex-col text-white">
            <h1 class="text-xl font-black tracking-tighter leading-none uppercase">
              Wibu<span :style="{ color: primaryColor }">Pedia</span>
            </h1>
            <div class="flex items-center gap-2 mt-1.5">
              <div class="w-1 h-1 rounded-full animate-pulse" :style="{ backgroundColor: primaryColor }"></div>
              <span class="text-[8px] font-bold uppercase tracking-[0.4em] opacity-30">Community Hub</span>
            </div>
          </div>
        </RouterLink>
      </div>

      <div class="flex-grow max-w-lg hidden md:block search-container relative transition-all duration-700" :class="{ 'max-w-2xl': isSearchFocused }">
        <form @submit.prevent="onSearch" class="relative group">
          <div class="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
            <i v-if="!isSearching" class="fa-solid fa-magnifying-glass text-[14px] transition-all" :style="isSearchFocused ? { color: primaryColor } : { opacity: 0.2 }"></i>
            <i v-else class="fa-solid fa-circle-notch animate-spin text-[14px]" :style="{ color: primaryColor }"></i>
          </div>
          <input v-model="searchQuery" type="text" placeholder="E.G Anime, Manga, Novel, Donghua, Movie..." @focus="isSearchFocused = true" 
                 class="w-full bg-white/[0.03] border border-white/[0.05] rounded-[1.5rem] py-4 pl-14 pr-32 text-[11px] font-bold text-text-main focus:outline-none transition-all shadow-inner"
                 :style="isSearchFocused ? { borderColor: `${primaryColor}40`, backgroundColor: 'rgba(255,255,255,0.05)', boxShadow: `0 0 40px ${primaryColor}05` } : {}" />
        </form>

        <Transition name="fade-slide">
          <div v-if="showSuggestions && suggestions.length > 0 && isSearchFocused" 
               class="absolute top-full left-0 right-0 mt-4 bg-dark-surface border border-white/10 rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.9)] overflow-hidden z-[120] backdrop-blur-3xl">
            <div class="max-h-[400px] overflow-y-auto scrollbar-hide">
              <div v-for="item in suggestions" :key="item.mal_id" @click="router.push(`/anime/${item.mal_id}`); showSuggestions=false"
                   class="p-5 hover:bg-white/[0.03] flex items-center gap-5 cursor-pointer transition-all border-b border-white/[0.03] last:border-0">
                <div class="w-12 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                   <img :src="item.images?.jpg?.small_image_url" class="w-full h-full object-cover" />
                </div>
                <div class="flex-grow overflow-hidden text-left">
                  <h4 class="text-[12px] font-black text-white truncate uppercase tracking-tight">{{ item.title }}</h4>
                  <p class="text-[9px] font-bold text-emerald-400 mt-1 uppercase">★ {{ item.score || 'N/A' }} • {{ item.type }}</p>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <div class="flex items-center gap-4 shrink-0">
        <div class="flex items-center gap-2">
          <div class="relative notif-wrapper">
            <button @click="isNotifOpen = !isNotifOpen" class="p-3 text-text-muted hover:bg-white/5 rounded-2xl transition-all relative">
              <i class="fa-solid fa-bell text-xl"></i>
              <div v-if="!isNotifOpen" class="absolute top-3 right-3 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
            </button>
            <Transition name="fade-slide">
              <Notification v-if="isNotifOpen" @close="isNotifOpen = false" />
            </Transition>
          </div>
          <RouterLink to="/library" class="relative p-3 bg-white/[0.03] border border-white/5 rounded-2xl group transition-all">
            <i class="fa-solid fa-layer-group text-xl text-text-muted group-hover:text-white"></i>
            <div v-if="libraryStore.totalItems > 0" :style="{ backgroundColor: primaryColor }" class="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 text-white text-[9px] font-black flex items-center justify-center rounded-lg border-2 border-dark-bg">{{ libraryStore.totalItems }}</div>
          </RouterLink>
        </div>

        <div class="h-8 w-px bg-white/10 mx-1 hidden sm:block"></div>

        <div class="relative profile-wrapper">
          <RouterLink v-if="!isLoggedIn" to="/auth" class="flex items-center gap-3 px-6 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest shadow-2xl group active:scale-95 transition-all">
            <i class="fa-solid fa-circle-user text-[14px]"></i>
            <span>Join Hub</span>
          </RouterLink>

          <div v-else @click="toggleProfile" class="flex items-center gap-3 p-1.5 pr-4 bg-white/[0.03] border border-white/[0.05] rounded-2xl cursor-pointer hover:bg-white/[0.08] transition-all">
            <div class="w-9 h-9 rounded-xl border border-white/10 p-[2px]">
              <img :src="userStore.profile.avatar" class="w-full h-full object-cover rounded-lg" />
            </div>
            <i class="fa-solid fa-chevron-down text-[10px] opacity-20 group-hover:opacity-100 transition-all" :class="{'rotate-180': isProfileOpen}"></i>
          </div>

          <Transition name="fade-slide">
            <div v-if="isProfileOpen && isLoggedIn" class="absolute top-full right-0 mt-3 w-[320px] bg-dark-surface/95 border border-white/10 rounded-[2rem] shadow-[0_40px_80px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-3xl z-[110]">
              
              <div class="p-5 flex items-center gap-4 border-b border-white/5 bg-white/[0.02]">
                <div class="w-12 h-12 rounded-2xl border border-white/10 p-0.5 shrink-0">
                  <img :src="userStore.profile.avatar" class="w-full h-full object-cover rounded-[0.7rem]" />
                </div>
                <div class="overflow-hidden">
                  <h3 class="text-xs font-black text-white uppercase truncate tracking-tight">{{ userStore.profile.name }}</h3>
                  <p :style="{ color: primaryColor }" class="text-[7px] font-black uppercase tracking-[0.2em] opacity-60">Verified Member</p>
                </div>
              </div>

              <div class="grid grid-cols-5 gap-0.5 py-3 px-2 bg-black/20 border-b border-white/5">
                <div v-for="s in stats" :key="s.label" class="text-center flex flex-col items-center justify-center group/stat">
                  <i :class="s.icon" class="text-[10px] mb-1.5 opacity-20 group-hover/stat:opacity-100 transition-opacity" :style="{ color: primaryColor }"></i>
                  <p class="text-[10px] font-black text-white tabular-nums leading-none">{{ s.val }}</p>
                  <p class="text-[5px] font-black text-white/30 uppercase tracking-widest mt-1.5">{{ s.label }}</p>
                </div>
              </div>

              <div class="p-2.5 space-y-1">
                <button v-for="link in [{p:'/settings', i:'fa-solid fa-sliders', t:'Preferences'}, {p:'/activity', i:'fa-solid fa-bolt-lightning', t:'Activity Log'}]" 
                  :key="link.t" @click="router.push(link.p); isProfileOpen = false" 
                  class="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/5 rounded-xl transition-all group text-left">
                  <i :class="link.i" class="text-[12px] opacity-20 group-hover:opacity-100 transition-all" :style="{ color: primaryColor }"></i>
                  <span class="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white">{{ link.t }}</span>
                </button>
              </div>

              <button @click="handleLogout" class="w-full flex items-center justify-center gap-3 p-4 bg-red-500/5 hover:bg-red-600 hover:text-white transition-all text-red-500 font-black text-[9px] uppercase tracking-[0.3em] border-t border-white/5 group">
                <i class="fa-solid fa-power-off text-[10px] group-hover:rotate-90 transition-transform"></i>
                <span>Sign Out Archive</span>
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
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
.fade-slide-enter-from { opacity: 0; transform: translateY(10px) scale(0.98); }
.fade-slide-leave-to { opacity: 0; transform: translateY(5px) scale(0.99); }
</style>