import { useState } from 'react'
import { ExternalLink, ArrowRight, Loader2 } from 'lucide-react'
import type { BioLink, PublicLink } from '@/types/bio'

type LinkData = BioLink | PublicLink

interface BioLinkItemProps {
  link: LinkData
  preview?: boolean
  onNavigate?: (linkId: string) => Promise<string>
}

export function BioLinkItem({ link, preview = false, onNavigate }: BioLinkItemProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    if (preview || !onNavigate) return

    setIsLoading(true)
    try {
      const redirectUrl = await onNavigate(link.id)
      window.location.href = redirectUrl
    } catch (err) {
      console.error('Failed to track click:', err)
      // Fallback to direct navigation
      window.location.href = link.url
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || preview}
      className={`group relative w-full text-left ${preview ? 'cursor-default' : ''}`}
    >
      {/* Glow effect on hover */}
      {!preview && (
        <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      {/* Glass card */}
      <div className={`
        relative flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl
        transition-all duration-300
        ${!preview ? 'hover:bg-white/15 hover:border-white/30 active:scale-[0.98]' : ''}
      `}>
        {/* Thumbnail */}
        {link.thumbnail_url ? (
          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-white/10">
            <img
              src={link.thumbnail_url}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <ExternalLink className="h-5 w-5 text-white/70" />
          </div>
        )}

        {/* Title */}
        <span className="flex-1 font-semibold text-white truncate">
          {link.title}
        </span>

        {/* Arrow/Loading */}
        {isLoading ? (
          <Loader2 className="h-5 w-5 text-white/70 animate-spin" />
        ) : (
          <div className={`
            w-10 h-10 rounded-full bg-white/10 flex items-center justify-center
            ${!preview ? 'group-hover:bg-white/20' : ''}
            transition-colors
          `}>
            <ArrowRight className={`h-5 w-5 text-white ${!preview ? 'group-hover:translate-x-0.5' : ''} transition-transform`} />
          </div>
        )}
      </div>
    </button>
  )
}
