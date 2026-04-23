import { Filter, MessageSquare, ShieldCheck, type LucideIcon } from 'lucide-react'
import { HeroDashboardMini } from './hero'

type Bullet = { Icon: LucideIcon; title: string; body: string }

const BULLETS: Bullet[] = [
    {
        Icon: MessageSquare,
        title: 'Reply to every comment',
        body: 'Text DM, carousel DM, or an auto-comment reply. Pick one, pick all three.',
    },
    {
        Icon: Filter,
        title: 'Trigger on keywords or all',
        body: 'Match exact phrases, partial text, or just catch everything.',
    },
    {
        Icon: ShieldCheck,
        title: 'Sensible rate limits',
        body: "Respect Instagram's policies. We throttle for you so nothing trips.",
    },
]

export function FeatureAutomations() {
    return (
        <section id="features" className="bg-card/60 border-y">
            <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8 py-20 md:py-28 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary mb-3">Automations</div>
                    <h2 className="text-[32px] md:text-[42px] font-bold tracking-[-0.02em] leading-[1.1] mb-5">
                        Turn comments into conversations while you sleep.
                    </h2>
                    <p className="text-[16px] text-muted-foreground leading-relaxed mb-8 max-w-[520px]">
                        Point an automation at any post. When someone comments the keyword, a DM goes out. Carousel, text,
                        or auto-reply. Edit or pause in two clicks.
                    </p>
                    <div className="space-y-4">
                        {BULLETS.map(({ Icon, title, body }) => (
                            <div key={title} className="flex gap-3">
                                <span className="w-9 h-9 rounded-md bg-primary/10 text-primary grid place-items-center shrink-0">
                                    <Icon className="size-4" />
                                </span>
                                <div>
                                    <div className="font-semibold text-[15px]">{title}</div>
                                    <div className="text-[14px] text-muted-foreground leading-relaxed">{body}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <HeroDashboardMini />
                </div>
            </div>
        </section>
    )
}
