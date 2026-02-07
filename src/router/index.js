import { createRouter, createWebHistory } from 'vue-router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css' // Pillar CSS v1.8

// --- CONFIGURATION NPROGRESS v1.8 ---
nprogress.configure({ 
  showSpinner: false, // Mematikan spinner agar tampilan tetap "Sharp"
  speed: 600, 
  trickleSpeed: 200 
})

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/Home.vue'),
    meta: { title: 'WibuPedia - Katalog Anime, Manga & Novel' }
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/pages/Auth.vue'),
    meta: { title: 'Autentikasi Pengguna - WibuPedia' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/pages/User/Settings.vue'),
    meta: { title: 'Pengaturan Saya - WibuPedia' }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/pages/Search.vue'),
    meta: { title: 'Eksplorasi Katalog - WibuPedia' }
  },
  /** * TRIPLE PILLAR DETAILS ROUTE 
   * Mendukung /anime/:id, /manga/:id, dan /novel/:id
   */
  {
    path: '/:type/:id', 
    name: 'details',
    component: () => import('@/pages/Details.vue'),
    props: true,
    beforeEnter: (to, from, next) => {
      const validTypes = ['anime', 'manga', 'novel']
      if (validTypes.includes(to.params.type)) {
        next()
      } else {
        next({ name: 'not-found' })
      }
    }
  },
  {
    path: '/library',
    name: 'library',
    component: () => import('@/pages/User/Library.vue'),
    meta: { title: 'Library - WibuPedia' }
  },
  {
    path: '/activity',
    name: 'activity',
    component: () => import('@/pages/Activity.vue'),
    meta: { title: 'Aktivitas Saya - WibuPedia' }
  },
  {
    path: '/report',
    name: 'IntelligenceReport',
    component: () => import('@/pages/Report.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/About.vue'),
    meta: { title: 'Tentang WibuPedia' }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/pages/Contact.vue'),
    meta: { title: 'Kontak Kami' }
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('@/pages/PrivacyPolicy.vue'),
    meta: { title: 'Kebijakan Privasi' }
  },
  {
    path: '/changelog',
    name: 'changelog',
    component: () => import('@/pages/Changelog.vue'),
    meta: { title: 'Changelog - Update Terbaru' }
  },
  {
    path: '/disclaimer',
    name: 'disclaimer',
    component: () => import('@/pages/Disclaimer.vue'),
    meta: { title: 'Disclaimer - Penafian' }
  },
  {
    path: '/status',
    name: 'status',
    component: () => import('@/pages/Status.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/shared/NotFound.vue'),
    meta: { title: '404 - Halaman Tidak Ditemukan' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// --- DYNAMIC GLOBAL GUARD & NPROGRESS ---
router.beforeEach((to, from, next) => {
  // 1. Start Progress Bar
  nprogress.start()

  // 2. Logic Title Dinamis
  const baseTitle = 'WibuPedia'
  let pageTitle = to.meta.title
  
  if (to.params.type && to.params.id) {
    const typeLabel = to.params.type.charAt(0).toUpperCase() + to.params.type.slice(1)
    pageTitle = `${typeLabel} Details - ${baseTitle}`
  }

  document.title = pageTitle || baseTitle
  next()
})

router.afterEach(() => {
  // 3. Complete Progress Bar
  nprogress.done()
})

export default router