<script setup>
import { ref, onErrorCaptured, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/userStore.js'

const error = ref(null)
const router = useRouter()
const userStore = useUserStore()
const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')

// Menangkap error dari komponen anak
onErrorCaptured((err) => {
  error.value = err
  console.error('Community Hub Alert - Error Captured:', err)
  return false
})

const resetError = () => {
  error.value = null
  window.location.reload()
}

const returnHome = () => {
  error.value = null
  router.push('/')
}

// Vite Environment Detection
const isDev = import.meta.env.DEV
</script>

<template>
  <div v-if="error" class="min-h-[600px] flex items-center justify-center p-6 bg-dark-bg relative overflow-hidden font-outfit">
    <div class="absolute w-[500px] h-[500px] bg-red-500/10 blur-[150px] rounded-full pointer-events-none transition-all duration-1000"></div>

    <div class="max-w-md w-full bg-dark-surface border border-white/5 rounded-[3.5rem] p-12 text-center backdrop-blur-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative z-10 animate-reveal">
      
      <div class="relative w-24 h-24 bg-red-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 group">
        <div class="absolute inset-0 bg-red-500/20 rounded-[2.5rem] animate-ping opacity-30"></div>
        <i class="fa-solid fa-circle-exclamation text-4xl text-red-500 relative z-10 transition-transform group-hover:scale-110"></i>
      </div>

      <h2 class="text-4xl font-black text-white mb-6 uppercase tracking-tighter italic">Oops!</h2>
      <p class="text-text-muted mb-12 leading-relaxed font-medium opacity-60 text-base">
        Terjadi kendala saat memuat halaman ini. Jangan khawatir, silakan coba segarkan halaman atau kembali ke beranda.
      </p>

      <div class="flex flex-col gap-4">
        <button @click="resetError" class="w-full py-6 bg-red-600 hover:bg-red-500 text-white font-black rounded-3xl uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-red-600/30 active:scale-95 transition-all">
          Refresh Page
        </button>
        
        <button @click="returnHome" class="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted hover:text-white transition-all py-4">
          Return to Home
        </button>
      </div>

      <div v-if="isDev" class="mt-12 p-8 bg-black/40 rounded-[2.5rem] text-left border border-white/5 relative overflow-hidden">
        <div class="flex items-center justify-between mb-6">
           <p class="text-[10px] font-black uppercase text-red-400 tracking-widest opacity-40">Debug Information</p>
           <span class="px-3 py-1 bg-red-500/10 text-red-500 text-[8px] font-black rounded-xl uppercase tracking-widest border border-red-500/20">Developer</span>
        </div>
        <div class="max-h-40 overflow-y-auto scrollbar-hide">
          <p class="text-[11px] font-mono text-red-400/70 leading-relaxed break-all">
            {{ error.stack || error.message }}
          </p>
        </div>
      </div>
    </div>
  </div>

  <slot v-else />
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.scrollbar-hide::-webkit-scrollbar { display: none; }

.animate-reveal {
  animation: revealUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes revealUp {
  from { opacity: 0; transform: translateY(50px); filter: blur(10px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}
</style>