import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { MarketingNav } from '@/components/marketing/marketing-nav'
import { Hero } from '@/components/marketing/hero'
import { HowItWorks } from '@/components/marketing/how-it-works'
import { FeatureAutomations } from '@/components/marketing/feature-automations'
import { AnalyticsFeature } from '@/components/marketing/analytics-feature'
import { Pricing } from '@/components/marketing/pricing'
import { FAQ } from '@/components/marketing/faq'
import { FinalCTA } from '@/components/marketing/final-cta'
import { MarketingFooter } from '@/components/marketing/marketing-footer'
import { useFadeInOnScroll } from '@/hooks/use-fade-in-on-scroll'

const HEADLINE = 'Reply to every comment. Publish every link. One quiet tool doing it.'

function FadeIn({ children }: { children: ReactNode }) {
    const { ref, visible } = useFadeInOnScroll<HTMLDivElement>()
    return (
        <div
            ref={ref}
            className={`transition-all duration-[600ms] ease-out ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
        >
            {children}
        </div>
    )
}

function scrollToId(id: string) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Home() {
    const navigate = useNavigate()
    const toPricing = () => scrollToId('pricing')
    const toRegister = () => navigate('/register')

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <MarketingNav onScrollTo={scrollToId} />
            <main className="flex-1">
                <Hero headline={HEADLINE} onPrimaryCta={toPricing} onSecondaryCta={toRegister} />
                <FadeIn><HowItWorks /></FadeIn>
                <FadeIn><FeatureAutomations /></FadeIn>
                <FadeIn><AnalyticsFeature /></FadeIn>
                <FadeIn><Pricing /></FadeIn>
                <FadeIn><FAQ /></FadeIn>
                <FadeIn><FinalCTA onPrimaryCta={toPricing} /></FadeIn>
            </main>
            <MarketingFooter />
        </div>
    )
}
