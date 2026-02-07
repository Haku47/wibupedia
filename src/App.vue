<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import ErrorBoundary from '@/components/shared/ErrorBoundary.vue'
import LoadingScreen from '@/components/shared/LoadingScreen.vue'
import QuickSearchOverlay from '@/components/shared/QuickSearchOverlay.vue'
import ReloadPrompt from '@/components/shared/ReloadPrompt.vue'
import { SpeedInsights } from '@vercel/speed-insights/vue'

// --- STATES ---
const isInitialLoading = ref(true) 
const showScrollTop = ref(false)

// --- HANDLERS ---
const handleScroll = () => {
  showScrollTop.value = window.scrollY > 400
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// --- LIFECYCLE ---
onMounted(() => {
  // 🛡️ Optimized scroll listener
  window.addEventListener('scroll', handleScroll, { passive: true })
  
  // Simulasi Inisialisasi System Vault (v1.9.9 Tactical Preloader)
  setTimeout(() => {
    isInitialLoading.value = false
  }, 2000)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <Teleport to="body">
    <LoadingScreen :isLoading="isInitialLoading" />
    <QuickSearchOverlay />
  </Teleport>

  <div v-if="!isInitialLoading" class="min-h-screen bg-dark-bg text-text-main flex flex-col font-sans selection:bg-brand-primary/30">
    
    <Navbar />

    <div class="flex-grow w-full flex flex-col relative">
      <main class="flex-grow min-w-0">
        <ErrorBoundary>
          <RouterView v-slot="{ Component }">
            <transition name="page-vault" mode="out-in">
              <component :is="Component" />
            </transition>
          </RouterView>
        </ErrorBoundary>
      </main>
    </div>

    <div class="fixed bottom-8 right-8 z-[100] flex flex-col gap-4">
      <Transition name="zoom">
        <button 
          v-if="showScrollTop"
          @click="scrollToTop"
          class="w-14 h-14 bg-dark-surface/80 backdrop-blur-xl border border-white/5 text-text-main rounded-2xl shadow-2xl flex items-center justify-center transition-all active:scale-90"
        >
          <i class="fa-solid fa-chevron-up"></i>
        </button>
      </Transition>

      <button 
        @click="$router.push('/search')"
        class="w-16 h-16 bg-brand-primary text-white rounded-2xl shadow-neon flex items-center justify-center text-xl transition-all active:scale-95 border border-white/20"
      >
        <i class="fa-solid fa-terminal"></i>
      </button>
    </div>

    <Footer />
    <ReloadPrompt />
    <SpeedInsights />
  </div>
</template>

<style>
/* --- 1. GLOBAL BASE & RESET --- */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');

:root {
  --color-brand-primary: #3B82F6;
}

body {
  margin: 0;
  overflow-x: hidden;
  background-color: #0F172A;
  color: #F8FAFC;
  font-family: 'Outfit', sans-serif;
}

/* --- 2. KUSTOMISASI NPROGRESS (Neon Glow) --- */
#nprogress .bar {
  background: var(--color-brand-primary) !important;
  height: 3px !important;
  box-shadow: 0 0 15px var(--color-brand-primary), 0 0 5px var(--color-brand-primary) !important;
}

/* --- 3. SCROLLBAR DESIGN (Modern Dark) --- */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #0F172A; }
::-webkit-scrollbar-thumb { 
  background: #1E293B; 
  border-radius: 10px; 
}
::-webkit-scrollbar-thumb:hover { background: var(--color-brand-primary); }

/* --- 4. SKELETON 2.0 GLOBAL ENGINE (GPU Optimized) --- */
.skeleton-box {
  position: relative;
  overflow: hidden;
  background-color: #1E293B;
  will-change: transform;
}
.skeleton-box::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
  animation: shimmer-sweep 2s infinite;
}
@keyframes shimmer-sweep {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* --- 5. PAGE ANIMATIONS (CINEMATIC VAULT) --- */
.page-vault-enter-active,
.page-vault-leave-active { 
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1); 
}
.page-vault-enter-from { 
  opacity: 0; 
  transform: translateY(10px); 
}
.page-vault-leave-to { 
  opacity: 0; 
  filter: blur(10px);
}

.shadow-neon { box-shadow: 0 0 20px rgba(59, 130, 246, 0.4); }

/* Zoom Transition for Buttons */
.zoom-enter-active, .zoom-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.zoom-enter-from, .zoom-leave-to { opacity: 0; transform: scale(0.5); }
</style>