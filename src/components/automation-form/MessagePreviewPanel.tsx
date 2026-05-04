import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Monitor,
  Send,
  Smartphone,
} from 'lucide-react'
import type { ButtonTemplate, CarouselElement, MessageType } from '@/types'

type Device = 'phone' | 'desktop'

interface MessagePreviewPanelProps {
  device: Device
  onDeviceChange: (d: Device) => void
  messageType: MessageType
  message: string
  cards: CarouselElement[]
  template: ButtonTemplate
  username?: string
}

function IGHeader({ username }: { username: string }) {
  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5"
      style={{ background: '#000', borderBottom: '1px solid #1f2024' }}
    >
      <button type="button" className="text-white" tabIndex={-1}>
        <ChevronLeft className="h-5 w-5" />
      </button>
      <div
        className="rounded-full p-[2px]"
        style={{
          background:
            'conic-gradient(from 220deg at 50% 50%, #f58529, #dd2a7b, #8134af, #515bd4, #f58529)',
        }}
      >
        <div
          className="w-7 h-7 rounded-full"
          style={{ background: 'linear-gradient(135deg,#fcb045,#fd1d1d)' }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-[13px] font-semibold truncate">{username}</p>
        <p className="text-[10px]" style={{ color: '#7d7d7d' }}>
          Active now
        </p>
      </div>
      <span className="text-white opacity-60">
        <ChevronRight className="h-4 w-4" />
      </span>
    </div>
  )
}

function DMComposer() {
  return (
    <div
      className="px-3 py-2.5 flex items-center gap-2 shrink-0"
      style={{ background: '#0c0c0e', borderTop: '1px solid #1f2024' }}
    >
      <div
        className="flex-1 h-8 rounded-full px-3 flex items-center"
        style={{ background: '#1c1c1e' }}
      >
        <span className="text-[11px]" style={{ color: '#5a5a5a' }}>
          Message...
        </span>
      </div>
      <span style={{ color: '#0a84ff' }}>
        <Send className="h-4 w-4" />
      </span>
    </div>
  )
}

function Bubble({
  children,
  dim,
}: {
  children: React.ReactNode
  dim?: boolean
}) {
  return (
    <div className="flex items-end gap-2 mb-1.5">
      <div
        className="w-6 h-6 rounded-full shrink-0"
        style={{ background: 'linear-gradient(135deg,#fcb045,#fd1d1d)' }}
      />
      <div
        className="max-w-[78%] px-3 py-2 rounded-2xl text-[12.5px] leading-snug"
        style={{
          background: '#262626',
          color: dim ? '#9a9a9a' : '#fff',
          borderBottomLeftRadius: 4,
        }}
      >
        {children}
      </div>
    </div>
  )
}

function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mx-auto"
      style={{
        background: '#0a0b0d',
        border: '8px solid #1f2024',
        borderRadius: 36,
        boxShadow:
          '0 30px 60px -20px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.04) inset',
        overflow: 'hidden',
        width: 300,
        height: 600,
      }}
    >
      <div className="h-full w-full flex flex-col" style={{ background: '#000' }}>
        <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[11px] text-white tabular-nums shrink-0">
          <span>9:41</span>
          <div className="flex items-center gap-1 opacity-80">
            <span>5G</span>
            <span>·</span>
            <span>92%</span>
          </div>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col">{children}</div>
      </div>
    </div>
  )
}

function CarouselBubble({
  cards,
  inline,
}: {
  cards: CarouselElement[]
  inline?: boolean
}) {
  return (
    <div className={inline ? '' : 'ml-8 mt-1'}>
      <div className="flex gap-2 overflow-x-auto pb-2 -mr-3 pr-3 snap-x">
        {cards.map((c, i) => (
          <div
            key={i}
            className="snap-start shrink-0 w-[180px] rounded-xl overflow-hidden"
            style={{ background: '#1c1c1e', border: '1px solid #2a2a2c' }}
          >
            <div className="aspect-square" style={{ background: '#0e0e10' }}>
              {c.image_url ? (
                <img src={c.image_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-[10px]"
                  style={{ color: '#5a5a5a' }}
                >
                  No image
                </div>
              )}
            </div>
            <div className="p-2.5">
              <p className="text-[12px] font-semibold text-white truncate">
                {c.title || 'Card title'}
              </p>
              {c.subtitle && (
                <p
                  className="text-[10.5px] mt-0.5 line-clamp-2"
                  style={{ color: '#9a9a9a' }}
                >
                  {c.subtitle}
                </p>
              )}
              <div className="mt-2 space-y-1">
                {c.buttons.map((b, bi) => (
                  <div
                    key={bi}
                    className="text-center text-[11.5px] font-medium py-1.5 rounded"
                    style={{
                      background: '#0a84ff15',
                      color: '#5ea7ff',
                      border: '1px solid #0a84ff35',
                    }}
                  >
                    {b.title || 'Button'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ButtonsBubble({
  template,
  textSize = 12.5,
}: {
  template: ButtonTemplate
  textSize?: number
}) {
  return (
    <div className="flex items-end gap-2 mb-1.5">
      <div
        className="w-6 h-6 rounded-full shrink-0"
        style={{ background: 'linear-gradient(135deg,#fcb045,#fd1d1d)' }}
      />
      <div className="max-w-[78%]">
        <div
          className="px-3 py-2 rounded-2xl text-white"
          style={{
            background: '#262626',
            borderBottomLeftRadius: 4,
            fontSize: `${textSize}px`,
          }}
        >
          {template.text || (
            <span className="italic" style={{ color: '#9a9a9a' }}>
              Message body...
            </span>
          )}
        </div>
        <div
          className="mt-1.5 rounded-xl overflow-hidden"
          style={{ background: '#1c1c1e', border: '1px solid #2a2a2c' }}
        >
          {template.buttons.map((b, i) => (
            <div
              key={i}
              className="text-center text-[12px] font-medium py-2.5 px-2"
              style={{ color: '#5ea7ff', borderTop: i ? '1px solid #2a2a2c' : 'none' }}
            >
              {b.title || 'Button'}
              {b.type === 'web_url' && (
                <ExternalLink className="inline ml-1 h-3 w-3" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PhonePreview({
  username,
  messageType,
  message,
  cards,
  template,
}: {
  username: string
  messageType: MessageType
  message: string
  cards: CarouselElement[]
  template: ButtonTemplate
}) {
  return (
    <PhoneShell>
      <div className="h-full flex flex-col" style={{ background: '#000' }}>
        <IGHeader username={username} />
        <div
          className="flex-1 overflow-y-auto px-3 py-3"
          style={{ scrollbarWidth: 'none' }}
        >
          <p className="text-center text-[10px] mb-3" style={{ color: '#7d7d7d' }}>
            Today · 9:41 AM
          </p>
          {messageType === 'text' && (
            <Bubble dim={!message}>
              {message || <span className="italic">Your DM will appear here</span>}
            </Bubble>
          )}
          {messageType === 'carousel' && (
            <>
              {message && <Bubble>{message}</Bubble>}
              <CarouselBubble cards={cards} />
            </>
          )}
          {messageType === 'button' && <ButtonsBubble template={template} />}
        </div>
        <DMComposer />
      </div>
    </PhoneShell>
  )
}

function DesktopPreview({
  username,
  messageType,
  message,
  cards,
  template,
}: {
  username: string
  messageType: MessageType
  message: string
  cards: CarouselElement[]
  template: ButtonTemplate
}) {
  return (
    <div
      className="rounded-xl overflow-hidden mx-auto w-full"
      style={{
        background: '#000',
        border: '1px solid var(--border)',
        maxWidth: 440,
        height: 540,
      }}
    >
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{ background: '#0c0c0e', borderBottom: '1px solid #1f2024' }}
      >
        <span
          className="w-2.5 h-2.5 rounded-full inline-block"
          style={{ background: '#ff5f57' }}
        />
        <span
          className="w-2.5 h-2.5 rounded-full inline-block"
          style={{ background: '#febc2e' }}
        />
        <span
          className="w-2.5 h-2.5 rounded-full inline-block"
          style={{ background: '#28c840' }}
        />
        <p className="text-[11px] text-center flex-1 -ml-12" style={{ color: '#7d7d7d' }}>
          instagram.com / direct / inbox
        </p>
      </div>
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{ borderBottom: '1px solid #1f2024' }}
      >
        <div
          className="rounded-full p-[2px]"
          style={{
            background:
              'conic-gradient(from 220deg at 50% 50%, #f58529, #dd2a7b, #8134af, #515bd4, #f58529)',
          }}
        >
          <div
            className="w-8 h-8 rounded-full"
            style={{ background: 'linear-gradient(135deg,#fcb045,#fd1d1d)' }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-[13px] font-semibold truncate">{username}</p>
          <p className="text-[10.5px]" style={{ color: '#7d7d7d' }}>
            Active now
          </p>
        </div>
      </div>
      <div className="px-4 py-4 overflow-y-auto" style={{ height: 460 }}>
        <p className="text-center text-[10.5px] mb-4" style={{ color: '#7d7d7d' }}>
          Today · 9:41 AM
        </p>
        <div className="flex items-end gap-2">
          <div
            className="w-7 h-7 rounded-full shrink-0"
            style={{ background: 'linear-gradient(135deg,#fcb045,#fd1d1d)' }}
          />
          {messageType === 'text' && (
            <div
              className="max-w-[60%] px-3.5 py-2.5 rounded-2xl text-[13px]"
              style={{
                background: '#262626',
                color: message ? '#fff' : '#9a9a9a',
                borderBottomLeftRadius: 4,
              }}
            >
              {message || <span className="italic">Your DM will appear here</span>}
            </div>
          )}
          {messageType === 'carousel' && (
            <div className="space-y-2 max-w-[80%]">
              {message && (
                <div
                  className="max-w-fit px-3.5 py-2.5 rounded-2xl text-[13px]"
                  style={{
                    background: '#262626',
                    color: '#fff',
                    borderBottomLeftRadius: 4,
                  }}
                >
                  {message}
                </div>
              )}
              <CarouselBubble cards={cards} inline />
            </div>
          )}
          {messageType === 'button' && (
            <div className="max-w-[60%]">
              <ButtonsBubble template={template} textSize={13} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function MessagePreviewPanel({
  device,
  onDeviceChange,
  messageType,
  message,
  cards,
  template,
  username = 'yourbrand',
}: MessagePreviewPanelProps) {
  return (
    <div
      className="rounded-xl p-4 sm:p-5"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--accent)' }}
          />
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Live preview
          </span>
        </div>
        <div
          className="inline-flex rounded-md p-0.5"
          style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
        >
          {(
            [
              { id: 'phone', icon: <Smartphone className="h-3 w-3" />, label: 'Phone' },
              { id: 'desktop', icon: <Monitor className="h-3 w-3" />, label: 'Desktop' },
            ] as const
          ).map((d) => {
            const active = device === d.id
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => onDeviceChange(d.id)}
                className="px-2.5 h-7 rounded text-xs font-medium inline-flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{
                  background: active ? 'var(--card)' : 'transparent',
                  color: active ? 'var(--foreground)' : 'var(--muted-foreground)',
                  boxShadow: active ? '0 1px 2px rgb(0 0 0 / 0.06)' : 'none',
                }}
              >
                {d.icon} {d.label}
              </button>
            )
          })}
        </div>
      </div>

      <div
        className="rounded-lg p-4 flex items-center justify-center"
        style={{
          background: 'var(--background)',
          border: '1px solid var(--border)',
          minHeight: 600,
        }}
      >
        {device === 'phone' ? (
          <PhonePreview
            username={username}
            messageType={messageType}
            message={message}
            cards={cards}
            template={template}
          />
        ) : (
          <DesktopPreview
            username={username}
            messageType={messageType}
            message={message}
            cards={cards}
            template={template}
          />
        )}
      </div>

      <p className="mt-3 text-[11px] text-muted-foreground">
        Most followers see DMs on phone. Switch to desktop to check link buttons & wider layouts.
      </p>
    </div>
  )
}
