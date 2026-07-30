import { MarketingNav } from '@/components/marketing/marketing-nav'
import { MarketingFooter } from '@/components/marketing/marketing-footer'

const noop = () => {}

export default function DataDeletionPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <MarketingNav onScrollTo={noop} />
            <main className="flex-1 w-full max-w-[860px] mx-auto px-6 md:px-8 py-16">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Data Deletion</h1>
                <p className="text-sm text-muted-foreground mb-10">Last Updated: July 2026</p>

                <div className="space-y-10 text-sm text-foreground/80 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">Delete Instagram and Meta Data</h2>
                        <p>
                            You can ask CreatorModo to delete the Instagram and Meta Platform Data associated with
                            your CreatorModo account at any time. This includes your linked Instagram account details,
                            automation rules, selected post information, comment data used for automations, delivery
                            history, and related analytics stored by CreatorModo.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">Self-Serve Deletion</h2>
                        <p>
                            If you have access to your CreatorModo account, sign in, open your dashboard, and disconnect
                            your Instagram account. Disconnecting removes the linked Instagram account from CreatorModo
                            and deletes automations and delivery logs tied to that Instagram connection.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">Request Deletion by Email</h2>
                        <p>
                            If you cannot sign in or want us to delete additional account data, email{' '}
                            <a href="mailto:support@creatormodo.com" className="underline hover:text-foreground transition-colors">
                                support@creatormodo.com
                            </a>{' '}
                            with the subject line "Data Deletion Request". Include the email address on your
                            CreatorModo account and the Instagram handle you connected.
                        </p>
                        <p className="mt-3">
                            We may ask you to verify account ownership before deleting data. We will complete deletion
                            as soon as reasonably possible unless we are required to retain limited information for
                            security, fraud prevention, legal compliance, dispute resolution, or enforcement of our terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">Meta App Data Deletion Callback</h2>
                        <p>
                            If you reach this page from Meta's app settings or data deletion flow, email us using the
                            instructions above. This page is the public deletion instruction URL for CreatorModo's Meta
                            and Instagram integration.
                        </p>
                    </section>
                </div>
            </main>
            <MarketingFooter />
        </div>
    )
}
