<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBikesStore } from '../stores/bikes.js'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const bikesStore = useBikesStore()
const authStore = useAuthStore()

const myBikes = ref([])
const loading = ref(true)
const placeholder = 'https://placehold.co/600x450/1e293b/94a3b8?text=No+Image'

async function load() {
  loading.value = true
  myBikes.value = await bikesStore.fetchMine(authStore.user.uid)
  loading.value = false
}

onMounted(load)

async function remove(id) {
  if (!confirm('Delete this bike?')) return
  await bikesStore.remove(id)
  await load()
}
</script>

<template>
  <div class="row" style="justify-content: space-between;">
    <h1>My Bikes</h1>
    <button @click="router.push({ name: 'bikeNew' })">+ Add bike</button>
  </div>

  <div v-if="loading" class="muted">Loading…</div>
  <div v-else-if="myBikes.length === 0" class="notice">
    You haven't listed any bikes yet. <a href="#" @click.prevent="router.push({ name: 'bikeNew' })">Add one now</a>.
  </div>

  <div v-else class="grid">
    <div v-for="bike in myBikes" :key="bike.id" class="card">
      <img :src="bike.imageUrl || placeholder" :alt="bike.name"
           @click="router.push({ name: 'bike', params: { id: bike.id } })" />
      <div class="card-body stack">
        <h3>{{ bike.name }}</h3>
        <div class="muted">{{ bike.brand }} · {{ bike.type }}</div>
        <div class="row">
          <button class="secondary" @click="router.push({ name: 'bikeEdit', params: { id: bike.id } })">Edit</button>
          <button class="danger" @click="remove(bike.id)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>
