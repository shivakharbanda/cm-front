import { useEffect, useRef, useState } from 'react'
import {
  Camera,
  Check,
  ChevronDown,
  Image as ImageIcon,
  Layers,
  Loader2,
  Search,
  Video,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getInstagramPosts } from '@/lib/instagram'
import type { InstagramPost } from '@/types'

type Filter = 'all' | 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'

interface PostPickerFieldProps {
  value: InstagramPost | null
  onChange: (post: InstagramPost) => void
  hasError?: boolean
}

function MediaIcon({ type, size = 12 }: { type: string; size?: number }) {
  const props = { className: '', style: { width: size, height: size } }
  if (type === 'VIDEO') return <Video {...props} />
  if (type === 'CAROUSEL_ALBUM') return <Layers {...props} />
  return <ImageIcon {...props} />
}

function MediaTypeFilter({ value, onChange }: { value: Filter; onChange: (v: Filter) => void }) {
  const opts: { id: Filter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'IMAGE', label: 'Photos' },
    { id: 'VIDEO', label: 'Reels' },
    { id: 'CAROUSEL_ALBUM', label: 'Carousel' },
  ]
  return (
    <div
      className="inline-flex rounded-md p-0.5"
      style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
    >
      {opts.map((o) => {
        const active = o.id === value
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className="px-2.5 h-7 rounded text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{
              background: active ? 'var(--card)' : 'transparent',
              color: active ? 'var(--foreground)' : 'var(--muted-foreground)',
              boxShadow: active ? '0 1px 2px rgb(0 0 0 / 0.06)' : 'none',
            }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

function PostTile({
  post,
  selected,
  onClick,
}: {
  post: InstagramPost
  selected: boolean
  onClick: () => void
}) {
  const src = post.thumbnail_url || post.media_url
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative aspect-square rounded-lg overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={{ border: `2px solid ${selected ? 'var(--primary)' : 'transparent'}` }}
    >
      {src ? (
        <img src={src} alt="" className="w-full h-full object-cover" />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}
        >
          <MediaIcon type={post.media_type} size={20} />
        </div>
      )}
      <div
        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center backdrop-blur-sm"
        style={{ background: 'rgba(0,0,0,0.45)', color: '#fff' }}
      >
        <MediaIcon type={post.media_type} size={12} />
      </div>
      {selected && (
        <div
          className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </div>
      )}
      {post.caption && (
        <div
          className="absolute inset-x-0 bottom-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,.75), transparent)' }}
        >
          <p className="text-[11px] text-white line-clamp-2">{post.caption}</p>
        </div>
      )}
    </button>
  )
}

export function PostPickerField({ value, onChange, hasError }: PostPickerFieldProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const popRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  useEffect(() => {
    if (open && posts.length === 0 && !loading) {
      void loadPosts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const loadPosts = async (cursor?: string) => {
    if (cursor) setLoadingMore(true)
    else setLoading(true)
    setError(null)
    try {
      const res = await getInstagramPosts(cursor)
      setPosts((prev) => (cursor ? [...prev, ...res.posts] : res.posts))
      setNextCursor(res.next_cursor)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const filtered = posts.filter((p) => {
    if (filter !== 'all' && p.media_type !== filter) return false
    if (query && !(p.caption || '').toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  const triggerStyle = {
    border: hasError ? '1.5px solid var(--destructive)' : '1px solid var(--border)',
  }

  return (
    <div className="relative" ref={popRef}>
      {value ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full p-3 rounded-xl flex items-center gap-3 text-left transition-colors hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{ ...triggerStyle, background: 'var(--card)' }}
        >
          <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
            {value.thumbnail_url || value.media_url ? (
              <img
                src={value.thumbnail_url || value.media_url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}
              >
                <MediaIcon type={value.media_type} size={18} />
              </div>
            )}
            <div
              className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,.55)', color: '#fff' }}
            >
              <MediaIcon type={value.media_type} size={10} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground">
              Post #{value.id} ·{' '}
              {new Date(value.timestamp).toLocaleDateString(undefined, {
                day: 'numeric',
                month: 'short',
              })}
            </p>
            <p className="text-sm truncate mt-0.5 text-foreground">
              {value.caption || 'No caption'}
            </p>
          </div>
          <span
            className="text-xs font-medium px-3 py-1.5 rounded-md shrink-0"
            style={{
              color: 'var(--primary)',
              background: 'color-mix(in oklab, var(--primary) 12%, transparent)',
            }}
          >
            Change
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full p-4 rounded-xl flex items-center gap-4 text-left transition-colors hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{
            border: hasError ? '1.5px dashed var(--destructive)' : '1.5px dashed var(--border)',
            background: 'transparent',
          }}
        >
          <div
            className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}
          >
            <Camera className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Choose a post to automate</p>
            <p className="text-xs mt-0.5 text-muted-foreground">
              Pick from your recent Instagram posts
            </p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      )}

      {open && (
        <div
          className="absolute left-0 right-0 z-40 mt-2 p-4 rounded-xl"
          style={{
            background: 'var(--popover)',
            border: '1px solid var(--border)',
            boxShadow:
              '0 24px 48px -16px rgba(0,0,0,.25), 0 4px 8px -4px rgba(0,0,0,.1)',
          }}
        >
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <div className="relative flex-1 min-w-[180px]">
              <Search
                className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <input
                placeholder="Search captions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="w-full h-9 pl-9 pr-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                style={{
                  background: 'var(--input)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                }}
              />
            </div>
            <MediaTypeFilter value={filter} onChange={setFilter} />
          </div>

          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[360px] overflow-y-auto">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg animate-pulse"
                  style={{ background: 'var(--muted)' }}
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-sm text-destructive">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-sm text-muted-foreground">
              {posts.length === 0
                ? 'No posts found. Make sure your Instagram account has posts.'
                : 'No posts match. Try a different filter.'}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[360px] overflow-y-auto pr-1">
              {filtered.map((p) => (
                <PostTile
                  key={p.id}
                  post={p}
                  selected={!!value && value.id === p.id}
                  onClick={() => {
                    onChange(p)
                    setOpen(false)
                  }}
                />
              ))}
            </div>
          )}

          <div
            className="mt-3 pt-3 flex items-center justify-between text-xs flex-wrap gap-2"
            style={{ borderTop: '1px solid var(--border)', color: 'var(--muted-foreground)' }}
          >
            <span>
              {filtered.length} of {posts.length} loaded
              {filter !== 'all' && ` (${filter.toLowerCase()})`}
            </span>
            <div className="flex items-center gap-2">
              {nextCursor && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => loadPosts(nextCursor)}
                  disabled={loadingMore}
                >
                  {loadingMore ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : null}
                  Load more
                </Button>
              )}
              <button
                type="button"
                className="hover:underline"
                style={{ color: 'var(--primary)' }}
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

