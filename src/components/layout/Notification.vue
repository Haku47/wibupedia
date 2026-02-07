<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useJikan } from '@/composables/useJikan'

const { fetchSeasonal } = useJikan()
const emit = defineEmits(['close'])

const notifications = ref([
  {
    id: 'sync-1',
    title: 'Vault Sync Berhasil',
    desc: 'Koleksi lokal kamu telah berhasil disinkronkan dengan database.',
    time: 'Baru saja',
    type: 'sync',
    category: 'system', // Kategori khusus sistem
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
        title: `Rilis: ${anime.title}`,
        desc: `${anime.title} kini tersedia di katalog musim ini. Cek sekarang!`,
        time: 'System Update',
        type: 'update',
        category: 'anime', // Sesuai pillar utama
        isRead: false
      }))
      notifications.value = [...updates, ...notifications.value]
    }
  } catch (err) {
    console.error("Gagal memuat dynamic updates", err)
  } finally {
    isLoading.value = false
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.isRead = true)
}

// Helper untuk warna badge sesuai pilar
const getCategoryStyle = (cat) => {
  switch (cat) {
    case 'anime': return 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
    case 'manga': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    case 'novel': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    default: return 'bg-white/5 text-text-muted border-white/10'
  }
}

onMounted(() => {
  loadDynamicUpdates()
})
</script>

<template>
  <div class="notif-panel fixed md:absolute top-[70px] md:top-full right-0 md:right-0 w-[calc(100vw-2rem)] mx-4 md:mx-0 md:w-96 bg-dark-surface border border-dark-border rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden z-[110] backdrop-blur-3xl animate-in">
    
    <div class="p-5 md:p-6 border-b border-dark-border flex items-center justify-between bg-white/5">
      <div class="flex items-center gap-3">
        <div class="w-1.5 h-4 bg-brand-primary rounded-full"></div>
        <h3 class="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-text-main">Notifikasi</h3>
      </div>
      
      <div class="flex items-center gap-2">
        <button @click="markAllAsRead" class="text-[8px] font-black uppercase tracking-widest text-brand-primary hover:opacity-70 transition-opacity pr-2 border-r border-white/10">
          Mark Read
        </button>
        <button @click="$emit('close')" class="p-1 text-text-muted hover:text-white transition-colors">
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>
      </div>
    </div>

    <div class="max-h-[60vh] md:max-h-[400px] overflow-y-auto scrollbar-hide">
      <div v-if="isLoading" class="p-10 text-center">
        <i class="fa-solid fa-circle-notch animate-spin text-brand-primary text-xl"></i>
      </div>

      <div v-else v-for="notif in notifications" :key="notif.id" 
           class="p-5 border-b border-dark-border/50 hover:bg-white/5 transition-colors cursor-pointer group relative">
        
        <div v-if="!notif.isRead" class="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-10 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
        
        <div class="flex gap-4">
          <div class="w-10 h-10 shrink-0 rounded-xl bg-dark-bg border border-dark-border flex items-center justify-center group-hover:border-brand-primary/50 transition-colors shadow-inner">
            <i v-if="notif.type === 'system' || notif.type === 'sync'" class="fa-solid fa-rotate text-amber-500 text-xs"></i>
            <i v-else-if="notif.type === 'update'" class="fa-solid fa-play text-brand-primary text-xs"></i>
            <i v-else class="fa-solid fa-server text-emerald-500 text-xs"></i>
          </div>
          <div class="flex-grow">
            <div class="flex items-center gap-2 mb-1.5">
               <span :class="getCategoryStyle(notif.category)" class="px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest border">
                 {{ notif.category || 'System' }}
               </span>
               <span class="text-[8px] font-black uppercase tracking-widest opacity-20 truncate max-w-[100px]">{{ notif.time }}</span>
            </div>

            <h4 class="text-[12px] font-bold text-text-main mb-1 group-hover:text-brand-primary transition-colors leading-snug">{{ notif.title }}</h4>
            <p class="text-[10px] text-text-muted leading-relaxed mb-2 line-clamp-2 opacity-70">{{ notif.desc }}</p>
            
            <div v-if="!notif.isRead" class="flex justify-end">
               <div class="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="notifications.length === 0 && !isLoading" class="p-12 text-center">
        <i class="fa-solid fa-bell-slash text-3xl text-text-muted/20 mb-4"></i>
        <p class="text-[10px] font-black text-text-muted uppercase tracking-widest">No Updates</p>
      </div>
    </div>

    <RouterLink to="/changelog" @click="$emit('close')" class="group block p-5 text-center bg-white/5 hover:bg-brand-primary transition-all">
      <span class="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted group-hover:text-white transition-colors">
        System Log <i class="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
      </span>
    </RouterLink>
  </div>
</template>

<style scoped>
.animate-in { animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@media (max-width: 767px) {
  .notif-panel { left: 0; right: 0; width: calc(100% - 2rem); margin: 0 auto; top: 80px; }
}
@keyframes slideIn {
  from { opacity: 0; transform: translateY(15px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>