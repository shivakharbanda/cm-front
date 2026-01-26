import { authenticatedFetcher } from './auth'
import type {
  Automation,
  AutomationCreate,
  AutomationUpdate,
  AutomationAnalytics,
  AutomationAnalyticsSummary,
  AutomationCommentersResponse,
} from '@/types'

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

export async function getAutomationsSummary(): Promise<Record<string, AutomationAnalyticsSummary>> {
  return authenticatedFetcher<Record<string, AutomationAnalyticsSummary>>(
    `${API_PREFIX}/analytics/summary`
  )
}

export async function getAutomationAnalytics(
  id: string,
  params?: { start_date?: string; end_date?: string }
): Promise<AutomationAnalytics> {
  const query = params ? `?${new URLSearchParams(params as Record<string, string>)}` : ''
  return authenticatedFetcher<AutomationAnalytics>(`${API_PREFIX}/${id}/analytics${query}`)
}

export async function getAutomationCommenters(
  id: string,
  params?: { limit?: number; offset?: number }
): Promise<AutomationCommentersResponse> {
  const queryParams = params
    ? `?${new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)])
      )}`
    : ''
  return authenticatedFetcher<AutomationCommentersResponse>(`${API_PREFIX}/${id}/commenters${queryParams}`)
}
