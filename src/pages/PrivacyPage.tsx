import { MarketingNav } from '@/components/marketing/marketing-nav'
import { MarketingFooter } from '@/components/marketing/marketing-footer'

const noop = () => {}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <MarketingNav onScrollTo={noop} />
            <main className="flex-1 w-full max-w-[860px] mx-auto px-6 md:px-8 py-16">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
                <p className="text-sm text-muted-foreground mb-10">Last Updated: May 2026</p>

                <p className="text-sm text-foreground/80 leading-relaxed mb-8">
                    CreaterModo ("we", "our", or "us") values your privacy. This Privacy Policy explains how we collect,
                    use, store, and protect your information when you use our website, products, services, or automation
                    systems. By using CreaterModo, you consent to the practices described in this Privacy Policy.
                </p>

                <div className="space-y-10">
                    <section>
                        <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-4">We may collect the following information:</p>

                        <h3 className="text-base font-semibold mb-2">Personal Information</h3>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-2">Including but not limited to:</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 leading-relaxed mb-6">
                            <li>Name</li>
                            <li>Email address</li>
                            <li>Phone number</li>
                            <li>Billing information</li>
                            <li>Social media handles</li>
                            <li>Business information</li>
                        </ul>

                        <h3 className="text-base font-semibold mb-2">Usage Data</h3>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-2">We may automatically collect:</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 leading-relaxed mb-6">
                            <li>IP address</li>
                            <li>Browser type</li>
                            <li>Device information</li>
                            <li>Operating system</li>
                            <li>Website activity</li>
                            <li>Session duration</li>
                            <li>Diagnostic and analytics data</li>
                        </ul>

                        <h3 className="text-base font-semibold mb-2">Instagram &amp; Meta Permissions</h3>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                            If you connect your Instagram or Meta account with CreaterModo, we may access limited account
                            information and permissions explicitly authorized by you through the Instagram API or Meta platform.
                            This may include:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 leading-relaxed mb-4">
                            <li>Username</li>
                            <li>Profile information</li>
                            <li>Messages or conversations required for automation features</li>
                            <li>Account engagement data</li>
                            <li>Business account metadata</li>
                            <li>Permissions necessary for automation workflows</li>
                        </ul>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            CreaterModo only accesses the permissions and information you explicitly approve. We do not gain
                            full control of your account, change account settings without authorization, or access information
                            beyond granted permissions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">2. Cookies &amp; Tracking Technologies</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3">We may use cookies and similar technologies to:</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 leading-relaxed mb-4">
                            <li>Improve user experience</li>
                            <li>Understand visitor behavior</li>
                            <li>Remember preferences</li>
                            <li>Analyze platform performance</li>
                        </ul>
                        <p className="text-sm text-foreground/80 leading-relaxed">You can disable cookies through your browser settings.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3">We use your information to:</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 leading-relaxed mb-4">
                            <li>Provide and improve our services</li>
                            <li>Process payments</li>
                            <li>Deliver customer support</li>
                            <li>Communicate updates and service-related information</li>
                            <li>Enable automation workflows</li>
                            <li>Improve platform performance and analytics</li>
                            <li>Prevent fraud, abuse, or unauthorized activity</li>
                        </ul>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-2">
                            We use authorized Instagram and Meta data solely for providing the services requested by you.
                        </p>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            We do not sell your personal information or misuse your account data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">4. Sharing of Information</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                            We do not sell your personal information. We may share information only when necessary:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 leading-relaxed mb-4">
                            <li>To comply with legal obligations</li>
                            <li>To protect our rights and platform security</li>
                            <li>With payment providers for transaction processing</li>
                            <li>With infrastructure or hosting providers necessary to operate our services</li>
                        </ul>
                        <p className="text-sm text-foreground/80 leading-relaxed">Any shared data is limited to what is reasonably necessary.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">5. Data Retention</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3">We retain information only for as long as necessary to:</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 leading-relaxed mb-4">
                            <li>Provide services</li>
                            <li>Meet legal obligations</li>
                            <li>Resolve disputes</li>
                            <li>Enforce agreements</li>
                        </ul>
                        <p className="text-sm text-foreground/80 leading-relaxed">Inactive or unnecessary data may be securely deleted or anonymized periodically.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">6. Data Security</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                            We implement reasonable technical and organizational measures to protect your data. However, no
                            online system or transmission method is completely secure.
                        </p>
                        <p className="text-sm text-foreground/80 leading-relaxed">By using our services, you acknowledge and accept this risk.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">7. Third-Party Platforms</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                            CreaterModo integrates with Instagram and Meta APIs to provide automation and creator-related services.
                            Your use of Instagram-connected features is also subject to:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 leading-relaxed mb-4">
                            <li>Instagram Terms of Use</li>
                            <li>Meta Platform Policies</li>
                        </ul>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            CreaterModo is not responsible for restrictions, suspensions, outages, or policy changes imposed
                            by Instagram or Meta.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">8. Your Rights</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                            Depending on your jurisdiction, you may have rights to:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 leading-relaxed mb-4">
                            <li>Access your personal data</li>
                            <li>Correct inaccurate information</li>
                            <li>Request deletion of your data</li>
                            <li>Withdraw consent</li>
                            <li>Request data portability where applicable</li>
                        </ul>
                        <p className="text-sm text-foreground/80 leading-relaxed">To exercise these rights, contact us using the information below.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">9. Children's Privacy</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                            CreaterModo does not knowingly collect personal information from children under the age of 14.
                        </p>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            If we discover that information has been collected from a user under 14 where consent is required,
                            we will take steps to remove that information promptly.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">10. International Data Transfers</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            Your information may be stored or processed in locations outside your country of residence. By
                            using our services, you consent to such transfers where legally permitted.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">11. Changes to This Privacy Policy</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                            We may update this Privacy Policy periodically. Changes become effective immediately upon posting
                            on this page.
                        </p>
                        <p className="text-sm text-foreground/80 leading-relaxed">We encourage users to review this policy regularly.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">12. Contact Us</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            If you have questions regarding this Privacy Policy, contact:
                        </p>
                        <p className="text-sm text-foreground/80 leading-relaxed mt-2">
                            <strong>CreaterModo</strong><br />
                            Email:{' '}
                            <a href="mailto:support@creatermodo.com" className="text-primary hover:underline">
                                support@creatermodo.com
                            </a>
                        </p>
                    </section>
                </div>
            </main>
            <MarketingFooter />
        </div>
    )
}
