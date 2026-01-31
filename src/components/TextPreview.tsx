import { useEffect, useState } from 'react'
import { Send, Camera, Mic, Heart } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

interface TextPreviewProps {
  message?: string
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

export function TextPreview({ message, username }: TextPreviewProps) {
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
      <div className={`flex-1 p-4 space-y-3 overflow-y-auto min-h-[180px] flex flex-col justify-end ${isDark ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
        {message && message.trim() ? (
          <div className="flex justify-end">
            <div className="bg-[#3797F0] text-white text-sm rounded-2xl rounded-br-sm px-3.5 py-2 max-w-[85%] whitespace-pre-wrap break-words shadow-sm">
              {message}
            </div>
          </div>
        ) : (
          <div className={`flex items-center justify-center h-24 text-xs ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
            Type a message to see a preview
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
