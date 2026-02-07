<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { APP_CONFIG } from '@/core/constants/APP_CONFIG'
import { useUserStore } from '@/store/userStore.js'

const route = useRoute()
const userStore = useUserStore()
const currentYear = new Date().getFullYear()

// 🛡️ v2.3.1: Auto-Hide Logic
const isAuthPage = computed(() => {
  const authRoutes = ['/auth', '/login', '/register']
  return authRoutes.includes(route.path)
})

const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')

const getSocialIcon = (platform) => {
  const icons = {
    github: 'fa-brands fa-github',
    instagram: 'fa-brands fa-instagram',
    discord: 'fa-brands fa-discord',
    twitter: 'fa-brands fa-x-twitter',
    x: 'fa-brands fa-x-twitter',
    facebook: 'fa-brands fa-facebook',
    youtube: 'fa-brands fa-youtube'
  }
  return icons[platform.toLowerCase()] || 'fa-solid fa-link'
}

const linkGroups = {
  navigation: [
    { name: 'Discover', path: '/' },
    { name: 'Search Archive', path: '/search' },
    { name: 'My Library', path: '/library' }
  ],
  community: [
    { name: 'About Us', path: '/about' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Changelog', path: '/changelog' },
    { name: 'Contact', path: '/contact' },
    { name: 'Disclaimer', path: '/disclaimer' }
  ],
  ecosystem: [
    { name: 'Jikan API', url: 'https://jikan.moe/' },
    { name: 'MyAnimeList', url: 'https://myanimelist.net/' },
    { name: 'API Status', path: '/status' }
  ]
}
</script>

<template>
  <footer v-if="!isAuthPage" class="footer-root border-t border-white/5 mt-auto relative overflow-hidden bg-dark-bg font-outfit">
    
    <div :style="{ backgroundColor: primaryColor }" class="absolute -bottom-40 -left-40 w-[500px] h-[500px] opacity-[0.03] blur-[150px] rounded-full pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-8 py-20 md:py-28 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-8 items-start">
        
        <div class="lg:col-span-2 space-y-10 text-center md:text-left">
          <div>
            <RouterLink to="/" class="inline-flex items-center gap-5 group mb-8">
              <div :style="{ backgroundColor: primaryColor }"
                   class="w-14 h-14 rounded-3xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-all duration-700 border border-white/10 group-hover:scale-110">
                <span class="text-white font-black text-2xl italic tracking-tighter">W</span>
              </div>
              <div class="flex flex-col">
                <span class="text-3xl font-black tracking-tighter text-white uppercase italic leading-none">
                  Wibu<span :style="{ color: primaryColor }">Pedia</span>
                </span>
                <span class="text-[8px] font-black uppercase tracking-[0.6em] text-white/20 mt-2">Community Hub</span>
              </div>
            </RouterLink>

            <p class="text-text-muted text-base leading-relaxed opacity-50 max-w-sm mx-auto md:mx-0 font-medium">
              Platform modern untuk mengelola archive anime, manga, dan novel favoritmu. Dibangun dengan fokus pada kecepatan dan keintiman komunitas.
            </p>
          </div>

          <div class="flex flex-wrap justify-center md:justify-start gap-4">
            <div class="px-5 py-2 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center gap-3 group/v">
              <div class="w-1.5 h-1.5 rounded-full animate-pulse" :style="{ backgroundColor: primaryColor }"></div>
              <span class="text-[10px] text-white font-black tracking-widest tabular-nums">{{ APP_CONFIG.VERSION }}</span>
              <div class="h-3 w-px bg-white/10"></div>
              <span class="text-[8px] font-black uppercase tracking-widest text-text-muted opacity-40">Stable Build</span>
            </div>
          </div>
          
          <div class="flex gap-4 justify-center md:justify-start">
            <a v-for="(url, platform) in APP_CONFIG.SOCIAL" 
               :key="platform" :href="url" target="_blank" rel="noopener noreferrer"
               class="w-12 h-12 rounded-[1.2rem] border border-white/5 flex items-center justify-center text-text-muted transition-all hover:scale-110 active:scale-95 bg-white/[0.02] hover:bg-white/[0.08]"
               @mouseenter="e => e.currentTarget.style.color = primaryColor"
               @mouseleave="e => e.currentTarget.style.color = ''"
            >
               <i :class="getSocialIcon(platform)" class="text-xl"></i>
            </a>
          </div>
        </div>

        <div v-for="(links, group) in linkGroups" :key="group" class="text-left bg-white/[0.01] p-8 rounded-[2.5rem] border border-white/[0.03] hover:border-white/5 transition-colors">
          <h4 class="text-white font-black mb-10 uppercase text-[9px] tracking-[0.5em] opacity-20">
            {{ group }}
          </h4>
          <ul class="space-y-6">
            <li v-for="link in links" :key="link.name">
              <RouterLink v-if="link.path" :to="link.path" 
                class="text-[14px] text-text-muted font-bold transition-all inline-block opacity-40 hover:opacity-100 hover:translate-x-2"
                @mouseenter="e => e.currentTarget.style.color = primaryColor"
                @mouseleave="e => e.currentTarget.style.color = ''"
              >
                {{ link.name }}
              </RouterLink>
              <a v-else :href="link.url" target="_blank" rel="noopener noreferrer" 
                class="text-[14px] text-text-muted font-bold transition-all flex items-center gap-3 group/ext opacity-40 hover:opacity-100 hover:translate-x-2"
                @mouseenter="e => e.currentTarget.style.color = primaryColor"
                @mouseleave="e => e.currentTarget.style.color = ''"
              >
                {{ link.name }}
                <i class="fa-solid fa-arrow-up-right-from-square text-[9px] opacity-10 group-hover/ext:opacity-100 transition-opacity"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-white/5 mt-28 pt-12">
        <div class="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div class="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p class="text-[11px] text-text-muted font-black tracking-widest opacity-20 uppercase">
              &copy; {{ currentYear }} • Malangan Dev Team
            </p>
            <div class="hidden md:block h-4 w-px bg-white/5"></div>
            <div class="flex items-center gap-3 group">
              <span class="text-[10px] text-text-muted font-bold opacity-30 uppercase tracking-widest">Handcrafted with</span>
              <i class="fa-solid fa-heart text-[10px] animate-pulse group-hover:scale-125 transition-transform" :style="{ color: primaryColor }"></i>
              <span class="text-[10px] text-text-muted font-bold opacity-30 uppercase tracking-widest">in Malang, ID</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
li { list-style: none; }

.footer-root a, .footer-root button {
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>