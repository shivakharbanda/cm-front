import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getInstagramAccount } from '@/lib/instagram'
import type { InstagramAccount } from '@/types'
import { AutomationFormPage } from '@/components/automation-form/AutomationFormPage'

export default function CreateAutomationPage() {
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [account, setAccount] = useState<InstagramAccount | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const acc = await getInstagramAccount()
        if (cancelled) return
        if (!acc) {
          toast.error('Connect your Instagram account first')
          navigate('/dashboard')
          return
        }
        setAccount(acc)
      } catch (err) {
        if (cancelled) return
        toast.error(err instanceof Error ? err.message : 'Failed to load Instagram account')
        navigate('/dashboard')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [authLoading, isAuthenticated, navigate])

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!account) return null

  return (
    <AutomationFormPage
      mode="create"
      instagramAccountId={account.id}
      instagramUsername={account.username}
    />
  )
}
