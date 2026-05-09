import { Link } from 'react-router-dom'
import { ModeToggle } from './mode-toggle'

export function AppFooter() {
    return (
        <footer className="flex flex-col items-center justify-between gap-4 min-h-[3rem] md:h-20 py-2 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                © {new Date().getFullYear()} <span className="font-semibold">Hibra</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Privacy
                </Link>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Terms
                </Link>
                <div className="hidden md:block">
                    <ModeToggle />
                </div>
            </div>
        </footer>
    )
}
