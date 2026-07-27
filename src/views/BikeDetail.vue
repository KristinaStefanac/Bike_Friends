<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBikesStore } from '../stores/bikes.js'
import { useAuthStore } from '../stores/auth.js'
import { useMessagesStore } from '../stores/messages.js'

const route = useRoute()
const router = useRouter()
const bikesStore = useBikesStore()
const authStore = useAuthStore()
const messagesStore = useMessagesStore()

const bike = ref(null)
const loading = ref(true)
const placeholder = 'https://placehold.co/800x600/1e293b/94a3b8?text=No+Image'

onMounted(async () => {
  bike.value = await bikesStore.fetchOne(route.params.id)
  loading.value = false
})

async function requestTestRide() {
  await authStore.ready
  if (!authStore.user) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  if (authStore.user.uid === bike.value.ownerId) {
    alert("This is your own bike — you can't request a test ride for it.")
    return
  }
  const threadId = await messagesStore.startOrGetThread({
    meUid: authStore.user.uid,
    meEmail: authStore.user.email,
    ownerUid: bike.value.ownerId,
    ownerEmail: bike.value.ownerEmail,
    bikeId: bike.value.id,
    bikeName: bike.value.name
  })
  router.push({ name: 'thread', params: { threadId } })
}
</script>

<template>
  <div v-if="loading" class="muted">Loading…</div>
  <div v-else-if="!bike" class="notice">Bike not found.</div>
  <div v-else>
    <RouterLink to="/">‹ Back to all bikes</RouterLink>
    <h1>{{ bike.name }}</h1>
    <img :src="bike.imageUrl || placeholder" :alt="bike.name"
         style="width: 100%; max-height: 480px; object-fit: cover; border-radius: 8px; margin-bottom: 16px;" />
    <div class="stack">
      <div><strong>Brand:</strong> {{ bike.brand }}</div>
      <div><strong>Type:</strong> {{ bike.type }}</div>
      <div><strong>Size:</strong> {{ bike.size }}</div>
      <div><strong>Location:</strong> {{ bike.location }}</div>
      <div><strong>Owner:</strong> {{ bike.ownerEmail }}</div>
      <p>{{ bike.description }}</p>
      <button class="huge" @click="requestTestRide">🚲 I want a test ride</button>
    </div>
  </div>
</template>
