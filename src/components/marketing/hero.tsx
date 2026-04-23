import { ArrowRight, Globe, Instagram, MessageSquare, Twitter, Users, Youtube, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

type HeroProps = {
    headline: string
    onPrimaryCta: () => void
    onSecondaryCta: () => void
}

// Fake-window chrome traffic-light dots. Literal hex values from the design
// system — they're semantically the dusty-rose / ochre / sage brand triad,
// not random dot colors.
const CHROME_DOTS = ['#C48B8B', '#C9A962', '#7D9B76']

const METRICS: Array<[label: string, value: string, Icon: typeof MessageSquare]> = [
    ['DMs sent', '12,458', MessageSquare],
    ['Reached', '8,921', Users],
    ['Active', '14', Zap],
]

type AutomationRow = { name: string; status: 'Active' | 'Inactive'; trigger: string; message: string; bg: string }
const AUTOMATIONS: AutomationRow[] = [
    { name: 'Product Launch DM', status: 'Active', trigger: 'Keyword', message: 'Carousel', bg: 'linear-gradient(135deg,#B8963A,#7D9B76)' },
    { name: 'Welcome Commenters', status: 'Active', trigger: 'All Comments', message: 'Text', bg: 'linear-gradient(135deg,#8B7355,#C48B8B)' },
    { name: 'Waitlist Drip', status: 'Inactive', trigger: 'Keyword', message: 'Text', bg: 'linear-gradient(135deg,#9B8BB5,#C9A962)' },
]

export function HeroDashboardMini() {
    return (
        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
            <div className="h-8 border-b flex items-center gap-1.5 px-3">
                {CHROME_DOTS.map(hex => (
                    <span key={hex} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: `${hex}80` }} />
                ))}
                <div className="ml-auto text-[10px] text-muted-foreground font-mono">creatormodo.com/app</div>
            </div>
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <div className="text-sm font-bold">Dashboard</div>
                        <div className="text-[10px] text-muted-foreground">Manage your Instagram automations</div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Instagram className="size-2.5 text-primary" />
                        @jane.creator
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                    {METRICS.map(([label, value, Icon]) => (
                        <div key={label} className="rounded-lg border bg-background p-2">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
                                <span className="inline-flex w-5 h-5 rounded-md bg-primary/10 text-primary items-center justify-center">
                                    <Icon className="size-2.5" />
                                </span>
                            </div>
                            <div className="text-[15px] font-bold tracking-tight">{value}</div>
                        </div>
                    ))}
                </div>

                <div>
                    {AUTOMATIONS.map(row => (
                        <div key={row.name} className="flex items-center gap-2 py-2 border-t first:border-t-0">
                            <div className="w-7 h-7 rounded-md shrink-0" style={{ background: row.bg }} />
                            <div className="text-[11px] font-semibold truncate flex-1">{row.name}</div>
                            <span
                                className={`text-[9px] px-1.5 h-4 rounded flex items-center font-medium ${
                                    row.status === 'Active'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-secondary text-secondary-foreground'
                                }`}
                            >
                                {row.status}
                            </span>
                            <span className="text-[9px] px-1.5 h-4 rounded border flex items-center">{row.trigger}</span>
                            <span className="text-[9px] px-1.5 h-4 rounded bg-secondary text-secondary-foreground hidden sm:flex items-center">
                                {row.message}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

type HeroPhoneBioProps = { compact?: boolean }

const PHONE_SOCIAL_ICONS = [Instagram, Twitter, Youtube, Globe]

const PHONE_LINKS: Array<[bg: string, title: string]> = [
    ['linear-gradient(135deg,#C48B8B,#9B8BB5)', 'Latest YouTube · Studio tour'],
    ['linear-gradient(135deg,#C9A962,#8B7355)', 'Free preset pack'],
    ['linear-gradient(135deg,#7D9B76,#C9A962)', 'Book a 1:1 call'],
    ['linear-gradient(135deg,#9B8BB5,#7D9B76)', 'Shop: Beacon tote'],
]

export function HeroPhoneBio({ compact = false }: HeroPhoneBioProps) {
    const width = compact ? 220 : 260
    return (
        <div
            className="rounded-[36px] overflow-hidden shadow-2xl border-[8px] border-foreground/10 mx-auto"
            style={{ width, background: 'linear-gradient(135deg,#0f172a,#4c1d95,#0f172a)' }}
        >
            <div className="pt-6 pb-5 px-4 text-center text-white relative">
                <div className="absolute -top-10 -left-6 w-40 h-40 rounded-full bg-purple-500/30 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-10 -right-6 w-40 h-40 rounded-full bg-blue-500/30 blur-2xl pointer-events-none" />

                <div className="relative">
                    <div className="relative w-14 h-14 mx-auto mb-2">
                        <div className="absolute inset-0 rounded-full blur-md bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-75 scale-110" />
                        <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 grid place-items-center font-bold border-2 border-white/10">
                            J
                        </div>
                    </div>
                    <div className="text-[13px] font-bold">Jane Marek</div>
                    <div className="text-white/60 text-[10px] mb-3">Creative direction · Brooklyn</div>
                    <div className="flex justify-center gap-1.5 mb-3">
                        {PHONE_SOCIAL_ICONS.map((Icon, i) => (
                            <div
                                key={i}
                                className="w-6 h-6 rounded-full bg-white/10 border border-white/20 grid place-items-center backdrop-blur-md"
                            >
                                <Icon className="size-2.5 text-white" />
                            </div>
                        ))}
                    </div>
                    <div className="space-y-1.5">
                        {PHONE_LINKS.map(([bg, title]) => (
                            <div
                                key={title}
                                className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-2.5 py-1.5 flex items-center gap-2"
                            >
                                <div className="w-7 h-7 rounded-xl ring-2 ring-white/10 shrink-0" style={{ background: bg }} />
                                <div className="text-[10px] font-semibold truncate text-left flex-1">{title}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function Hero({ headline, onPrimaryCta, onSecondaryCta }: HeroProps) {
    const sub =
        "Auto-DM commenters, run a publishable link-in-bio, see what's working. One tool, two surfaces, zero copywriting on weekends."

    return (
        <section className="relative overflow-hidden">
            {/* soft decorative wash */}
            <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                    background:
                        'radial-gradient(900px 400px at 20% -10%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 60%), radial-gradient(700px 340px at 90% 10%, color-mix(in oklab, var(--accent) 18%, transparent), transparent 60%)',
                }}
            />
            <div className="relative w-full max-w-[1200px] mx-auto px-6 md:px-8 pt-16 md:pt-24 pb-16 md:pb-24">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-5">
                    <span className="inline-block w-6 h-px bg-primary" />
                    For creators on Instagram
                </div>
                <h1 className="text-[38px] md:text-[56px] font-bold leading-[1.04] tracking-[-0.02em] max-w-[860px] text-balance">
                    {headline}
                </h1>
                <p className="mt-5 md:mt-6 text-[17px] md:text-[19px] text-muted-foreground max-w-[620px] leading-relaxed">
                    {sub}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Button size="lg" onClick={onPrimaryCta}>
                        Get started free
                        <ArrowRight className="size-4" />
                    </Button>
                    <Button size="lg" variant="outline" onClick={onSecondaryCta}>
                        <Instagram className="size-4" />
                        Connect Instagram
                    </Button>
                    <span className="text-[13px] text-muted-foreground ml-1">Free forever. No card required.</span>
                </div>

                <div className="mt-14 md:mt-20 relative">
                    <div className="grid md:grid-cols-[1.35fr_1fr] gap-6 md:gap-10 items-center">
                        <div className="relative">
                            <HeroDashboardMini />
                        </div>
                        <div className="flex md:justify-start justify-center">
                            <HeroPhoneBio compact />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
