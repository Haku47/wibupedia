<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router' // 🛡️ Tambahkan useRouter
import { useJikan } from '@/composables/useJikan'

const router = useRouter() // 🚀 Inisialisasi router
const { fetchSeasonal } = useJikan()
const emit = defineEmits(['close'])

const notifications = ref([
  {
    id: 'sync-1',
    title: 'Archive Synchronized',
    desc: 'Koleksi personal divalidasi dengan database komunitas.',
    time: 'Now',
    type: 'sync',
    category: 'system',
    isRead: false
  }
])

const isLoading = ref(false)

const loadDynamicUpdates = async () => {
  isLoading.value = true
  try {
    const seasonalData = await fetchSeasonal()
    if (seasonalData && seasonalData.length > 0) {
      const updates = seasonalData.slice(0, 3).map(item => {
        let cat = 'tv'
        let statusLabel = 'New Airing'
        
        if (item.type === 'Movie') {
          cat = 'movie'
          statusLabel = 'Hot Movie'
        } else if (item.type === 'ONA') {
          cat = 'donghua'
          statusLabel = 'New ONA'
        } else if (item.type === 'Manga') {
          cat = 'manga'
          statusLabel = 'Hot Manga'
        }

        return {
          id: item.mal_id, // ID MAL untuk redirect
          title: `${statusLabel}: ${item.title}`,
          desc: `${item.title} masuk dalam archive komunitas musim ini.`,
          time: 'Notification',
          type: 'update',
          category: cat,
          isRead: false
        }
      })
      notifications.value = [...updates, ...notifications.value]
    }
  } catch (err) {
    console.error("Community Notification Interrupt:", err)
  } finally {
    isLoading.value = false
  }
}

// --- 🚀 NEW: NAVIGATION HANDLER ---
const handleNotifClick = (notif) => {
  notif.isRead = true // Tandai sebagai sudah dibaca
  emit('close') // Tutup panel notifikasi

  if (notif.type === 'update') {
    // Redirect ke halaman detail (Anime/Manga sesuai kategori)
    const routePath = notif.category === 'manga' || notif.category === 'novel' ? 'manga' : 'anime'
    router.push(`/${routePath}/${notif.id}`)
  } else if (notif.type === 'sync') {
    router.push('/library')
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
  <div class="notif-panel fixed md:absolute top-[75px] md:top-[calc(100%+0.8rem)] right-0 md:right-0 w-[calc(100vw-2rem)] mx-4 md:mx-0 md:w-[340px] bg-dark-surface/98 border border-white/10 rounded-[2rem] shadow-[0_40px_80px_rgba(0,0,0,0.8)] overflow-hidden z-[110] backdrop-blur-3xl animate-in font-outfit">
    
    <div class="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
      <div class="flex items-center gap-2">
        <div class="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse"></div>
        <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Notifications</h3>
      </div>
      
      <div class="flex items-center gap-3">
        <button @click="markAllAsRead" class="text-[8px] font-black uppercase tracking-widest text-brand-primary/60 hover:text-brand-primary transition-all">
          Mark Read
        </button>
        <button @click="$emit('close')" class="w-6 h-6 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all">
          <i class="fa-solid fa-xmark text-[8px]"></i>
        </button>
      </div>
    </div>

    <div class="max-h-[50vh] md:max-h-[380px] overflow-y-auto scrollbar-hide custom-scroll">
      <div v-if="isLoading" class="p-16 text-center">
        <i class="fa-solid fa-circle-notch animate-spin text-brand-primary text-xl opacity-20"></i>
      </div>

      <div v-else v-for="notif in notifications" :key="notif.id" 
           @click="handleNotifClick(notif)"
           class="px-6 py-5 border-b border-white/[0.03] hover:bg-white/[0.02] transition-all cursor-pointer group relative">
        
        <div v-if="!notif.isRead" class="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary"></div>
        
        <div class="flex gap-4">
          <div class="w-10 h-10 shrink-0 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:border-white/10 transition-all">
            <i v-if="notif.type === 'sync'" class="fa-solid fa-check-double text-brand-primary text-xs"></i>
            <i v-else-if="notif.category === 'movie'" class="fa-solid fa-film text-purple-500 text-xs"></i>
            <i v-else-if="notif.category === 'donghua'" class="fa-solid fa-dragon text-red-500 text-xs"></i>
            <i v-else-if="notif.category === 'manga'" class="fa-solid fa-book-open text-emerald-500 text-xs"></i>
            <i v-else-if="notif.category === 'novel'" class="fa-solid fa-scroll text-amber-500 text-xs"></i>
            <i v-else class="fa-solid fa-bell text-brand-primary text-xs"></i>
          </div>

          <div class="flex-grow overflow-hidden text-left">
            <div class="flex items-center justify-between mb-1">
               <span :class="getCategoryStyle(notif.category)" class="px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-wider border transition-colors">
                 {{ notif.category }}
               </span>
               <span class="text-[7px] font-bold text-white/20">{{ notif.time }}</span>
            </div>

            <h4 class="text-[11px] font-black text-white group-hover:text-brand-primary transition-colors truncate tracking-tight uppercase leading-tight">{{ notif.title }}</h4>
            <p class="text-[10px] text-text-muted leading-snug line-clamp-1 opacity-40 italic">{{ notif.desc }}</p>
          </div>
        </div>
      </div>
      
      <div v-if="notifications.length === 0 && !isLoading" class="p-16 text-center">
        <i class="fa-solid fa-bell-slash text-xl text-white/5 mb-3 block"></i>
        <p class="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">All Clean</p>
      </div>
    </div>

    <RouterLink to="/changelog" @click="$emit('close')" class="flex items-center justify-center gap-2 py-4 bg-white/[0.02] hover:bg-brand-primary transition-all duration-500 border-t border-white/5 group">
      <span class="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-white transition-colors">
        System Logs
      </span>
      <i class="fa-solid fa-arrow-right text-[8px] text-brand-primary group-hover:text-white transition-all"></i>
    </RouterLink>
  </div>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.custom-scroll::-webkit-scrollbar { width: 3px; }
.custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
.animate-in { animation: slideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>