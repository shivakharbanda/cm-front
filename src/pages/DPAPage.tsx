import { MarketingNav } from '@/components/marketing/marketing-nav'
import { MarketingFooter } from '@/components/marketing/marketing-footer'

const noop = () => {}

export default function DPAPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <MarketingNav onScrollTo={noop} />
            <main className="flex-1 w-full max-w-[860px] mx-auto px-6 md:px-8 py-16">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Data Processing Agreement</h1>
                <p className="text-sm text-muted-foreground mb-10">Last Updated: May 2026</p>

                <div className="space-y-10 text-sm text-foreground/80 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">What is this?</h2>
                        <p>
                            A Data Processing Agreement (DPA) discloses which third-party services CreatorModo uses
                            to process data on your behalf, what data they receive, and the legal basis under which
                            that processing happens. We believe in full transparency — this page tells you exactly
                            what goes where.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">Who we are</h2>
                        <p>
                            CreatorModo acts as the <strong>data controller</strong> — we decide how and why your
                            data is processed. The third-party services listed below act as <strong>data processors</strong> —
                            they process data only on our instructions and are bound by their own DPAs.
                        </p>
                        <p className="mt-3">
                            <strong>CreatorModo</strong><br />
                            Contact: <a href="mailto:support@creatormodo.com" className="underline hover:text-foreground transition-colors">support@creatormodo.com</a>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">Third-party processors</h2>
                        <p className="mb-4">
                            The following third-party services receive data when you use CreatorModo:
                        </p>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-[13px]">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2 pr-6 font-semibold text-foreground">Service</th>
                                        <th className="text-left py-2 pr-6 font-semibold text-foreground">Provider</th>
                                        <th className="text-left py-2 pr-6 font-semibold text-foreground">Purpose</th>
                                        <th className="text-left py-2 font-semibold text-foreground">Their DPA</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr>
                                        <td className="py-3 pr-6 font-medium">Google Analytics</td>
                                        <td className="py-3 pr-6">Google LLC (USA)</td>
                                        <td className="py-3 pr-6">Anonymous usage analytics — pages visited, session duration, device type</td>
                                        <td className="py-3">
                                            <a
                                                href="https://business.safety.google/adsprocessorterms/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="underline hover:text-foreground transition-colors"
                                            >
                                                Google DPA ↗
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">What data is shared</h2>
                        <p className="mb-3">
                            We share <strong>anonymous usage data only</strong> with Google Analytics. This includes:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Pages visited and time spent</li>
                            <li>General device type and browser</li>
                            <li>Country-level location (not precise)</li>
                            <li>How you arrived at the site (referrer)</li>
                        </ul>
                        <p className="mt-3">
                            <strong>We do not share</strong> your name, email address, Instagram account data,
                            automation content, or any information that identifies you personally with Google Analytics.
                            IP addresses are anonymised before leaving your browser.
                        </p>
                        <p className="mt-3">
                            Google Analytics data is only collected <strong>after you accept cookies</strong>. If you
                            decline, no data is sent to Google at all.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">Your rights</h2>
                        <p className="mb-3">You can opt out of analytics data collection at any time:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Visit our <a href="/cookies" className="underline hover:text-foreground transition-colors">Cookie Policy</a> page and click "Update cookie preferences"</li>
                            <li>Use the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">Google Analytics opt-out browser add-on ↗</a></li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">Questions</h2>
                        <p>
                            If you have any questions about how your data is processed, contact us at{' '}
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
