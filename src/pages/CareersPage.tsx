import { Link } from 'react-router-dom'
import { MarketingNav } from '@/components/marketing/marketing-nav'
import { MarketingFooter } from '@/components/marketing/marketing-footer'

const noop = () => {}

export default function CareersPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <MarketingNav onScrollTo={noop} />

            <main className="flex-1 w-full max-w-[860px] mx-auto px-6 md:px-8 py-16">

                {/* Hero */}
                <h1 className="text-4xl font-bold tracking-tight mb-2">Work at CreatorModo</h1>
                <p className="text-sm text-muted-foreground mb-2 italic">
                    (We know. We shouldn't have a careers page. Keep reading.)
                </p>
                <div className="h-px bg-border my-10" />

                {/* Honest pitch */}
                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-3">The honest situation</h2>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                        We're two people. One writes code, the other does marketing and outreach.
                        Most of our energy, frankly, goes into motivating each other to keep going on days
                        when it feels pointless — which, to be honest, is most of them. :)
                    </p>
                    <p className="text-sm text-foreground/80 leading-relaxed mt-3">
                        Adding a third person would technically make us 50% larger as a company.
                        We haven't decided if that's exciting or terrifying.
                    </p>
                </section>

                {/* Open roles */}
                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-4">Current openings</h2>

                    <div className="rounded-xl border bg-muted/30 p-8 text-center">
                        <p className="text-4xl mb-3">🦗</p>
                        <p className="text-sm font-medium text-foreground mb-1">No open roles</p>
                        <p className="text-xs text-muted-foreground">
                            We can barely afford ourselves.
                        </p>
                    </div>

                    {/* Fake listing for comedic effect */}
                    <div className="mt-6 rounded-xl border p-6 opacity-60">
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                                <p className="text-sm font-semibold line-through">Co-founder / Everything Else</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Remote · Full-time · Unpaid</p>
                            </div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider bg-muted px-2 py-1 rounded-full shrink-0">
                                Closed
                            </span>
                        </div>
                        <p className="text-xs text-foreground/70 leading-relaxed">
                            We're looking for someone comfortable owning an undefined role at a company worth
                            exactly $0. Equity available. Vesting cliff is "whenever we figure out what equity means."
                            Must be okay with Slack messages at midnight and celebrating small wins very loudly.
                        </p>
                    </div>
                </section>

                {/* What we actually offer */}
                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-4">What we actually offer</h2>
                    <ul className="space-y-3">
                        {[
                            'The satisfaction of watching your work go live for real users (not just your laptop)',
                            'Bragging rights for helping build the product that got our first 1,000 users',
                            'A reference letter from two people nobody has heard of — yet',
                            'The ability to say you joined before we were cool (we will be cool someday)',
                            "Zero bureaucracy. Zero stand-ups you don't need to be in.",
                        ].map(item => (
                            <li key={item} className="flex gap-3 text-sm text-foreground/80">
                                <span className="text-primary mt-0.5 shrink-0">→</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* CTA */}
                <div className="rounded-xl border bg-card/50 p-6">
                    <p className="text-sm font-medium mb-1">Still reading?</p>
                    <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                        If you genuinely want to be involved in what we're building — as a user,
                        a collaborator, or just someone with an idea — we'd actually love to hear from you.
                        No formalities. Just say hi.
                    </p>
                    <Link
                        to="/contact"
                        className="text-sm text-primary hover:underline font-medium"
                    >
                        Get in touch →
                    </Link>
                </div>

            </main>

            <MarketingFooter />
        </div>
    )
}
