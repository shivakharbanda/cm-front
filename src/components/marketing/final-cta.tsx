import { ArrowRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

type FinalCtaProps = {
    onPrimaryCta: () => void
}

export function FinalCTA({ onPrimaryCta }: FinalCtaProps) {
    return (
        <section className="w-full max-w-[1200px] mx-auto px-6 md:px-8 py-20 md:py-28">
            <div
                className="rounded-2xl border p-10 md:p-16 text-center relative overflow-hidden"
                style={{ background: 'color-mix(in oklab, var(--primary) 8%, var(--card))' }}
            >
                <div
                    className="absolute inset-0 pointer-events-none opacity-60"
                    style={{
                        background:
                            'radial-gradient(600px 300px at 50% 0%, color-mix(in oklab, var(--primary) 25%, transparent), transparent 70%)',
                    }}
                />
                <div className="relative">
                    <h2 className="text-[34px] md:text-[48px] font-bold tracking-[-0.02em] leading-[1.05] max-w-[720px] mx-auto text-balance">
                        Stop losing leads to a crowded DM inbox.
                    </h2>
                    <p className="mt-4 text-[16px] md:text-[17px] text-muted-foreground max-w-[520px] mx-auto">
                        Set up your first automation in about four minutes. Free forever on the Starter plan.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Button size="lg" onClick={onPrimaryCta}>
                            Get started free
                            <ArrowRight className="size-4" />
                        </Button>
                        <Button size="lg" variant="outline">
                            <Calendar className="size-4" />
                            Book a 15-min demo
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
