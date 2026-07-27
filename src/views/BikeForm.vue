<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBikesStore } from '../stores/bikes.js'
import { useAuthStore } from '../stores/auth.js'

const route = useRoute()
const router = useRouter()
const bikesStore = useBikesStore()
const authStore = useAuthStore()

const isEdit = computed(() => !!route.params.id)
const submitting = ref(false)
const error = ref('')

const form = ref({
  name: '',
  brand: '',
  type: 'Road',
  size: '',
  location: '',
  imageUrl: '',
  description: ''
})

onMounted(async () => {
  if (isEdit.value) {
    const bike = await bikesStore.fetchOne(route.params.id)
    if (!bike) {
      error.value = 'Bike not found.'
      return
    }
    if (bike.ownerId !== authStore.user.uid) {
      error.value = 'You can only edit your own bikes.'
      return
    }
    form.value = {
      name: bike.name,
      brand: bike.brand,
      type: bike.type,
      size: bike.size,
      location: bike.location,
      imageUrl: bike.imageUrl,
      description: bike.description
    }
  }
})

async function submit() {
  submitting.value = true
  error.value = ''
  try {
    const payload = {
      ...form.value,
      ownerId: authStore.user.uid,
      ownerEmail: authStore.user.email
    }
    if (isEdit.value) {
      await bikesStore.update(route.params.id, payload)
    } else {
      await bikesStore.create(payload)
    }
    router.push({ name: 'myBikes' })
  } catch (e) {
    error.value = e.message
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <h1>{{ isEdit ? 'Edit bike' : 'Add a bike' }}</h1>
  <div v-if="error" class="notice" style="border-color: var(--danger);">{{ error }}</div>
  <form class="stack" style="max-width: 600px;" @submit.prevent="submit">
    <label>Name<input v-model="form.name" required /></label>
    <label>Brand<input v-model="form.brand" /></label>
    <label>Type
      <select v-model="form.type">
        <option>Road</option>
        <option>Mountain</option>
        <option>Gravel</option>
        <option>Hybrid</option>
        <option>City</option>
        <option>E-bike</option>
      </select>
    </label>
    <label>Size<input v-model="form.size" placeholder="e.g. M, 54cm" /></label>
    <label>Location<input v-model="form.location" placeholder="City / area" /></label>
    <label>Image URL<input v-model="form.imageUrl" placeholder="https://…" /></label>
    <label>Description<textarea v-model="form.description" rows="4"></textarea></label>
    <div class="row">
      <button :disabled="submitting" type="submit">{{ isEdit ? 'Save changes' : 'Create bike' }}</button>
      <button class="secondary" type="button" @click="router.back()">Cancel</button>
    </div>
  </form>
</template>
