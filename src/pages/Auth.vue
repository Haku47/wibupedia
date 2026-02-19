<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/userStore.js'

const router = useRouter()
const userStore = useUserStore()

const isLogin = ref(true)
const isLoading = ref(false)
const primaryColor = computed(() => userStore.preferences?.primaryColor || '#3b82f6')

const form = ref({
  email: '',
  password: '',
  username: ''
})

const toggleMode = () => { isLogin.value = !isLogin.value }

const handleAuth = async () => {
  if (!form.value.email || !form.value.password) return
  isLoading.value = true
  
  // Simulasi Proses Autentikasi
  setTimeout(() => {
    userStore.login({
      name: isLogin.value ? userStore.profile.name : form.value.username,
      email: form.value.email
    })
    isLoading.value = false
    router.push('/')
  }, 1500)
}
</script>

<template>
  <div class="auth-page min-h-screen flex items-center justify-center p-6 bg-dark-bg relative overflow-hidden font-outfit">
    
    <div class="absolute inset-0 z-0">
      <div :style="{ backgroundColor: primaryColor }" class="absolute -top-24 -left-24 w-[500px] h-[500px] opacity-[0.08] blur-[120px] rounded-full"></div>
      <div :style="{ backgroundColor: primaryColor }" class="absolute -bottom-24 -right-24 w-[500px] h-[500px] opacity-[0.08] blur-[120px] rounded-full"></div>
    </div>

    <div class="w-full max-w-5xl grid lg:grid-cols-2 gap-0 relative z-10 bg-dark-surface/30 backdrop-blur-3xl border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
      
      <div class="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-br from-white/[0.03] to-transparent border-r border-white/5">
        <div>
          <RouterLink to="/" class="inline-flex items-center gap-4 mb-16 group">
            <div :style="{ backgroundColor: primaryColor }" 
                 class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12">
              <span class="text-white font-black text-2xl italic">W</span>
            </div>
            <span class="text-2xl font-black tracking-tighter text-white uppercase italic">
              Wibu<span :style="{ color: primaryColor }">Pedia</span>
            </span>
          </RouterLink>

          <h1 class="text-5xl font-black text-white uppercase leading-[1.1] tracking-tighter mb-6">
            Explore the<br />
            <span :style="{ color: primaryColor }">Ultimate</span><br />
            Anime Archive.
          </h1>
          <p class="text-text-muted text-sm leading-relaxed max-w-xs opacity-60 font-medium">
            Gabung dengan komunitas untuk mengelola library personal, melacak progres nonton, dan menemukan ribuan judul anime terbaru.
          </p>
        </div>

        <div class="flex items-center gap-6">
          <div class="flex -space-x-3">
            <div v-for="n in 4" :key="n" class="w-10 h-10 rounded-full border-2 border-dark-bg bg-white/10 overflow-hidden">
              <img :src="`https://i.pravatar.cc/100?img=${n+10}`" alt="User" />
            </div>
          </div>
          <span class="text-[10px] font-black text-white/40 uppercase tracking-widest">Join 1.4M+ Members</span>
        </div>
      </div>

      <div class="p-10 md:p-16 flex flex-col justify-center">
        <div class="mb-12 lg:hidden flex justify-center">
           <span class="text-2xl font-black text-white uppercase italic">Wibu<span :style="{ color: primaryColor }">Pedia</span></span>
        </div>

        <div class="mb-10">
          <h2 class="text-3xl font-black text-white uppercase tracking-tighter mb-2">
            {{ isLogin ? 'Welcome Back' : 'Create Account' }}
          </h2>
          <p class="text-xs font-bold text-text-muted opacity-40 uppercase tracking-widest">
            {{ isLogin ? 'Sign in to access your library' : 'Start your anime journey today' }}
          </p>
        </div>

        <form @submit.prevent="handleAuth" class="space-y-5">
          <div v-if="!isLogin" class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Display Name</label>
            <input v-model="form.username" type="text" placeholder="Username" 
                   class="auth-input w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none transition-all" />
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Email Address</label>
            <input v-model="form.email" type="email" placeholder="email@example.com" 
                   class="auth-input w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none transition-all" />
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Password</label>
            <input v-model="form.password" type="password" placeholder="••••••••" 
                   class="auth-input w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none transition-all" />
          </div>

          <button type="submit" :disabled="isLoading"
                  class="w-full mt-6 py-5 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3 group"
                  :style="{ backgroundColor: primaryColor }">
            <template v-if="!isLoading">
              {{ isLogin ? 'Sign In' : 'Sign Up' }}
              <i class="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
            </template>
            <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </button>
        </form>

        <div class="mt-12 text-center">
          <p class="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-40 mb-4">
            {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
          </p>
          <button @click="toggleMode" 
                  class="text-xs font-black uppercase tracking-widest hover:opacity-80 transition-all border-b-2 pb-1"
                  :style="{ color: primaryColor, borderColor: primaryColor + '30' }">
            {{ isLogin ? 'Register Now' : 'Login Here' }}
          </button>
        </div>
      </div>
    </div>

    <div class="absolute bottom-10 text-[10px] font-black text-white/10 uppercase tracking-[1em] pointer-events-none">
      WibuPedia Community Node
    </div>
  </div>
</template>

<style scoped>
.auth-input:focus {
  background-color: rgba(255, 255, 255, 0.08);
  border-color: v-bind(primaryColor);
  box-shadow: 0 0 0 4px v-bind(primaryColor + '10');
}

/* Chrome/Safari Hide scrollbar */
::-webkit-scrollbar {
  display: none;
}
</style>