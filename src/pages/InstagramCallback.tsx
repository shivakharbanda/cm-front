import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { handleInstagramCallback } from '@/lib/instagram'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle, CheckCircle, Instagram } from 'lucide-react'

type CallbackStatus = 'loading' | 'success' | 'error'

export default function InstagramCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [status, setStatus] = useState<CallbackStatus>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return

    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    const code = searchParams.get('code')
    const errorParam = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    if (errorParam) {
      setStatus('error')
      setError(errorDescription || errorParam || 'Authorization was denied')
      return
    }

    if (!code) {
      setStatus('error')
      setError('No authorization code received from Instagram')
      return
    }

    const exchangeCode = async () => {
      try {
        await handleInstagramCallback(code)
        setStatus('success')
        setTimeout(() => {
          navigate('/')
        }, 1500)
      } catch (err) {
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Failed to connect Instagram account')
      }
    }

    exchangeCode()
  }, [authLoading, isAuthenticated, navigate, searchParams])

  if (authLoading) {
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Instagram className="h-12 w-12 text-pink-500" />
          </div>
          <CardTitle>
            {status === 'loading' && 'Connecting Instagram...'}
            {status === 'success' && 'Connected Successfully'}
            {status === 'error' && 'Connection Failed'}
          </CardTitle>
          <CardDescription>
            {status === 'loading' && 'Please wait while we complete the authorization'}
            {status === 'success' && 'Your Instagram account has been linked'}
            {status === 'error' && 'We could not connect your Instagram account'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'loading' && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {status === 'success' && (
            <div className="flex justify-center py-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
          )}

          {status === 'error' && (
            <>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <div className="flex flex-col gap-2">
                <Button onClick={() => navigate('/')} variant="outline">
                  Back to Dashboard
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
