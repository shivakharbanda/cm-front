import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import type { DatePoint } from '@/types/bio'

interface AnalyticsChartProps {
  viewsData: DatePoint[]
  clicksData: DatePoint[]
  className?: string
}

export function AnalyticsChart({ viewsData, clicksData, className }: AnalyticsChartProps) {
  // Merge views and clicks data by date
  const mergedData = viewsData.map((view) => {
    const click = clicksData.find((c) => c.date === view.date)
    return {
      date: view.date,
      views: view.value,
      clicks: click?.value || 0,
    }
  })

  const formatXAxis = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM d')
    } catch {
      return dateStr
    }
  }

  const formatTooltipLabel = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMMM d, yyyy')
    } catch {
      return dateStr
    }
  }

  if (mergedData.length === 0) {
    return (
      <div className={`flex items-center justify-center h-[300px] bg-card border rounded-xl ${className}`}>
        <p className="text-muted-foreground">No data available for this period</p>
      </div>
    )
  }

  return (
    <div className={`p-4 bg-card border rounded-xl ${className}`}>
      <h3 className="font-semibold mb-4">Traffic Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={mergedData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#B8963A" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#B8963A" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7D9B76" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7D9B76" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            className="text-muted-foreground"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            className="text-muted-foreground"
            width={40}
          />
          <Tooltip
            labelFormatter={formatTooltipLabel}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
          />
          <Area
            type="monotone"
            dataKey="views"
            name="Views"
            stroke="#B8963A"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#viewsGradient)"
          />
          <Area
            type="monotone"
            dataKey="clicks"
            name="Clicks"
            stroke="#7D9B76"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#clicksGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
