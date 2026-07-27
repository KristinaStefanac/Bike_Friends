import { defineStore } from 'pinia'
import {
  collection, addDoc, getDocs, doc, query, where, orderBy,
  serverTimestamp, onSnapshot, setDoc, getDoc
} from 'firebase/firestore'
import { db } from '../firebase.js'

function threadId(uidA, uidB, bikeId) {
  const sorted = [uidA, uidB].sort()
  return `${sorted[0]}_${sorted[1]}_${bikeId}`
}

export const useMessagesStore = defineStore('messages', {
  state: () => ({
    threads: [],
    activeMessages: [],
    unsub: null
  }),
  
  actions: {
    async startOrGetThread({ meUid, meEmail, ownerUid, ownerEmail, bikeId, bikeName }) {
      const id = threadId(meUid, ownerUid, bikeId)
      const ref = doc(db, 'threads', id)
      const snap = await getDoc(ref)
      
      if (!snap.exists()) {
        await setDoc(ref, {
          participants: [meUid, ownerUid],
          participantEmails: { [meUid]: meEmail, [ownerUid]: ownerEmail },
          bikeId,
          bikeName,
          createdAt: serverTimestamp(),
          lastMessageAt: serverTimestamp()
        })
      }
      return id
    },

    async sendMessage(threadId, fromUid, text) {
      await addDoc(collection(db, 'threads', threadId, 'messages'), {
        from: fromUid,
        text,
        createdAt: serverTimestamp()
      })
      await setDoc(doc(db, 'threads', threadId), { lastMessageAt: serverTimestamp() }, { merge: true })
    },

    async fetchThreads(uid) {
      const q = query(
        collection(db, 'threads'),
        where('participants', 'array-contains', uid),
        orderBy('lastMessageAt', 'desc')
      )
      const snap = await getDocs(q)
      this.threads = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    },

    subscribeMessages(threadId) {
      this.unsubscribeMessages()
      const q = query(collection(db, 'threads', threadId, 'messages'), orderBy('createdAt', 'asc'))
      this.unsub = onSnapshot(q, (snap) => {
        this.activeMessages = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      })
    },

    unsubscribeMessages() {
      if (this.unsub) {
        this.unsub()
        this.unsub = null
      }
      this.activeMessages = []
    }
  }
})