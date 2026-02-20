'use client'

import { create } from 'zustand'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  isAdmin: boolean
  hydrated: boolean
  hydrate: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  hydrated: false,

  get isAdmin() {
    return get().user?.role === 'admin'
  },

  setAuth(user, token) {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ user, token })
  },

  clearAuth() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null })
  },

  hydrate() {
    if (typeof window === 'undefined') return
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    const user = userStr ? (JSON.parse(userStr) as User) : null
    set({ user, token, hydrated: true })
  },
}))
