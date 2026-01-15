import type { UseFetchOptions } from '#app'

interface ApiError {
  statusCode: number
  message: string
  error?: string
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase as string

  // Get token from localStorage
  const getToken = () => {
    if (import.meta.client) {
      return localStorage.getItem('access_token')
    }
    return null
  }

  // Get refresh token from localStorage
  const getRefreshToken = () => {
    if (import.meta.client) {
      return localStorage.getItem('refresh_token')
    }
    return null
  }

  // Save tokens to localStorage
  const saveTokens = (accessToken: string, refreshToken: string) => {
    if (import.meta.client) {
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('refresh_token', refreshToken)
    }
  }

  // Clear tokens from localStorage
  const clearTokens = () => {
    if (import.meta.client) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    }
  }

  // Refresh access token
  const refreshAccessToken = async () => {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await $fetch<{ access_token: string, refresh_token: string }>('/auth/refresh', {
        baseURL,
        method: 'POST',
        body: { refresh_token: refreshToken }
      })

      saveTokens(response.access_token, response.refresh_token)
      return response.access_token
    } catch (error) {
      // If refresh fails, clear tokens and redirect to login
      clearTokens()
      if (import.meta.client) {
        window.location.href = '/auth/login'
      }
      throw error
    }
  }

  // Main API fetch function
  const apiFetch = async <T>(
    url: string,
    options: UseFetchOptions<T> = {}
  ): Promise<T> => {
    const token = getToken()

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {})
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await $fetch<T>(url, {
        baseURL,
        ...options,
        headers
      })

      return response
    } catch (error: any) {
      // Handle 401 unauthorized - try to refresh token
      if (error?.statusCode === 401 && token) {
        try {
          const newToken = await refreshAccessToken()

          // Retry original request with new token
          const retryResponse = await $fetch<T>(url, {
            baseURL,
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${newToken}`
            }
          })

          return retryResponse
        } catch (refreshError) {
          // Refresh failed, throw original error
          throw error
        }
      }

      // For other errors, just throw
      throw error
    }
  }

  // Upload file function
  const uploadFile = async (
    url: string,
    file: File,
    additionalData?: Record<string, any>
  ): Promise<any> => {
    const token = getToken()
    const formData = new FormData()

    formData.append('file', file)

    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key])
      })
    }

    const headers: Record<string, string> = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await $fetch(url, {
        baseURL,
        method: 'POST',
        headers,
        body: formData
      })

      return response
    } catch (error: any) {
      // Handle 401 unauthorized - try to refresh token
      if (error?.statusCode === 401 && token) {
        try {
          const newToken = await refreshAccessToken()

          // Retry upload with new token
          const retryResponse = await $fetch(url, {
            baseURL,
            method: 'POST',
            headers: {
              ...headers,
              Authorization: `Bearer ${newToken}`
            },
            body: formData
          })

          return retryResponse
        } catch (refreshError) {
          throw error
        }
      }

      throw error
    }
  }

  return {
    apiFetch,
    uploadFile,
    getToken,
    getRefreshToken,
    saveTokens,
    clearTokens
  }
}
