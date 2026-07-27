<script setup>
import { ref, onMounted, watch, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useMessagesStore } from '../stores/messages.js'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const messagesStore = useMessagesStore()

const draft = ref('')
const sending = ref(false)

const activeThread = computed(() =>
  messagesStore.threads.find((t) => t.id === route.params.threadId)
)

async function loadThreads() {
  await authStore.ready
  if (authStore.user) await messagesStore.fetchThreads(authStore.user.uid)
}

onMounted(loadThreads)

watch(
  () => route.params.threadId,
  (id) => {
    if (id) messagesStore.subscribeMessages(id)
    else messagesStore.unsubscribeMessages()
  },
  { immediate: true }
)

onUnmounted(() => messagesStore.unsubscribeMessages())

async function send() {
  if (!draft.value.trim()) return
  sending.value = true
  try {
    await messagesStore.sendMessage(route.params.threadId, authStore.user.uid, draft.value.trim())
    draft.value = ''
    await loadThreads()
  } finally {
    sending.value = false
  }
}

function otherEmail(thread) {
  if (!thread || !authStore.user) return ''
  const otherUid = thread.participants.find((p) => p !== authStore.user.uid)
  return thread.participantEmails?.[otherUid] || 'unknown'
}
</script>

<template>
  <h1>Messages</h1>
  <div style="display: grid; grid-template-columns: 280px 1fr; gap: 16px;">
    <aside class="stack" style="background: var(--panel); padding: 12px; border-radius: 8px; border: 1px solid var(--border);">
      <div v-if="messagesStore.threads.length === 0" class="muted">
        No conversations yet. Click "I want a test ride" on a bike to start one.
      </div>
      <a
        v-for="t in messagesStore.threads"
        :key="t.id"
        href="#"
        :style="{ fontWeight: t.id === route.params.threadId ? 700 : 400 }"
        @click.prevent="router.push({ name: 'thread', params: { threadId: t.id } })"
      >
        <div>{{ t.bikeName }}</div>
        <div class="muted" style="font-size: 12px;">with {{ otherEmail(t) }}</div>
      </a>
    </aside>

    <section v-if="route.params.threadId" class="stack">
      <div class="muted" v-if="activeThread">
        Re: <strong>{{ activeThread.bikeName }}</strong> — with {{ otherEmail(activeThread) }}
      </div>
      <div class="thread">
        <div
          v-for="m in messagesStore.activeMessages"
          :key="m.id"
          class="message"
          :class="m.from === authStore.user?.uid ? 'me' : 'them'"
        >{{ m.text }}</div>
      </div>
      <form class="row" @submit.prevent="send">
        <input v-model="draft" placeholder="Type a message…" />
        <button :disabled="sending" type="submit">Send</button>
      </form>
    </section>
    <section v-else class="muted">Pick a conversation on the left.</section>
  </div>
</template>
