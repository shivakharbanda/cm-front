import { useState } from 'react'
import { Outlet } from 'react-router'
import { AppHeader } from './app-header'
import { AppFooter } from './app-footer'
import { BottomNav } from './app-bottomnav'
import { InstallPrompt } from './InstallPrompt'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/AuthContext'

function UnverifiedEmailBanner() {
    const { user, resendVerification } = useAuth()
    const [dismissed, setDismissed] = useState(false)
    const [resendSent, setResendSent] = useState(false)

    if (!user || user.email_verified_at || dismissed) return null

    const handleResend = async () => {
        try {
            await resendVerification()
            setResendSent(true)
        } catch {
            // silent — user can try again
        }
    }

    return (
        <Alert className="mb-4 rounded-none border-x-0 border-t-0 border-yellow-300 bg-yellow-50 text-yellow-900">
            <AlertDescription className="flex items-center justify-between gap-2 flex-wrap">
                <span>
                    {resendSent
                        ? 'Verification email sent — check your inbox.'
                        : <>
                            Verify your email to keep your account secure.{' '}
                            <button
                                onClick={handleResend}
                                className="underline font-medium hover:no-underline"
                            >
                                Resend link
                            </button>
                          </>
                    }
                </span>
                <button
                    onClick={() => setDismissed(true)}
                    className="text-yellow-700 hover:text-yellow-900 leading-none"
                    aria-label="Dismiss"
                >
                    ✕
                </button>
            </AlertDescription>
        </Alert>
    )
}

export function AppLayout() {
    return (
        <div className="min-h-screen flex flex-col w-full ~bg-muted/50">
            <AppHeader />
            <UnverifiedEmailBanner />
            <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-grow flex-col">
                <div className='flex flex-grow flex-col'>
                    <Outlet />
                </div>
                <AppFooter />
            </div>
            <BottomNav />
            <InstallPrompt />
        </div>
    )
}
