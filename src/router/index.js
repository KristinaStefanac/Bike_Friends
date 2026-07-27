import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/Home.vue') },
  { path: '/login', name: 'login', component: () => import('../views/Login.vue') },
  { path: '/bikes/:id', name: 'bike', component: () => import('../views/BikeDetail.vue') },
  { path: '/my-bikes', name: 'myBikes', component: () => import('../views/MyBikes.vue'), meta: { auth: true } },
  { path: '/my-bikes/new', name: 'bikeNew', component: () => import('../views/BikeForm.vue'), meta: { auth: true } },
  { path: '/my-bikes/:id/edit', name: 'bikeEdit', component: () => import('../views/BikeForm.vue'), meta: { auth: true } },
  { path: '/messages', name: 'messages', component: () => import('../views/Messages.vue'), meta: { auth: true } },
  { path: '/messages/:threadId', name: 'thread', component: () => import('../views/Messages.vue'), meta: { auth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  if (!to.meta.auth) return true
  const auth = useAuthStore()
  await auth.ready
  if (!auth.user) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  return true
})

export default router