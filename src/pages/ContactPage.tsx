import { useState } from 'react'
import { Mail, Twitter, Instagram as InstagramIcon, CheckCircle, AlertCircle } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/marketing-nav'
import { MarketingFooter } from '@/components/marketing/marketing-footer'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { submitContactForm, type ContactFormData } from '@/lib/contact'

const noop = () => {}

const INITIAL_FORM: ContactFormData = { name: '', email: '', subject: '', message: '' }

export default function ContactPage() {
    const [form, setForm] = useState<ContactFormData>(INITIAL_FORM)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await submitContactForm({
                name: form.name,
                email: form.email,
                subject: form.subject || undefined,
                message: form.message,
            })
            setSuccess(true)
            setForm(INITIAL_FORM)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <MarketingNav onScrollTo={noop} />

            <main className="flex-1 w-full max-w-[860px] mx-auto px-6 md:px-8 py-16">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Get in touch</h1>
                <p className="text-sm text-muted-foreground mb-12">
                    Have a question, a feature request, or just want to say hi? We'd love to hear from you.
                </p>

                <div className="grid md:grid-cols-[1fr_1.8fr] gap-12">
                    {/* Contact details */}
                    <div className="space-y-6">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-3">
                                Contact
                            </p>
                            <a
                                href="mailto:hello@creatormodo.com"
                                className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground transition-colors"
                            >
                                <Mail className="size-4 text-primary shrink-0" />
                                hello@creatormodo.com
                            </a>
                        </div>

                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-3">
                                Follow us
                            </p>
                            <div className="space-y-2">
                                <a
                                    href="#"
                                    className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground transition-colors"
                                >
                                    <Twitter className="size-4 text-primary shrink-0" />
                                    @creatormodo
                                </a>
                                <a
                                    href="#"
                                    className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground transition-colors"
                                >
                                    <InstagramIcon className="size-4 text-primary shrink-0" />
                                    @creatormodo
                                </a>
                            </div>
                        </div>

                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-3">
                                Response time
                            </p>
                            <p className="text-sm text-foreground/80">
                                We typically reply within 1–2 business days.
                            </p>
                        </div>
                    </div>

                    {/* Contact form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Send a message</CardTitle>
                            <CardDescription>Fill in the form and we'll get back to you.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {success ? (
                                <Alert className="border-green-500/30 bg-green-500/10">
                                    <CheckCircle className="size-4 text-green-600" />
                                    <AlertDescription className="text-green-700 dark:text-green-400">
                                        Message sent! We'll get back to you soon.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {error && (
                                        <Alert variant="destructive">
                                            <AlertCircle className="size-4" />
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                placeholder="Your name"
                                                value={form.name}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={form.email}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject">
                                            Subject{' '}
                                            <span className="text-muted-foreground text-xs">(optional)</span>
                                        </Label>
                                        <Input
                                            id="subject"
                                            name="subject"
                                            placeholder="What's this about?"
                                            value={form.subject}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            placeholder="Tell us what's on your mind…"
                                            value={form.message}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                            rows={5}
                                        />
                                    </div>

                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? 'Sending…' : 'Send message'}
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>

            <MarketingFooter />
        </div>
    )
}
