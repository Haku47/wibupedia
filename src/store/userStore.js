import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useLibraryStore } from '@/store/libraryStore.js' // WAJIB tambahkan .jsport Library Store for cross-store access

export const useUserStore = defineStore('user', () => {
  const libraryStore = useLibraryStore()

  // --- 1. STATE: USER PROFILE ---
  const profile = ref({
    name: 'Kang Ryu',
    avatar: 'https://ui-avatars.com/api/?name=Host&background=0D8ABC&color=fff',
    role: 'Super Administrator',
    bio: 'WibuPedia Vault Controller.'
  })

  // --- 2. STATE: PREFERENCES ---
  const preferences = ref({
    primaryColor: '#3b82f6', // Default Blue
    cardLayout: 'comfortable' // comfortable | compact
  })

  // --- 3. 🧠 v1.9.8: DYNAMIC INTELLIGENCE BANNER LOGIC ---
  const dynamicBanner = computed(() => {
    // Ambil genre teratas dari Analytics Engine
    const topGenre = libraryStore.vaultStats?.topGenres[0]?.[0] || 'Default'
    
    // Mapping Visual Berdasarkan Mood Database
    const banners = {
      'Action': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070',
      'Adventure': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070',
      'Comedy': 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=2083',
      'Fantasy': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964',
      'Romance': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=2070',
      'Sci-Fi': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072',
      'Horror': 'https://images.unsplash.com/photo-1505635330300-319435b9b24f?q=80&w=2000',
      'Slice of Life': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2168',
      'Default': 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070'
    }

    return banners[topGenre] || banners['Default']
  })

  // --- 4. PERSISTENCE LOGIC ---
  const savedProfile = localStorage.getItem('wibupedia_user')
  if (savedProfile) {
    profile.value = JSON.parse(savedProfile)
  }

  const savedPrefs = localStorage.getItem('wibupedia_prefs')
  if (savedPrefs) {
    preferences.value = JSON.parse(savedPrefs)
    document.documentElement.style.setProperty('--color-brand-primary', preferences.value.primaryColor)
  }

  // --- 5. WATCHERS (AUTO-SAVE) ---
  watch(profile, (newVal) => {
    localStorage.setItem('wibupedia_user', JSON.stringify(newVal))
  }, { deep: true })

  watch(preferences, (newVal) => {
    localStorage.setItem('wibupedia_prefs', JSON.stringify(newVal))
    document.documentElement.style.setProperty('--color-brand-primary', newVal.primaryColor)
  }, { deep: true })

  // --- 6. ACTIONS ---
  const updateProfile = (newData) => {
    profile.value = { ...profile.value, ...newData }
  }

  const updatePreferences = (newPrefs) => {
    preferences.value = { ...preferences.value, ...newPrefs }
  }

  const resetUser = () => {
    profile.value = {
      name: 'Kang Ryu',
      avatar: 'https://ui-avatars.com/api/?name=Host&background=0D8ABC&color=fff',
      role: 'Super Administrator',
      bio: 'WibuPedia Vault Controller.'
    }
    preferences.value = {
      primaryColor: '#3b82f6',
      cardLayout: 'comfortable'
    }
    document.documentElement.style.setProperty('--color-brand-primary', '#3b82f6')
  }

  return { 
    profile, 
    preferences, 
    dynamicBanner, // 🛡️ Export computed baru untuk v1.9.8
    updateProfile, 
    updatePreferences, 
    resetUser 
  }
})