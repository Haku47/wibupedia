<script setup>
import { ref, computed } from 'vue'
import { useLibraryStore } from '@/store/libraryStore'
import { useUserStore } from '@/store/userStore'

const libraryStore = useLibraryStore()
const userStore = useUserStore()
const fileInput = ref(null)

const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')

defineProps({
  themeColor: String,
  themeBg: String
})

// --- 🔄 COLLECTION MANAGEMENT ---
const initiateExport = () => {
  console.log("Community Hub: Preparing Collection Export...");
  
  if (typeof libraryStore.exportLibrary !== 'function') {
    console.error("Logic Error: Export function missing in Store.");
    alert("Maaf, fitur ekspor sedang tidak tersedia di sistem.");
    return
  }

  const success = libraryStore.exportLibrary()
  if (!success) console.warn("Community Hub: Export failed.");
}

const handleImport = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  if (confirm('⚠️ PERHATIAN: Proses ini akan mengganti seluruh koleksi Anda dengan data dari file yang dipilih. Lanjutkan?')) {
    try {
      console.log("Community Hub: Restoring Collection...");
      const success = await libraryStore.importLibrary(file)
      if (success) {
        alert('Koleksi berhasil dipulihkan! Database telah diperbarui.')
        window.location.reload()
      }
    } catch (err) {
      alert('Gagal memproses file. Pastikan format file JSON sudah benar.')
      console.error(err)
    }
  }
  e.target.value = ''
}
</script>

<template>
  <div class="mt-20 pt-12 border-t border-white/5 relative z-10 font-outfit">
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
      
      <div class="space-y-2">
        <h4 class="text-white text-[11px] font-black uppercase tracking-[0.4em] opacity-40">Data Management</h4>
        <p class="text-text-muted text-xs font-medium leading-relaxed max-w-sm opacity-50">
          Simpan cadangan koleksi Anda ke format JSON atau pulihkan data dari perangkat lain dengan mudah.
        </p>
      </div>

      <div class="flex flex-wrap gap-4">
        <button 
          @click.stop="initiateExport"
          type="button"
          class="group flex items-center gap-4 px-8 py-4 bg-white/[0.03] border border-white/10 rounded-2xl transition-all hover:bg-white/[0.08] active:scale-95"
        >
          <i class="fa-solid fa-download text-xs text-text-muted group-hover:scale-110 transition-transform" 
             :style="{ '--hover-color': primaryColor }"></i>
          <span class="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-white transition-colors">Export Backup</span>
        </button>

        <button 
          @click.stop="fileInput.click()"
          type="button"
          class="group flex items-center gap-4 px-8 py-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl transition-all hover:bg-emerald-500/10 hover:border-emerald-500/30 active:scale-95"
        >
          <i class="fa-solid fa-upload text-xs text-emerald-500/60 group-hover:scale-110 transition-transform"></i>
          <span class="text-[10px] font-black uppercase tracking-widest text-emerald-500/80 group-hover:text-emerald-400 transition-colors">Restore Collection</span>
        </button>

        <input 
          type="file" 
          ref="fileInput" 
          @change="handleImport" 
          accept=".json" 
          class="hidden" 
        />
      </div>

    </div>
  </div>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }

button {
  cursor: pointer !important;
  user-select: none;
}

/* Custom Hover Icon Color logic if needed */
button:hover i[style*="--hover-color"] {
  color: v-bind(primaryColor) !important;
}
</style>