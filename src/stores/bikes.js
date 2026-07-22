import { defineStore } from 'pinia'
import {
  collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc,
  query, orderBy, where, serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase.js'

export const useBikesStore = defineStore('bikes', {
  state: () => ({
    bikes: [],
    loading: false
  }),
  actions: {
    async fetchAll() {
      this.loading = true
      try {
        const q = query(collection(db, 'bikes'), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        this.bikes = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      } finally {
        this.loading = false
      }
    },
    async fetchOne(id) {
      const snap = await getDoc(doc(db, 'bikes', id))
      return snap.exists() ? { id: snap.id, ...snap.data() } : null
    },
    async fetchMine(uid) {
      const q = query(collection(db, 'bikes'), where('ownerId', '==', uid))
      const snap = await getDocs(q)
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    },
    async create(payload) {
      const ref = await addDoc(collection(db, 'bikes'), {
        ...payload,
        createdAt: serverTimestamp()
      })
      return ref.id
    },
    async update(id, payload) {
      await updateDoc(doc(db, 'bikes', id), payload)
    },
    async remove(id) {
      await deleteDoc(doc(db, 'bikes', id))
    }
  }
})
