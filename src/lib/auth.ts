import { fetcher } from './api'

export interface User {
  id: string
  email: string
  is_active: boolean
  created_at: string
  email_verified_at: string | null
}

// Login - cookies are set by the server
export const login = async (email: string, password: string): Promise<User> => {
  return fetcher<User>('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
}

// Registration
export const register = async (email: string, password: string): Promise<User> => {
  return fetcher<User>('/api/v1/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
}

// Logout - clears cookies on server
export const logout = async (): Promise<void> => {
  await fetcher('/api/v1/auth/logout', {
    method: 'POST',
  })
}

// Get current user - checks if authenticated
export const getCurrentUser = async (): Promise<User> => {
  return fetcher<User>('/api/v1/auth/me')
}

// Refresh tokens - cookies are handled by server
export const refreshTokens = async (): Promise<User> => {
  return fetcher<User>('/api/v1/auth/refresh', {
    method: 'POST',
  })
}

export const requestPasswordReset = async (email: string): Promise<void> => {
  await fetcher('/api/v1/auth/password-reset/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
}

export const confirmPasswordReset = async (token: string, newPassword: string): Promise<void> => {
  await fetcher('/api/v1/auth/password-reset/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, new_password: newPassword }),
  })
}

export const sendEmailVerification = async (): Promise<void> => {
  await fetcher('/api/v1/auth/email/send-verification', {
    method: 'POST',
  })
}

export const verifyEmail = async (token: string): Promise<void> => {
  await fetcher('/api/v1/auth/email/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
}

// Authenticated fetcher - just use the regular fetcher since cookies are sent automatically
// Handles 401 errors by attempting token refresh
export const authenticatedFetcher = async <T = unknown>(
  path: string,
  options?: RequestInit
): Promise<T> => {
  try {
    return await fetcher<T>(path, options)
  } catch (err) {
    if (err instanceof Error && err.message.includes('401')) {
      try {
        // Attempt to refresh tokens
        await refreshTokens()
        // Retry the original request
        return await fetcher<T>(path, options)
      } catch {
        // Refresh failed, redirect to login
        window.location.href = '/login'
        throw new Error('Session expired. Please log in again.')
      }
    }
    throw err
  }
}
