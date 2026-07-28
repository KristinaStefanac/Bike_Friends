import { defineStore } from 'pinia'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../firebase.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    ready: null
  }),
  actions: {
    init() {
      this.ready = new Promise((resolve) => {
        onAuthStateChanged(auth, (u) => {
          this.user = u ? { uid: u.uid, email: u.email } : null
          resolve()
        })
      })
    },
    async register(email, password) {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      this.user = { uid: cred.user.uid, email: cred.user.email }
    },
    async login(email, password) {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      this.user = { uid: cred.user.uid, email: cred.user.email }
    },
    async logout() {
      await signOut(auth)
      this.user = null
    }
  }
})
