const CREATORS = [
    '@jane.marek',
    '@studio.beacon',
    '@harlow.prints',
    '@coastal.fm',
    '@mira.ceramics',
    '@north.kit',
]

export function LogoRow() {
    return (
        <section className="border-y bg-card/60">
            <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8 py-8">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-5 text-center">
                    Quietly running in the background for creators like
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
                    {CREATORS.map(handle => (
                        <span key={handle} className="text-muted-foreground font-mono text-[13px] tracking-tight">
                            {handle}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    )
}
