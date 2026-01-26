import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { format, subDays, parseISO } from 'date-fns'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChevronLeft,
  MessageSquare,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageCircle,
  Percent,
} from 'lucide-react'
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
import { getAutomation, getAutomationAnalytics, getAutomationCommenters } from '@/lib/automations'
import type { Automation, AutomationAnalytics, CommenterInfo } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

type DateRange = '7d' | '30d' | '90d'

interface MetricCardProps {
  title: string
  value: number | string
  icon: React.ElementType
  format?: 'number' | 'percent'
  variant?: 'default' | 'success' | 'danger'
}

function MetricCard({ title, value, icon: Icon, format = 'number', variant = 'default' }: MetricCardProps) {
  const formatValue = (val: number | string): string => {
    if (typeof val === 'string') return val
    if (format === 'percent') return `${val.toFixed(1)}%`
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`
    return val.toLocaleString()
  }

  const getIconColor = () => {
    switch (variant) {
      case 'success':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30'
      case 'danger':
        return 'text-red-500 bg-red-100 dark:bg-red-900/30'
      default:
        return 'text-primary bg-primary/10'
    }
  }

  return (
    <div className="flex-shrink-0 w-[140px] sm:w-auto sm:flex-1 p-4 bg-card border rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-lg ${getIconColor()}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm text-muted-foreground">{title}</span>
      </div>
      <span className="text-2xl font-bold">{formatValue(value)}</span>
    </div>
  )
}

export default function AutomationAnalyticsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()

  const [automation, setAutomation] = useState<Automation | null>(null)
  const [analytics, setAnalytics] = useState<AutomationAnalytics | null>(null)
  const [commenters, setCommenters] = useState<CommenterInfo[]>([])
  const [commentersTotal, setCommentersTotal] = useState(0)
  const [commentersLoading, setCommentersLoading] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange>('30d')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getDateParams = useCallback((range: DateRange) => {
    const endDate = new Date()
    let startDate: Date

    switch (range) {
      case '7d':
        startDate = subDays(endDate, 7)
        break
      case '30d':
        startDate = subDays(endDate, 30)
        break
      case '90d':
        startDate = subDays(endDate, 90)
        break
    }

    return {
      start_date: format(startDate, 'yyyy-MM-dd'),
      end_date: format(endDate, 'yyyy-MM-dd'),
    }
  }, [])

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || authLoading || !id) return

    setLoading(true)
    setError(null)

    try {
      const [automationData, analyticsData, commentersData] = await Promise.all([
        getAutomation(id),
        getAutomationAnalytics(id, getDateParams(dateRange)),
        getAutomationCommenters(id, { limit: 10 }),
      ])

      setAutomation(automationData)
      setAnalytics(analyticsData)
      setCommenters(commentersData.commenters)
      setCommentersTotal(commentersData.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, authLoading, id, dateRange, getDateParams])

  const loadMoreCommenters = useCallback(async () => {
    if (!id || commentersLoading) return

    setCommentersLoading(true)
    try {
      const data = await getAutomationCommenters(id, { limit: 10, offset: commenters.length })
      setCommenters((prev) => [...prev, ...data.commenters])
    } catch (err) {
      console.error('Failed to load more commenters:', err)
    } finally {
      setCommentersLoading(false)
    }
  }, [id, commenters.length, commentersLoading])

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    fetchData()
  }, [isAuthenticated, authLoading, navigate, fetchData])

  // Prepare chart data
  const chartData = analytics
    ? analytics.dms_by_date.map((dm) => {
        const reply = analytics.replies_by_date.find((r) => r.date === dm.date)
        return {
          date: dm.date,
          dms: dm.value,
          replies: reply?.value || 0,
        }
      })
    : []

  const formatXAxis = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM d')
    } catch {
      return dateStr
    }
  }

  const formatTooltipLabel = (label: React.ReactNode) => {
    try {
      return format(parseISO(String(label)), 'MMMM d, yyyy')
    } catch {
      return String(label)
    }
  }

  if (authLoading || !isAuthenticated) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">Analytics</h1>
            {automation && (
              <p className="text-sm text-muted-foreground">{automation.name}</p>
            )}
          </div>
        </div>

        <Select
          value={dateRange}
          onValueChange={(value: DateRange) => setDateRange(value)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* DM Metrics */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Direct Messages</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
          {loading ? (
            <>
              <Skeleton className="h-24 w-[140px] sm:flex-1 rounded-xl flex-shrink-0" />
              <Skeleton className="h-24 w-[140px] sm:flex-1 rounded-xl flex-shrink-0" />
              <Skeleton className="h-24 w-[140px] sm:flex-1 rounded-xl flex-shrink-0" />
              <Skeleton className="h-24 w-[140px] sm:flex-1 rounded-xl flex-shrink-0" />
            </>
          ) : analytics ? (
            <>
              <MetricCard
                title="DMs Sent"
                value={analytics.total_dms_sent}
                icon={MessageSquare}
              />
              <MetricCard
                title="People Reached"
                value={analytics.unique_people_reached}
                icon={Users}
              />
              <MetricCard
                title="Success Rate"
                value={analytics.dm_success_rate}
                icon={Percent}
                format="percent"
                variant="success"
              />
              <MetricCard
                title="Failed"
                value={analytics.total_dms_failed}
                icon={XCircle}
                variant="danger"
              />
            </>
          ) : null}
        </div>
      </div>

      {/* Comment Reply Metrics */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Comment Replies</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
          {loading ? (
            <>
              <Skeleton className="h-24 w-[140px] sm:flex-1 rounded-xl flex-shrink-0" />
              <Skeleton className="h-24 w-[140px] sm:flex-1 rounded-xl flex-shrink-0" />
              <Skeleton className="h-24 w-[140px] sm:flex-1 rounded-xl flex-shrink-0" />
            </>
          ) : analytics ? (
            <>
              <MetricCard
                title="Replies Sent"
                value={analytics.total_comment_replies}
                icon={MessageCircle}
              />
              <MetricCard
                title="Success Rate"
                value={analytics.comment_reply_success_rate}
                icon={CheckCircle}
                format="percent"
                variant="success"
              />
              <MetricCard
                title="Failed"
                value={analytics.total_comment_replies_failed}
                icon={XCircle}
                variant="danger"
              />
            </>
          ) : null}
        </div>
      </div>

      {/* Timeline Chart */}
      {loading ? (
        <Skeleton className="h-[380px] rounded-xl" />
      ) : chartData.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Activity Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="dmsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="repliesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
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
                  allowDecimals={false}
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
                  dataKey="dms"
                  name="DMs Sent"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#dmsGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="replies"
                  name="Comment Replies"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#repliesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No activity yet</h3>
            <p className="text-muted-foreground">
              Analytics will appear here once your automation starts sending DMs
            </p>
          </CardContent>
        </Card>
      )}

      {/* People Reached Section */}
      {loading ? (
        <Skeleton className="h-[300px] rounded-xl" />
      ) : commenters.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">People Reached ({commentersTotal})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {commenters.map((c) => (
                <div key={`${c.user_id}-${c.dm_sent_at}`} className="flex items-center gap-3 py-2 border-b last:border-0">
                  {/* Profile picture */}
                  <Avatar className="h-10 w-10">
                    {c.profile_picture_url ? (
                      <AvatarImage src={c.profile_picture_url} />
                    ) : (
                      <AvatarFallback>{c.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                    )}
                  </Avatar>

                  {/* User info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{c.name || c.username || c.user_id}</p>
                    {c.username && (
                      <p className="text-sm text-muted-foreground">@{c.username}</p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="text-right text-sm text-muted-foreground">
                    {c.followers_count !== null && (
                      <p>{c.followers_count.toLocaleString()} followers</p>
                    )}
                    {c.media_count !== null && (
                      <p>{c.media_count} posts</p>
                    )}
                  </div>

                  {/* Status badge */}
                  <Badge variant={c.status === 'sent' ? 'default' : 'destructive'}>
                    {c.status}
                  </Badge>
                </div>
              ))}
            </div>

            {commentersTotal > commenters.length && (
              <Button
                variant="ghost"
                className="w-full mt-4"
                onClick={loadMoreCommenters}
                disabled={commentersLoading}
              >
                {commentersLoading ? 'Loading...' : `Load more (${commentersTotal - commenters.length} remaining)`}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
