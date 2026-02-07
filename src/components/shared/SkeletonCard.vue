<template>
  <div class="skeleton-card flex flex-col h-full bg-dark-surface/30 border border-dark-border/40 rounded-[2rem] overflow-hidden animate-reveal">
    
    <div class="relative aspect-[2/3] md:aspect-[3/4] overflow-hidden">
      <div class="skeleton-box w-full h-full"></div>
    </div>

    <div class="p-5 flex flex-col flex-grow gap-4">
      <div class="space-y-3">
        <div class="skeleton-box h-4 rounded-lg w-full"></div>
        <div class="skeleton-box h-4 rounded-lg w-3/4 opacity-50"></div>
      </div>
      
      <div class="mt-auto pt-5 flex items-center justify-between border-t border-dark-border/20">
        <div class="skeleton-box h-3 rounded-full w-14"></div>
        <div class="skeleton-box h-3 rounded-full w-10 opacity-30"></div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Transisi masuk yang smooth agar tidak jarring saat data muncul */
.animate-reveal {
  animation: reveal 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes reveal {
  from { 
    opacity: 0; 
    transform: translateY(10px) scale(0.98); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
}

/* Kustomisasi tambahan jika ingin shimmer-nya lebih tajam khusus di kartu */
.skeleton-box {
  background-color: #1e293b; /* Slate-800 */
}
</style>