<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/userStore.js'

const router = useRouter()
const userStore = useUserStore()

const isOpen = ref(false)
const searchQuery = ref('')
const inputRef = ref(null)
const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')

// --- KEYBOARD ENGINE ---
const handleKeyDown = (e) => {
  // Buka dengan "/"
  if (e.key === '/' && !isOpen.value) {
    const activeElem = document.activeElement
    if (activeElem.tagName !== 'INPUT' && activeElem.tagName !== 'TEXTAREA') {
      e.preventDefault()
      openSearch()
    }
  }
  // Tutup dengan "Escape"
  if (e.key === 'Escape' && isOpen.value) {
    closeSearch()
  }
}

const openSearch = () => {
  isOpen.value = true
  setTimeout(() => inputRef.value?.focus(), 100)
}

const closeSearch = () => {
  isOpen.value = false
  searchQuery.value = ''
}

const handleQuickSearch = () => {
  if (searchQuery.value.trim().length < 2) return
  const query = searchQuery.value
  closeSearch()
  router.push({ name: 'search', query: { q: query, type: 'anime' } })
}

onMounted(() => window.addEventListener('keydown', handleKeyDown))
onUnmounted(() => window.removeEventListener('keydown', handleKeyDown))
</script>

<template>
  <Teleport to="body">
    <Transition name="cmd-fade">
      <div v-if="isOpen" class="fixed inset-0 z-[1000] flex items-start justify-center pt-[12vh] px-4 font-outfit">
        <div class="absolute inset-0 bg-dark-bg/40 backdrop-blur-xl" @click="closeSearch"></div>

        <div class="relative w-full max-w-2xl bg-dark-surface border border-white/5 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden animate-cmd-pop">
          
          <div :style="{ backgroundColor: primaryColor }" class="absolute -top-24 -right-24 w-64 h-64 opacity-[0.05] blur-[100px] rounded-full pointer-events-none"></div>

          <div class="p-10 md:p-12">
            <div class="flex items-center gap-5 mb-10 opacity-30">
              <i class="fa-solid fa-magnifying-glass text-xs" :style="{ color: primaryColor }"></i>
              <span class="text-[10px] font-black uppercase tracking-[0.5em]">Quick Search Hub</span>
            </div>

            <div class="relative group">
              <input 
                ref="inputRef"
                v-model="searchQuery"
                type="text"
                placeholder="Cari anime atau manga..."
                @keydown.enter="handleQuickSearch"
                class="w-full bg-transparent border-none text-3xl md:text-4xl font-black text-white placeholder:text-white/5 focus:ring-0 uppercase tracking-tighter"
              />
              <div class="absolute -bottom-4 left-0 right-0 h-0.5 bg-white/5 overflow-hidden">
                <div class="h-full transition-all duration-700 scale-x-0 group-focus-within:scale-x-100 origin-left"
                     :style="{ backgroundColor: primaryColor }"></div>
              </div>
            </div>

            <div class="mt-16 flex flex-wrap items-center justify-between gap-6">
              <div class="flex items-center gap-8">
                <div class="flex items-center gap-3">
                  <span class="px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-xl text-[9px] font-black text-white/40 tabular-nums">ENTER</span>
                  <span class="text-[9px] font-bold text-text-muted uppercase tracking-widest opacity-30">Search</span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-xl text-[9px] font-black text-white/40 tabular-nums">ESC</span>
                  <span class="text-[9px] font-bold text-text-muted uppercase tracking-widest opacity-30">Close</span>
                </div>
              </div>

              <p class="text-[9px] font-black text-text-muted uppercase tracking-widest opacity-20">
                WibuPedia Discovery Engine
              </p>
            </div>
          </div>

          <div class="h-1 w-full bg-white/5 relative overflow-hidden">
            <div class="h-full absolute top-0 left-0 w-1/3 animate-scan"
                 :style="{ backgroundColor: primaryColor }"></div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }

.animate-cmd-pop {
  animation: cmdPop 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes cmdPop {
  from { opacity: 0; transform: translateY(-30px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes scan {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(300%); }
}

.animate-scan {
  animation: scan 2.5s cubic-bezier(0.45, 0, 0.55, 1) infinite;
}

/* Transitions */
.cmd-fade-enter-active, .cmd-fade-leave-active { transition: all 0.5s ease; }
.cmd-fade-enter-from, .cmd-fade-leave-to { opacity: 0; backdrop-filter: blur(0px); }
</style>