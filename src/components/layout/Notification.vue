<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useJikan } from '@/composables/useJikan'

const { fetchSeasonal } = useJikan()
const emit = defineEmits(['close'])

const notifications = ref([
  {
    id: 'sync-1',
    title: 'Archive Synchronized',
    desc: 'Koleksi personal kamu berhasil divalidasi dengan database global.',
    time: 'Just Now',
    type: 'sync',
    category: 'system',
    isRead: false
  }
])

const isLoading = ref(false)

// --- 🛡️ v2.4.5: ELITE CATEGORY FEED ---
const loadDynamicUpdates = async () => {
  isLoading.value = true
  try {
    const seasonalData = await fetchSeasonal()
    if (seasonalData && seasonalData.length > 0) {
      // Mapping real-time data ke feed notifikasi
      const updates = seasonalData.slice(0, 3).map(item => {
        // Deteksi kategori untuk styling
        let cat = 'tv'
        if (item.type === 'Movie') cat = 'movie'
        if (item.type === 'ONA') cat = 'donghua'

        return {
          id: item.mal_id,
          title: `New Intel: ${item.title}`,
          desc: `${item.title} kini terdaftar sebagai archive populer musim ini.`,
          time: 'Global Feed',
          type: 'update',
          category: cat,
          isRead: false
        }
      })
      notifications.value = [...updates, ...notifications.value]
    }
  } catch (err) {
    console.error("Feed Interrupt:", err)
  } finally {
    isLoading.value = false
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.isRead = true)
}

const getCategoryStyle = (cat) => {
  const styles = {
    tv: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
    movie: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    manga: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    novel: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    donghua: 'bg-red-500/10 text-red-500 border-red-500/20',
    system: 'bg-white/5 text-white/40 border-white/10'
  }
  return styles[cat] || styles.system
}

onMounted(() => {
  loadDynamicUpdates()
})
</script>

<template>
  <div class="notif-panel fixed md:absolute top-[75px] md:top-[calc(100%+1rem)] right-0 md:right-0 w-[calc(100vw-2rem)] mx-4 md:mx-0 md:w-[420px] bg-dark-surface/95 border border-white/10 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.9)] overflow-hidden z-[110] backdrop-blur-3xl animate-in font-outfit">
    
    <div class="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
      <div class="flex items-center gap-3">
        <div class="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse"></div>
        <h3 class="text-[11px] font-black uppercase tracking-[0.3em] text-white">Live Intel Feed</h3>
      </div>
      
      <div class="flex items-center gap-4">
        <button @click="markAllAsRead" class="text-[9px] font-black uppercase tracking-widest text-brand-primary hover:text-white transition-all italic">
          Clear All
        </button>
        <button @click="$emit('close')" class="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-red-500/20 hover:text-red-500 transition-all">
          <i class="fa-solid fa-xmark text-[10px]"></i>
        </button>
      </div>
    </div>

    <div class="max-h-[60vh] md:max-h-[480px] overflow-y-auto scrollbar-hide custom-scroll">
      <div v-if="isLoading" class="p-24 text-center">
        <i class="fa-solid fa-compass animate-spin text-brand-primary text-2xl opacity-20"></i>
      </div>

      <div v-else v-for="notif in notifications" :key="notif.id" 
           class="p-8 border-b border-white/[0.03] hover:bg-white/[0.03] transition-all cursor-pointer group relative">
        
        <div v-if="!notif.isRead" class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-brand-primary rounded-r-full shadow-lg"></div>
        
        <div class="flex gap-6">
          <div class="w-14 h-14 shrink-0 rounded-2xl bg-dark-bg border border-white/5 flex items-center justify-center group-hover:border-white/20 transition-all shadow-inner">
            <i v-if="notif.type === 'sync'" class="fa-solid fa-shield-check text-brand-primary text-lg"></i>
            <i v-else-if="notif.category === 'movie'" class="fa-solid fa-film text-purple-500 text-lg"></i>
            <i v-else-if="notif.category === 'donghua'" class="fa-solid fa-dragon text-red-500 text-lg"></i>
            <i v-else class="fa-solid fa-bolt text-amber-500 text-lg"></i>
          </div>

          <div class="flex-grow">
            <div class="flex items-center justify-between mb-2.5">
               <span :class="getCategoryStyle(notif.category)" class="px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider border shadow-sm">
                 {{ notif.category }}
               </span>
               <span class="text-[8px] font-bold uppercase tracking-widest text-white/20">{{ notif.time }}</span>
            </div>

            <h4 class="text-[14px] font-black text-white mb-1.5 group-hover:text-brand-primary transition-colors leading-tight tracking-tight">{{ notif.title }}</h4>
            <p class="text-[12px] text-text-muted leading-relaxed line-clamp-2 font-medium opacity-50">{{ notif.desc }}</p>
          </div>
        </div>
      </div>
      
      <div v-if="notifications.length === 0 && !isLoading" class="p-24 text-center">
        <div class="w-20 h-20 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto mb-6">
          <i class="fa-solid fa-satellite-dish text-2xl text-white/10"></i>
        </div>
        <p class="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Archive is Silent</p>
      </div>
    </div>

    <RouterLink to="/changelog" @click="$emit('close')" class="group flex items-center justify-center gap-4 p-8 bg-white/[0.01] hover:bg-brand-primary transition-all duration-700 border-t border-white/5">
      <span class="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-white transition-colors italic">
        View Build Logs
      </span>
      <i class="fa-solid fa-chevron-right text-[10px] text-brand-primary group-hover:text-white group-hover:translate-x-2 transition-all"></i>
    </RouterLink>
  </div>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.scrollbar-hide::-webkit-scrollbar { display: none; }

.custom-scroll::-webkit-scrollbar { width: 4px; }
.custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }

.animate-in { 
  animation: slideIn 0.6s cubic-bezier(0.22, 1, 0.36, 1); 
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(30px) scale(0.95); filter: blur(15px); }
  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}

@media (max-width: 767px) {
  .notif-panel { 
    left: 0; 
    right: 0; 
    width: calc(100% - 2rem); 
    margin: 0 auto; 
    top: 85px; 
  }
}
</style>