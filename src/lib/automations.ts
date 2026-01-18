import { authenticatedFetcher } from './auth'
import type { Automation, AutomationCreate, AutomationUpdate } from '@/types'

const API_PREFIX = '/api/v1/automations'

export async function getAutomations(instagramAccountId?: string): Promise<Automation[]> {
  const params = instagramAccountId ? `?instagram_account_id=${instagramAccountId}` : ''
  return authenticatedFetcher<Automation[]>(`${API_PREFIX}${params}`)
}

export async function getAutomation(id: string): Promise<Automation> {
  return authenticatedFetcher<Automation>(`${API_PREFIX}/${id}`)
}

export async function createAutomation(data: AutomationCreate): Promise<Automation> {
  return authenticatedFetcher<Automation>(API_PREFIX, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function updateAutomation(id: string, data: AutomationUpdate): Promise<Automation> {
  return authenticatedFetcher<Automation>(`${API_PREFIX}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteAutomation(id: string): Promise<void> {
  await authenticatedFetcher<void>(`${API_PREFIX}/${id}`, {
    method: 'DELETE',
  })
}

export async function activateAutomation(id: string): Promise<Automation> {
  return authenticatedFetcher<Automation>(`${API_PREFIX}/${id}/activate`, {
    method: 'POST',
  })
}

export async function deactivateAutomation(id: string): Promise<Automation> {
  return authenticatedFetcher<Automation>(`${API_PREFIX}/${id}/deactivate`, {
    method: 'POST',
  })
}
