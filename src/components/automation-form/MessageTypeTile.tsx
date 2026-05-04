import type { ReactNode } from 'react'
import type { MessageType } from '@/types'

interface MessageTypeTileProps {
  id: MessageType
  title: string
  description: string
  icon: ReactNode
  active: boolean
  onClick: () => void
}

function TextMini({ active }: { active: boolean }) {
  return (
    <div
      className="rounded-md p-2 space-y-1.5"
      style={{
        background: active
          ? 'color-mix(in oklab, var(--primary) 6%, var(--muted))'
          : 'var(--muted)',
      }}
    >
      <div className="h-2 w-3/4 rounded-full" style={{ background: 'var(--border)' }} />
      <div className="h-2 w-2/3 rounded-full" style={{ background: 'var(--border)' }} />
      <div className="h-2 w-1/2 rounded-full" style={{ background: 'var(--border)' }} />
    </div>
  )
}

function CarouselMini({ active }: { active: boolean }) {
  return (
    <div className="flex gap-1.5 overflow-hidden">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-md p-1.5 flex-shrink-0 w-[60%]"
          style={{
            background:
              active && i === 0
                ? 'color-mix(in oklab, var(--primary) 8%, var(--muted))'
                : 'var(--muted)',
          }}
        >
          <div className="h-8 rounded mb-1" style={{ background: 'var(--border)' }} />
          <div className="h-1.5 w-3/4 rounded-full" style={{ background: 'var(--border)' }} />
        </div>
      ))}
    </div>
  )
}

function ButtonMini({ active }: { active: boolean }) {
  return (
    <div
      className="rounded-md p-2 space-y-1.5"
      style={{
        background: active
          ? 'color-mix(in oklab, var(--primary) 6%, var(--muted))'
          : 'var(--muted)',
      }}
    >
      <div className="h-2 w-3/4 rounded-full" style={{ background: 'var(--border)' }} />
      <div className="h-2 w-1/2 rounded-full" style={{ background: 'var(--border)' }} />
      <div
        className="h-4 w-full rounded mt-2"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      />
      <div
        className="h-4 w-full rounded"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      />
    </div>
  )
}

export function MessageTypeTile({
  id,
  title,
  description,
  icon,
  active,
  onClick,
}: MessageTypeTileProps) {
  const Mini = id === 'text' ? TextMini : id === 'carousel' ? CarouselMini : ButtonMini
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-xl p-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{
        background: active
          ? 'color-mix(in oklab, var(--primary) 6%, var(--card))'
          : 'var(--card)',
        border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
        boxShadow: active ? '0 0 0 1px var(--primary) inset' : 'none',
      }}
    >
      <div className="h-[60px] flex items-end overflow-hidden">
        <div className="w-full">
          <Mini active={active} />
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span
          className="w-7 h-7 rounded-md flex items-center justify-center"
          style={{
            background: active
              ? 'color-mix(in oklab, var(--primary) 22%, transparent)'
              : 'var(--muted)',
            color: active ? 'var(--primary)' : 'var(--muted-foreground)',
          }}
        >
          {icon}
        </span>
        <span className="font-semibold text-sm text-foreground">{title}</span>
      </div>
      <p className="text-xs mt-1.5 text-muted-foreground text-pretty">{description}</p>
    </button>
  )
}
