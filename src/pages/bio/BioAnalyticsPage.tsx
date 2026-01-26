import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { format, subDays } from 'date-fns'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChevronLeft,
  Download,
  Eye,
  MousePointer,
  Percent,
  AlertCircle,
  Pencil,
} from 'lucide-react'
import {
  getBioPages,
  getBioAnalytics,
  getItemAnalytics,
  getCountryBreakdown,
  exportAnalytics,
} from '@/lib/bio'
import type { BioPage, PageAnalytics, ItemAnalytics, CountryBreakdown, AnalyticsParams } from '@/types/bio'
import {
  AnalyticsMetricCard,
  AnalyticsChart,
  TopLinksCard,
  GeoBreakdownCard,
  BioBottomNav,
} from '@/components/bio'

type DateRange = '7d' | '30d' | '90d'

export default function BioAnalyticsPage() {
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()

  const [bioPage, setBioPage] = useState<BioPage | null>(null)
  const [analytics, setAnalytics] = useState<PageAnalytics | null>(null)
  const [itemAnalytics, setItemAnalytics] = useState<ItemAnalytics | null>(null)
  const [countries, setCountries] = useState<CountryBreakdown[]>([])
  const [dateRange, setDateRange] = useState<DateRange>('7d')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const getDateParams = useCallback((range: DateRange): AnalyticsParams => {
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
    if (!isAuthenticated || authLoading) return

    setLoading(true)
    setError(null)

    try {
      const pages = await getBioPages()
      const page = pages[0]  // User can only have one

      if (!page) {
        navigate('/bio')
        return
      }

      setBioPage(page)

      const params = getDateParams(dateRange)

      const [analyticsData, itemsData, countriesData] = await Promise.all([
        getBioAnalytics(page.id, params),
        getItemAnalytics(page.id, params),
        getCountryBreakdown(page.id, params),
      ])

      setAnalytics(analyticsData)
      setItemAnalytics(itemsData)
      setCountries(countriesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, authLoading, dateRange, navigate, getDateParams])

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    fetchData()
  }, [isAuthenticated, authLoading, navigate, fetchData])

  const handleExport = async () => {
    if (!bioPage) return

    setExporting(true)
    try {
      const params = getDateParams(dateRange)
      const blob = await exportAnalytics(bioPage.id, params)

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bio-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export analytics')
    } finally {
      setExporting(false)
    }
  }

  if (authLoading || !isAuthenticated) {
    return null
  }

  return (
    <div className="pb-20 lg:pb-6">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/bio">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Analytics</h1>
          </div>

          <div className="flex items-center gap-2">
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

            <Button
              variant="outline"
              size="icon"
              onClick={handleExport}
              disabled={exporting || !bioPage}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Metric Cards */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
          {loading ? (
            <>
              <Skeleton className="h-24 w-[140px] sm:flex-1 rounded-xl flex-shrink-0" />
              <Skeleton className="h-24 w-[140px] sm:flex-1 rounded-xl flex-shrink-0" />
              <Skeleton className="h-24 w-[140px] sm:flex-1 rounded-xl flex-shrink-0" />
            </>
          ) : analytics ? (
            <>
              <AnalyticsMetricCard
                title="Views"
                value={analytics.total_views}
                change={analytics.views_change_percent}
                icon={Eye}
              />
              <AnalyticsMetricCard
                title="Clicks"
                value={analytics.total_clicks}
                change={analytics.clicks_change_percent}
                icon={MousePointer}
              />
              <AnalyticsMetricCard
                title="CTR"
                value={analytics.ctr}
                icon={Percent}
                format="percent"
              />
            </>
          ) : null}
        </div>

        {/* Traffic Chart */}
        {loading ? (
          <Skeleton className="h-[380px] rounded-xl" />
        ) : analytics ? (
          <AnalyticsChart
            viewsData={analytics.views_by_date}
            clicksData={analytics.clicks_by_date}
          />
        ) : null}

        {/* Bottom Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {loading ? (
            <>
              <Skeleton className="h-[280px] rounded-xl" />
              <Skeleton className="h-[280px] rounded-xl" />
            </>
          ) : (
            <>
              <TopLinksCard links={itemAnalytics?.links || []} />
              <GeoBreakdownCard countries={countries} />
            </>
          )}
        </div>
      </div>

      {/* Floating Edit Button */}
      <Link
        to="/bio"
        className="fixed bottom-24 right-6 lg:bottom-6 z-40"
      >
        <Button size="lg" className="rounded-full shadow-lg">
          <Pencil className="h-5 w-5 mr-2" />
          Edit Bio
        </Button>
      </Link>

      {/* Bottom Navigation (mobile only) */}
      <BioBottomNav />
    </div>
  )
}
