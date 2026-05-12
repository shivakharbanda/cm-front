import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock } from 'lucide-react'
import { confirmPasswordReset } from '@/lib/auth'
import { AppLogo } from '@/components/app-logo'

export default function ResetPasswordForm() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')

    const [formData, setFormData] = useState({ password: '', confirmPassword: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <Alert variant="destructive">
                            <AlertDescription>
                                Invalid reset link. Please{' '}
                                <Link to="/forgot-password" className="underline font-medium">
                                    request a new one
                                </Link>
                                .
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
        if (errors.general) setErrors(prev => ({ ...prev, general: '' }))
    }

    const validate = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters'
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password'
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        setIsLoading(true)
        try {
            await confirmPasswordReset(token, formData.password)
            navigate('/login', { state: { message: 'Password updated. You can now log in with your new password.' } })
        } catch (err) {
            setErrors({
                general: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const isExpiredError = errors.general?.toLowerCase().includes('invalid') ||
        errors.general?.toLowerCase().includes('expired') ||
        errors.general?.toLowerCase().includes('already used')

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <AppLogo />
                    </div>
                    <CardTitle className="text-2xl font-semibold">Set new password</CardTitle>
                    <CardDescription>
                        Choose a strong password for your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {errors.general && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {errors.general}
                                    {isExpiredError && (
                                        <>
                                            {' '}
                                            <Link to="/forgot-password" className="underline font-medium">
                                                Request a new link
                                            </Link>
                                            .
                                        </>
                                    )}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="password">New password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="At least 8 characters"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-destructive">{errors.password}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm new password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirm ? 'text' : 'password'}
                                    placeholder="Repeat your new password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                >
                                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Resetting password…' : 'Reset password'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
