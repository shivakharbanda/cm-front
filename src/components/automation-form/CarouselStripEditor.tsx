import { GripVertical, Image as ImageIcon, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CarouselElement } from '@/types'

const MAX_CARDS = 10
const MAX_BUTTONS_PER_CARD = 3

const emptyCard = (): CarouselElement => ({
  title: '',
  subtitle: '',
  image_url: '',
  buttons: [{ type: 'web_url', title: '', url: '' }],
})

interface CarouselStripEditorProps {
  cards: CarouselElement[]
  onChange: (cards: CarouselElement[]) => void
  errors: Record<string, string>
}

export function CarouselStripEditor({ cards, onChange, errors }: CarouselStripEditorProps) {
  const update = (i: number, patch: Partial<CarouselElement>) =>
    onChange(cards.map((c, ci) => (ci === i ? { ...c, ...patch } : c)))

  const updateBtn = (
    ci: number,
    bi: number,
    patch: Partial<CarouselElement['buttons'][number]>,
  ) =>
    onChange(
      cards.map((c, idx) =>
        idx !== ci
          ? c
          : { ...c, buttons: c.buttons.map((b, bIdx) => (bIdx === bi ? { ...b, ...patch } : b)) },
      ),
    )

  const addCard = () => {
    if (cards.length >= MAX_CARDS) return
    onChange([...cards, emptyCard()])
  }

  const removeCard = (i: number) => {
    if (cards.length <= 1) return
    onChange(cards.filter((_, ci) => ci !== i))
  }

  const addBtn = (ci: number) =>
    onChange(
      cards.map((c, idx) =>
        idx !== ci
          ? c
          : c.buttons.length >= MAX_BUTTONS_PER_CARD
          ? c
          : { ...c, buttons: [...c.buttons, { type: 'web_url', title: '', url: '' }] },
      ),
    )

  const removeBtn = (ci: number, bi: number) =>
    onChange(
      cards.map((c, idx) =>
        idx !== ci ? c : { ...c, buttons: c.buttons.filter((_, x) => x !== bi) },
      ),
    )

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-muted-foreground">
          {cards.length} {cards.length === 1 ? 'card' : 'cards'} · scroll to see all · max{' '}
          {MAX_CARDS}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addCard}
          disabled={cards.length >= MAX_CARDS}
        >
          <Plus className="h-3.5 w-3.5 mr-1" /> Add card
        </Button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1 snap-x snap-mandatory">
        {cards.map((card, ci) => (
          <div
            key={ci}
            className="snap-start shrink-0 w-[300px] rounded-xl p-3 space-y-2.5"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                <GripVertical className="h-3 w-3" /> Card {ci + 1}
              </span>
              <button
                type="button"
                onClick={() => removeCard(ci)}
                disabled={cards.length <= 1}
                className="p-1 rounded hover:bg-[var(--muted)] disabled:opacity-30 transition-colors"
                aria-label="Remove card"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* image area */}
            <div
              className="aspect-[4/3] rounded-md flex items-center justify-center overflow-hidden relative group"
              style={{
                background: card.image_url ? 'transparent' : 'var(--muted)',
                border: `1px dashed ${card.image_url ? 'transparent' : 'var(--border)'}`,
              }}
            >
              {card.image_url ? (
                <img src={card.image_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <ImageIcon className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-[11px] text-muted-foreground">Image (optional)</p>
                </div>
              )}
              <input
                type="text"
                placeholder="Paste image URL"
                value={card.image_url || ''}
                onChange={(e) => update(ci, { image_url: e.target.value })}
                className="absolute inset-x-2 bottom-2 h-7 rounded text-[11px] px-2 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                style={{
                  background: 'rgba(0,0,0,.6)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,.2)',
                }}
              />
            </div>

            <input
              placeholder="Card title"
              value={card.title}
              onChange={(e) => update(ci, { title: e.target.value })}
              maxLength={80}
              className="w-full h-9 px-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              style={{
                background: 'var(--input)',
                color: 'var(--foreground)',
                border: errors[`card_${ci}_title`]
                  ? '1px solid var(--destructive)'
                  : '1px solid var(--border)',
              }}
            />
            {errors[`card_${ci}_title`] && (
              <p className="text-[11px] text-destructive -mt-1.5">
                {errors[`card_${ci}_title`]}
              </p>
            )}

            <input
              placeholder="Subtitle (optional)"
              value={card.subtitle || ''}
              onChange={(e) => update(ci, { subtitle: e.target.value })}
              maxLength={80}
              className="w-full h-9 px-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              style={{
                background: 'var(--input)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
              }}
            />

            <div className="space-y-1.5">
              {card.buttons.map((btn, bi) => (
                <div key={bi} className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <input
                      placeholder="Button label"
                      value={btn.title}
                      onChange={(e) => updateBtn(ci, bi, { title: e.target.value })}
                      maxLength={20}
                      className="flex-1 h-8 px-2 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                      style={{
                        background: 'var(--input)',
                        color: 'var(--foreground)',
                        border: errors[`card_${ci}_btn_${bi}_title`]
                          ? '1px solid var(--destructive)'
                          : '1px solid var(--border)',
                      }}
                    />
                    <input
                      placeholder="https://"
                      value={btn.url}
                      onChange={(e) => updateBtn(ci, bi, { url: e.target.value })}
                      className="flex-1 h-8 px-2 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                      style={{
                        background: 'var(--input)',
                        color: 'var(--foreground)',
                        border: errors[`card_${ci}_btn_${bi}_url`]
                          ? '1px solid var(--destructive)'
                          : '1px solid var(--border)',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeBtn(ci, bi)}
                      disabled={card.buttons.length <= 1}
                      className="p-1.5 rounded hover:bg-[var(--muted)] disabled:opacity-30 transition-colors"
                      aria-label="Remove button"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  {(errors[`card_${ci}_btn_${bi}_title`] ||
                    errors[`card_${ci}_btn_${bi}_url`]) && (
                    <p className="text-[11px] text-destructive">
                      {errors[`card_${ci}_btn_${bi}_title`] ||
                        errors[`card_${ci}_btn_${bi}_url`]}
                    </p>
                  )}
                </div>
              ))}
              {card.buttons.length < MAX_BUTTONS_PER_CARD && (
                <button
                  type="button"
                  onClick={() => addBtn(ci)}
                  className="text-[11px] font-medium inline-flex items-center gap-1 hover:underline"
                  style={{ color: 'var(--primary)' }}
                >
                  <Plus className="h-3 w-3" /> Add button
                </button>
              )}
            </div>
          </div>
        ))}

        {cards.length < MAX_CARDS && (
          <button
            type="button"
            onClick={addCard}
            className="snap-start shrink-0 w-[180px] rounded-xl flex flex-col items-center justify-center gap-2 transition-colors hover:bg-[var(--muted)]"
            style={{
              border: '1.5px dashed var(--border)',
              color: 'var(--muted-foreground)',
              minHeight: '420px',
            }}
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs font-medium">Add card</span>
          </button>
        )}
      </div>
    </div>
  )
}
