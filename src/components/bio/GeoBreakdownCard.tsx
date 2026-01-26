import { Globe } from 'lucide-react'
import type { CountryBreakdown } from '@/types/bio'

interface GeoBreakdownCardProps {
  countries: CountryBreakdown[]
  className?: string
}

// Country flag emoji helper
const getCountryFlag = (countryCode: string): string => {
  try {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  } catch {
    return ''
  }
}

export function GeoBreakdownCard({ countries, className }: GeoBreakdownCardProps) {
  // Sort by views descending and take top 5
  const topCountries = [...countries]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)

  if (topCountries.length === 0) {
    return (
      <div className={`p-4 bg-card border rounded-xl ${className}`}>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          By Country
        </h3>
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          No geographic data available
        </div>
      </div>
    )
  }

  return (
    <div className={`p-4 bg-card border rounded-xl ${className}`}>
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Globe className="h-4 w-4 text-primary" />
        By Country
      </h3>

      <div className="space-y-3">
        {topCountries.map((country) => (
          <div key={country.country_code} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg leading-none">
                  {getCountryFlag(country.country_code)}
                </span>
                <span className="text-sm font-medium truncate">
                  {country.country_name}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm font-semibold">
                  {country.views.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground w-12 text-right">
                  {country.percentage.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="ml-7 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary/70 rounded-full transition-all duration-500"
                style={{ width: `${country.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
