import { fetcher, ApiError } from './api'

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

// Get current user — uses authenticatedFetcher so an expired access token
// triggers a silent refresh rather than a false 401 logout.
export const getCurrentUser = async (): Promise<User> => {
  return authenticatedFetcher<User>('/api/v1/auth/me')
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

// Single in-flight refresh shared across all parallel callers
let refreshPromise: Promise<User> | null = null

export const authenticatedFetcher = async <T = unknown>(
  path: string,
  options?: RequestInit
): Promise<T> => {
  try {
    return await fetcher<T>(path, options)
  } catch (err) {
    // Only intercept 401 — let everything else (500, network errors) bubble up
    if (!(err instanceof ApiError && err.status === 401)) throw err

    // Deduplicate: reuse an in-flight refresh so parallel 401s don't race
    if (!refreshPromise) {
      refreshPromise = refreshTokens().finally(() => { refreshPromise = null })
    }

    try {
      await refreshPromise
    } catch (refreshErr) {
      // Refresh itself 401'd → session is truly dead → notify AuthContext to logout
      if (refreshErr instanceof ApiError && refreshErr.status === 401) {
        window.dispatchEvent(new Event('auth:session-expired'))
      }
      throw refreshErr
    }

    // Refresh succeeded — new cookie is set, retry with it automatically
    return await fetcher<T>(path, options)
  }
}
