import { Check, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const FEATURES = [
    'Unlimited automations',
    'Full analytics dashboard',
    'Instagram comment triggers',
    'Auto-DM with keyword matching',
    'Multiple Instagram accounts',
    'No credit card required',
]

export function Pricing() {
    const navigate = useNavigate()
    const signUp = () => navigate('/register')

    return (
        <section id="pricing" className="bg-card/60 border-y">
            <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8 py-20 md:py-28">
                <div className="mb-12 text-center">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary mb-3">Pricing</div>
                    <h2 className="text-[32px] md:text-[42px] font-bold tracking-[-0.02em] leading-[1.1]">
                        Free. All of it.
                    </h2>
                    <p className="text-[15px] text-muted-foreground mt-3 max-w-[480px] mx-auto">
                        Every feature, unlimited automations, full analytics — no credit card, no catch. Free forever.
                    </p>
                </div>

                <div className="max-w-[420px] mx-auto">
                    <div className="rounded-xl border border-primary bg-background p-8 shadow-lg relative">
                        <span className="absolute -top-2.5 left-6 text-[10px] font-semibold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded">
                            Free forever
                        </span>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-[52px] font-bold tracking-tight">$0</span>
                            <span className="text-[14px] text-muted-foreground">/ forever</span>
                        </div>
                        <div className="my-5 border-t" />
                        <ul className="space-y-3 mb-8">
                            {FEATURES.map(f => (
                                <li key={f} className="flex gap-2.5 text-[14px]">
                                    <Check className="size-4 text-accent mt-0.5 shrink-0" />
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                        <Button onClick={signUp} className="w-full" size="lg">
                            Get started free
                            <ArrowRight className="size-4" />
                        </Button>
                    </div>
                    <p className="text-center text-[12px] text-muted-foreground mt-4">
                        No hidden tiers. No credit card ever.
                    </p>
                </div>
            </div>
        </section>
    )
}
