import { useEffect, useState } from 'react'
import { ImageIcon, Send, Camera, Mic, Heart } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import type { CarouselElement } from '@/types'

interface CarouselPreviewProps {
  message?: string
  cards: CarouselElement[]
  username?: string
}

function useResolvedTheme() {
  const { theme } = useTheme()
  const [resolved, setResolved] = useState<'light' | 'dark'>(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = (e: MediaQueryListEvent) => setResolved(e.matches ? 'dark' : 'light')
      setResolved(mq.matches ? 'dark' : 'light')
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
    setResolved(theme === 'dark' ? 'dark' : 'light')
  }, [theme])

  return resolved
}

export function CarouselPreview({ message, cards, username }: CarouselPreviewProps) {
  const visibleCards = cards.filter(c => c.title)
  const isDark = useResolvedTheme() === 'dark'
  const displayName = username || 'instagram_user'
  const initial = displayName[0]?.toUpperCase() || 'U'

  return (
    <div className={`rounded-2xl overflow-hidden border flex flex-col h-full ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'}`}>
      {/* Chat header */}
      <div className={`flex items-center gap-3 px-4 py-3 border-b ${isDark ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-100 bg-white'}`}>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold truncate ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
            {displayName}
          </p>
          <p className={`text-[11px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            Instagram
          </p>
        </div>
        <div className="flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className={`text-[10px] font-medium tracking-wide ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            LIVE
          </span>
        </div>
      </div>

      {/* Chat area */}
      <div className={`flex-1 p-4 space-y-3 overflow-y-auto min-h-[180px] ${isDark ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
        {/* Text bubble */}
        {message && message.trim() && (
          <div className="flex justify-end">
            <div className="bg-[#3797F0] text-white text-sm rounded-2xl rounded-br-sm px-3.5 py-2 max-w-[85%] whitespace-pre-wrap break-words shadow-sm">
              {message}
            </div>
          </div>
        )}

        {/* Carousel cards */}
        {visibleCards.length > 0 && (
          <div className="flex gap-2.5 overflow-x-auto pb-1">
            {visibleCards.map((card, i) => (
              <div
                key={i}
                className={`flex-shrink-0 w-[200px] rounded-xl overflow-hidden shadow-md flex flex-col ${isDark ? 'bg-zinc-800 border border-zinc-700' : 'bg-white border border-zinc-200'}`}
              >
                {/* Image area */}
                <div className={`w-full h-[150px] relative overflow-hidden ${isDark ? 'bg-zinc-700' : 'bg-zinc-100'}`}>
                  {card.image_url ? (
                    <img
                      src={card.image_url}
                      alt={card.title}
                      className="w-full h-full object-cover"
                      onError={e => {
                        const img = e.target as HTMLImageElement
                        img.style.display = 'none'
                        const fallback = img.parentElement?.querySelector('.img-fallback')
                        if (fallback) (fallback as HTMLElement).style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div
                    className={`img-fallback absolute inset-0 items-center justify-center ${isDark ? 'bg-gradient-to-br from-zinc-700 to-zinc-800' : 'bg-gradient-to-br from-zinc-100 to-zinc-200'}`}
                    style={{ display: card.image_url ? 'none' : 'flex' }}
                  >
                    <ImageIcon className={`h-8 w-8 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
                  </div>
                </div>

                {/* Content */}
                <div className="px-3 pt-2.5 pb-1.5 flex-1">
                  <p className={`text-[13px] font-semibold leading-snug line-clamp-2 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    {card.title}
                  </p>
                  {card.subtitle && (
                    <p className={`text-[12px] leading-snug mt-0.5 line-clamp-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {card.subtitle}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="px-3 pb-2.5 space-y-1.5">
                  {card.buttons.map((btn, bi) =>
                    btn.title ? (
                      <div
                        key={bi}
                        className={`w-full text-center text-[13px] font-medium text-[#3797F0] border rounded-lg py-1.5 transition-colors ${isDark ? 'border-zinc-600 bg-zinc-800 hover:bg-zinc-700' : 'border-zinc-200 bg-white hover:bg-zinc-50'}`}
                      >
                        {btn.title}
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {visibleCards.length === 0 && !(message && message.trim()) && (
          <div className={`flex items-center justify-center h-24 text-xs ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
            Add a card title to see a preview
          </div>
        )}
      </div>

      {/* Message input bar */}
      <div className={`flex items-center gap-2 px-3 py-2.5 border-t ${isDark ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-100 bg-white'}`}>
        <Camera className={`h-5 w-5 flex-shrink-0 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
        <div className={`flex-1 rounded-full border px-3 py-1.5 text-xs ${isDark ? 'border-zinc-700 text-zinc-600 bg-zinc-900' : 'border-zinc-200 text-zinc-400 bg-zinc-50'}`}>
          Message...
        </div>
        <Mic className={`h-5 w-5 flex-shrink-0 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
        <Heart className={`h-5 w-5 flex-shrink-0 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
        <Send className={`h-4 w-4 flex-shrink-0 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
      </div>
    </div>
  )
}
