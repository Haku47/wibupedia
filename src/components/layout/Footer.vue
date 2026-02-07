<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { APP_CONFIG } from '@/core/constants/APP_CONFIG'
import { useUserStore } from '@/store/userStore'

const userStore = useUserStore()
const currentYear = new Date().getFullYear()

// --- DYNAMIC ACCENT ENGINE v1.8 ---
const primaryColor = computed(() => userStore.preferences.primaryColor || '#3b82f6')

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
  jelajah: [
    { name: 'Home', path: '/' },
    { name: 'Pencarian', path: '/search' },
    { name: 'Library', path: '/library' }
  ],
  wibupedia: [
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Privacy', path: '/privacy' },
    { name: 'Disclaimer', path: '/disclaimer' },
    { name: 'Changelog', path: '/changelog' }
  ],
  ekosistem: [
    { name: 'API Status', path: '/status' },
    { name: 'Jikan API', url: 'https://jikan.moe/' },
    { name: 'MAL', url: 'https://myanimelist.net/' }
  ]
}
</script>

<template>
  <footer class="footer-container border-t border-white/5 mt-auto relative overflow-hidden">
    <div :style="{ backgroundColor: primaryColor }" class="absolute -bottom-24 -left-24 w-64 h-64 opacity-[0.03] blur-[100px] rounded-full pointer-events-none transition-all duration-1000"></div>

    <div class="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10">
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-10 items-start">
        
        <div class="lg:col-span-2 text-center md:text-left">
          <RouterLink to="/" class="inline-flex items-center gap-4 mb-8 group">
            <div :style="{ backgroundColor: primaryColor }"
                 class="brand-box w-12 h-12 rounded-[1.2rem] flex items-center justify-center shadow-2xl group-hover:rotate-6 transition-all duration-700 border border-white/10">
              <span class="text-white font-black text-2xl font-outfit">W</span>
            </div>
            <span class="text-2xl font-black tracking-tighter text-text-main font-outfit uppercase italic">
              Wibu<span :style="{ color: primaryColor }" class="transition-colors duration-700">Pedia</span>
            </span>
          </RouterLink>
          <p class="text-text-muted text-[13px] md:text-[14px] leading-relaxed mb-10 font-medium opacity-50 max-w-sm mx-auto md:mx-0 italic">
            Arsip digital personal untuk eksplorasi anime, manga, dan novel. Membangun standar kedaulatan data komunitas yang tajam dan transparan.
          </p>
          
          <div class="flex gap-4 justify-center md:justify-start">
            <a v-for="(url, platform) in APP_CONFIG.SOCIAL" 
               :key="platform" :href="url" target="_blank" rel="noopener noreferrer"
               class="social-link w-12 h-12 rounded-2xl border border-white/5 flex items-center justify-center text-text-muted transition-all hover:scale-110 active:scale-95 bg-white/5 backdrop-blur-sm"
               @mouseenter="e => e.currentTarget.style.color = primaryColor"
               @mouseleave="e => e.currentTarget.style.color = ''"
            >
               <i :class="getSocialIcon(platform)" class="text-xl transition-colors duration-500"></i>
            </a>
          </div>
        </div>

        <div v-for="(links, group) in linkGroups" :key="group" class="text-left">
          <h4 class="text-text-main font-black mb-8 uppercase text-[10px] tracking-[0.4em] opacity-30 font-outfit italic">
            {{ group }}
          </h4>
          <ul class="space-y-5">
            <li v-for="link in links" :key="link.name">
              <RouterLink v-if="link.path" :to="link.path" 
                class="footer-link text-[13px] md:text-[14px] text-text-muted font-medium transition-all inline-block opacity-70 hover:opacity-100 hover:translate-x-1"
                @mouseenter="e => e.currentTarget.style.color = primaryColor"
                @mouseleave="e => e.currentTarget.style.color = ''"
              >
                {{ link.name }}
              </RouterLink>
              <a v-else :href="link.url" target="_blank" rel="noopener noreferrer" 
                class="footer-link text-[13px] md:text-[14px] text-text-muted font-medium transition-all flex items-center gap-2 group/ext opacity-70 hover:opacity-100"
                @mouseenter="e => e.currentTarget.style.color = primaryColor"
                @mouseleave="e => e.currentTarget.style.color = ''"
              >
                {{ link.name }}
                <i class="fa-solid fa-arrow-up-right-from-square text-[8px] opacity-20 group-hover/ext:opacity-100 transition-all"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-white/5 mt-24 pt-12 flex flex-col md:flex-row justify-between items-center gap-10">
        <div class="text-center md:text-left order-2 md:order-1">
          <p class="text-[11px] md:text-[12px] text-text-muted font-medium font-outfit tracking-wider opacity-40">
            &copy; {{ currentYear }} <span class="text-text-main font-black tracking-widest uppercase">Malangan Dev</span>. 
            <span class="hidden md:inline mx-5 opacity-10">|</span>
            <span class="block md:inline mt-4 md:mt-0 italic">Securely Handcrafted with 
              <i class="fa-solid fa-bolt text-[10px] mx-1 transition-colors duration-700" :style="{ color: primaryColor }"></i> 
              Malang, ID
            </span>
          </p>
        </div>
        
        <div class="flex items-center gap-4 order-1 md:order-2">
          <div class="version-badge flex items-center gap-4 px-5 py-2.5 border border-white/5 rounded-2xl bg-white/5 backdrop-blur-md shadow-inner group transition-all hover:border-white/10">
            <div class="flex items-center gap-3">
              <div class="relative flex h-2 w-2">
                <span :style="{ backgroundColor: primaryColor }" class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40"></span>
                <span :style="{ backgroundColor: primaryColor }" class="relative inline-flex rounded-full h-2 w-2"></span>
              </div>
              <span class="text-[10px] text-text-main font-black tracking-[0.2em] uppercase transition-all duration-700 tabular-nums">
                {{ APP_CONFIG.VERSION }}
              </span>
            </div>
            <div class="h-4 w-px bg-white/10 mx-1"></div>
            <span :style="{ color: primaryColor }" class="text-[9px] font-black uppercase tracking-[0.3em] italic animate-pulse">
              {{ APP_CONFIG.STATUS || 'LATEST' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-container {
  background-color: #0F172A;
}
.font-outfit { font-family: 'Outfit', sans-serif; }
.footer-link { text-decoration: none; }
li { list-style: none; }

@media (max-width: 768px) {
  .footer-link { padding: 2px 0; }
}
</style>