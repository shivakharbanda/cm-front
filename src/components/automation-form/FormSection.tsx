import type { ReactNode } from 'react'
import { Check } from 'lucide-react'

interface FormSectionProps {
  id: string
  step: number
  title: string
  description?: string
  complete?: boolean
  optional?: boolean
  children: ReactNode
}

export function FormSection({
  id,
  step,
  title,
  description,
  complete,
  optional,
  children,
}: FormSectionProps) {
  return (
    <section
      id={id}
      className="rounded-xl p-6 sm:p-7 scroll-mt-24"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
      }}
    >
      <header className="flex items-start gap-4 mb-5">
        <div
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold tabular-nums"
          style={{
            background: complete ? 'var(--primary)' : 'var(--muted)',
            color: complete ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
            border: complete ? '1px solid var(--primary)' : '1px solid var(--border)',
          }}
        >
          {complete ? <Check className="h-3 w-3" strokeWidth={3} /> : step}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">{title}</h2>
            {optional && (
              <span
                className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium text-muted-foreground"
                style={{ border: '1px solid var(--border)' }}
              >
                Optional
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground text-pretty">{description}</p>
          )}
        </div>
      </header>
      <div>{children}</div>
    </section>
  )
}
