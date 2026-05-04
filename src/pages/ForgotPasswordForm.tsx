import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Instagram, CheckCircle } from 'lucide-react'
import { requestPasswordReset } from '@/lib/auth'
import { appConfig } from '@/config/app'

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const validate = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email.trim()) {
            setEmailError('Email is required')
            return false
        }
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address')
            return false
        }
        setEmailError('')
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        setIsLoading(true)
        try {
            await requestPasswordReset(email)
        } catch {
            // Intentionally swallow — never reveal whether the email exists
        } finally {
            setIsLoading(false)
            setSubmitted(true)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <div className="flex items-center space-x-2">
                            <Instagram className="h-8 w-8 text-primary" />
                            <span className="text-2xl font-bold text-primary">{appConfig.name}</span>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-semibold">Reset your password</CardTitle>
                    <CardDescription>
                        Enter your email and we'll send you a reset link
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {submitted ? (
                        <div className="space-y-4">
                            <Alert className="border-green-200 bg-green-50 text-green-800">
                                <CheckCircle className="h-4 w-4" />
                                <AlertDescription>
                                    If an account with that email exists, a reset link is on its way.
                                    Check your inbox (and spam folder).
                                </AlertDescription>
                            </Alert>
                            <div className="text-center text-sm">
                                <Link to="/login" className="text-primary hover:underline">
                                    Back to sign in
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                            if (emailError) setEmailError('')
                                        }}
                                        className={`pl-10 ${emailError ? 'border-destructive' : ''}`}
                                        autoComplete="email"
                                    />
                                </div>
                                {emailError && (
                                    <p className="text-sm text-destructive">{emailError}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Sending reset link…' : 'Send reset link'}
                            </Button>

                            <div className="text-center text-sm">
                                <Link to="/login" className="text-primary hover:underline">
                                    Back to sign in
                                </Link>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
