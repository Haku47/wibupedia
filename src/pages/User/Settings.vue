<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/store/userStore'
import { useLibraryStore } from '@/store/libraryStore'

const userStore = useUserStore()
const libraryStore = useLibraryStore()

const form = ref({ ...userStore.profile })
const prefs = ref({ ...userStore.preferences })
const isSaving = ref(false)
const showToast = ref({ show: false, message: '', color: 'bg-emerald-500' })
const fileInput = ref(null)
const importFileInput = ref(null)

// --- ROLE GUARD LOGIC ---
const isSuperAdmin = computed(() => userStore.profile.role === 'Super Administrator')
const canEditIdentity = computed(() => isSuperAdmin.value)

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
    triggerToast('Avatar Synchronized', 'bg-brand-primary')
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
    triggerToast('Core Configuration Deployed!', 'bg-emerald-500')
  }, 1000)
}

const triggerToast = (msg, color = 'bg-brand-primary') => {
  showToast.value = { show: true, message: msg, color }
  setTimeout(() => { showToast.value.show = false }, 3000)
}

// 🛡️ DATA PROTOCOLS (EXPORT/IMPORT)
const handleExport = () => {
  const success = libraryStore.exportLibrary()
  if (success) triggerToast('Archive Exported Successfully')
}

const handleImport = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (confirm('⚠️ PERINGATAN: Import data akan menimpa seluruh Library saat ini. Lanjutkan?')) {
    try {
      const success = await libraryStore.importLibrary(file)
      if (success) {
        triggerToast('Archive Restored!', 'bg-emerald-500')
        setTimeout(() => window.location.reload(), 1000)
      }
    } catch (err) {
      triggerToast('Restore Failed: Invalid File', 'bg-red-500')
    }
  }
  e.target.value = ''
}

const clearAllData = () => {
  if (!isSuperAdmin.value) return
  if (confirm('CRITICAL: Purge all local data permanently?')) {
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
  <main class="min-h-screen bg-dark-bg text-text-main pb-40 pt-28 relative overflow-hidden">
    <div :style="{ backgroundColor: prefs.primaryColor }" class="absolute top-0 right-0 w-[800px] h-[800px] opacity-[0.03] blur-[180px] rounded-full pointer-events-none transition-all duration-1000"></div>

    <div class="max-w-6xl mx-auto px-6 relative z-10">
      
      <header class="mb-16 animate-reveal">
        <div class="relative w-full h-48 md:h-64 rounded-[3rem] overflow-hidden mb-12 border border-white/5 shadow-2xl group/banner">
          <img :src="userStore.dynamicBanner" 
               class="w-full h-full object-cover transition-all duration-1000 group-hover/banner:scale-110" 
               alt="Dynamic System Banner" />
          
          <div class="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-60"></div>
          
          <div class="absolute bottom-8 left-10 flex flex-col gap-2">
             <div class="flex items-center gap-3">
                <div class="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/10">
                   <span class="text-[8px] font-black text-white uppercase tracking-[0.3em] italic">
                      System Mood: {{ libraryStore.vaultStats?.topGenres[0]?.[0] || 'Neutral' }}
                   </span>
                </div>
                <span class="text-white/40 text-[8px] font-black uppercase tracking-widest italic">Intelligence Sync Active</span>
             </div>
             <h1 class="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic font-outfit leading-none mt-2">
               System<span class="text-brand-primary transition-colors duration-700">Settings.</span>
             </h1>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <div class="lg:col-span-4 space-y-10 animate-reveal-item" style="animation-delay: 0.1s">
          <div class="p-10 bg-dark-surface border border-dark-border rounded-[2.5rem] text-center relative overflow-hidden group shadow-2xl transition-all hover:border-brand-primary/20">
            <div @click="triggerAvatarUpload" class="relative w-32 h-32 mx-auto mb-8 rounded-[2.5rem] p-1 bg-gradient-to-tr from-brand-primary to-dark-surface cursor-pointer group/avatar shadow-2xl">
              <div class="w-full h-full rounded-[2.3rem] border-4 border-dark-surface overflow-hidden relative">
                 <img :src="form.avatar" class="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" />
                 <div class="absolute inset-0 bg-brand-primary/80 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all">
                    <i class="fa-solid fa-sync text-white text-xl"></i>
                 </div>
              </div>
              <input type="file" ref="fileInput" @change="handleAvatarUpload" accept="image/*" class="hidden" />
            </div>
            <h3 class="text-2xl font-black font-outfit uppercase tracking-tighter truncate italic">{{ form.name }}</h3>
            <p class="text-[9px] font-black text-brand-primary uppercase tracking-[0.4em] mt-2 opacity-60 italic">{{ form.role }}</p>
          </div>

          <div class="p-8 bg-dark-surface border border-dark-border rounded-[2.5rem] space-y-4 shadow-xl">
            <div class="flex items-center gap-3 mb-4 opacity-30">
               <i class="fa-solid fa-database text-xs"></i>
               <h4 class="text-[9px] font-black uppercase tracking-[0.3em] italic font-outfit">Archive Protocols</h4>
            </div>
            
            <button @click="handleExport" class="group w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-brand-primary transition-all duration-500 italic flex items-center justify-center gap-3">
              <i class="fa-solid fa-file-export group-hover:translate-y-[-2px] transition-transform"></i> Generate Backup
            </button>

            <button @click="importFileInput.click()" class="group w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all duration-500 italic flex items-center justify-center gap-3">
              <i class="fa-solid fa-file-import group-hover:translate-y-[-2px] transition-transform"></i> Restore Archive
            </button>
            <input type="file" ref="importFileInput" @change="handleImport" accept=".json" class="hidden" />

            <div class="pt-4 border-t border-white/5">
              <button @click="clearAllData" 
                :class="!isSuperAdmin ? 'opacity-20 cursor-not-allowed grayscale' : 'hover:bg-red-600 hover:text-white'"
                class="w-full py-4 bg-red-600/5 border border-red-600/20 text-red-600 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 italic flex items-center justify-center gap-3">
                <i class="fa-solid fa-skull-crossbones"></i> Purge All Logic
              </button>
            </div>
          </div>
        </div>

        <div class="lg:col-span-8 space-y-10 animate-reveal-item" style="animation-delay: 0.2s">
          
          <div class="p-10 bg-dark-surface border border-dark-border rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div v-if="!canEditIdentity" class="absolute inset-0 bg-dark-surface/80 backdrop-blur-md z-20 flex flex-col items-center justify-center p-10 text-center">
              <i class="fa-solid fa-fingerprint text-5xl text-brand-primary mb-6 animate-pulse opacity-40"></i>
              <p class="text-[10px] font-black uppercase tracking-[0.3em] text-white italic">Administrator Override Required</p>
            </div>

            <h3 class="text-xl font-black font-outfit uppercase mb-10 flex items-center gap-4 italic tracking-tighter">
              <i class="fa-solid fa-id-card-clip text-brand-primary"></i> Identity <span class="text-text-muted opacity-30">Matrix</span>
            </h3>

            <div class="space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-2">
                  <label class="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] ml-3 opacity-50 italic">Display Persona</label>
                  <input v-model="form.name" :readonly="!canEditIdentity" type="text" class="w-full bg-dark-bg border border-dark-border rounded-2xl px-6 py-4 text-sm font-bold focus:border-brand-primary outline-none transition-all italic" />
                </div>
                <div class="space-y-2">
                  <label class="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] ml-3 opacity-50 italic">Security Role</label>
                  <input v-model="form.role" :readonly="!canEditIdentity" type="text" class="w-full bg-dark-bg border border-dark-border rounded-2xl px-6 py-4 text-sm font-bold focus:border-brand-primary outline-none transition-all italic" />
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] ml-3 opacity-50 italic">Avatar Endpoint</label>
                <input v-model="form.avatar" type="text" placeholder="https://..." class="w-full bg-dark-bg border border-dark-border rounded-2xl px-6 py-4 text-xs font-medium focus:border-brand-primary outline-none transition-all" />
              </div>
            </div>
          </div>

          <div class="p-10 bg-dark-surface border border-dark-border rounded-[2.5rem] shadow-2xl">
            <h3 class="text-xl font-black font-outfit uppercase mb-10 flex items-center gap-4 italic tracking-tighter">
              <i class="fa-solid fa-sliders text-brand-primary"></i> UI <span class="text-text-muted opacity-30">Module</span>
            </h3>
            
            <div class="space-y-12">
              <div>
                <label class="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] mb-6 block ml-3 opacity-50 italic">Core Aesthetic</label>
                <div class="flex flex-wrap gap-5">
                  <button v-for="color in THEME_COLORS" :key="color.hex" @click="applyThemeColor(color.hex)"
                    :style="{ backgroundColor: color.hex }"
                    class="w-12 h-12 rounded-[1.2rem] transition-all duration-500 hover:scale-110 flex items-center justify-center border-2 shadow-lg"
                    :class="prefs.primaryColor === color.hex ? 'border-white scale-110' : 'border-transparent opacity-40'">
                    <i v-if="prefs.primaryColor === color.hex" class="fa-solid fa-check text-white text-xs"></i>
                  </button>
                </div>
              </div>

              <div>
                <label class="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] mb-6 block ml-3 opacity-50 italic">Grid Density</label>
                <div class="flex p-2 bg-dark-bg border border-white/5 rounded-2xl w-fit backdrop-blur-md">
                  <button v-for="mode in ['comfortable', 'compact']" :key="mode" @click="prefs.cardLayout = mode"
                    :class="prefs.cardLayout === mode ? 'bg-brand-primary text-white shadow-neon' : 'text-text-muted hover:text-white'"
                    class="px-10 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 italic">
                    {{ mode }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-4">
            <button @click="saveSettings" :disabled="isSaving"
              class="group relative overflow-hidden px-16 py-6 bg-brand-primary text-white rounded-[2.2rem] font-black text-[11px] uppercase tracking-[0.4em] shadow-[0_20px_40px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95 transition-all duration-500 italic">
              <span v-if="!isSaving" class="flex items-center gap-4">
                 DEPLOY CONFIGURATION <i class="fa-solid fa-chevron-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </span>
              <span v-else class="flex items-center gap-4">
                <i class="fa-solid fa-sync animate-spin"></i> SYNCHRONIZING...
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>

    <Transition name="toast">
      <div v-if="showToast.show" :class="showToast.color"
           class="fixed bottom-10 left-1/2 -translate-x-1/2 px-12 py-6 rounded-3xl shadow-2xl text-white font-black text-[11px] uppercase tracking-[0.3em] flex items-center gap-5 z-[500] border border-white/10 backdrop-blur-xl italic">
        <i class="fa-solid fa-shield-check text-xl"></i> {{ showToast.message }}
      </div>
    </Transition>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.shadow-neon { box-shadow: 0 0 20px var(--color-brand-primary); }

/* Animation Engine */
.animate-reveal { animation: revealUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
.animate-reveal-item { opacity: 0; animation: revealUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }

@keyframes revealUp { 
  from { opacity: 0; transform: translateY(40px); filter: blur(10px); } 
  to { opacity: 1; transform: translateY(0); filter: blur(0); } 
}

/* Toast Dynamics */
.toast-enter-active, .toast-leave-active { transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 60px) scale(0.8); }

/* Custom Inputs */
input::placeholder { color: rgba(255, 255, 255, 0.1); }
</style>