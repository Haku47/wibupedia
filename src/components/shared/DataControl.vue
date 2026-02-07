<script setup>
import { ref } from 'vue'
import { useLibraryStore } from '@/store/libraryStore'

const libraryStore = useLibraryStore()
const fileInput = ref(null)

defineProps({
  themeColor: String,
  themeBg: String
})

// --- 🛡️ BYPASS PROTOCOL ---
const initiateExport = () => {
  console.log("System: Initiating Data Export Protocol...");
  
  // Verifikasi apakah fungsi tersedia di Store
  if (typeof libraryStore.exportLibrary !== 'function') {
    console.error("Critical Error: exportLibrary function not found in Store!");
    alert("System Error: Protokol Ekspor tidak ditemukan di Core Engine.");
    return
  }

  const success = libraryStore.exportLibrary()
  if (success) {
    console.log("System: Export successful.");
  } else {
    console.warn("System: Export failed in store logic.");
  }
}

const handleImport = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  if (confirm('⚠️ PERINGATAN: Import data akan menimpa seluruh koleksi saat ini. Lanjutkan proses sinkronisasi?')) {
    try {
      console.log("System: Restoring Archive...");
      const success = await libraryStore.importLibrary(file)
      if (success) {
        alert('Archive Restored: Database berhasil diperbarui.')
        window.location.reload()
      }
    } catch (err) {
      alert('Error: Dekripsi data gagal.')
      console.error(err)
    }
  }
  e.target.value = ''
}
</script>

<template>
  <div class="mt-20 pt-10 border-t border-white/5 relative z-[100]">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
      
      <div class="pointer-events-none">
        <h4 class="text-white text-xs font-black uppercase tracking-[0.3em] mb-2 italic opacity-80">Data Protocol</h4>
        <p class="text-text-muted text-[9px] uppercase tracking-widest opacity-40 leading-relaxed max-w-sm">
          Ekspor database Library Host ke dalam format JSON untuk cadangan fisik atau sinkronisasi antar perangkat.
        </p>
      </div>

      <div class="flex flex-wrap gap-4">
        <button 
          @click.stop="initiateExport"
          type="button"
          class="group flex items-center gap-3 px-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl transition-all hover:bg-brand-primary/10 hover:border-brand-primary/30 active:scale-95 cursor-pointer"
        >
          <i class="fa-solid fa-download text-[10px] opacity-40 group-hover:opacity-100 group-hover:text-brand-primary transition-all"></i>
          <span class="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted group-hover:text-white">Generate Backup</span>
        </button>

        <button 
          @click.stop="fileInput.click()"
          type="button"
          class="group flex items-center gap-3 px-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl transition-all hover:bg-emerald-500/10 hover:border-emerald-500/30 active:scale-95 cursor-pointer"
        >
          <i class="fa-solid fa-upload text-[10px] opacity-40 group-hover:opacity-100 group-hover:text-emerald-500 transition-all"></i>
          <span class="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted group-hover:text-white">Restore Archive</span>
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
.italic { font-style: italic; }
button { cursor: pointer !important; } /* Paksa kursor pointer */
</style>