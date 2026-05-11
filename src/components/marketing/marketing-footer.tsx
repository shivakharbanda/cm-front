import { Instagram } from 'lucide-react'
import { Link } from 'react-router-dom'


const COMPANY_LINKS: Array<[string, string]> = [
    ['About', '/about'],
    ['Blog', '/blog'],
    ['Careers', '/careers'],
    ['Contact', '/contact'],
]

const LEGAL_LINKS: Array<[string, string]> = [
    ['Privacy', '/privacy'],
    ['Terms', '/terms'],
    ['DPA', '/dpa'],
    ['Cookies', '/cookies'],
]

export function MarketingFooter() {
    return (
        <footer className="border-t bg-card/40">
            <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8 py-14 grid md:grid-cols-[1.5fr_3fr] gap-10">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Instagram className="size-[22px] text-primary" />
                        <span className="font-semibold text-[15px] tracking-tight">CreatorModo</span>
                    </div>
                    <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[280px]">
                        Quiet tools for loud inboxes. Made for creators who'd rather make things.
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                    {/* Company */}
                    <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-3">
                            Company
                        </div>
                        <ul className="space-y-2">
                            {COMPANY_LINKS.map(([label, to]) => (
                                <li key={label}>
                                    <Link to={to} className="text-[13px] text-foreground/80 hover:text-foreground transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-3">
                            Legal
                        </div>
                        <ul className="space-y-2">
                            {LEGAL_LINKS.map(([label, to]) => (
                                <li key={label}>
                                    <Link to={to} className="text-[13px] text-foreground/80 hover:text-foreground transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="border-t">
                <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8 py-5 flex flex-wrap gap-3 items-center justify-between text-[12px] text-muted-foreground">
                    <div>© 2026 CreatorModo. All rights reserved.</div>
                    <div className="flex gap-4">
                        <a className="hover:text-foreground cursor-pointer transition-colors">Twitter</a>
                        <a className="hover:text-foreground cursor-pointer transition-colors">Instagram</a>
                        <a className="hover:text-foreground cursor-pointer transition-colors">GitHub</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
