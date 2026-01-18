import { authenticatedFetcher } from './auth'
import type { InstagramAccount, InstagramPostsResponse, InstagramAuthURL } from '@/types'

const API_PREFIX = '/api/v1/instagram'

export async function getInstagramAuthUrl(): Promise<InstagramAuthURL> {
  return authenticatedFetcher<InstagramAuthURL>(`${API_PREFIX}/auth-url`)
}

export async function handleInstagramCallback(code: string): Promise<InstagramAccount> {
  return authenticatedFetcher<InstagramAccount>(`${API_PREFIX}/callback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  })
}

export async function getInstagramAccount(): Promise<InstagramAccount | null> {
  try {
    return await authenticatedFetcher<InstagramAccount>(`${API_PREFIX}/account`)
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return null
    }
    throw error
  }
}

export async function disconnectInstagramAccount(): Promise<void> {
  await authenticatedFetcher<void>(`${API_PREFIX}/account`, {
    method: 'DELETE',
  })
}

export async function getInstagramPosts(cursor?: string): Promise<InstagramPostsResponse> {
  const params = cursor ? `?after=${cursor}` : ''
  return authenticatedFetcher<InstagramPostsResponse>(`${API_PREFIX}/posts${params}`)
}
