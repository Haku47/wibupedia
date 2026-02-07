<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/store/userStore.js'
import { useLibraryStore } from '@/store/libraryStore.js'
// 🛡️ Import Config untuk akses versi
import { APP_CONFIG } from '@/core/constants/APP_CONFIG'

const userStore = useUserStore()
const libraryStore = useLibraryStore()

const form = ref({ ...userStore.profile })
const prefs = ref({ ...userStore.preferences })
const isSaving = ref(false)
const showToast = ref({ show: false, message: '', color: 'bg-brand-primary' })
const fileInput = ref(null)
const importFileInput = ref(null)

// 🚀 CE FUNCTION: Ambil versi dari config pusat
const currentVersion = computed(() => APP_CONFIG.VERSION || 'v2.6.9 CE')

// --- MEMBER ROLE LOGIC ---
const isSuperAdmin = computed(() => userStore.profile.role === 'Super Administrator')

// --- THEME COLORS (Elite Palette) ---
const THEME_COLORS = [
  { name: 'Classic Blue', hex: '#3b82f6' },
  { name: 'Emerald Green', hex: '#10b981' },
  { name: 'Rose Red', hex: '#f43f5e' },
  { name: 'Amber Gold', hex: '#f59e0b' },
  { name: 'Vivid Purple', hex: '#a855f7' }
]

const triggerAvatarUpload = () => fileInput.value.click()

const handleAvatarUpload = (event) => {
  const file = event.target.files[0]
  if (!file || !file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = (e) => {
    form.value.avatar = e.target.result
    triggerToast('Profile Image Updated', 'bg-brand-primary')
  }
  reader.readAsDataURL(file)
}

const applyThemeColor = (hex) => {
  prefs.value.primaryColor = hex
  document.documentElement.style.setProperty('--color-brand-primary', hex)
}

const saveSettings = () => {
  isSaving.value = true
  setTimeout(() => {
    userStore.updateProfile(form.value)
    userStore.updatePreferences(prefs.value)
    isSaving.value = false
    triggerToast('Preferences Saved Successfully!', 'bg-emerald-500')
  }, 1000)
}

const triggerToast = (msg, color = 'bg-brand-primary') => {
  showToast.value = { show: true, message: msg, color }
  setTimeout(() => { showToast.value.show = false }, 3000)
}

// 📦 DATA MANAGEMENT
const handleExport = () => {
  const success = libraryStore.exportLibrary()
  if (success) triggerToast('Collection Backup Generated')
}

const handleImport = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (confirm('Konfirmasi: Import data akan mengganti seluruh koleksi saat ini. Lanjutkan?')) {
    try {
      const success = await libraryStore.importLibrary(file)
      if (success) {
        triggerToast('Collection Restored!', 'bg-emerald-500')
        setTimeout(() => window.location.reload(), 1000)
      }
    } catch (err) {
      triggerToast('Import Failed: Invalid File', 'bg-red-500')
    }
  }
  e.target.value = ''
}

const clearAllData = () => {
  if (confirm('⚠️ PERINGATAN: Hapus seluruh data aplikasi secara permanen?')) {
    localStorage.clear()
    window.location.reload()
  }
}

onMounted(() => {
  window.scrollTo(0, 0)
  document.documentElement.style.setProperty('--color-brand-primary', userStore.preferences.primaryColor)
})
</script>

<template>
  <main class="min-h-screen bg-dark-bg text-text-main pb-40 pt-28 relative overflow-hidden font-outfit">
    <div :style="{ backgroundColor: prefs.primaryColor }" class="absolute top-0 right-0 w-[800px] h-[800px] opacity-[0.03] blur-[150px] rounded-full pointer-events-none transition-all duration-1000"></div>

    <div class="max-w-6xl mx-auto px-6 relative z-10">
      
      <header class="mb-20 animate-reveal">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <div class="flex items-center gap-4 mb-6">
              <div :style="{ backgroundColor: prefs.primaryColor }" class="w-12 h-1 rounded-full shadow-lg"></div>
              <span class="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 ">Security Console</span>
            </div>
            <h1 class="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none">
              User <span :style="{ color: prefs.primaryColor }">Preferences</span>
            </h1>
          </div>
          
          <div class="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] backdrop-blur-xl group hover:border-white/10 transition-all shadow-2xl">
             <div class="text-right">
                <p class="text-[8px] font-black text-text-muted uppercase tracking-widest opacity-40 mb-1">Archive Build</p>
                <p class="text-xs font-black text-white uppercase tracking-widest">{{ currentVersion }}</p>
             </div>
             <div class="w-px h-10 bg-white/5"></div>
             <i class="fa-solid fa-microchip text-2xl opacity-20 group-hover:opacity-100 transition-opacity" :style="{ color: prefs.primaryColor }"></i>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <div class="lg:col-span-4 space-y-10 animate-reveal-item" style="animation-delay: 0.1s">
          
          <div class="p-10 bg-dark-surface/50 border border-white/5 rounded-[3.5rem] text-center relative overflow-hidden shadow-2xl backdrop-blur-3xl group">
            <div @click="triggerAvatarUpload" class="relative w-44 h-44 mx-auto mb-10 rounded-[3rem] p-1.5 bg-white/[0.02] border border-white/10 cursor-pointer group/avatar overflow-hidden shadow-inner">
               <img :src="form.avatar" class="w-full h-full object-cover rounded-[2.5rem] transition-transform duration-[1.5s] group-hover/avatar:scale-110" />
               <div class="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all backdrop-blur-sm">
                  <i class="fa-solid fa-fingerprint text-white text-4xl mb-3"></i>
                  <span class="text-[9px] font-black text-white uppercase tracking-widest">Identify User</span>
               </div>
               <input type="file" ref="fileInput" @change="handleAvatarUpload" accept="image/*" class="hidden" />
            </div>
            
            <h3 class="text-3xl font-black uppercase tracking-tighter truncate leading-none mb-4 text-white">{{ form.name }}</h3>
            <div class="inline-flex items-center gap-3 px-6 py-2.5 bg-black/40 rounded-2xl border border-white/5 shadow-xl">
               <div class="w-1.5 h-1.5 rounded-full animate-pulse" :style="{ backgroundColor: prefs.primaryColor }"></div>
               <span class="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">{{ form.role }}</span>
            </div>
          </div>

          <div class="p-10 bg-dark-surface/50 border border-white/5 rounded-[3.5rem] space-y-5 shadow-2xl backdrop-blur-3xl">
            <div class="flex items-center gap-3 mb-6 opacity-30">
               <i class="fa-solid fa-box-archive text-xs"></i>
               <h4 class="text-[9px] font-black uppercase tracking-[0.4em]">Archive Management</h4>
            </div>
            
            <button @click="handleExport" class="w-full py-5 bg-white/[0.02] border border-white/5 text-white/50 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-4 group">
              <i class="fa-solid fa-cloud-arrow-down group-hover:-translate-y-1 transition-transform"></i> Export Backup
            </button>

            <button @click="importFileInput.click()" class="w-full py-5 bg-white/[0.02] border border-white/5 text-white/50 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/20 transition-all flex items-center justify-center gap-4 group">
              <i class="fa-solid fa-cloud-arrow-up group-hover:-translate-y-1 transition-transform"></i> Restore Data
            </button>
            <input type="file" ref="importFileInput" @change="handleImport" accept=".json" class="hidden" />

            <div class="pt-8 mt-4 border-t border-white/5">
              <button @click="clearAllData" class="w-full py-5 bg-red-500/5 border border-red-500/10 text-red-500/30 hover:text-white hover:bg-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4">
                <i class="fa-solid fa-skull-crossbones"></i> Purge All Records
              </button>
            </div>
          </div>
        </div>

        <div class="lg:col-span-8 space-y-12 animate-reveal-item" style="animation-delay: 0.2s">
          
          <div class="p-12 bg-dark-surface border border-white/5 rounded-[4rem] shadow-2xl relative overflow-hidden group">
            <div class="flex items-center gap-6 mb-16">
              <div class="w-1.5 h-10 rounded-full" :style="{ backgroundColor: prefs.primaryColor }"></div>
              <h3 class="text-3xl font-black uppercase tracking-tighter text-white ">Identity</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div class="space-y-4">
                <label class="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-20 ml-2">Public Designation</label>
                <input v-model="form.name" type="text" class="w-full bg-white/[0.02] border border-white/5 rounded-[1.5rem] px-8 py-6 text-base font-bold text-white focus:bg-white/[0.05] focus:border-white/10 outline-none transition-all shadow-inner" placeholder="Operator Name" />
              </div>
              <div class="space-y-4">
                <label class="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-20 ml-2">Authority Level</label>
                <input v-model="form.role" :readonly="!isSuperAdmin" type="text" class="w-full bg-white/[0.02] border border-white/5 rounded-[1.5rem] px-8 py-6 text-base font-bold text-white outline-none shadow-inner" :class="!isSuperAdmin ? 'opacity-20 cursor-not-allowed' : 'focus:border-white/10'" />
              </div>
              <div class="md:col-span-2 space-y-4">
                <label class="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-20 ml-2">Avatar Digital Link</label>
                <input v-model="form.avatar" type="text" class="w-full bg-white/[0.02] border border-white/5 rounded-[1.5rem] px-8 py-6 text-[10px] font-medium text-white/30 focus:text-white/60 focus:border-white/10 outline-none transition-all shadow-inner truncate" />
              </div>
            </div>
          </div>

          <div class="p-12 bg-dark-surface border border-white/5 rounded-[4rem] shadow-2xl relative overflow-hidden group">
            <div class="flex items-center gap-6 mb-16">
              <div class="w-1.5 h-10 rounded-full" :style="{ backgroundColor: prefs.primaryColor }"></div>
              <h3 class="text-3xl font-black uppercase tracking-tighter text-white ">Visual Preferences</h3>
            </div>
            
            <div class="space-y-20">
              <div>
                <label class="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] opacity-30 ml-2 mb-10 block">Visual Chromatic Sync</label>
                <div class="flex flex-wrap gap-6">
                  <button v-for="color in THEME_COLORS" :key="color.hex" @click="applyThemeColor(color.hex)"
                    :style="{ backgroundColor: color.hex }"
                    class="w-16 h-16 rounded-[1.8rem] transition-all duration-700 hover:scale-110 flex items-center justify-center border-4 shadow-2xl relative group/color"
                    :class="prefs.primaryColor === color.hex ? 'border-white scale-110 shadow-white/10' : 'border-transparent opacity-20 hover:opacity-100'">
                    <i v-if="prefs.primaryColor === color.hex" class="fa-solid fa-shield-check text-white text-xl"></i>
                    <span class="absolute -bottom-10 whitespace-nowrap text-[8px] font-black uppercase tracking-widest opacity-0 group-hover/color:opacity-100 transition-opacity" :style="{ color: color.hex }">{{ color.name }}</span>
                  </button>
                </div>
              </div>

              <div>
                <label class="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] opacity-30 ml-2 mb-10 block">Grid Structural Density</label>
                <div class="inline-flex p-2 bg-black/40 border border-white/5 rounded-[2.5rem] shadow-2xl">
                  <button v-for="mode in ['comfortable', 'compact']" :key="mode" @click="prefs.cardLayout = mode"
                    :class="prefs.cardLayout === mode ? 'bg-white text-black shadow-2xl scale-105' : 'text-text-muted hover:text-white'"
                    class="px-14 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all  active:scale-95">
                    {{ mode }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-8">
            <button @click="saveSettings" :disabled="isSaving"
              class="group relative px-24 py-8 text-white rounded-[3rem] font-black text-[12px] uppercase tracking-[0.5em] shadow-[0_30px_60px_rgba(0,0,0,0.5)] hover:scale-105 active:scale-95 transition-all overflow-hidden"
              :style="{ backgroundColor: prefs.primaryColor }">
              <span v-if="!isSaving" class="relative z-10 flex items-center gap-5">
                Commit Preferences <i class="fa-solid fa-bolt-lightning text-sm group-hover:rotate-12 transition-transform"></i>
              </span>
              <span v-else class="relative z-10 flex items-center gap-5">
                <i class="fa-solid fa-sync animate-spin"></i> Synchronizing...
              </span>
              <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
            </button>
          </div>

        </div>
      </div>
    </div>

    <Transition name="toast">
      <div v-if="showToast.show" :class="showToast.color"
           class="fixed bottom-12 left-1/2 -translate-x-1/2 px-12 py-6 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] text-white font-black text-[11px] uppercase tracking-[0.3em] flex items-center gap-6 z-[600] border border-white/10 backdrop-blur-3xl ">
        <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
           <i class="fa-solid fa-satellite-dish text-sm animate-pulse"></i>
        </div>
        {{ showToast.message }}
      </div>
    </Transition>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.animate-reveal { animation: revealUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
.animate-reveal-item { opacity: 0; animation: revealUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
@keyframes revealUp { 
  from { opacity: 0; transform: translateY(60px); filter: blur(20px); } 
  to { opacity: 1; transform: translateY(0); filter: blur(0); } 
}
.toast-enter-active, .toast-leave-active { transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 100px) scale(0.8); }
input { transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
</style>