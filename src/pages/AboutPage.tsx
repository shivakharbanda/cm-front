import { Link } from 'react-router-dom'
import { MarketingNav } from '@/components/marketing/marketing-nav'
import { MarketingFooter } from '@/components/marketing/marketing-footer'

const noop = () => {}

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <MarketingNav onScrollTo={noop} />

            <main className="flex-1 w-full max-w-[860px] mx-auto px-6 md:px-8 py-16">

                {/* Hero */}
                <h1 className="text-4xl font-bold tracking-tight mb-4">We're just two people.</h1>
                <p className="text-base text-muted-foreground leading-relaxed mb-14 max-w-[600px]">
                    No VC backing. No press release. No grand mission statement. Just two people from college
                    who decided to actually finish something for once.
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-8 mb-14 pb-14 border-b">
                    {[
                        ['2', 'founders'],
                        ['1', 'product'],
                        ['0', 'investors'],
                        ['∞', 'late nights'],
                    ].map(([num, label]) => (
                        <div key={label}>
                            <div className="text-3xl font-bold text-primary">{num}</div>
                            <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
                        </div>
                    ))}
                </div>

                {/* Origin story */}
                <div className="space-y-10 mb-14 pb-14 border-b">
                    <section>
                        <h2 className="text-xl font-semibold mb-3">How this started</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            We met in college. Like most people in college, we had ideas. Unlike most people in college,
                            we actually got annoyed enough at ourselves for never shipping them to do something about it.
                        </p>
                        <p className="text-sm text-foreground/80 leading-relaxed mt-3">
                            CreatorModo is our first project that we've taken end-to-end — real product, real users,
                            real code in production. Not a hackathon demo. Not a half-finished repo sitting on GitHub.
                            Something we actually built, deployed, and put our names on.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">Who does what</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            One of us handles all the engineering — the backend, the frontend, the infra, the 3am debugging sessions.
                            The other handles marketing, outreach, and making sure the product actually finds the people it's meant for.
                            Between us we cover the full stack. Barely.
                        </p>
                    </section>
                </div>

                {/* Why it's free */}
                <div className="mb-14 pb-14 border-b">
                    <h2 className="text-xl font-semibold mb-3">Why is this free?</h2>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                        Honest answer: we're trying to go from zero to real users. Not theoretical users. Not friends
                        who said "yeah I'd use that." Actual people who find it useful and come back.
                    </p>
                    <p className="text-sm text-foreground/80 leading-relaxed mt-3">
                        We're early in our careers and building this because we want to be able to say
                        — with receipts — that we've taken a product from idea to production to traction.
                        That's worth more to us right now than a few dollars a month.
                    </p>
                    <p className="text-sm text-foreground/80 leading-relaxed mt-3">
                        There's no catch. No ads. No "free tier with a gotcha." We're just two people who
                        want to build something people actually use.
                    </p>
                </div>

                {/* What we're building */}
                <div className="mb-14 pb-14 border-b">
                    <h2 className="text-xl font-semibold mb-3">What we're building</h2>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                        CreatorModo is a quiet automation tool for Instagram creators. Auto-DM people who comment
                        on your posts, build a link-in-bio page that actually captures leads, and see what's working —
                        all without spending hours in your inbox.
                    </p>
                    <p className="text-sm text-foreground/80 leading-relaxed mt-3">
                        We built the thing we'd want to use. That's it.
                    </p>
                </div>

                {/* CTA */}
                <div>
                    <h2 className="text-xl font-semibold mb-3">Say hi</h2>
                    <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                        If you're using CreatorModo, we genuinely want to hear from you — what's working,
                        what's broken, what you wish existed. We read every message.
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
