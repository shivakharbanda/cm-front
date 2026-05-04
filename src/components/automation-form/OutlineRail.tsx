import { Check } from 'lucide-react'

export interface OutlineSection {
  id: string
  title: string
  complete: boolean
  optional?: boolean
}

interface OutlineRailProps {
  sections: OutlineSection[]
  active: string
  onJump: (id: string) => void
}

export function OutlineRail({ sections, active, onJump }: OutlineRailProps) {
  return (
    <nav className="sticky top-20 hidden lg:block" aria-label="Form sections">
      <p className="text-[11px] font-bold uppercase tracking-wider mb-3 text-muted-foreground">
        Steps
      </p>
      <ol className="space-y-1">
        {sections.map((s, i) => {
          const isActive = active === s.id
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onJump(s.id)}
                className="group w-full flex items-center gap-3 py-1.5 px-2 rounded-md text-left transition-colors hover:bg-[var(--muted)]"
                style={{ background: isActive ? 'var(--muted)' : 'transparent' }}
              >
                <span
                  className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold tabular-nums"
                  style={{
                    background: s.complete
                      ? 'var(--primary)'
                      : isActive
                      ? 'var(--card)'
                      : 'transparent',
                    color: s.complete
                      ? 'var(--primary-foreground)'
                      : isActive
                      ? 'var(--foreground)'
                      : 'var(--muted-foreground)',
                    border: s.complete
                      ? '1px solid var(--primary)'
                      : `1px solid ${isActive ? 'var(--border)' : 'transparent'}`,
                  }}
                >
                  {s.complete ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
                </span>
                <span
                  className="text-[13px]"
                  style={{
                    color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)',
                    fontWeight: isActive ? 600 : 500,
                  }}
                >
                  {s.title}
                </span>
                {s.optional && (
                  <span className="ml-auto text-[10px] text-muted-foreground">opt.</span>
                )}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
