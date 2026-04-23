import { BarChart3, GripVertical, Mail, type LucideIcon } from 'lucide-react'
import { HeroPhoneBio } from './hero'

type Bullet = { Icon: LucideIcon; title: string; body: string }

const BULLETS: Bullet[] = [
    {
        Icon: GripVertical,
        title: 'Drag to reorder',
        body: "What's on top today doesn't have to be on top tomorrow.",
    },
    {
        Icon: Mail,
        title: 'Lead-capture cards',
        body: 'Inline email forms that pipe straight to your list.',
    },
    {
        Icon: BarChart3,
        title: 'Per-link analytics',
        body: 'Clicks, captures, and conversion. Exportable as CSV.',
    },
]

// The published bio page is the one place in the whole system where gradients
// and glass appear — this section mirrors that sub-brand, hence the literal
// hex values instead of tokens.
export function FeatureBio() {
    return (
        <section className="relative overflow-hidden">
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg,#0f172a 0%,#3b1d6e 55%,#0f172a 100%)' }}
            />
            <div
                className="absolute inset-0 opacity-50"
                style={{
                    background:
                        'radial-gradient(800px 400px at 15% 0%, rgba(168,85,247,0.35), transparent 60%), radial-gradient(700px 400px at 100% 100%, rgba(59,130,246,0.3), transparent 60%)',
                }}
            />
            <div className="relative w-full max-w-[1200px] mx-auto px-6 md:px-8 py-20 md:py-28 grid md:grid-cols-[1fr_auto] gap-12 md:gap-16 items-center text-white">
                <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60 mb-3">Link in bio</div>
                    <h2 className="text-[32px] md:text-[42px] font-bold tracking-[-0.02em] leading-[1.1] mb-5">
                        One link. Every thing you're selling, shipping, or saying.
                    </h2>
                    <p className="text-[16px] text-white/70 leading-relaxed mb-8 max-w-[520px]">
                        Drag to reorder. Add lead-capture cards that collect emails inline. Publish to{' '}
                        <span className="font-mono text-white/90">creatormodo.com/your-name</span>. See which link did the
                        work.
                    </p>
                    <div className="space-y-4">
                        {BULLETS.map(({ Icon, title, body }) => (
                            <div key={title} className="flex gap-3">
                                <span className="w-9 h-9 rounded-md bg-white/10 border border-white/20 backdrop-blur-md grid place-items-center shrink-0">
                                    <Icon className="size-4" />
                                </span>
                                <div>
                                    <div className="font-semibold text-[15px]">{title}</div>
                                    <div className="text-[14px] text-white/60 leading-relaxed">{body}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <HeroPhoneBio />
                </div>
            </div>
        </section>
    )
}
