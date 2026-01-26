import { authenticatedFetcher } from './auth'
import { fetcher, API_BASE_URL } from './api'
import type {
  BioPage,
  BioPageCreate,
  BioPageUpdate,
  BioLink,
  BioLinkCreate,
  BioLinkUpdate,
  BioCard,
  BioCardCreate,
  BioCardUpdate,
  PageItem,
  ReorderItem,
  RoutingRule,
  RoutingRuleCreate,
  RoutingRuleUpdate,
  PageAnalytics,
  ItemAnalytics,
  AnalyticsParams,
  CountryBreakdown,
  LeadListResponse,
  LeadParams,
  PublicBioResponse,
  ViewRequest,
  ClickRequest,
  ClickResponse,
  CardSubmitRequest,
  CardSubmitResponse,
  SocialLink,
  SocialLinkCreate,
  SocialLinkUpdate,
} from '@/types/bio'

const API_PREFIX = '/api/v1/bio-pages'
const PUBLIC_API_PREFIX = '/api/v1/public/bio'

// ============ Bio Pages ============

export async function getBioPages(): Promise<BioPage[]> {
  return authenticatedFetcher<BioPage[]>(API_PREFIX)
}

export async function getBioPage(id: string): Promise<BioPage> {
  return authenticatedFetcher<BioPage>(`${API_PREFIX}/${id}`)
}

export async function createBioPage(data?: BioPageCreate): Promise<BioPage> {
  return authenticatedFetcher<BioPage>(API_PREFIX, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data || {}),
  })
}

export async function updateBioPage(id: string, data: BioPageUpdate): Promise<BioPage> {
  return authenticatedFetcher<BioPage>(`${API_PREFIX}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteBioPage(id: string): Promise<void> {
  await authenticatedFetcher<void>(`${API_PREFIX}/${id}`, {
    method: 'DELETE',
  })
}

export async function publishBioPage(id: string): Promise<BioPage> {
  return authenticatedFetcher<BioPage>(`${API_PREFIX}/${id}/publish`, {
    method: 'POST',
  })
}

export async function unpublishBioPage(id: string): Promise<BioPage> {
  return authenticatedFetcher<BioPage>(`${API_PREFIX}/${id}/unpublish`, {
    method: 'POST',
  })
}

// ============ Bio Links ============

export async function getBioLinks(pageId: string): Promise<BioLink[]> {
  return authenticatedFetcher<BioLink[]>(`${API_PREFIX}/${pageId}/links`)
}

export async function createBioLink(pageId: string, data: BioLinkCreate): Promise<BioLink> {
  return authenticatedFetcher<BioLink>(`${API_PREFIX}/${pageId}/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function updateBioLink(
  pageId: string,
  linkId: string,
  data: BioLinkUpdate
): Promise<BioLink> {
  return authenticatedFetcher<BioLink>(`${API_PREFIX}/${pageId}/links/${linkId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteBioLink(pageId: string, linkId: string): Promise<void> {
  await authenticatedFetcher<void>(`${API_PREFIX}/${pageId}/links/${linkId}`, {
    method: 'DELETE',
  })
}

// ============ Bio Cards (Lead Magnets) ============

export async function getBioCards(pageId: string): Promise<BioCard[]> {
  return authenticatedFetcher<BioCard[]>(`${API_PREFIX}/${pageId}/cards`)
}

export async function createBioCard(pageId: string, data: BioCardCreate): Promise<BioCard> {
  return authenticatedFetcher<BioCard>(`${API_PREFIX}/${pageId}/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function updateBioCard(
  pageId: string,
  cardId: string,
  data: BioCardUpdate
): Promise<BioCard> {
  return authenticatedFetcher<BioCard>(`${API_PREFIX}/${pageId}/cards/${cardId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteBioCard(pageId: string, cardId: string): Promise<void> {
  await authenticatedFetcher<void>(`${API_PREFIX}/${pageId}/cards/${cardId}`, {
    method: 'DELETE',
  })
}

// ============ Page Items (Ordering) ============

export async function getPageItems(pageId: string): Promise<PageItem[]> {
  const response = await authenticatedFetcher<{ items: PageItem[] }>(`${API_PREFIX}/${pageId}/items`)
  return response.items
}

export async function reorderPageItems(pageId: string, items: ReorderItem[]): Promise<void> {
  await authenticatedFetcher<void>(`${API_PREFIX}/${pageId}/items/reorder`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  })
}

// ============ Routing Rules ============

export async function getRoutingRules(linkId: string): Promise<RoutingRule[]> {
  return authenticatedFetcher<RoutingRule[]>(`/api/v1/bio-links/${linkId}/rules`)
}

export async function createRoutingRule(
  linkId: string,
  data: RoutingRuleCreate
): Promise<RoutingRule> {
  return authenticatedFetcher<RoutingRule>(`/api/v1/bio-links/${linkId}/rules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function updateRoutingRule(
  linkId: string,
  ruleId: string,
  data: RoutingRuleUpdate
): Promise<RoutingRule> {
  return authenticatedFetcher<RoutingRule>(`/api/v1/bio-links/${linkId}/rules/${ruleId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteRoutingRule(linkId: string, ruleId: string): Promise<void> {
  await authenticatedFetcher<void>(`/api/v1/bio-links/${linkId}/rules/${ruleId}`, {
    method: 'DELETE',
  })
}

// ============ Analytics ============

function buildAnalyticsParams(params: AnalyticsParams): string {
  const searchParams = new URLSearchParams()
  if (params.start_date) searchParams.append('start_date', params.start_date)
  if (params.end_date) searchParams.append('end_date', params.end_date)
  if (params.period) searchParams.append('period', params.period)
  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

export async function getBioAnalytics(
  pageId: string,
  params: AnalyticsParams = {}
): Promise<PageAnalytics> {
  return authenticatedFetcher<PageAnalytics>(
    `${API_PREFIX}/${pageId}/analytics${buildAnalyticsParams(params)}`
  )
}

export async function getItemAnalytics(
  pageId: string,
  params: AnalyticsParams = {}
): Promise<ItemAnalytics> {
  return authenticatedFetcher<ItemAnalytics>(
    `${API_PREFIX}/${pageId}/analytics/items${buildAnalyticsParams(params)}`
  )
}

export async function getCountryBreakdown(
  pageId: string,
  params: AnalyticsParams = {}
): Promise<CountryBreakdown[]> {
  return authenticatedFetcher<CountryBreakdown[]>(
    `${API_PREFIX}/${pageId}/analytics/countries${buildAnalyticsParams(params)}`
  )
}

export async function exportAnalytics(
  pageId: string,
  params: AnalyticsParams = {}
): Promise<Blob> {
  const url = `${API_BASE_URL}${API_PREFIX}/${pageId}/analytics/export${buildAnalyticsParams(params)}`
  const response = await fetch(url, {
    credentials: 'include',
  })
  if (!response.ok) {
    throw new Error(`Failed to export analytics: ${response.status}`)
  }
  return response.blob()
}

// ============ Leads ============

function buildLeadParams(params: LeadParams): string {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.append('page', params.page.toString())
  if (params.per_page) searchParams.append('per_page', params.per_page.toString())
  if (params.card_id) searchParams.append('card_id', params.card_id)
  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

export async function getLeads(
  pageId: string,
  params: LeadParams = {}
): Promise<LeadListResponse> {
  return authenticatedFetcher<LeadListResponse>(
    `${API_PREFIX}/${pageId}/leads${buildLeadParams(params)}`
  )
}

export async function deleteLead(pageId: string, leadId: string): Promise<void> {
  await authenticatedFetcher<void>(`${API_PREFIX}/${pageId}/leads/${leadId}`, {
    method: 'DELETE',
  })
}

export async function exportLeads(pageId: string): Promise<Blob> {
  const url = `${API_BASE_URL}${API_PREFIX}/${pageId}/leads/export`
  const response = await fetch(url, {
    credentials: 'include',
  })
  if (!response.ok) {
    throw new Error(`Failed to export leads: ${response.status}`)
  }
  return response.blob()
}

// ============ Social Links ============

export async function getSocialLinks(pageId: string): Promise<SocialLink[]> {
  return authenticatedFetcher<SocialLink[]>(`${API_PREFIX}/${pageId}/social-links`)
}

export async function createSocialLink(pageId: string, data: SocialLinkCreate): Promise<SocialLink> {
  return authenticatedFetcher<SocialLink>(`${API_PREFIX}/${pageId}/social-links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function updateSocialLink(
  pageId: string,
  linkId: string,
  data: SocialLinkUpdate
): Promise<SocialLink> {
  return authenticatedFetcher<SocialLink>(`${API_PREFIX}/${pageId}/social-links/${linkId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteSocialLink(pageId: string, linkId: string): Promise<void> {
  await authenticatedFetcher<void>(`${API_PREFIX}/${pageId}/social-links/${linkId}`, {
    method: 'DELETE',
  })
}

// ============ Public API (No Auth) ============

export async function getPublicBioPage(slug: string): Promise<PublicBioResponse> {
  return fetcher<PublicBioResponse>(`${PUBLIC_API_PREFIX}/${slug}`)
}

export async function trackPageView(slug: string, data: ViewRequest = {}): Promise<void> {
  await fetcher<void>(`${PUBLIC_API_PREFIX}/${slug}/view`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function trackLinkClick(
  slug: string,
  linkId: string,
  data: ClickRequest = {}
): Promise<ClickResponse> {
  return fetcher<ClickResponse>(`${PUBLIC_API_PREFIX}/${slug}/click/${linkId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function submitCardLead(
  slug: string,
  cardId: string,
  data: CardSubmitRequest
): Promise<CardSubmitResponse> {
  return fetcher<CardSubmitResponse>(`${PUBLIC_API_PREFIX}/${slug}/card/${cardId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}
