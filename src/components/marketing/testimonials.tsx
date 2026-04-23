import { Quote } from 'lucide-react'

type Card = { quote: string; name: string; handle: string }

const CARDS: Card[] = [
    {
        quote:
            "I set up one automation on a Saturday and woke up to 340 new emails on my list. I've since turned most of my launches into DM flows.",
        name: 'Harlow Prints',
        handle: '48k followers · print shop',
    },
    {
        quote:
            'The bio page finally gave me somewhere to put everything without feeling tacky. Drag-to-reorder is the move.',
        name: 'Mira Ceramics',
        handle: '12k followers · studio potter',
    },
    {
        quote:
            'What sold me is the analytics. I can see which reel actually put money in the bank, not just which one went off.',
        name: 'Coastal FM',
        handle: 'Indie music label',
    },
]

export function Testimonials() {
    return (
        <section className="w-full max-w-[1200px] mx-auto px-6 md:px-8 py-20 md:py-28">
            <div className="mb-12">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary mb-3">
                    Creators using it
                </div>
                <h2 className="text-[32px] md:text-[42px] font-bold tracking-[-0.02em] leading-[1.1] max-w-[680px]">
                    Kind words from people who have better things to do than caption DMs.
                </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
                {CARDS.map(card => (
                    <div key={card.name} className="rounded-xl border bg-card p-6 flex flex-col">
                        <Quote className="size-5 text-primary mb-4" />
                        <div className="text-[15px] leading-relaxed flex-1 text-balance">{card.quote}</div>
                        <div className="mt-5 pt-5 border-t">
                            <div className="font-semibold text-[14px]">{card.name}</div>
                            <div className="text-[12px] text-muted-foreground">{card.handle}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
