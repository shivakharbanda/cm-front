import { Layers, Link as LinkIcon, MessageSquare } from 'lucide-react'
import type { ButtonTemplate, CarouselElement, MessageType } from '@/types'
import { MessageTypeTile } from './MessageTypeTile'
import { CarouselStripEditor } from './CarouselStripEditor'
import { ButtonTemplateInlineEditor } from './ButtonTemplateInlineEditor'

const TEXT_LIMIT = 1000

const TYPES: { id: MessageType; title: string; description: string; icon: React.ReactNode }[] = [
  {
    id: 'text',
    title: 'Text DM',
    description: 'A simple direct message — fastest to set up.',
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    id: 'carousel',
    title: 'Carousel',
    description: 'Up to 10 swipeable cards with images, titles, and tap buttons.',
    icon: <Layers className="h-4 w-4" />,
  },
  {
    id: 'button',
    title: 'Buttons',
    description: 'Short message body with up to 3 tap buttons (URL or postback).',
    icon: <LinkIcon className="h-4 w-4" />,
  },
]

interface MessageStepFieldProps {
  messageType: MessageType
  onMessageType: (t: MessageType) => void
  dmText: string
  onDmText: (s: string) => void
  carousel: CarouselElement[]
  onCarousel: (c: CarouselElement[]) => void
  buttonTpl: ButtonTemplate
  onButtonTpl: (b: ButtonTemplate) => void
  errors: Record<string, string>
}

export function MessageStepField({
  messageType,
  onMessageType,
  dmText,
  onDmText,
  carousel,
  onCarousel,
  buttonTpl,
  onButtonTpl,
  errors,
}: MessageStepFieldProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {TYPES.map((t) => (
          <MessageTypeTile
            key={t.id}
            id={t.id}
            title={t.title}
            description={t.description}
            icon={t.icon}
            active={messageType === t.id}
            onClick={() => onMessageType(t.id)}
          />
        ))}
      </div>

      {messageType === 'text' && (
        <div>
          <div className="flex items-end justify-between mb-2">
            <label
              htmlFor="dm-text"
              className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
            >
              Message
            </label>
            <span className="text-[10px] tabular-nums text-muted-foreground">
              {dmText.length} / {TEXT_LIMIT}
            </span>
          </div>
          <textarea
            id="dm-text"
            placeholder="Hey! Thanks for the comment 👋 Here's the link you asked for: ..."
            value={dmText}
            onChange={(e) => onDmText(e.target.value)}
            maxLength={TEXT_LIMIT}
            rows={5}
            className="w-full px-3 py-2 rounded-md text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
            style={{
              background: 'var(--input)',
              color: 'var(--foreground)',
              border: errors.dm_message_template
                ? '1px solid var(--destructive)'
                : '1px solid var(--border)',
            }}
          />
          {errors.dm_message_template ? (
            <p className="mt-1.5 text-xs text-destructive">{errors.dm_message_template}</p>
          ) : (
            <p className="mt-1.5 text-xs text-muted-foreground">
              Tip: keep it conversational. Add a link only if your DMs already pass Instagram's
              automation review.
            </p>
          )}
        </div>
      )}

      {messageType === 'carousel' && (
        <CarouselStripEditor cards={carousel} onChange={onCarousel} errors={errors} />
      )}

      {messageType === 'button' && (
        <ButtonTemplateInlineEditor
          template={buttonTpl}
          onChange={onButtonTpl}
          errors={errors}
        />
      )}
    </div>
  )
}
