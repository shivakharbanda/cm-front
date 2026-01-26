import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2, Instagram, Twitter, Youtube, Globe, Linkedin, Music2 } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { BioLinkItem, BioCardItem } from '@/components/bio'
import {
  getPublicBioPage,
  trackPageView,
  trackLinkClick,
  submitCardLead,
} from '@/lib/bio'
import type { PublicBioResponse, PublicLink, PublicCard, ThemeConfig, SocialPlatform } from '@/types/bio'

export default function PublicBioPage() {
  const { slug } = useParams<{ slug: string }>()
  const [page, setPage] = useState<PublicBioResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) {
        setError('Invalid page URL')
        setLoading(false)
        return
      }

      try {
        const data = await getPublicBioPage(slug)
        setPage(data)

        // Track page view
        trackPageView(slug, {
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
        }).catch(console.error)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Page not found')
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [slug])

  // Update document title and meta tags
  useEffect(() => {
    if (page) {
      document.title = page.display_name
        ? `${page.display_name} | Link in Bio`
        : `@${slug} | Link in Bio`
    }
  }, [page])

  const handleLinkClick = async (linkId: string): Promise<string> => {
    if (!slug) throw new Error('Invalid slug')

    const result = await trackLinkClick(slug, linkId, {
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
    })
    return result.redirect_url
  }

  const handleCardSubmit = async (cardId: string, email: string) => {
    if (!slug) throw new Error('Invalid slug')

    return submitCardLead(slug, cardId, { email })
  }

  const getThemeStyles = (theme: ThemeConfig | null) => {
    if (!theme) return {}
    return {
      '--theme-bg': theme.background_color,
      '--theme-text': theme.text_color,
      '--theme-button-bg': theme.button_color,
      '--theme-button-text': theme.button_text_color,
    } as React.CSSProperties
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-white/70 text-center">
          {error || "The page you're looking for doesn't exist."}
        </p>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      style={getThemeStyles(page.theme_config)}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[440px] mx-auto px-6 py-12">
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center mb-8">
          {/* Avatar with gradient ring */}
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full blur-sm scale-110 opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full scale-105" />
            <Avatar className="h-24 w-24 relative border-4 border-white/10">
              <AvatarImage src={page.profile_image_url || undefined} />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                {page.display_name?.charAt(0) || slug?.charAt(0).toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Name */}
          <h1 className="text-2xl font-bold text-white mb-1">
            {page.display_name || `@${slug}`}
          </h1>

          {/* Bio */}
          {page.bio_text && (
            <p className="text-white/70 text-sm max-w-[300px]">{page.bio_text}</p>
          )}

          {/* Social Icons */}
          {page.social_links && page.social_links.length > 0 && (
            <div className="flex items-center gap-3 mt-4">
              {page.social_links.map((link) => (
                <SocialIconLink key={link.id} platform={link.platform} url={link.url} />
              ))}
            </div>
          )}
        </div>

        {/* Links and Cards */}
        <div className="space-y-4">
          {page.items.length === 0 ? (
            <div className="text-center py-8 text-white/50">
              No links available
            </div>
          ) : (
            page.items.map((item) => {
              if (item.type === 'link') {
                const link = item.data as PublicLink
                return (
                  <BioLinkItem
                    key={`link-${item.item_id}`}
                    link={link}
                    onNavigate={handleLinkClick}
                  />
                )
              } else {
                const card = item.data as PublicCard
                return (
                  <BioCardItem
                    key={`card-${item.item_id}`}
                    card={card}
                    onSubmit={(email) => handleCardSubmit(card.id, email)}
                  />
                )
              }
            })
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/60 transition-colors"
          >
            Powered by{' '}
            <span className="font-semibold text-white/60">Hibra</span>
          </a>
        </div>
      </div>
    </div>
  )
}

const PLATFORM_ICONS: Record<SocialPlatform, React.ElementType> = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  tiktok: Music2,
  linkedin: Linkedin,
  website: Globe,
}

function SocialIconLink({ platform, url }: { platform: SocialPlatform; url: string }) {
  const Icon = PLATFORM_ICONS[platform] || Globe
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
    >
      <Icon className="h-5 w-5 text-white/70" />
    </a>
  )
}
