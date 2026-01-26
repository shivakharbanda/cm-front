// Social Link types
export type SocialPlatform = 'instagram' | 'twitter' | 'youtube' | 'tiktok' | 'linkedin' | 'website'

export interface SocialLink {
  id: string
  bio_page_id: string
  platform: SocialPlatform
  url: string
  position: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SocialLinkCreate {
  platform: SocialPlatform
  url: string
}

export interface SocialLinkUpdate {
  url?: string
  position?: number
  is_active?: boolean
}

export interface SocialLinkInput {
  id?: string           // undefined for new links
  platform: SocialPlatform
  url: string
  is_active?: boolean   // default true
}

export interface PublicSocialLink {
  id: string
  platform: SocialPlatform
  url: string
}

// Bio Page types
export interface ThemeConfig {
  background_color?: string
  button_color?: string
  button_text_color?: string
  text_color?: string
  font_family?: string
}

export interface BioPage {
  id: string
  user_id: string
  instagram_account_id: string | null
  slug: string
  display_name: string | null
  bio_text: string | null
  profile_image_url: string | null
  theme_config: ThemeConfig | null
  is_published: boolean
  seo_title: string | null
  seo_description: string | null
  og_image_url: string | null
  created_at: string
  updated_at: string
}

export interface BioPageCreate {
  slug?: string  // Optional, auto-generated if not provided
}

export interface BioPageUpdate {
  slug?: string
  display_name?: string | null
  bio_text?: string | null
  profile_image_url?: string | null
  theme_config?: ThemeConfig | null
  seo_title?: string | null
  seo_description?: string | null
  og_image_url?: string | null
  social_links?: SocialLinkInput[]
}

// Bio Link types
export type LinkType = 'standard' | 'smart'

export interface BioLink {
  id: string
  bio_page_id: string
  title: string
  url: string
  link_type: LinkType
  position: number
  is_active: boolean
  visible_from: string | null
  visible_until: string | null
  thumbnail_url: string | null
  created_at: string
  updated_at: string
}

export interface BioLinkCreate {
  title: string
  url: string
  link_type?: LinkType
  thumbnail_url?: string | null
  visible_from?: string | null
  visible_until?: string | null
}

export interface BioLinkUpdate {
  title?: string
  url?: string
  link_type?: LinkType
  is_active?: boolean
  thumbnail_url?: string | null
  visible_from?: string | null
  visible_until?: string | null
}

// Bio Card types (Lead Magnets)
export interface BioCard {
  id: string
  bio_page_id: string
  badge_text: string | null
  headline: string
  description: string | null
  background_color: string
  background_image_url: string | null
  cta_text: string
  destination_url: string
  success_message: string | null
  requires_email: boolean
  position: number
  is_active: boolean
  visible_from: string | null
  visible_until: string | null
  created_at: string
  updated_at: string
}

export interface BioCardCreate {
  badge_text?: string | null
  headline: string
  description?: string | null
  background_color?: string
  background_image_url?: string | null
  cta_text: string
  destination_url: string
  success_message?: string | null
  requires_email?: boolean
  visible_from?: string | null
  visible_until?: string | null
}

export interface BioCardUpdate {
  badge_text?: string | null
  headline?: string
  description?: string | null
  background_color?: string
  background_image_url?: string | null
  cta_text?: string
  destination_url?: string
  success_message?: string | null
  requires_email?: boolean
  is_active?: boolean
  visible_from?: string | null
  visible_until?: string | null
}

// Page Item types (for ordering)
export type PageItemType = 'link' | 'card'

export interface PageItem {
  type: PageItemType
  item_id: string
  position: number
  data: BioLink | BioCard
}

export interface ReorderItem {
  type: PageItemType
  item_id: string
  position: number
}

// Routing Rule types
export type RuleType = 'country' | 'device' | 'time'

export interface RoutingRule {
  id: string
  bio_link_id: string
  rule_type: RuleType
  rule_config: Record<string, unknown>
  destination_url: string
  priority: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RoutingRuleCreate {
  rule_type: RuleType
  rule_config: Record<string, unknown>
  destination_url: string
  priority?: number
}

export interface RoutingRuleUpdate {
  rule_type?: RuleType
  rule_config?: Record<string, unknown>
  destination_url?: string
  priority?: number
  is_active?: boolean
}

// Analytics types
export interface DatePoint {
  date: string
  value: number
}

export interface PageAnalytics {
  total_views: number
  total_clicks: number
  ctr: number
  views_by_date: DatePoint[]
  clicks_by_date: DatePoint[]
  views_change_percent?: number
  clicks_change_percent?: number
}

export interface LinkAnalytics {
  link_id: string
  title: string
  clicks: number
  unique_clicks: number
  ctr: number
}

export interface CardAnalytics {
  card_id: string
  headline: string
  views: number
  submissions: number
  conversion_rate: number
}

export interface ItemAnalytics {
  links: LinkAnalytics[]
  cards: CardAnalytics[]
}

export interface CountryBreakdown {
  country_code: string
  country_name: string
  views: number
  percentage: number
}

export interface AnalyticsParams {
  start_date?: string
  end_date?: string
  period?: '7d' | '30d' | '90d'
}

// Lead types
export interface Lead {
  id: string
  bio_card_id: string
  email: string
  created_at: string
}

export interface LeadListResponse {
  leads: Lead[]
  total: number
  page: number
  per_page: number
}

export interface LeadParams {
  page?: number
  per_page?: number
  card_id?: string
}

// Public page types
export interface PublicLink {
  id: string
  title: string
  url: string
  thumbnail_url: string | null
}

export interface PublicCard {
  id: string
  badge_text: string | null
  headline: string
  description: string | null
  background_color: string
  background_image_url: string | null
  cta_text: string
  requires_email: boolean
}

export interface PublicPageItem {
  type: PageItemType
  item_id: string
  position: number
  data: PublicLink | PublicCard
}

export interface PublicBioResponse {
  slug: string
  display_name: string | null
  bio_text: string | null
  profile_image_url: string | null
  theme_config: ThemeConfig | null
  items: PublicPageItem[]
  social_links: PublicSocialLink[]
}

// Tracking request types
export interface ViewRequest {
  referrer?: string | null
  user_agent?: string | null
}

export interface ClickRequest {
  referrer?: string | null
  user_agent?: string | null
}

export interface ClickResponse {
  redirect_url: string
}

export interface CardSubmitRequest {
  email: string
}

export interface CardSubmitResponse {
  success: boolean
  message: string
  redirect_url?: string
}
