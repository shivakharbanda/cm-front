import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { BioLinkItem } from './BioLinkItem'
import { BioCardItem } from './BioCardItem'
import type { BioPage, PageItem, BioLink, BioCard } from '@/types/bio'

interface BioPreviewProps {
  page: BioPage | null
  items: PageItem[]
}

export function BioPreview({ page, items }: BioPreviewProps) {
  if (!page) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No bio page created yet
      </div>
    )
  }

  const activeItems = items.filter((item) => {
    const data = item.data
    return 'is_active' in data ? data.is_active : true
  })

  return (
    <div className="relative w-full max-w-[375px] mx-auto">
      {/* Phone Frame */}
      <div className="relative bg-background border-4 border-foreground/10 rounded-[2.5rem] p-2 shadow-xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-foreground/10 rounded-b-xl" />

        {/* Screen - Dark theme matching published page */}
        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-[2rem] min-h-[600px] overflow-hidden relative">
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative z-10 p-6 pt-10">
            {/* Profile Section */}
            <div className="flex flex-col items-center text-center mb-6">
              {/* Avatar with gradient ring */}
              <div className="relative mb-3">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full blur-sm scale-110 opacity-75" />
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full scale-105" />
                <Avatar className="h-20 w-20 relative border-2 border-white/10">
                  <AvatarImage src={page.profile_image_url || undefined} />
                  <AvatarFallback className="text-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    {page.display_name?.charAt(0) || page.slug.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h1 className="font-bold text-lg text-white">
                {page.display_name || `@${page.slug}`}
              </h1>
              {page.bio_text && (
                <p className="text-sm text-white/70 mt-1 max-w-[280px]">
                  {page.bio_text}
                </p>
              )}
            </div>

            {/* Items */}
            <div className="space-y-4">
              {activeItems.length === 0 ? (
                <div className="text-center py-8 text-white/50 text-sm">
                  Add links or cards to see them here
                </div>
              ) : (
                activeItems.map((item) => {
                  if (item.type === 'link') {
                    const link = item.data as BioLink
                    return (
                      <BioLinkItem key={`link-${item.item_id}`} link={link} preview />
                    )
                  } else {
                    const card = item.data as BioCard
                    return (
                      <BioCardItem key={`card-${item.item_id}`} card={card} preview />
                    )
                  }
                })
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-white/40">
                Powered by <span className="font-medium text-white/60">Hibra</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
