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

export interface Automation {
  id: string
  instagram_account_id: string
  name: string
  post_id: string
  trigger_type: TriggerType
  keywords?: string[]
  dm_message_template: string
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
  dm_message_template: string
}

export interface AutomationUpdate {
  name?: string
  trigger_type?: TriggerType
  keywords?: string[]
  dm_message_template?: string
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

// API Response types
export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface InstagramAuthURL {
  auth_url: string
}
