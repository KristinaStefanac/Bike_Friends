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
    user: null
  }),

  actions: {
    async login(email, password) {
      await signInWithEmailAndPassword(auth, email, password)
    },

    async register(email, password) {
      await createUserWithEmailAndPassword(auth, email, password)
    },

    async logout() {
      await signOut(auth)
      this.user = null
    },

    init() {
      onAuthStateChanged(auth, (u) => {
        this.user = u
      })
    }
  }
})