import { MarketingNav } from '@/components/marketing/marketing-nav'
import { MarketingFooter } from '@/components/marketing/marketing-footer'

const noop = () => {}

export default function DPAPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <MarketingNav onScrollTo={noop} />
            <main className="flex-1 w-full max-w-[860px] mx-auto px-6 md:px-8 py-16">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Data Processing Addendum</h1>
                <p className="text-sm text-muted-foreground mb-10">Last Updated: July 2026</p>

                <div className="space-y-10 text-sm text-foreground/80 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">Who We Are</h2>
                        <p>
                            CreatorModo provides Instagram automation and link-in-bio tools. When you use CreatorModo,
                            we process account, automation, analytics, lead, and Instagram/Meta Platform Data to provide
                            the services you request.
                        </p>
                        <p className="mt-3">
                            Contact:{' '}
                            <a href="mailto:support@creatormodo.com" className="underline hover:text-foreground transition-colors">
                                support@creatormodo.com
                            </a>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">Data We Process</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>CreatorModo account data, including email, account status, and support/contact requests</li>
                            <li>Instagram connection data, including account identifiers, username, and connection credentials</li>
                            <li>Instagram media, comment, and webhook event information needed to run user-configured automations</li>
                            <li>Automation content, including trigger keywords, selected posts, DM content, buttons, and comment reply content</li>
                            <li>Delivery, analytics, lead, and diagnostic records generated while operating the service</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">Service Providers</h2>
                        <p className="mb-3">
                            CreatorModo uses third-party service providers only as needed to operate and improve the
                            service. These providers may process data on our behalf for the following purposes:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Hosting, storage, and infrastructure for the website, app, API, and automation services</li>
                            <li>Temporary processing of Instagram webhook events so automations can run reliably</li>
                            <li>Transactional email for account verification, password reset, and service notifications</li>
                            <li>Analytics and diagnostics to understand site usage, improve reliability, and prevent abuse</li>
                            <li>Meta and Instagram API services when you connect your account and authorize automation features</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">Deletion and Requests</h2>
                        <p>
                            Users can request deletion of CreatorModo account data and Instagram/Meta Platform Data
                            through our{' '}
                            <a href="/data-deletion" className="underline hover:text-foreground transition-colors">
                                Data Deletion page
                            </a>.
                        </p>
                    </section>
                </div>
            </main>
            <MarketingFooter />
        </div>
    )
}
