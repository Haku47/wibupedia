<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { ANIME_GENRES } from '@/core/constants/GENRE_LIST'

const route = useRoute()

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])

const navLinks = [
  { name: 'Beranda', path: '/', icon: 'fa-solid fa-house' },
  { name: 'Cari Anime', path: '/search', icon: 'fa-solid fa-magnifying-glass' },
  { name: 'Library', path: '/library', icon: 'fa-solid fa-book-bookmark' },
]

const popularGenres = ANIME_GENRES.slice(0, 8)
</script>

<template>
  <Transition name="fade">
    <div 
      v-if="isOpen" 
      @click="$emit('close')"
      class="fixed inset-0 bg-dark-bg/60 backdrop-blur-lg z-[110] lg:hidden"
    ></div>
  </Transition>

  <aside 
    :class="isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'"
    class="fixed bottom-24 right-6 w-[calc(100vw-3rem)] max-w-[320px] max-h-[70vh] bg-dark-surface border border-dark-border z-[120] rounded-[2.5rem] shadow-2xl transition-all duration-500 ease-[var(--animate-spring)] lg:hidden flex flex-col overflow-hidden"
  >
    <div class="p-8 flex flex-col h-full overflow-y-auto no-scrollbar">
      
      <div class="flex items-center gap-4 mb-10">
        <div class="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
          <span class="text-white font-black text-xl font-outfit">W</span>
        </div>
        <div>
          <h2 class="text-lg font-black text-text-main font-outfit leading-none">WibuPedia</h2>
          <span class="text-[10px] text-brand-primary font-bold uppercase tracking-[0.2em]">Quick Menu</span>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-3 mb-10">
            <RouterLink 
            v-for="link in navLinks" 
            :key="link.path" 
            :to="link.path"
            @click="$emit('close')"
            class="flex items-center justify-between px-6 py-4 rounded-2xl transition-all active:scale-95 border"
            :class="route.path === link.path 
                ? 'active-link' 
                : 'bg-dark-bg/50 border-dark-border text-text-muted hover:text-brand-primary'"
            >
            </RouterLink>
      </div>

      <div class="mb-6">
        <p class="text-[10px] uppercase tracking-[0.3em] font-bold text-text-muted px-2 mb-5 opacity-50 text-center">Genre Populer</p>
        <div class="flex flex-wrap gap-2 justify-center">
          <RouterLink 
            v-for="genre in popularGenres" 
            :key="genre.id"
            :to="`/search?genre=${genre.id}`"
            @click="$emit('close')"
            class="px-4 py-2 bg-dark-bg border border-dark-border rounded-full text-[11px] font-bold text-text-muted hover:border-brand-primary hover:text-brand-primary transition-all active:scale-90"
          >
            #{{ genre.name }}
          </RouterLink>
        </div>
      </div>

      <div class="mt-auto">
        <button 
          @click="$emit('close')"
          class="w-full py-4 bg-dark-bg border border-dark-border rounded-2xl text-xs font-bold text-text-muted hover:text-text-main transition-colors"
        >
          Tutup Menu
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* Hapus baris @reference yang bikin error */

.font-outfit {
  /* Ambil langsung dari font-family yang didefinisikan di style.css */
  font-family: 'Outfit', sans-serif;
}

/* Gunakan selector manual sebagai pengganti @apply yang butuh reference */
.active-link {
  background-color: var(--color-brand-primary);
  border-color: var(--color-brand-primary);
  color: #ffffff;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Transisi Fade untuk Overlay */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>