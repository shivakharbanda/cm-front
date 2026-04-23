import { Instagram, LineChart, Zap, type LucideIcon } from 'lucide-react'

type Step = { n: string; Icon: LucideIcon; title: string; body: string }

const STEPS: Step[] = [
    {
        n: '01',
        Icon: Instagram,
        title: 'Connect Instagram',
        body: 'One OAuth tap. We only request the scopes we actually need. Disconnect any time.',
    },
    {
        n: '02',
        Icon: Zap,
        title: 'Build an automation',
        body: 'Pick a post, choose a trigger (keyword or any comment), write the DM — text or carousel.',
    },
    {
        n: '03',
        Icon: LineChart,
        title: 'Watch it run',
        body: 'DMs send themselves. Replies come back to your inbox. You see what converted.',
    },
]

export function HowItWorks() {
    return (
        <section className="w-full max-w-[1200px] mx-auto px-6 md:px-8 py-20 md:py-28">
            <div className="mb-12 max-w-[640px]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary mb-3">How it works</div>
                <h2 className="text-[32px] md:text-[42px] font-bold tracking-[-0.02em] leading-[1.1]">
                    Three steps. Roughly four minutes.
                </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
                {STEPS.map(({ n, Icon, title, body }) => (
                    <div key={n} className="rounded-xl border bg-card p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary grid place-items-center">
                                <Icon className="size-[18px]" />
                            </span>
                            <span className="font-mono text-[12px] text-muted-foreground">{n}</span>
                        </div>
                        <div className="font-semibold text-[17px] mb-2">{title}</div>
                        <div className="text-[14px] text-muted-foreground leading-relaxed">{body}</div>
                    </div>
                ))}
            </div>
        </section>
    )
}
