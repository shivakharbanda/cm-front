import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getAutomation } from '@/lib/automations'
import { getInstagramAccount } from '@/lib/instagram'
import type { Automation, InstagramAccount } from '@/types'
import { AutomationFormPage } from '@/components/automation-form/AutomationFormPage'
import { automationToInitial } from '@/components/automation-form/useAutomationForm'

export default function EditAutomationPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [account, setAccount] = useState<InstagramAccount | null>(null)
  const [automation, setAutomation] = useState<Automation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (!id) {
      navigate('/dashboard')
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const [acc, auto] = await Promise.all([getInstagramAccount(), getAutomation(id)])
        if (cancelled) return
        if (!acc) {
          toast.error('Connect your Instagram account first')
          navigate('/dashboard')
          return
        }
        setAccount(acc)
        setAutomation(auto)
      } catch (err) {
        if (cancelled) return
        toast.error(err instanceof Error ? err.message : 'Failed to load automation')
        navigate('/dashboard')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [authLoading, isAuthenticated, navigate, id])

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!account || !automation) return null

  return (
    <AutomationFormPage
      mode="edit"
      automationId={automation.id}
      instagramAccountId={account.id}
      instagramUsername={account.username}
      initial={automationToInitial(automation)}
      postLocked
    />
  )
}
