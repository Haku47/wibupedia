<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <main class="min-h-[80vh] bg-dark-bg flex items-center justify-center px-6 relative overflow-hidden">
    <div class="absolute w-[600px] h-[600px] bg-brand-primary/5 blur-[150px] rounded-full -top-48 -left-48 pointer-events-none"></div>

    <div class="text-center relative z-10 animate-reveal">
      <div class="relative mb-12 group">
        <h1 class="text-[10rem] md:text-[15rem] font-black text-white/5 leading-none select-none font-outfit tracking-tighter glitch" data-text="404">
          404
        </h1>
        <div class="absolute inset-0 flex flex-col items-center justify-center drop-shadow-2xl">
          <i class="fa-solid fa-ghost text-6xl text-brand-primary animate-float mb-4"></i>
          <span class="text-[10px] font-black uppercase tracking-[0.5em] text-brand-primary/60">Dimension Lost</span>
        </div>
      </div>

      <h2 class="text-3xl md:text-4xl font-black text-text-main mb-6 font-outfit uppercase tracking-tighter leading-tight">
        Data <span class="text-brand-primary italic">Not Found.</span>
      </h2>
      <p class="text-sm md:text-base text-text-muted max-w-md mx-auto mb-12 leading-relaxed opacity-70 font-medium">
        Koordinat yang kamu tuju tidak terdaftar dalam protokol <span class="text-brand-primary font-bold">WibuPedia</span>. Sepertinya arsip ini telah dihapus atau pindah dimensi.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-5">
        <router-link 
          to="/" 
          class="w-full sm:w-auto px-10 py-5 bg-brand-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-[1.5rem] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-brand-primary/20"
        >
          Return to Dashboard
        </router-link>
        
        <button 
          @click="router.back()" 
          class="w-full sm:w-auto px-10 py-5 bg-dark-surface border border-dark-border text-text-main text-[10px] font-black uppercase tracking-[0.2em] rounded-[1.5rem] hover:bg-brand-primary hover:border-brand-primary transition-all active:scale-95"
        >
          Go Back
        </button>
      </div>

      <div class="mt-20 flex items-center justify-center gap-3 opacity-20">
        <div class="w-8 h-[1px] bg-text-muted"></div>
        <span class="text-[8px] font-black uppercase tracking-[0.4em]">Vault Security Protocol v1.8</span>
        <div class="w-8 h-[1px] bg-text-muted"></div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }

/* 1. ANIMASI GHOST FLOAT */
.animate-float {
  animation: floating 4s ease-in-out infinite;
}

@keyframes floating {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

/* 2. GLITCH EFFECT (Memory Efficient CSS Only) */
.glitch {
  position: relative;
}
.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}
.glitch:hover::before {
  animation: glitch-anim 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
  color: #3B82F6;
  z-index: -1;
}
.glitch:hover::after {
  animation: glitch-anim 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both infinite;
  color: #ef4444;
  z-index: -2;
}

@keyframes glitch-anim {
  0% { transform: translate(0); }
  20% { transform: translate(-3px, 3px); }
  40% { transform: translate(-3px, -3px); }
  60% { transform: translate(3px, 3px); }
  80% { transform: translate(3px, -3px); }
  100% { transform: translate(0); }
}

/* 3. REVEAL TRANSITION */
.animate-reveal {
  animation: reveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes reveal {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>