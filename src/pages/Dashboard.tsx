import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Instagram,
  Plus,
  Trash2,
  Pencil,
  MessageSquare,
  MessageCircle,
  Zap,
  AlertCircle,
  RefreshCw,
  Loader2,
} from 'lucide-react'
import { getAutomations, activateAutomation, deactivateAutomation, deleteAutomation } from '@/lib/automations'
import { getInstagramAccount, getInstagramAuthUrl, disconnectInstagramAccount } from '@/lib/instagram'
import type { Automation, InstagramAccount } from '@/types'
import { CreateAutomationDialog } from '@/components/CreateAutomationDialog'
import { EditAutomationDialog } from '@/components/EditAutomationDialog'

export default function Dashboard() {
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()

  const [instagramAccount, setInstagramAccount] = useState<InstagramAccount | null>(null)
  const [automations, setAutomations] = useState<Automation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null)
  const [connectLoading, setConnectLoading] = useState(false)

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || authLoading) return

    setLoading(true)
    setError(null)

    try {
      const [account, automationsList] = await Promise.all([
        getInstagramAccount(),
        getAutomations(),
      ])
      setInstagramAccount(account)
      setAutomations(automationsList)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, authLoading])

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    fetchData()
  }, [isAuthenticated, authLoading, navigate, fetchData])

  const handleToggleActive = async (automation: Automation) => {
    setActionLoading(automation.id)
    try {
      const updated = automation.is_active
        ? await deactivateAutomation(automation.id)
        : await activateAutomation(automation.id)

      setAutomations(prev =>
        prev.map(a => (a.id === automation.id ? updated : a))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update automation')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (automationId: string) => {
    if (!confirm('Are you sure you want to delete this automation?')) return

    setActionLoading(automationId)
    try {
      await deleteAutomation(automationId)
      setAutomations(prev => prev.filter(a => a.id !== automationId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete automation')
    } finally {
      setActionLoading(null)
    }
  }

  const handleAutomationCreated = (newAutomation: Automation) => {
    setAutomations(prev => [newAutomation, ...prev])
    setShowCreateDialog(false)
  }

  const handleEdit = (automation: Automation) => {
    setEditingAutomation(automation)
  }

  const handleAutomationUpdated = (updated: Automation) => {
    setAutomations(prev => prev.map(a => a.id === updated.id ? updated : a))
    setEditingAutomation(null)
  }

  const handleConnectInstagram = async () => {
    setConnectLoading(true)
    setError(null)
    try {
      const { auth_url } = await getInstagramAuthUrl()
      window.location.href = auth_url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start Instagram connection')
      setConnectLoading(false)
    }
  }

  const handleDisconnectInstagram = async () => {
    if (!confirm('Are you sure you want to disconnect your Instagram account? This will also remove all automations.')) return

    setConnectLoading(true)
    setError(null)
    try {
      await disconnectInstagramAccount()
      setInstagramAccount(null)
      setAutomations([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect Instagram account')
    } finally {
      setConnectLoading(false)
    }
  }

  if (authLoading || !isAuthenticated) {
    return null
  }

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your Instagram automations
          </p>
        </div>
        <Button onClick={() => fetchData()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Instagram Account Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Instagram className="h-5 w-5 text-pink-500" />
              <CardTitle className="text-lg">Instagram Account</CardTitle>
            </div>
            {!loading && (
              <Badge variant={instagramAccount ? 'default' : 'secondary'}>
                {instagramAccount ? 'Connected' : 'Not Connected'}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-10 w-full" />
          ) : instagramAccount ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">@{instagramAccount.username}</p>
                <p className="text-sm text-muted-foreground">
                  Connected since {new Date(instagramAccount.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnectInstagram}
                disabled={connectLoading}
              >
                {connectLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Disconnect'
                )}
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">
                Connect your Instagram account to start creating automations
              </p>
              <Button onClick={handleConnectInstagram} disabled={connectLoading}>
                {connectLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Instagram className="h-4 w-4 mr-2" />
                )}
                Connect Instagram
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Automations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Automations</h2>
          <Button
            onClick={() => setShowCreateDialog(true)}
            disabled={!instagramAccount}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Automation
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : automations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No automations yet</h3>
              <p className="text-muted-foreground mb-4">
                {instagramAccount
                  ? 'Create your first automation to start sending DMs automatically'
                  : 'Connect your Instagram account first to create automations'}
              </p>
              {instagramAccount && (
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Automation
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {automations.map(automation => (
              <Card key={automation.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-medium truncate">{automation.name}</h3>
                        <Badge
                          variant={automation.is_active ? 'default' : 'secondary'}
                        >
                          {automation.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline">
                          {automation.trigger_type === 'all_comments'
                            ? 'All Comments'
                            : 'Keyword'}
                        </Badge>
                        {automation.comment_reply_enabled && (
                          <Badge variant="outline" className="gap-1">
                            <MessageCircle className="h-3 w-3" />
                            Reply
                          </Badge>
                        )}
                      </div>

                      {automation.trigger_type === 'keyword' && automation.keywords && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {automation.keywords.map((keyword, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span className="truncate">{automation.dm_message_template}</span>
                      </div>

                      <p className="text-xs text-muted-foreground mt-2">
                        Post ID: {automation.post_id}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={automation.is_active}
                          onCheckedChange={() => handleToggleActive(automation)}
                          disabled={actionLoading === automation.id}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(automation)}
                        disabled={actionLoading === automation.id}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(automation.id)}
                        disabled={actionLoading === automation.id}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Automation Dialog */}
      {instagramAccount && (
        <CreateAutomationDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          instagramAccountId={instagramAccount.id}
          onSuccess={handleAutomationCreated}
        />
      )}

      {/* Edit Automation Dialog */}
      {editingAutomation && (
        <EditAutomationDialog
          open={!!editingAutomation}
          onOpenChange={(open) => !open && setEditingAutomation(null)}
          automation={editingAutomation}
          onSuccess={handleAutomationUpdated}
        />
      )}
    </div>
  )
}
