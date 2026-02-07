<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useJikan } from '@/composables/useJikan'

const { fetchSeasonal } = useJikan()
const emit = defineEmits(['close'])

const notifications = ref([
  {
    id: 'sync-1',
    title: 'Collection Updated',
    desc: 'Koleksi personal kamu berhasil disinkronkan dengan archive terbaru.',
    time: 'Baru saja',
    type: 'sync',
    category: 'community',
    isRead: false
  }
])

const isLoading = ref(false)

const loadDynamicUpdates = async () => {
  isLoading.value = true
  try {
    const seasonalData = await fetchSeasonal()
    if (seasonalData && seasonalData.length > 0) {
      const updates = seasonalData.slice(0, 2).map(anime => ({
        id: anime.mal_id,
        title: `Rilis Baru: ${anime.title}`,
        desc: `${anime.title} kini tersedia di daftar musim ini. Cek koleksinya!`,
        time: 'Info Komunitas',
        type: 'update',
        category: 'anime',
        isRead: false
      }))
      notifications.value = [...updates, ...notifications.value]
    }
  } catch (err) {
    console.error("Gagal memuat info terbaru", err)
  } finally {
    isLoading.value = false
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.isRead = true)
}

const getCategoryStyle = (cat) => {
  switch (cat) {
    case 'anime': return 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
    case 'manga': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    case 'novel': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    default: return 'bg-white/5 text-white/40 border-white/10'
  }
}

onMounted(() => {
  loadDynamicUpdates()
})
</script>

<template>
  <div class="notif-panel fixed md:absolute top-[75px] md:top-[calc(100%+1rem)] right-0 md:right-0 w-[calc(100vw-2rem)] mx-4 md:mx-0 md:w-[400px] bg-dark-surface/95 border border-white/10 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden z-[110] backdrop-blur-3xl animate-in font-outfit">
    
    <div class="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
      <div class="flex items-center gap-3">
        <div class="w-2 h-2 rounded-full bg-brand-primary shadow-lg animate-pulse"></div>
        <h3 class="text-xs font-black uppercase tracking-widest text-white">Notifications</h3>
      </div>
      
      <div class="flex items-center gap-4">
        <button @click="markAllAsRead" class="text-[9px] font-black uppercase tracking-widest text-brand-primary hover:opacity-50 transition-all italic">
          Clear All
        </button>
        <button @click="$emit('close')" class="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-red-500/20 hover:text-red-500 transition-all">
          <i class="fa-solid fa-xmark text-xs"></i>
        </button>
      </div>
    </div>

    <div class="max-h-[60vh] md:max-h-[450px] overflow-y-auto scrollbar-hide">
      <div v-if="isLoading" class="p-20 text-center">
        <i class="fa-solid fa-circle-notch animate-spin text-brand-primary text-xl"></i>
      </div>

      <div v-else v-for="notif in notifications" :key="notif.id" 
           class="p-6 border-b border-white/5 hover:bg-white/[0.03] transition-all cursor-pointer group relative">
        
        <div v-if="!notif.isRead" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-brand-primary rounded-r-full shadow-lg"></div>
        
        <div class="flex gap-5">
          <div class="w-12 h-12 shrink-0 rounded-2xl bg-dark-bg border border-white/5 flex items-center justify-center group-hover:border-brand-primary/30 transition-all shadow-inner">
            <i v-if="notif.type === 'sync'" class="fa-solid fa-cloud-arrow-down text-brand-primary text-sm"></i>
            <i v-else-if="notif.type === 'update'" class="fa-solid fa-bullhorn text-amber-500 text-sm"></i>
            <i v-else class="fa-solid fa-user-group text-emerald-500 text-sm"></i>
          </div>

          <div class="flex-grow">
            <div class="flex items-center justify-between mb-2">
               <span :class="getCategoryStyle(notif.category)" class="px-2.5 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider border shadow-sm">
                 {{ notif.category }}
               </span>
               <span class="text-[8px] font-bold uppercase tracking-widest text-white/20">{{ notif.time }}</span>
            </div>

            <h4 class="text-[13px] font-black text-white mb-1 group-hover:text-brand-primary transition-colors leading-tight">{{ notif.title }}</h4>
            <p class="text-[11px] text-text-muted leading-relaxed line-clamp-2 font-medium opacity-60">{{ notif.desc }}</p>
          </div>
        </div>
      </div>
      
      <div v-if="notifications.length === 0 && !isLoading" class="p-20 text-center">
        <div class="w-16 h-16 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto mb-6">
          <i class="fa-solid fa-bell-slash text-xl text-white/10"></i>
        </div>
        <p class="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">No New Alerts</p>
      </div>
    </div>

    <RouterLink to="/changelog" @click="$emit('close')" class="group flex items-center justify-center gap-3 p-6 bg-white/[0.02] hover:bg-brand-primary transition-all duration-500">
      <span class="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white transition-colors">
        Community History
      </span>
      <i class="fa-solid fa-arrow-right-long text-[10px] text-brand-primary group-hover:text-white group-hover:translate-x-2 transition-all"></i>
    </RouterLink>
  </div>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.scrollbar-hide::-webkit-scrollbar { display: none; }

.animate-in { 
  animation: slideIn 0.5s cubic-bezier(0.22, 1, 0.36, 1); 
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px) scale(0.95); filter: blur(10px); }
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