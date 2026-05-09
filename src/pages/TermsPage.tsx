import { MarketingNav } from '@/components/marketing/marketing-nav'
import { MarketingFooter } from '@/components/marketing/marketing-footer'

const noop = () => {}

export default function TermsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <MarketingNav onScrollTo={noop} />
            <main className="flex-1 w-full max-w-[860px] mx-auto px-6 md:px-8 py-16">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Terms &amp; Conditions</h1>
                <p className="text-sm text-muted-foreground mb-10">Last Updated: May 2026</p>

                <p className="text-sm text-foreground/80 leading-relaxed mb-8">
                    Welcome to <strong>CreaterModo</strong>. These Terms and Conditions govern your use of our website,
                    products, services, automation systems, and platform operated by CreaterModo ("Company", "we",
                    "our", or "us"). By accessing or using CreaterModo, you agree to comply with and be bound by these
                    Terms. If you do not agree with any part of these Terms, please do not use our services.
                </p>

                <div className="space-y-10">
                    <section>
                        <h2 className="text-xl font-semibold mb-3">1. Definitions</h2>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80 leading-relaxed">
                            <li><strong>Platform</strong> refers to the CreaterModo website, applications, products, and services.</li>
                            <li><strong>User</strong>, <strong>You</strong>, or <strong>Your</strong> refers to any individual or entity using our platform.</li>
                            <li><strong>Services</strong> refers to creator tools, automation systems, AI tools, marketing services, educational resources, digital products, consulting, or related offerings provided by CreaterModo.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">2. Eligibility</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3">By using CreaterModo, you confirm that:</p>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80 leading-relaxed">
                            <li>You are at least <strong>14 years old</strong> or have permission from a parent or legal guardian.</li>
                            <li>You have the authority to agree to these Terms.</li>
                            <li>You will comply with all applicable laws and regulations while using our services.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">3. Use of Services</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3">You agree to use CreaterModo only for lawful purposes. You must not:</p>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80 leading-relaxed mb-4">
                            <li>Use the platform for illegal or fraudulent activities</li>
                            <li>Attempt to hack, damage, disrupt, or misuse our systems</li>
                            <li>Upload malicious software or harmful content</li>
                            <li>Abuse automation systems or APIs</li>
                            <li>Copy, reproduce, or redistribute our materials without permission</li>
                            <li>Use our services in violation of Instagram, Meta, or other platform policies</li>
                        </ul>
                        <p className="text-sm text-foreground/80 leading-relaxed">We reserve the right to suspend or terminate accounts that violate these Terms.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">4. Instagram Automation Services</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                            CreaterModo may provide automation, messaging, workflow, engagement, or creator-related services
                            using the Instagram API and Meta technologies. By using these services, you acknowledge and agree that:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80 leading-relaxed mb-4">
                            <li>CreaterModo only accesses permissions explicitly granted by you.</li>
                            <li>We do not control, manage, or interfere with your Instagram account beyond the permissions you approve.</li>
                            <li>We do not access private information outside the permissions authorized by you through Instagram or Meta.</li>
                            <li>You may revoke permissions at any time through your platform settings.</li>
                            <li>CreaterModo is not affiliated with, endorsed by, or officially connected to Instagram or Meta Platforms, Inc.</li>
                        </ul>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            You remain responsible for complying with Instagram's Terms of Use, Meta policies, and community guidelines.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">5. Intellectual Property</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                            All content, branding, designs, graphics, software, text, logos, and materials on CreaterModo are
                            owned by or licensed to us and protected under applicable intellectual property laws. You may not:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80 leading-relaxed mb-4">
                            <li>Republish material from CreaterModo</li>
                            <li>Sell or sublicense our content</li>
                            <li>Copy or duplicate platform assets</li>
                            <li>Use our branding without written permission</li>
                        </ul>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            You retain ownership of any content you submit, but you grant CreaterModo a non-exclusive license
                            to use, display, reproduce, and distribute such content for operational and promotional purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">6. Payments &amp; Refunds</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                            Certain services or products may require payment. By purchasing from CreaterModo, you agree that:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80 leading-relaxed mb-4">
                            <li>Pricing may change without prior notice</li>
                            <li>Payment must be completed before delivery of services</li>
                            <li>Refund eligibility depends on the type of service or product purchased</li>
                        </ul>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            Digital products, strategy sessions, consultations, automation setups, and custom services may be
                            non-refundable once work has started or delivery has been made. Refund requests may be reviewed on
                            a case-by-case basis.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">7. User Content</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3">If you submit feedback, comments, media, or content to CreaterModo:</p>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80 leading-relaxed mb-4">
                            <li>You confirm that you own or have rights to the content</li>
                            <li>You grant us permission to use it for operational or promotional purposes</li>
                            <li>You agree not to submit unlawful, abusive, or infringing material</li>
                        </ul>
                        <p className="text-sm text-foreground/80 leading-relaxed">We reserve the right to remove any content that violates these Terms.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">8. Publicity Rights</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                            Unless otherwise agreed in writing, you grant CreaterModo permission to use your:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80 leading-relaxed mb-4">
                            <li>Name</li>
                            <li>Brand name</li>
                            <li>Social handles</li>
                            <li>Logo</li>
                            <li>Testimonials</li>
                            <li>Publicly available project results</li>
                        </ul>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            for portfolio displays, case studies, marketing materials, and promotional purposes. You may request
                            removal by contacting us.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">9. Disclaimer</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                            CreaterModo services are provided on an "as-is" and "as-available" basis. We do not guarantee:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80 leading-relaxed mb-4">
                            <li>Specific business or growth results</li>
                            <li>Revenue increases</li>
                            <li>Viral reach or engagement</li>
                            <li>Continuous uptime</li>
                            <li>Error-free functionality</li>
                        </ul>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            Any strategies, automation systems, or recommendations provided are used at your own discretion and risk.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">10. Limitation of Liability</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                            To the maximum extent permitted by law, CreaterModo shall not be liable for:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80 leading-relaxed mb-4">
                            <li>Indirect or consequential damages</li>
                            <li>Business interruption</li>
                            <li>Data loss</li>
                            <li>Loss of revenue or profits</li>
                            <li>Platform downtime</li>
                            <li>Third-party platform restrictions or suspensions</li>
                        </ul>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            Our total liability shall not exceed the amount paid by you for our services within the previous 3 months.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">11. Termination</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                            We reserve the right to suspend or terminate access to our services if:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80 leading-relaxed mb-4">
                            <li>You violate these Terms</li>
                            <li>Your activities harm the platform or other users</li>
                            <li>Required by law or platform policy</li>
                        </ul>
                        <p className="text-sm text-foreground/80 leading-relaxed">Termination does not remove outstanding payment obligations.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">12. Changes to Terms</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            We may update these Terms periodically. Continued use of CreaterModo after updates constitutes
                            acceptance of the revised Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">13. Governing Law</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            These Terms shall be governed under the laws of India. Any disputes shall be subject to the
                            jurisdiction of courts located in India.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">14. Contact Information</h2>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            For any questions regarding these Terms, contact:
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
