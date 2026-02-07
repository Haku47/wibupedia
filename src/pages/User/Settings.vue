<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/store/userStore.js'
import { useLibraryStore } from '@/store/libraryStore.js'

const userStore = useUserStore()
const libraryStore = useLibraryStore()

const form = ref({ ...userStore.profile })
const prefs = ref({ ...userStore.preferences })
const isSaving = ref(false)
const showToast = ref({ show: false, message: '', color: 'bg-brand-primary' })
const fileInput = ref(null)
const importFileInput = ref(null)

// --- MEMBER ROLE LOGIC ---
const isSuperAdmin = computed(() => userStore.profile.role === 'Super Administrator')

// --- THEME COLORS ---
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
              <div :style="{ backgroundColor: prefs.primaryColor }" class="w-12 h-1.5 rounded-full shadow-lg"></div>
              <span class="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Account Dashboard</span>
            </div>
            <h1 class="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none italic">
              Profile <span :style="{ color: prefs.primaryColor }">Settings</span>
            </h1>
          </div>
          
          <div class="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] backdrop-blur-xl">
             <div class="text-right">
                <p class="text-[9px] font-black text-text-muted uppercase tracking-widest opacity-40 mb-1">Last Update</p>
                <p class="text-xs font-bold text-white uppercase italic">07 Feb 2026</p>
             </div>
             <div class="w-px h-10 bg-white/10"></div>
             <i class="fa-solid fa-shield-halved text-2xl opacity-20"></i>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <div class="lg:col-span-4 space-y-10 animate-reveal-item" style="animation-delay: 0.1s">
          
          <div class="p-10 bg-dark-surface border border-white/5 rounded-[3.5rem] text-center relative overflow-hidden shadow-2xl group transition-all hover:border-white/10">
            <div @click="triggerAvatarUpload" class="relative w-40 h-40 mx-auto mb-10 rounded-[3rem] p-1.5 bg-white/[0.03] border border-white/10 cursor-pointer group/avatar overflow-hidden">
               <img :src="form.avatar" class="w-full h-full object-cover rounded-[2.5rem] transition-transform duration-1000 group-hover/avatar:scale-110" />
               <div class="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all backdrop-blur-md">
                  <i class="fa-solid fa-camera-retro text-white text-3xl mb-2"></i>
                  <span class="text-[9px] font-black text-white uppercase tracking-widest">Update</span>
               </div>
               <input type="file" ref="fileInput" @change="handleAvatarUpload" accept="image/*" class="hidden" />
            </div>
            
            <h3 class="text-3xl font-black uppercase tracking-tighter truncate leading-none mb-4">{{ form.name }}</h3>
            <div class="inline-flex items-center gap-3 px-5 py-2 bg-white/[0.03] rounded-2xl border border-white/5">
               <div class="w-1.5 h-1.5 rounded-full animate-pulse" :style="{ backgroundColor: prefs.primaryColor }"></div>
               <span class="text-[10px] font-black text-white/40 uppercase tracking-widest">{{ form.role }}</span>
            </div>
          </div>

          <div class="p-10 bg-dark-surface border border-white/5 rounded-[3.5rem] space-y-4 shadow-xl">
            <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8">Collection Management</h4>
            
            <button @click="handleExport" class="w-full py-5 bg-white/[0.02] border border-white/5 text-white/60 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-4">
              <i class="fa-solid fa-download"></i> Export Data
            </button>

            <button @click="importFileInput.click()" class="w-full py-5 bg-white/[0.02] border border-white/5 text-white/60 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-4">
              <i class="fa-solid fa-upload"></i> Import Data
            </button>
            <input type="file" ref="importFileInput" @change="handleImport" accept=".json" class="hidden" />

            <div class="pt-6 mt-4 border-t border-white/5">
              <button @click="clearAllData" class="w-full py-5 bg-red-500/5 border border-red-500/10 text-red-500/40 hover:text-white hover:bg-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4">
                <i class="fa-solid fa-trash-can"></i> Reset All Data
              </button>
            </div>
          </div>
        </div>

        <div class="lg:col-span-8 space-y-10 animate-reveal-item" style="animation-delay: 0.2s">
          
          <div class="p-12 bg-dark-surface border border-white/5 rounded-[4rem] shadow-2xl">
            <div class="flex items-center gap-5 mb-14">
              <div class="w-1.5 h-8 rounded-full" :style="{ backgroundColor: prefs.primaryColor }"></div>
              <h3 class="text-2xl font-black uppercase tracking-tighter">Profile Identity</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div class="space-y-4">
                <label class="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-30 ml-2">Display Name</label>
                <input v-model="form.name" type="text" class="w-full bg-white/[0.02] border border-white/5 rounded-[1.5rem] px-8 py-5 text-base font-bold text-white focus:border-white/20 outline-none transition-all placeholder:opacity-10" placeholder="Masukkan nama..." />
              </div>
              <div class="space-y-4">
                <label class="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-30 ml-2">Member Status</label>
                <input v-model="form.role" :readonly="!isSuperAdmin" type="text" class="w-full bg-white/[0.02] border border-white/5 rounded-[1.5rem] px-8 py-5 text-base font-bold text-white outline-none" :class="!isSuperAdmin ? 'opacity-30 cursor-not-allowed' : 'focus:border-white/20'" />
              </div>
              <div class="md:col-span-2 space-y-4">
                <label class="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-30 ml-2">Avatar Source URL</label>
                <input v-model="form.avatar" type="text" class="w-full bg-white/[0.02] border border-white/5 rounded-[1.5rem] px-8 py-5 text-xs font-medium text-white/40 focus:border-white/20 outline-none transition-all" />
              </div>
            </div>
          </div>

          <div class="p-12 bg-dark-surface border border-white/5 rounded-[4rem] shadow-2xl">
            <div class="flex items-center gap-5 mb-14">
              <div class="w-1.5 h-8 rounded-full" :style="{ backgroundColor: prefs.primaryColor }"></div>
              <h3 class="text-2xl font-black uppercase tracking-tighter">Theme Experience</h3>
            </div>
            
            <div class="space-y-16">
              <div>
                <label class="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-30 ml-2 mb-10 block">Primary Accent</label>
                <div class="flex flex-wrap gap-5">
                  <button v-for="color in THEME_COLORS" :key="color.hex" @click="applyThemeColor(color.hex)"
                    :style="{ backgroundColor: color.hex }"
                    class="w-16 h-16 rounded-[1.8rem] transition-all duration-500 hover:scale-110 flex items-center justify-center border-4 shadow-2xl"
                    :class="prefs.primaryColor === color.hex ? 'border-white scale-110 shadow-white/10' : 'border-transparent opacity-20 hover:opacity-100'">
                    <i v-if="prefs.primaryColor === color.hex" class="fa-solid fa-check text-white text-xl"></i>
                  </button>
                </div>
              </div>

              <div>
                <label class="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-30 ml-2 mb-10 block">Grid Density</label>
                <div class="inline-flex p-2 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                  <button v-for="mode in ['comfortable', 'compact']" :key="mode" @click="prefs.cardLayout = mode"
                    :class="prefs.cardLayout === mode ? 'bg-white text-black shadow-2xl' : 'text-text-muted hover:text-white'"
                    class="px-14 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all">
                    {{ mode }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-6">
            <button @click="saveSettings" :disabled="isSaving"
              class="group relative px-20 py-7 text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all overflow-hidden"
              :style="{ backgroundColor: prefs.primaryColor }">
              <span v-if="!isSaving" class="relative z-10 flex items-center gap-4">
                Apply Changes <i class="fa-solid fa-check-double text-[10px]"></i>
              </span>
              <span v-else class="relative z-10 flex items-center gap-4">
                <i class="fa-solid fa-circle-notch animate-spin"></i> Syncing...
              </span>
              <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>
          </div>

        </div>
      </div>
    </div>

    <Transition name="toast">
      <div v-if="showToast.show" :class="showToast.color"
           class="fixed bottom-12 left-1/2 -translate-x-1/2 px-10 py-5 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] text-white font-black text-[11px] uppercase tracking-widest flex items-center gap-5 z-[500] border border-white/10 backdrop-blur-3xl">
        <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
           <i class="fa-solid fa-bell text-sm"></i>
        </div>
        {{ showToast.message }}
      </div>
    </Transition>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }

/* 🚀 ANIMATION ENGINE */
.animate-reveal { animation: revealUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
.animate-reveal-item { opacity: 0; animation: revealUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }

@keyframes revealUp { 
  from { opacity: 0; transform: translateY(50px); filter: blur(15px); } 
  to { opacity: 1; transform: translateY(0); filter: blur(0); } 
}

/* Toast Transitions */
.toast-enter-active, .toast-leave-active { transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 80px) scale(0.8); }

/* Custom Inputs */
input { transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
</style>