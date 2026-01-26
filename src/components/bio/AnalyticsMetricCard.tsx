import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnalyticsMetricCardProps {
  title: string
  value: number | string
  change?: number
  icon?: React.ElementType
  format?: 'number' | 'percent'
}

export function AnalyticsMetricCard({
  title,
  value,
  change,
  icon: Icon,
  format = 'number',
}: AnalyticsMetricCardProps) {
  const formatValue = (val: number | string): string => {
    if (typeof val === 'string') return val
    if (format === 'percent') return `${val.toFixed(1)}%`
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`
    return val.toLocaleString()
  }

  const getTrendIcon = () => {
    if (change === undefined || change === 0) {
      return <Minus className="h-3 w-3" />
    }
    return change > 0 ? (
      <TrendingUp className="h-3 w-3" />
    ) : (
      <TrendingDown className="h-3 w-3" />
    )
  }

  const getTrendColor = () => {
    if (change === undefined || change === 0) return 'text-muted-foreground'
    return change > 0 ? 'text-green-600' : 'text-red-500'
  }

  return (
    <div className="flex-shrink-0 w-[140px] sm:w-auto sm:flex-1 p-4 bg-card border rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        {Icon && (
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
        <span className="text-sm text-muted-foreground">{title}</span>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold">{formatValue(value)}</span>
        {change !== undefined && (
          <div
            className={cn(
              'flex items-center gap-0.5 text-xs font-medium mb-1',
              getTrendColor()
            )}
          >
            {getTrendIcon()}
            <span>{Math.abs(change).toFixed(1)}%</span>
          </div>
        )}
      </div>
    </div>
  )
}
