<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBikesStore } from '@/stores/bikes.js'
import BikeCard from '@/components/BikeCard.vue'
import SearchPanel from '@/components/SearchPanel.vue'
import Pagination from '@/components/Pagination.vue'

const bikesStore = useBikesStore()
const search = ref('')
const page = ref(1)
const pageSize = 10

onMounted(() => bikesStore.fetchAll())

const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return bikesStore.bikes
  return bikesStore.bikes.filter((b) => b.name?.toLowerCase().includes(term))
})

const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))

const paginated = computed(() => {
  const start = (page.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})

function onSearch(v) {
  search.value = v
  page.value = 1
}
</script>

<template>
  <h1>Find a bike to try</h1>
  <SearchPanel :model-value="search" @update:model-value="onSearch" />

  <div v-if="bikesStore.loading" class="muted">Loading…</div>
  <div v-else-if="filtered.length === 0" class="notice">
    No bikes match your search. Try a different name, or
    <RouterLink to="/my-bikes/new">add the first bike</RouterLink>.
  </div>

  <div v-else class="grid">
    <BikeCard v-for="bike in paginated" :key="bike.id" :bike="bike" />
  </div>

  <Pagination :page="page" :page-count="pageCount" @change="(n) => (page = n)" />
</template>
