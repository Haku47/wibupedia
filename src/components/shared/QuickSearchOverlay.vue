<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isOpen = ref(false)
const searchQuery = ref('')
const inputRef = ref(null)

// --- KEYBOARD ENGINE ---
const handleKeyDown = (e) => {
  // Buka dengan "/"
  if (e.key === '/' && !isOpen.value) {
    e.preventDefault()
    openSearch()
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
  if (searchQuery.value.trim().length < 3) return
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
      <div v-if="isOpen" class="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-4">
        <div class="absolute inset-0 bg-dark-bg/60 backdrop-blur-[20px]" @click="closeSearch"></div>

        <div class="relative w-full max-w-2xl bg-dark-surface border border-white/10 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden animate-cmd-pop">
          <div class="p-8">
            <div class="flex items-center gap-6 mb-8 opacity-40">
              <i class="fa-solid fa-terminal text-brand-primary"></i>
              <span class="text-[9px] font-black uppercase tracking-[0.4em] font-outfit">Quick Access Terminal v1.8</span>
            </div>

            <div class="relative group">
              <input 
                ref="inputRef"
                v-model="searchQuery"
                type="text"
                placeholder="Type to search archives..."
                @keydown.enter="handleQuickSearch"
                class="w-full bg-transparent border-none text-2xl md:text-3xl font-black text-white placeholder:text-white/5 focus:ring-0 font-outfit uppercase italic tracking-tighter"
              />
              <div class="absolute -bottom-4 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-primary/0 via-brand-primary to-brand-primary/0 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-700"></div>
            </div>

            <div class="mt-12 flex items-center justify-between">
              <div class="flex items-center gap-4">
                <span class="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-text-muted">ENTER</span>
                <span class="text-[9px] font-bold text-text-muted uppercase tracking-widest opacity-40 italic">Execute</span>
              </div>
              <div class="flex items-center gap-4">
                <span class="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-text-muted">ESC</span>
                <span class="text-[9px] font-bold text-text-muted uppercase tracking-widest opacity-40 italic">Abort</span>
              </div>
            </div>
          </div>

          <div class="h-1 w-full bg-white/5 overflow-hidden">
            <div class="h-full bg-brand-primary w-1/3 animate-scan"></div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }

.animate-cmd-pop {
  animation: cmdPop 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes cmdPop {
  from { opacity: 0; transform: translateY(-20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes scan {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(300%); }
}

.animate-scan {
  animation: scan 3s linear infinite;
}

/* Transitions */
.cmd-fade-enter-active, .cmd-fade-leave-active { transition: opacity 0.4s ease; }
.cmd-fade-enter-from, .cmd-fade-leave-to { opacity: 0; }
</style>