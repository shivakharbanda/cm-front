import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { verifyEmail } from '@/lib/auth'
import { useAuth } from '@/contexts/AuthContext'
import { AppLogo } from '@/components/app-logo'

type VerifyState = 'verifying' | 'success' | 'error'

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const { isAuthenticated, resendVerification, refreshUser } = useAuth()

    const [state, setState] = useState<VerifyState>(token ? 'verifying' : 'error')
    const [errorMessage, setErrorMessage] = useState('Invalid or missing verification link.')
    const [resendSent, setResendSent] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)

    useEffect(() => {
        if (!token) return

        verifyEmail(token)
            .then(() => {
                setState('success')
                refreshUser().catch(() => {})
            })
            .catch((err) => {
                setErrorMessage(
                    err instanceof Error ? err.message : 'Verification failed. The link may be expired or already used.'
                )
                setState('error')
            })
    }, [token])

    const handleResend = async () => {
        setResendLoading(true)
        try {
            await resendVerification()
            setResendSent(true)
        } catch {
            setErrorMessage('Could not send a new verification email. Please try again later.')
        } finally {
            setResendLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <AppLogo />
                    </div>
                    <CardTitle className="text-2xl font-semibold">Email verification</CardTitle>
                    <CardDescription>
                        {state === 'verifying' && 'Verifying your email address…'}
                        {state === 'success' && 'Your email has been verified.'}
                        {state === 'error' && 'Unable to verify your email.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {state === 'verifying' && (
                        <div className="flex items-center justify-center py-6 gap-3 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Verifying…</span>
                        </div>
                    )}

                    {state === 'success' && (
                        <>
                            <Alert className="border-green-200 bg-green-50 text-green-800">
                                <CheckCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Email verified successfully. You're all set.
                                </AlertDescription>
                            </Alert>
                            <Button asChild className="w-full">
                                <Link to="/dashboard">Continue to dashboard</Link>
                            </Button>
                        </>
                    )}

                    {state === 'error' && (
                        <>
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{errorMessage}</AlertDescription>
                            </Alert>

                            {isAuthenticated && !resendSent && (
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleResend}
                                    disabled={resendLoading}
                                >
                                    {resendLoading ? 'Sending…' : 'Resend verification email'}
                                </Button>
                            )}

                            {resendSent && (
                                <Alert className="border-green-200 bg-green-50 text-green-800">
                                    <CheckCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        A new verification email is on its way. Check your inbox.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {!isAuthenticated && (
                                <p className="text-sm text-center text-muted-foreground">
                                    <Link to="/login" className="text-primary hover:underline">
                                        Sign in
                                    </Link>{' '}
                                    to resend the verification email.
                                </p>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
