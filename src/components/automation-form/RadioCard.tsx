import type { ReactNode } from 'react'
import { Check } from 'lucide-react'

interface RadioCardProps {
  selected: boolean
  onClick: () => void
  title: string
  description: string
  icon: ReactNode
  badge?: string
  disabled?: boolean
}

export function RadioCard({
  selected,
  onClick,
  title,
  description,
  icon,
  badge,
  disabled,
}: RadioCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="text-left w-full p-4 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background: selected
          ? 'color-mix(in oklab, var(--primary) 7%, var(--card))'
          : 'var(--card)',
        border: `1px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
        boxShadow: selected ? '0 0 0 1px var(--primary) inset' : 'none',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
          style={{
            background: selected
              ? 'color-mix(in oklab, var(--primary) 22%, transparent)'
              : 'var(--muted)',
            color: selected ? 'var(--primary)' : 'var(--muted-foreground)',
          }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-foreground">{title}</span>
            {badge && (
              <span
                className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                style={{
                  background: 'transparent',
                  color: 'var(--muted-foreground)',
                  border: '1px solid var(--border)',
                }}
              >
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs mt-0.5 text-muted-foreground text-pretty">{description}</p>
        </div>
        <div
          className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
          style={{
            background: selected ? 'var(--primary)' : 'transparent',
            border: `1.5px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
          }}
        >
          {selected && (
            <Check
              className="h-3 w-3"
              strokeWidth={3}
              style={{ color: 'var(--primary-foreground)' }}
            />
          )}
        </div>
      </div>
    </button>
  )
}
