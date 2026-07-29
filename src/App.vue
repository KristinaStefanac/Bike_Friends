<script setup>
import { onMounted } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth.js'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  authStore.init()
})

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <nav class="nav">
    <RouterLink to="/" class="brand">🚲 Bike Friends</RouterLink>
    <RouterLink v-if="authStore.user" to="/my-bikes">My Bikes</RouterLink>
    <RouterLink v-if="authStore.user" to="/messages">Messages</RouterLink>
    <span class="spacer" />
    <span v-if="authStore.user" class="muted">{{ authStore.user.email }}</span>
    <button v-if="authStore.user" class="secondary" @click="handleLogout">Logout</button>
    <RouterLink v-else to="/login"><button>Login</button></RouterLink>
  </nav>
  <main class="container">
    <RouterView />
  </main>
</template>
