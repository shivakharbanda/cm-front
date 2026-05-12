import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { ModeToggle } from '@/components/mode-toggle'
import { AppLogo } from '@/components/app-logo'

type NavProps = {
    onScrollTo: (id: string) => void
}

const LINKS: Array<{ label: string; anchor?: string }> = [
    { label: 'Product', anchor: 'features' },
    { label: 'Pricing', anchor: 'pricing' },
    { label: 'Docs' },
    { label: 'Changelog' },
]

export function MarketingNav({ onScrollTo }: NavProps) {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()

    return (
        <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b">
            <div className="w-full max-w-[1200px] mx-auto flex items-center gap-2 h-14 px-6 md:px-8">
                <Link to="/">
                    <AppLogo textClassName="hidden sm:block" />
                </Link>
                <nav className="hidden md:flex gap-1 ml-8">
                    {LINKS.map(({ label, anchor }) => (
                        <button
                            key={label}
                            type="button"
                            onClick={anchor ? () => onScrollTo(anchor) : undefined}
                            className="h-8 px-3 flex items-center rounded-md text-sm font-medium text-foreground/70 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
                        >
                            {label}
                        </button>
                    ))}
                </nav>
                <div className="flex-1" />
                <div className="hidden sm:block">
                    <ModeToggle />
                </div>
                {isAuthenticated ? (
                    <Button size="sm" onClick={() => navigate('/dashboard')}>
                        Open dashboard
                        <ArrowRight className="size-3.5" />
                    </Button>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="flex h-8 px-3 items-center rounded-md text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                        >
                            Sign in
                        </Link>
                        <Button size="sm" onClick={() => navigate('/register')}>
                            Get started
                            <ArrowRight className="hidden sm:block size-3.5" />
                        </Button>
                    </>
                )}
            </div>
        </header>
    )
}
