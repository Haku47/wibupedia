<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useUserStore } from '@/store/userStore.js'

const router = useRouter()
const userStore = useUserStore()
const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')
</script>

<template>
  <main class="min-h-[90vh] bg-dark-bg flex items-center justify-center px-6 relative overflow-hidden font-outfit">
    <div :style="{ backgroundColor: primaryColor }" class="absolute w-[600px] h-[600px] opacity-[0.05] blur-[150px] rounded-full -top-48 -left-48 pointer-events-none"></div>

    <div class="text-center relative z-10 animate-reveal">
      <div class="relative mb-12 group">
        <h1 class="text-[12rem] md:text-[18rem] font-black text-white/[0.03] leading-none select-none tracking-tighter transition-all duration-700 group-hover:text-white/[0.05]">
          404
        </h1>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <div class="relative mb-6">
            <div :style="{ backgroundColor: primaryColor }" class="absolute inset-0 opacity-20 blur-2xl rounded-full animate-pulse"></div>
            <i class="fa-solid fa-compass text-7xl animate-float relative z-10" :style="{ color: primaryColor }"></i>
          </div>
          <span class="text-[10px] font-black uppercase tracking-[0.6em] text-white/20">Lost in Discovery</span>
        </div>
      </div>

      <h2 class="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter leading-tight italic">
        Page <span :style="{ color: primaryColor }">Not Found.</span>
      </h2>
      <p class="text-sm md:text-base text-text-muted max-w-md mx-auto mb-16 leading-relaxed opacity-60 font-medium">
        Halaman yang kamu cari tidak ditemukan atau telah berpindah alamat. Jangan khawatir, kamu bisa kembali ke beranda komunitas.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
        <router-link 
          to="/" 
          class="w-full sm:w-auto px-12 py-5 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl"
          :style="{ backgroundColor: primaryColor }"
        >
          Back to Home
        </router-link>
        
        <button 
          @click="router.back()" 
          class="w-full sm:w-auto px-12 py-5 bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all active:scale-95"
        >
          Previous Page
        </button>
      </div>

      <div class="mt-24 flex items-center justify-center gap-4 opacity-10">
        <div class="w-10 h-px bg-white"></div>
        <span class="text-[8px] font-black uppercase tracking-[0.5em]">WibuPedia Community Hub v2.2.6</span>
        <div class="w-10 h-px bg-white"></div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }

/* 🚀 SOFT FLOATING ANIMATION */
.animate-float {
  animation: floating 5s ease-in-out infinite;
}

@keyframes floating {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(8deg); }
}

/* ✨ SMOOTH REVEAL */
.animate-reveal {
  animation: reveal 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes reveal {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>