<script setup>
const props = defineProps({
  page: { type: Number, required: true },
  pageCount: { type: Number, required: true }
})
defineEmits(['change'])
</script>

<template>
  <div v-if="pageCount > 1" class="pagination">
    <button class="secondary" :disabled="page === 1" @click="$emit('change', page - 1)">‹ Prev</button>
    <button
      v-for="n in pageCount"
      :key="n"
      :class="{ active: n === page }"
      @click="$emit('change', n)"
    >{{ n }}</button>
    <button class="secondary" :disabled="page === pageCount" @click="$emit('change', page + 1)">Next ›</button>
  </div>
</template>
