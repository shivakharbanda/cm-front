// User types
export interface User {
  id: string
  email: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Instagram types
export interface InstagramAccount {
  id: string
  user_id: string
  instagram_user_id: string
  username: string
  token_expires_at: string
  created_at: string
  updated_at: string
}

export interface InstagramPost {
  id: string
  caption?: string
  media_type: string
  media_url?: string
  thumbnail_url?: string
  permalink: string
  timestamp: string
}

export interface InstagramPostsResponse {
  posts: InstagramPost[]
  next_cursor: string | null
}

// Automation types
export type TriggerType = 'all_comments' | 'keyword'
export type MessageType = 'text' | 'carousel'

export interface CarouselButton {
  type: string
  url: string
  title: string
}

export interface CarouselElement {
  title: string
  subtitle?: string
  image_url?: string
  buttons: CarouselButton[]
}

export interface Automation {
  id: string
  instagram_account_id: string
  name: string
  post_id: string
  trigger_type: TriggerType
  keywords?: string[]
  message_type: MessageType
  dm_message_template?: string | null
  carousel_elements?: CarouselElement[] | null
  comment_reply_enabled: boolean
  comment_reply_template?: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AutomationCreate {
  instagram_account_id: string
  name: string
  post_id: string
  trigger_type: TriggerType
  keywords?: string[]
  message_type?: MessageType
  dm_message_template: string
  carousel_elements?: CarouselElement[]
  comment_reply_enabled?: boolean
  comment_reply_template?: string | null
}

export interface AutomationUpdate {
  name?: string
  trigger_type?: TriggerType
  keywords?: string[]
  message_type?: MessageType
  dm_message_template?: string
  carousel_elements?: CarouselElement[]
  comment_reply_enabled?: boolean
  comment_reply_template?: string | null
}

// DM Log types
export interface DMSentLog {
  id: string
  automation_id: string
  post_id: string
  commenter_user_id: string
  comment_id: string
  status: string
  sent_at: string
}

// Automation Analytics types
export interface AutomationAnalyticsSummary {
  dms_sent: number
  people_reached: number
}

export interface DatePoint {
  date: string
  value: number
}

export interface AutomationAnalytics {
  automation_id: string
  total_dms_sent: number
  total_dms_failed: number
  dm_success_rate: number
  unique_people_reached: number
  total_comment_replies: number
  total_comment_replies_failed: number
  comment_reply_success_rate: number
  dms_by_date: DatePoint[]
  replies_by_date: DatePoint[]
}

// Commenter types
export interface CommenterInfo {
  user_id: string
  username: string | null
  name: string | null
  biography: string | null
  followers_count: number | null
  media_count: number | null
  profile_picture_url: string | null
  dm_sent_at: string
  status: string
}

export interface AutomationCommentersResponse {
  automation_id: string
  commenters: CommenterInfo[]
  total: number
}

// API Response types
export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface InstagramAuthURL {
  auth_url: string
}
