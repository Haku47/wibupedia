<script setup>
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'

const error = ref(null)
const router = useRouter()

// Menangkap error dari komponen anak (children)
onErrorCaptured((err) => {
  error.value = err
  console.error('Vault Security Triggered - Error Captured:', err)
  // return false agar error tidak terus naik ke konsol browser
  return false
})

const resetError = () => {
  error.value = null
  // Me-reload halaman secara halus untuk membersihkan memory state
  window.location.reload()
}

const returnHome = () => {
  error.value = null
  router.push('/')
}

// Vite Environment Detection (Original logic preserved)
const isDev = import.meta.env.DEV
</script>

<template>
  <div v-if="error" class="min-h-[500px] flex items-center justify-center p-6 bg-dark-bg relative overflow-hidden">
    <div class="absolute w-[400px] h-[400px] bg-red-500/5 blur-[100px] rounded-full pointer-events-none"></div>

    <div class="max-w-md w-full bg-dark-surface border border-red-500/20 rounded-[3rem] p-10 text-center backdrop-blur-xl shadow-2xl relative z-10 animate-reveal">
      
      <div class="relative w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-10">
        <div class="absolute inset-0 bg-red-500/20 rounded-full animate-ping opacity-40"></div>
        <i class="fa-solid fa-triangle-exclamation text-3xl text-red-500 relative z-10"></i>
      </div>

      <h2 class="text-3xl font-black text-text-main mb-4 font-outfit uppercase tracking-tighter italic">System Halted.</h2>
      <p class="text-text-muted mb-10 leading-relaxed font-medium opacity-60 text-sm">
        Terjadi kegagalan pada enkripsi data atau render komponen. Vault terpaksa dikunci untuk menjaga integritas sistem.
      </p>

      <div class="flex flex-col gap-4">
        <button @click="resetError" class="w-full py-5 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-red-600/20 active:scale-95 transition-all">
          Re-Initialize System
        </button>
        
        <button @click="returnHome" class="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-brand-primary transition-colors py-2">
          Return to Dashboard
        </button>
      </div>

      <div v-if="isDev" class="mt-10 p-6 bg-black/40 rounded-[2rem] text-left border border-white/5 relative overflow-hidden group">
        <div class="flex items-center justify-between mb-4">
           <p class="text-[9px] font-black uppercase text-red-400 tracking-widest opacity-50">Stack Trace Discovery</p>
           <span class="px-2 py-0.5 bg-red-500/20 text-red-500 text-[7px] font-black rounded-md uppercase tracking-tighter">Dev Mode</span>
        </div>
        <div class="max-h-32 overflow-y-auto scrollbar-hide">
          <p class="text-[10px] font-mono text-red-400/80 leading-relaxed break-words">
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
  animation: reveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes reveal {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>