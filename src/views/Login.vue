<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const email = ref('')
const password = ref('')
const mode = ref('login')
const error = ref('')
const submitting = ref(false)

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

async function submit() {
  error.value = ''
  submitting.value = true
  try {
    if (mode.value === 'login') {
      await authStore.login(email.value, password.value)
    } else {
      await authStore.register(email.value, password.value)
    }
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (e) {
    error.value = e.message
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div style="max-width: 380px; margin: 40px auto;">
    <h1>{{ mode === 'login' ? 'Login' : 'Register' }}</h1>
    <form class="stack" @submit.prevent="submit">
      <input v-model="email" type="email" required placeholder="Email" />
      <input v-model="password" type="password" required minlength="6" placeholder="Password" />
      <button :disabled="submitting" class="huge" type="submit">
        {{ mode === 'login' ? 'Login' : 'Create account' }}
      </button>
      <div v-if="error" class="notice" style="border-color: var(--danger);">{{ error }}</div>
      <div class="muted" style="text-align: center;">
        <a href="#" @click.prevent="mode = mode === 'login' ? 'register' : 'login'">
          {{ mode === 'login' ? 'Need an account? Register' : 'Have an account? Login' }}
        </a>
      </div>
    </form>
  </div>
</template>