import { defineStore } from 'pinia'
import type { User } from '~/types/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    refreshToken: null as string | null,
    user: null as User | null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin' || state.user?.role === 'super_admin',
    isSuperAdmin: (state) => state.user?.role === 'super_admin'
  },

  actions: {
    async login(email: string, password: string) {
      const api = useApi()

      try {
        const response = await api.login({ email, password })

        this.token = response.data.access_token
        this.refreshToken = response.data.refresh_token

        // Save to localStorage
        if (import.meta.client) {
          localStorage.setItem('access_token', response.data.access_token)
          localStorage.setItem('refresh_token', response.data.refresh_token)
        }

        // Fetch user data
        await this.fetchUser()

        return true
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    },

    async fetchUser() {
      const api = useApi()

      try {
        const response = await api.getCurrentUser()
        this.user = response.data

        // Check if user is admin
        if (!this.isAdmin) {
          throw new Error('Unauthorized: Admin access required')
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
        this.logout()
        throw error
      }
    },

    logout() {
      this.token = null
      this.refreshToken = null
      this.user = null

      if (import.meta.client) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      }
    },

    async initAuth() {
      if (import.meta.client) {
        const token = localStorage.getItem('access_token')
        const refreshToken = localStorage.getItem('refresh_token')

        if (token && refreshToken) {
          this.token = token
          this.refreshToken = refreshToken

          try {
            await this.fetchUser()
          } catch (error) {
            this.logout()
          }
        }
      }
    }
  }
})
