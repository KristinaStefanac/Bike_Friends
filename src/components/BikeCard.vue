<script setup>
import { useRouter } from 'vue-router'

defineProps({
  bike: { type: Object, required: true }
})

const router = useRouter()
const placeholder = 'https://placehold.co/600x450/1e293b/94a3b8?text=No+Image'
</script>

<template>
  <div class="card">
    <img
      :src="bike.imageUrl || placeholder"
      :alt="bike.name"
      @click="router.push({ name: 'bike', params: { id: bike.id } })"
    />
    <div class="card-body">
      <h3>{{ bike.name }}</h3>
      <div class="muted">{{ bike.brand }} · {{ bike.type }}</div>
      <div class="muted">{{ bike.location }}</div>
    </div>
  </div>
</template>
