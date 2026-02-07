<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Footer from '@/components/layout/Footer.vue'
import ErrorBoundary from '@/components/shared/ErrorBoundary.vue'
import LoadingScreen from '@/components/shared/LoadingScreen.vue'
import QuickSearchOverlay from '@/components/shared/QuickSearchOverlay.vue'
import ReloadPrompt from '@/components/shared/ReloadPrompt.vue'

// --- STATES ---
const isInitialLoading = ref(true) 
const isSidebarOpen = ref(false)
const showScrollTop = ref(false)

// --- HANDLERS ---
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 400
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// --- LIFECYCLE ---
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  
  // Simulasi Inisialisasi System Vault (v1.8 Cinematic Preloader)
  setTimeout(() => {
    isInitialLoading.value = false
  }, 2500)
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
    
    <Navbar @toggle-sidebar="toggleSidebar" />

    <div class="flex-grow max-w-[1600px] mx-auto w-full flex flex-col lg:flex-row relative">
      
      <Sidebar 
        :is-open="isSidebarOpen" 
        @close="closeSidebar" 
      />

      <main class="flex-grow p-4 md:p-8 lg:p-10 min-w-0">
        <ErrorBoundary>
          <RouterView v-slot="{ Component }">
            <transition name="page-vault" mode="out-in">
              <component :is="Component" />
            </transition>
          </RouterView>
        </ErrorBoundary>
      </main>
    </div>

    <div class="lg:hidden fixed bottom-8 right-8 z-[100] flex flex-col gap-4">
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
        @click="toggleSidebar"
        class="w-18 h-18 bg-brand-primary text-white rounded-3xl shadow-[0_15px_40px_rgba(59,130,246,0.4)] flex items-center justify-center text-2xl transition-all active:scale-90 border border-white/20"
      >
        <Transition name="zoom" mode="out-in">
          <i :key="isSidebarOpen" :class="isSidebarOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-terminal'"></i>
        </Transition>
      </button>
    </div>

    <Footer />
    <ReloadPrompt />
  </div>
</template>

<style>
/* --- 1. GLOBAL BASE & RESET --- */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');

body {
  margin: 0;
  overflow-x: hidden;
  background-color: #0F172A;
  color: #F8FAFC;
}

/* --- 2. KUSTOMISASI NPROGRESS (Neon Glow) --- */
#nprogress .bar {
  background: #3B82F6 !important;
  height: 3px !important;
  box-shadow: 0 0 15px #3B82F6, 0 0 5px #3B82F6 !important;
}

/* --- 3. SCROLLBAR DESIGN (Modern Dark) --- */
::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { background: #0F172A; }
::-webkit-scrollbar-thumb { 
  background: #1E293B; 
  border-radius: 10px; 
  border: 2px solid #0F172A;
}
::-webkit-scrollbar-thumb:hover { background: #3B82F6; }

/* --- 4. SKELETON 2.0 GLOBAL ENGINE --- */
.skeleton-box {
  position: relative;
  overflow: hidden;
  background-color: #1E293B;
}
.skeleton-box::after {
  content: "";
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  background-image: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
  animation: shimmer-sweep 2s infinite;
}
@keyframes shimmer-sweep {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* --- 5. PAGE ANIMATIONS (CINEMATIC VAULT) --- */
.page-vault-enter-active,
.page-vault-leave-active { 
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1); 
}
.page-vault-enter-from { 
  opacity: 0; 
  filter: blur(20px); 
  transform: scale(0.98) translateY(20px); 
}
.page-vault-leave-to { 
  opacity: 0; 
  filter: blur(20px); 
  transform: scale(1.02); 
}

/* Zoom Transition for Buttons */
.zoom-enter-active, .zoom-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.zoom-enter-from, .zoom-leave-to { opacity: 0; transform: scale(0.5) rotate(-20deg); }
</style>