import { ExternalLink, TrendingUp } from 'lucide-react'
import type { LinkAnalytics } from '@/types/bio'

interface TopLinksCardProps {
  links: LinkAnalytics[]
  className?: string
}

export function TopLinksCard({ links, className }: TopLinksCardProps) {
  // Sort by clicks descending and take top 5
  const topLinks = [...links]
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5)

  const maxClicks = topLinks[0]?.clicks || 1

  if (topLinks.length === 0) {
    return (
      <div className={`p-4 bg-card border rounded-xl ${className}`}>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Top Links
        </h3>
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          No link data available
        </div>
      </div>
    )
  }

  return (
    <div className={`p-4 bg-card border rounded-xl ${className}`}>
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-primary" />
        Top Links
      </h3>

      <div className="space-y-3">
        {topLinks.map((link, index) => (
          <div key={link.link_id} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-medium text-muted-foreground w-5">
                  {index + 1}.
                </span>
                <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm font-medium truncate">{link.title}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm font-semibold">{link.clicks.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">
                  {link.ctr.toFixed(1)}% CTR
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="ml-7 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${(link.clicks / maxClicks) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
