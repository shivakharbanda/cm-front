import { MarketingNav } from '@/components/marketing/marketing-nav'
import { MarketingFooter } from '@/components/marketing/marketing-footer'

const noop = () => {}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <MarketingNav onScrollTo={noop} />
            <main className="flex-1 w-full max-w-[860px] mx-auto px-6 md:px-8 py-16">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
                <p className="text-sm text-muted-foreground mb-10">Last Updated: July 2026</p>

                <p className="text-sm text-foreground/80 leading-relaxed mb-8">
                    CreatorModo ("we", "our", or "us") values your privacy. This Privacy Policy explains how we
                    collect, use, store, share, and delete information when you use our website, products, services,
                    Instagram automation features, and link-in-bio tools.
                </p>

                <div className="space-y-10">
                    <section>
                        <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>

                        <h3 className="text-base font-semibold mb-2">Account Information</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 leading-relaxed mb-6">
                            <li>Email address, login and account status information, and account activity timestamps</li>
                            <li>Information you submit through contact forms, lead forms, support requests, or email</li>
                            <li>Bio page content, links, cards, social links, routing rules, and related analytics</li>
                        </ul>

                        <h3 className="text-base font-semibold mb-2">Usage Data</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 leading-relaxed mb-6">
                            <li>IP address, country-level location, browser type, device information, pages visited, referrer, and diagnostic data</li>
                            <li>Cookie consent preference and analytics data collected only when analytics cookies are accepted</li>
                        </ul>

                        <h3 className="text-base font-semibold mb-2">Instagram and Meta Platform Data</h3>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                            If you connect Instagram or Meta features, we process the data you authorize through Meta's
                            OAuth flow, Instagram APIs, and webhooks. Depending on the features you use, this may include:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 leading-relaxed mb-4">
                            <li>Instagram account identifiers, username, and connection credentials needed to operate the integration</li>
                            <li>Selected Instagram media information needed to create and run automations</li>
                            <li>Automation settings such as trigger keywords, selected posts, DM content, buttons, and comment reply content</li>
                            <li>Comment and commenter information needed to detect triggers and send user-configured responses</li>
                            <li>Delivery, error, and analytics information needed to show automation history and troubleshoot failures</li>
                            <li>Webhook event information temporarily processed to run your automations</li>
                        </ul>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            CreatorModo only uses Instagram and Meta Platform Data for the features you authorize. We do
                            not sell Platform Data, use it for eligibility decisions, or use it for surveillance.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">2. How We Use Information</h2>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 leading-relaxed">
                            <li>Provide, secure, debug, and improve CreatorModo</li>
                            <li>Authenticate users and protect accounts from fraud or unauthorized access</li>
                            <li>Connect Instagram accounts and operate user-configured comment, DM, and reply automations</li>
                            <li>Display selected posts, automation analytics, delivery history, and bio page analytics</li>
                            <li>Send transactional emails such as account verification, password reset, and Instagram connection notices</li>
                            <li>Respond to support, privacy, deletion, and legal requests</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">3. Sharing of Information</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                            We do not sell your personal information or Meta Platform Data. We share information only
                            when necessary:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 leading-relaxed">
                            <li>With Meta and Instagram when you authorize API calls, webhook subscriptions, DMs, replies, or related requests</li>
                            <li>With service providers that host, store, deliver email, monitor, analyze, and operate CreatorModo</li>
                            <li>When required by law, regulation, court order, platform policy, or a valid government request</li>
                            <li>To protect CreatorModo, our users, Meta products, or the public from fraud, abuse, security threats, or rights violations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">4. Cookies and Tracking</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            CreatorModo uses essential cookies for authentication and cookie preferences. We use Google
                            Analytics only after you accept analytics cookies. You can update your choices on our{' '}
                            <a href="/cookies" className="text-primary hover:underline">Cookie Policy</a> page.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">5. Data Retention and Deletion</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                            We retain information only as long as needed to provide CreatorModo, comply with legal
                            obligations, resolve disputes, enforce agreements, prevent abuse, and maintain security.
                        </p>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                            If you disconnect your Instagram account, CreatorModo deletes the Instagram connection data
                            and automation records tied to that connection, including related delivery history. Public
                            bio pages, leads, contact requests, or analytics that are separate from the Instagram
                            connection may remain unless you request deletion of those records too.
                        </p>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            You can request deletion of your CreatorModo account data or Meta Platform Data through our{' '}
                            <a href="/data-deletion" className="text-primary hover:underline">Data Deletion page</a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">6. Security</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            We use reasonable technical and organizational measures to protect information. No online
                            service can guarantee absolute security, but we work to limit access to data and protect it
                            from unauthorized use.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">7. Your Rights</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            Depending on your location, you may have rights to access, correct, delete, export, or
                            restrict use of your information, and to withdraw consent where processing is based on
                            consent. To exercise these rights, visit our{' '}
                            <a href="/data-deletion" className="text-primary hover:underline">Data Deletion page</a>{' '}
                            or contact us using the email below.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">8. Third-Party Platforms</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            CreatorModo integrates with Instagram and Meta APIs. Your use of Instagram-connected
                            features is also subject to Instagram's Terms of Use, Meta Platform Terms, and applicable
                            Meta developer policies. CreatorModo is not affiliated with or endorsed by Meta Platforms, Inc.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">9. Children's Privacy</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            CreatorModo does not knowingly collect personal information from children under 13. If we
                            learn that we collected such information without required consent, we will delete it promptly.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">10. International Data Transfers</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            Your information may be stored or processed outside your country of residence. We take
                            reasonable steps to protect information in accordance with this Privacy Policy and applicable law.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">11. Changes to This Privacy Policy</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            We may update this Privacy Policy periodically. Changes become effective when posted on this page.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">12. Contact Us</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            CreatorModo<br />
                            Email:{' '}
                            <a href="mailto:support@creatormodo.com" className="text-primary hover:underline">
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
