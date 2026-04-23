import { Badge } from '@/components/ui/badge'

// Bar chart heights (%), hand-picked in the design to show a rising trend.
const BAR_HEIGHTS = [35, 42, 50, 38, 55, 62, 48, 58, 72, 65, 80, 74, 88, 92]

const FOOTER_STATS: Array<[label: string, value: string]> = [
    ['Open rate', '87%'],
    ['Click rate', '42%'],
    ['Leads', '1,248'],
]

export function AnalyticsFeature() {
    return (
        <section className="w-full max-w-[1200px] mx-auto px-6 md:px-8 py-20 md:py-28">
            <div className="grid md:grid-cols-2 gap-10 items-center">
                <div className="order-2 md:order-1 rounded-xl border bg-card p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <div className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
                                Last 30 days
                            </div>
                            <div className="text-[26px] font-bold tracking-tight">12,458 DMs sent</div>
                        </div>
                        <Badge variant="outline">+28.4%</Badge>
                    </div>
                    <div className="flex items-end gap-1.5 h-32 mb-4">
                        {BAR_HEIGHTS.map((h, i) => (
                            <div
                                key={i}
                                className="flex-1 rounded-t bg-primary/80 hover:bg-primary transition-colors"
                                style={{ height: `${h}%` }}
                            />
                        ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t">
                        {FOOTER_STATS.map(([label, value]) => (
                            <div key={label}>
                                <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                                    {label}
                                </div>
                                <div className="font-bold text-[18px] mt-0.5">{value}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="order-1 md:order-2">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary mb-3">Analytics</div>
                    <h2 className="text-[32px] md:text-[42px] font-bold tracking-[-0.02em] leading-[1.1] mb-5">
                        Know what worked. Do more of it.
                    </h2>
                    <p className="text-[16px] text-muted-foreground leading-relaxed max-w-[520px]">
                        Every automation and every link comes with its own numbers. Export to CSV, share a read-only link
                        with your team, or just peek before bed.
                    </p>
                </div>
            </div>
        </section>
    )
}
