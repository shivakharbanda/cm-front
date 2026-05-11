import { MarketingNav } from '@/components/marketing/marketing-nav'
import { MarketingFooter } from '@/components/marketing/marketing-footer'
import { resetCookieConsentValue } from 'react-cookie-consent'

const COOKIE_NAME = 'creatormodo_cookie_consent'
const noop = () => {}

function handleUpdatePreferences() {
    resetCookieConsentValue(COOKIE_NAME)
    window.location.reload()
}

export default function CookiesPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <MarketingNav onScrollTo={noop} />
            <main className="flex-1 w-full max-w-[860px] mx-auto px-6 md:px-8 py-16">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Cookie Policy</h1>
                <p className="text-sm text-muted-foreground mb-10">Last Updated: May 2026</p>

                <div className="space-y-10 text-sm text-foreground/80 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">What are cookies?</h2>
                        <p>
                            Cookies are small text files stored on your device when you visit a website. They help websites
                            remember your preferences and understand how you interact with the site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">What cookies we use</h2>
                        <p className="mb-4">CreatorModo uses a minimal set of cookies:</p>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-[13px]">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2 pr-6 font-semibold text-foreground">Cookie</th>
                                        <th className="text-left py-2 pr-6 font-semibold text-foreground">Purpose</th>
                                        <th className="text-left py-2 font-semibold text-foreground">Duration</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr>
                                        <td className="py-3 pr-6 font-mono">creatormodo_cookie_consent</td>
                                        <td className="py-3 pr-6">Remembers your cookie preference (accept / decline)</td>
                                        <td className="py-3">150 days</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 pr-6 font-mono">_ga, _ga_*</td>
                                        <td className="py-3 pr-6">Google Analytics — understands how the site is used (only set if you accept cookies)</td>
                                        <td className="py-3">Up to 2 years</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-4">
                            We do not use advertising cookies or sell your data to third parties. Google Analytics data
                            is used solely to improve CreatorModo.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">Your choices</h2>
                        <p className="mb-4">
                            You can accept or decline analytics cookies at any time. If you decline, only the consent
                            preference cookie is stored — no analytics data is collected.
                        </p>
                        <button
                            onClick={handleUpdatePreferences}
                            className="h-9 px-5 rounded-md text-[13px] font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                        >
                            Update cookie preferences
                        </button>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">Contact</h2>
                        <p>
                            Questions about this policy? Email us at{' '}
                            <a href="mailto:support@creatormodo.com" className="underline hover:text-foreground transition-colors">
                                support@creatormodo.com
                            </a>
                        </p>
                    </section>
                </div>
            </main>
            <MarketingFooter />
        </div>
    )
}
