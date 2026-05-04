import { useState } from 'react'
import { AtSign, Hash, Sparkles, X } from 'lucide-react'
import type { TriggerType } from '@/types'
import { RadioCard } from './RadioCard'

interface TriggerStepFieldProps {
  trigger: TriggerType
  onTrigger: (t: TriggerType) => void
  keywords: string[]
  onKeywords: (k: string[]) => void
  errors: Record<string, string>
  onClearError: (field: string) => void
}

const SUGGESTIONS = ['info', 'price', 'link', 'shop', 'how']

export function TriggerStepField({
  trigger,
  onTrigger,
  keywords,
  onKeywords,
  errors,
  onClearError,
}: TriggerStepFieldProps) {
  const [input, setInput] = useState('')

  const addKeyword = (raw: string) => {
    const t = raw.trim().toLowerCase()
    if (!t || keywords.includes(t)) return
    onKeywords([...keywords, t])
    setInput('')
    if (errors.keywords) onClearError('keywords')
  }

  const removeKeyword = (k: string) => {
    onKeywords(keywords.filter((x) => x !== k))
  }

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addKeyword(input)
    }
    if (e.key === 'Backspace' && !input && keywords.length) {
      onKeywords(keywords.slice(0, -1))
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <RadioCard
          selected={trigger === 'all_comments'}
          onClick={() => onTrigger('all_comments')}
          icon={<AtSign className="h-4 w-4" />}
          title="Every comment"
          description="DM anyone who comments on this post. Best for giveaways and big launches."
        />
        <RadioCard
          selected={trigger === 'keyword'}
          onClick={() => onTrigger('keyword')}
          icon={<Hash className="h-4 w-4" />}
          title="Match a keyword"
          description="Only DM people whose comment includes one of your keywords. Best for product info."
          badge="Recommended"
        />
      </div>

      {trigger === 'keyword' && (
        <div
          className="rounded-xl p-4"
          style={{
            background: 'color-mix(in oklab, var(--primary) 5%, var(--card))',
            border: '1px solid color-mix(in oklab, var(--primary) 25%, var(--border))',
          }}
        >
          <label className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Keywords
            </span>
            <span className="text-[11px] text-muted-foreground">
              Match is case-insensitive · partial words count
            </span>
          </label>

          <div
            className="flex flex-wrap items-center gap-1.5 p-2 rounded-md min-h-[44px]"
            style={{
              background: 'var(--input)',
              border: `1px solid ${errors.keywords ? 'var(--destructive)' : 'var(--border)'}`,
            }}
          >
            {keywords.map((k) => (
              <span
                key={k}
                className="inline-flex items-center gap-1 px-2 h-7 rounded-md text-xs font-medium"
                style={{
                  background: 'color-mix(in oklab, var(--primary) 15%, transparent)',
                  color: 'var(--primary)',
                }}
              >
                {k}
                <button
                  type="button"
                  onClick={() => removeKeyword(k)}
                  className="hover:opacity-70"
                  aria-label={`Remove ${k}`}
                >
                  <X className="h-3 w-3" strokeWidth={2.5} />
                </button>
              </span>
            ))}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              onBlur={() => addKeyword(input)}
              placeholder={
                keywords.length
                  ? 'Add another...'
                  : 'Type a keyword and press Enter'
              }
              className="flex-1 min-w-[140px] bg-transparent outline-none text-sm h-7 px-1 text-foreground"
            />
          </div>

          {errors.keywords && (
            <p className="mt-1.5 text-xs text-destructive">{errors.keywords}</p>
          )}

          {keywords.length === 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Sparkles className="h-3 w-3" /> Try
              </span>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addKeyword(s)}
                  className="px-2 h-6 rounded-md text-[11px] font-medium hover:opacity-80 transition-opacity"
                  style={{
                    background: 'var(--muted)',
                    color: 'var(--muted-foreground)',
                    border: '1px solid var(--border)',
                  }}
                >
                  + {s}
                </button>
              ))}
            </div>
          )}

          <p className="mt-3 text-xs text-muted-foreground">
            Example: someone comments <em>"how much is the price?"</em> → triggers{' '}
            <code
              style={{
                background: 'var(--muted)',
                padding: '1px 5px',
                borderRadius: 3,
                fontSize: '0.85em',
              }}
            >
              price
            </code>
          </p>
        </div>
      )}
    </div>
  )
}
