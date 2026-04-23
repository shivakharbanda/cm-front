import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'

const ITEMS: Array<[question: string, answer: string]> = [
    [
        "Is this compliant with Instagram's rules?",
        'Yes. We use the official Instagram Graph API and respect their rate limits. We only DM users who comment on your posts, which is permitted.',
    ],
    [
        'Do I need a Business or Creator account?',
        "A Creator or Business Instagram account linked to a Facebook page. We'll walk you through the connection.",
    ],
    [
        'Can I cancel any time?',
        'Yes. One button, no email-a-human. Your data exports as CSV on the way out.',
    ],
    [
        'Does the bio page work on my own domain?',
        'On Creator and Studio, yes. Set a CNAME and we handle the SSL.',
    ],
    [
        'What happens to automations if I disconnect Instagram?',
        'They pause. Reconnect and they resume exactly where they were.',
    ],
]

export function FAQ() {
    const [openIndex, setOpenIndex] = useState(0)

    return (
        <section className="bg-card/60 border-y">
            <div className="w-full max-w-[800px] mx-auto px-6 md:px-8 py-20 md:py-28">
                <div className="mb-10 text-center">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary mb-3">
                        Questions, answered
                    </div>
                    <h2 className="text-[32px] md:text-[42px] font-bold tracking-[-0.02em] leading-[1.1]">FAQ</h2>
                </div>
                <div className="border-t">
                    {ITEMS.map(([question, answer], i) => {
                        const isOpen = openIndex === i
                        return (
                            <div key={question} className="border-b">
                                <button
                                    type="button"
                                    aria-expanded={isOpen}
                                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                                    className="w-full py-5 flex items-center gap-4 text-left group"
                                >
                                    <span className="flex-1 font-semibold text-[16px]">{question}</span>
                                    {isOpen ? (
                                        <Minus className="size-[18px] text-muted-foreground group-hover:text-foreground transition-colors" />
                                    ) : (
                                        <Plus className="size-[18px] text-muted-foreground group-hover:text-foreground transition-colors" />
                                    )}
                                </button>
                                {isOpen && (
                                    <div className="pb-5 text-[15px] text-muted-foreground leading-relaxed max-w-[640px]">
                                        {answer}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
