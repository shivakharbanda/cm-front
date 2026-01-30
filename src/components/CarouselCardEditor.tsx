import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, X } from 'lucide-react'
import type { CarouselElement } from '@/types'

interface CarouselCardEditorProps {
  cards: CarouselElement[]
  onChange: (cards: CarouselElement[]) => void
  errors: Record<string, string>
}

function emptyCard(): CarouselElement {
  return {
    title: '',
    subtitle: '',
    image_url: '',
    buttons: [{ type: 'web_url', url: '', title: '' }],
  }
}

export function CarouselCardEditor({ cards, onChange, errors }: CarouselCardEditorProps) {
  const updateCard = (index: number, field: keyof CarouselElement, value: string) => {
    const updated = cards.map((card, i) =>
      i === index ? { ...card, [field]: value } : card
    )
    onChange(updated)
  }

  const updateButton = (cardIndex: number, btnIndex: number, field: 'title' | 'url', value: string) => {
    const updated = cards.map((card, ci) => {
      if (ci !== cardIndex) return card
      const buttons = card.buttons.map((btn, bi) =>
        bi === btnIndex ? { ...btn, [field]: value } : btn
      )
      return { ...card, buttons }
    })
    onChange(updated)
  }

  const addButton = (cardIndex: number) => {
    const updated = cards.map((card, i) => {
      if (i !== cardIndex) return card
      return { ...card, buttons: [...card.buttons, { type: 'web_url', url: '', title: '' }] }
    })
    onChange(updated)
  }

  const removeButton = (cardIndex: number, btnIndex: number) => {
    const updated = cards.map((card, i) => {
      if (i !== cardIndex) return card
      return { ...card, buttons: card.buttons.filter((_, bi) => bi !== btnIndex) }
    })
    onChange(updated)
  }

  const addCard = () => {
    onChange([...cards, emptyCard()])
  }

  const removeCard = (index: number) => {
    onChange(cards.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {cards.map((card, cardIndex) => (
        <div key={cardIndex} className="space-y-3 p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Card {cardIndex + 1}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeCard(cardIndex)}
              disabled={cards.length <= 1}
              className="h-7 w-7"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="Card title (required)"
              value={card.title}
              onChange={e => updateCard(cardIndex, 'title', e.target.value)}
              maxLength={80}
              className={errors[`card_${cardIndex}_title`] ? 'border-destructive' : ''}
            />
            {errors[`card_${cardIndex}_title`] && (
              <p className="text-sm text-destructive">{errors[`card_${cardIndex}_title`]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Subtitle (optional)</Label>
            <Input
              placeholder="Card subtitle"
              value={card.subtitle || ''}
              onChange={e => updateCard(cardIndex, 'subtitle', e.target.value)}
              maxLength={80}
            />
          </div>

          <div className="space-y-2">
            <Label>Image URL (optional)</Label>
            <Input
              placeholder="https://example.com/image.jpg"
              value={card.image_url || ''}
              onChange={e => updateCard(cardIndex, 'image_url', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Buttons</Label>
            {card.buttons.map((btn, btnIndex) => (
              <div key={btnIndex} className="flex items-start gap-2">
                <div className="flex-1 space-y-1">
                  <Input
                    placeholder="Button title"
                    value={btn.title}
                    onChange={e => updateButton(cardIndex, btnIndex, 'title', e.target.value)}
                    maxLength={80}
                    className={errors[`card_${cardIndex}_btn_${btnIndex}_title`] ? 'border-destructive' : ''}
                  />
                  <Input
                    placeholder="Button URL"
                    value={btn.url}
                    onChange={e => updateButton(cardIndex, btnIndex, 'url', e.target.value)}
                    className={errors[`card_${cardIndex}_btn_${btnIndex}_url`] ? 'border-destructive' : ''}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeButton(cardIndex, btnIndex)}
                  disabled={card.buttons.length <= 1}
                  className="h-8 w-8 mt-0.5"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {errors[`card_${cardIndex}_buttons`] && (
              <p className="text-sm text-destructive">{errors[`card_${cardIndex}_buttons`]}</p>
            )}
            {card.buttons.length < 3 && (
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={() => addButton(cardIndex)}
                className="p-0 h-auto"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add button
              </Button>
            )}
          </div>
        </div>
      ))}

      {cards.length < 10 && (
        <Button type="button" variant="outline" onClick={addCard} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Card
        </Button>
      )}

      {errors.carousel_elements && (
        <p className="text-sm text-destructive">{errors.carousel_elements}</p>
      )}
    </div>
  )
}
