import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MarketingNav } from '@/components/marketing/marketing-nav'
import { MarketingFooter } from '@/components/marketing/marketing-footer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { subscribeForNotification } from '@/lib/notifications'

const noop = () => {}
const FEED_URL = 'https://blog.shiva.wtf/feeds/posts/default?alt=json-in-script&callback=renderBloggerFeed'
const MAX_POSTS = 6

// ---------- types ----------

interface RawEntry {
    title?: { $t: string }
    link?: Array<{ rel: string; type: string; href: string }>
    published?: { $t: string }
    updated?: { $t: string }
    content?: { $t: string }
}

interface BloggerFeedData {
    feed?: { entry?: RawEntry[] }
}

declare global {
    interface Window {
        renderBloggerFeed: (data: BloggerFeedData) => void
    }
}

interface BlogPost {
    title: string
    url: string
    published: string
    excerpt: string
    imageUrl: string | null
}

// ---------- helpers ----------

function stripHtml(html: string): string {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return (tmp.textContent ?? tmp.innerText ?? '').replace(/\s+/g, ' ').trim()
}

function truncate(text: string, n = 200): string {
    return text.length > n ? text.slice(0, n).trim() + '…' : text
}

function getAlternateUrl(links: RawEntry['link']): string {
    return links?.find(l => l.rel === 'alternate' && l.type === 'text/html')?.href ?? '#'
}

function fmtDate(iso: string | undefined): string {
    if (!iso) return ''
    try {
        return new Date(iso).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch {
        return ''
    }
}

function extractImage(html: string): string | null {
    const m = html.match(/<img[^>]+src="([^"]+)"/i)
    return m?.[1] ?? null
}

function parseEntry(entry: RawEntry): BlogPost {
    const raw = entry.content?.$t ?? ''
    return {
        title: entry.title?.$t ?? 'Untitled',
        url: getAlternateUrl(entry.link),
        published: fmtDate(entry.published?.$t ?? entry.updated?.$t),
        excerpt: truncate(stripHtml(raw)),
        imageUrl: extractImage(raw),
    }
}

// ---------- skeleton ----------

function SkeletonCard() {
    return (
        <div className="rounded-xl border p-6 flex flex-col gap-3 animate-pulse">
            <div className="h-40 rounded-lg bg-muted" />
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/4" />
            <div className="space-y-2">
                <div className="h-3 bg-muted rounded" />
                <div className="h-3 bg-muted rounded w-5/6" />
            </div>
        </div>
    )
}

// ---------- post card ----------

function PostCard({ post }: { post: BlogPost }) {
    return (
        <article className="rounded-xl border bg-card/50 flex flex-col overflow-hidden hover:shadow-sm transition-shadow">
            {post.imageUrl && (
                <a href={post.url} target="_blank" rel="noopener noreferrer" className="block shrink-0">
                    <img
                        src={post.imageUrl}
                        alt=""
                        className="w-full h-40 object-cover"
                        loading="lazy"
                        decoding="async"
                    />
                </a>
            )}
            <div className="flex flex-col flex-1 p-5">
                <h3 className="text-[15px] font-semibold leading-snug mb-1">
                    <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                    >
                        {post.title}
                    </a>
                </h3>
                {post.published && (
                    <p className="text-xs text-muted-foreground mb-3">{post.published}</p>
                )}
                <p className="text-sm text-foreground/70 leading-relaxed flex-1">{post.excerpt}</p>
                <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-sm text-primary hover:underline font-medium"
                >
                    Read post →
                </a>
            </div>
        </article>
    )
}

// ---------- notify form ----------

function NotifyForm() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await subscribeForNotification({
                email,
                notification_type: 'blog_series',
                label: 'Building CreatorModo Series',
            })
            setDone(true)
        } catch {
            setError("Couldn't save your email — try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="pt-10 border-t">
            <p className="text-sm text-foreground/80 mb-1">Want to know when it drops?</p>
            <p className="text-sm text-muted-foreground mb-4">
                Leave your email and we'll ping you the moment the series is live.
            </p>
            {done ? (
                <p className="text-sm text-primary font-medium">You're on the list.</p>
            ) : (
                <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm">
                    <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        className="flex-1"
                    />
                    <Button type="submit" size="sm" disabled={loading}>
                        {loading ? 'Saving…' : 'Notify me'}
                    </Button>
                </form>
            )}
            {error && <p className="text-xs text-destructive mt-2">{error}</p>}
        </div>
    )
}

// ---------- page ----------

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        let script: HTMLScriptElement | null = null

        window.renderBloggerFeed = (data: BloggerFeedData) => {
            try {
                const entries = data?.feed?.entry ?? []
                const sorted = [...entries].sort((a, b) => {
                    const aT = new Date(a.published?.$t ?? a.updated?.$t ?? 0).getTime()
                    const bT = new Date(b.published?.$t ?? b.updated?.$t ?? 0).getTime()
                    return bT - aT
                })
                setPosts(sorted.slice(0, MAX_POSTS).map(parseEntry))
            } catch {
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        script = document.createElement('script')
        script.src = FEED_URL
        script.async = true
        script.onerror = () => {
            setError(true)
            setLoading(false)
        }
        document.head.appendChild(script)

        return () => {
            delete (window as Window & { renderBloggerFeed?: unknown }).renderBloggerFeed
            script?.remove()
        }
    }, [])

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <MarketingNav onScrollTo={noop} />

            <main className="flex-1 w-full max-w-[860px] mx-auto px-6 md:px-8 py-16">

                <h1 className="text-4xl font-bold tracking-tight mb-2">Blog</h1>
                <p className="text-sm text-muted-foreground mb-2">
                    We haven't decided on a full company blog yet — but one of us is already writing.
                </p>
                <p className="text-sm text-muted-foreground mb-12">
                    Below are posts from the founder's personal blog. Once we launch successfully, a technical
                    breakdown of how we actually built this is coming.
                </p>

                {/* Live feed */}
                {loading && (
                    <div className="grid sm:grid-cols-2 gap-4 mb-14">
                        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                )}

                {error && (
                    <div className="rounded-xl border bg-muted/30 p-6 mb-14 text-sm text-foreground/80">
                        Couldn't load posts right now.{' '}
                        <a
                            href="https://blog.shiva.wtf/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            Visit the blog directly →
                        </a>
                    </div>
                )}

                {!loading && !error && posts.length > 0 && (
                    <div className="grid sm:grid-cols-2 gap-4 mb-14">
                        {posts.map(post => <PostCard key={post.url} post={post} />)}
                    </div>
                )}

                {!loading && !error && posts.length === 0 && (
                    <div className="rounded-xl border bg-muted/30 p-6 mb-14 text-sm text-foreground/80">
                        No posts yet.{' '}
                        <a
                            href="https://blog.shiva.wtf/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            Check back soon →
                        </a>
                    </div>
                )}

                {/* Founder blog callout */}
                <div className="rounded-xl border bg-card/50 p-6 mb-10">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2">
                        Founder's personal blog
                    </p>
                    <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                        These are personal posts from one of our founders — not a company blog, just someone
                        trying to write more and slowly getting there. More at{' '}
                        <a
                            href="https://blog.shiva.wtf/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            blog.shiva.wtf
                        </a>
                        .
                    </p>
                    <a
                        href="https://blog.shiva.wtf/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline font-medium"
                    >
                        See all posts →
                    </a>
                </div>

                {/* Upcoming series */}
                <div className="mb-14">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-4">
                        After launch
                    </p>
                    <div className="rounded-xl border p-6 relative overflow-hidden">
                        <span className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded-full">
                            Post-launch
                        </span>
                        <p className="text-[11px] text-muted-foreground mb-2">5–6 Part Technical Series</p>
                        <h2 className="text-lg font-semibold mb-3 pr-24">
                            Building CreatorModo: Architecture, Frontend &amp; Backend — End to End
                        </h2>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-5">
                            Once we've launched and have real users, we're going to break down exactly how we built
                            what you're using — the actual stack, the actual decisions, and the things that didn't
                            go to plan. A proper technical walkthrough, not a sanitised tutorial.
                        </p>
                        <div className="space-y-2 mb-5">
                            {[
                                'Part 1 — Architecture overview: how the three services talk to each other',
                                'Part 2 — The backend: FastAPI, async SQLAlchemy, RabbitMQ, and why we made those calls',
                                "Part 3 — The frontend: React 19, Tailwind 4, and building a UI that doesn't embarrass us",
                                'Part 4 — Auth, security, and the things that actually kept us up at night',
                                'Part 5 — Shipping it: deployment, infra, and going from local to live',
                            ].map((part, i) => (
                                <div key={i} className="flex gap-3 text-sm text-foreground/70">
                                    <span className="text-primary shrink-0 mt-0.5">→</span>
                                    {part}
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground italic">
                            Stay tuned. This one's going to be worth the wait.
                        </p>
                    </div>
                </div>

                {/* Notify CTA */}
                <NotifyForm />

            </main>

            <MarketingFooter />
        </div>
    )
}
