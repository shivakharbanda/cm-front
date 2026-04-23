import { Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

type Tier = {
    name: string
    price: string
    cadence: string
    features: string[]
    cta: string
    variant: 'default' | 'outline'
    featured?: boolean
}

const TIERS: Tier[] = [
    {
        name: 'Starter',
        price: '$0',
        cadence: 'Forever free',
        features: [
            '1 Instagram account',
            '3 active automations',
            'Link-in-bio (CreatorModo branded)',
            'Basic analytics',
        ],
        cta: 'Get started',
        variant: 'outline',
    },
    {
        name: 'Creator',
        price: '$29',
        cadence: 'Per month',
        features: [
            '2 Instagram accounts',
            'Unlimited automations',
            'Custom domain for bio page',
            'Lead-capture cards',
            'Advanced analytics + CSV export',
        ],
        cta: 'Start 14-day trial',
        variant: 'default',
        featured: true,
    },
    {
        name: 'Studio',
        price: '$79',
        cadence: 'Per month',
        features: [
            '10 Instagram accounts',
            'Team seats (3 included)',
            'Priority support',
            'API access',
            'White-label bio pages',
        ],
        cta: 'Start 14-day trial',
        variant: 'outline',
    },
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
                        Free to start. Fair as you grow.
                    </h2>
                    <p className="text-[15px] text-muted-foreground mt-3">
                        Cancel with a single button. We'll even export your data for you.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-5 max-w-[1000px] mx-auto">
                    {TIERS.map(tier => (
                        <div
                            key={tier.name}
                            className={`rounded-xl border bg-background p-6 relative ${
                                tier.featured ? 'border-primary shadow-lg' : ''
                            }`}
                        >
                            {tier.featured && (
                                <span className="absolute -top-2.5 left-6 text-[10px] font-semibold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded">
                                    Most popular
                                </span>
                            )}
                            <div className="font-semibold text-[15px]">{tier.name}</div>
                            <div className="mt-3 flex items-baseline gap-1.5">
                                <span className="text-[38px] font-bold tracking-tight">{tier.price}</span>
                                <span className="text-[13px] text-muted-foreground">{tier.cadence}</span>
                            </div>
                            <div className="my-5 border-t" />
                            <ul className="space-y-2.5 mb-6">
                                {tier.features.map(f => (
                                    <li key={f} className="flex gap-2 text-[14px]">
                                        <Check className="size-4 text-accent mt-0.5 shrink-0" />
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button variant={tier.variant} onClick={signUp} className="w-full">
                                {tier.cta}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
