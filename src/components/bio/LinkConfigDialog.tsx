import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ExternalLink, Calendar, BarChart3, Trash2 } from 'lucide-react'
import { SmartRoutingSection } from './SmartRoutingSection'
import {
  createBioLink,
  updateBioLink,
  getRoutingRules,
  createRoutingRule,
  updateRoutingRule,
  deleteRoutingRule,
} from '@/lib/bio'
import type { BioLink, BioLinkCreate, RoutingRule, RoutingRuleCreate } from '@/types/bio'

interface LinkConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pageId: string
  link?: BioLink | null
  onSuccess: (link: BioLink) => void
  onDelete?: (linkId: string) => void
}

export function LinkConfigDialog({
  open,
  onOpenChange,
  pageId,
  link,
  onSuccess,
  onDelete,
}: LinkConfigDialogProps) {
  const isEditing = !!link

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    thumbnail_url: '',
    enable_scheduling: false,
    visible_from: '',
    visible_until: '',
  })
  const [routingRules, setRoutingRules] = useState<RoutingRule[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [loadingRules, setLoadingRules] = useState(false)

  useEffect(() => {
    if (open && link) {
      setFormData({
        title: link.title,
        url: link.url,
        thumbnail_url: link.thumbnail_url || '',
        enable_scheduling: !!(link.visible_from || link.visible_until),
        visible_from: link.visible_from ? link.visible_from.split('T')[0] : '',
        visible_until: link.visible_until ? link.visible_until.split('T')[0] : '',
      })
      fetchRoutingRules()
    } else if (open) {
      resetForm()
    }
  }, [open, link])

  const fetchRoutingRules = async () => {
    if (!link) return
    setLoadingRules(true)
    try {
      const rules = await getRoutingRules(link.id)
      setRoutingRules(rules)
    } catch (err) {
      console.error('Failed to fetch routing rules:', err)
    } finally {
      setLoadingRules(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      url: '',
      thumbnail_url: '',
      enable_scheduling: false,
      visible_from: '',
      visible_until: '',
    })
    setRoutingRules([])
    setErrors({})
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required'
    } else {
      try {
        new URL(formData.url)
      } catch {
        newErrors.url = 'Please enter a valid URL'
      }
    }

    if (formData.enable_scheduling) {
      if (formData.visible_from && formData.visible_until) {
        if (new Date(formData.visible_from) >= new Date(formData.visible_until)) {
          newErrors.visible_until = 'End date must be after start date'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const data: BioLinkCreate = {
        title: formData.title.trim(),
        url: formData.url.trim(),
        thumbnail_url: formData.thumbnail_url.trim() || null,
        link_type: routingRules.length > 0 ? 'smart' : 'standard',
        visible_from: formData.enable_scheduling && formData.visible_from
          ? new Date(formData.visible_from).toISOString()
          : null,
        visible_until: formData.enable_scheduling && formData.visible_until
          ? new Date(formData.visible_until).toISOString()
          : null,
      }

      let savedLink: BioLink
      if (isEditing && link) {
        savedLink = await updateBioLink(pageId, link.id, data)
      } else {
        savedLink = await createBioLink(pageId, data)
      }

      onSuccess(savedLink)
      handleClose()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save link'
      setErrors({ general: message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddRoutingRule = async (ruleData: RoutingRuleCreate) => {
    if (!link) return
    try {
      const newRule = await createRoutingRule(link.id, ruleData)
      setRoutingRules((prev) => [...prev, newRule])
    } catch (err) {
      console.error('Failed to add routing rule:', err)
    }
  }

  const handleUpdateRoutingRule = async (ruleId: string, active: boolean) => {
    if (!link) return
    try {
      await updateRoutingRule(link.id, ruleId, { is_active: active })
      setRoutingRules((prev) =>
        prev.map((r) => (r.id === ruleId ? { ...r, is_active: active } : r))
      )
    } catch (err) {
      console.error('Failed to update routing rule:', err)
    }
  }

  const handleDeleteRoutingRule = async (ruleId: string) => {
    if (!link) return
    try {
      await deleteRoutingRule(link.id, ruleId)
      setRoutingRules((prev) => prev.filter((r) => r.id !== ruleId))
    } catch (err) {
      console.error('Failed to delete routing rule:', err)
    }
  }

  const handleDeleteLink = () => {
    if (!link || !onDelete) return
    if (confirm('Are you sure you want to delete this link?')) {
      onDelete(link.id)
      handleClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Link' : 'Add New Link'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update your link details and settings.'
              : 'Add a new link to your bio page.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 py-2">
          {errors.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* Icon Preview */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
              {formData.thumbnail_url ? (
                <img
                  src={formData.thumbnail_url}
                  alt=""
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <ExternalLink className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Basic Settings */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="My Website"
              value={formData.title}
              onChange={handleInputChange}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              name="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={handleInputChange}
              className={errors.url ? 'border-destructive' : ''}
            />
            {errors.url && (
              <p className="text-sm text-destructive">{errors.url}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail_url">Thumbnail URL (optional)</Label>
            <Input
              id="thumbnail_url"
              name="thumbnail_url"
              placeholder="https://example.com/image.jpg"
              value={formData.thumbnail_url}
              onChange={handleInputChange}
            />
          </div>

          {/* Scheduling */}
          <div className="space-y-3 pt-2 border-t">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule Link
                </Label>
                <p className="text-xs text-muted-foreground">
                  Only show this link during specific dates
                </p>
              </div>
              <Switch
                checked={formData.enable_scheduling}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, enable_scheduling: checked }))
                }
              />
            </div>

            {formData.enable_scheduling && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="visible_from">Start Date</Label>
                  <Input
                    id="visible_from"
                    name="visible_from"
                    type="date"
                    value={formData.visible_from}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visible_until">End Date</Label>
                  <Input
                    id="visible_until"
                    name="visible_until"
                    type="date"
                    value={formData.visible_until}
                    onChange={handleInputChange}
                    className={errors.visible_until ? 'border-destructive' : ''}
                  />
                  {errors.visible_until && (
                    <p className="text-sm text-destructive">{errors.visible_until}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Smart Routing (only for existing links) */}
          {isEditing && (
            <div className="pt-2 border-t">
              {loadingRules ? (
                <p className="text-sm text-muted-foreground">Loading routing rules...</p>
              ) : (
                <SmartRoutingSection
                  rules={routingRules}
                  onAddRule={handleAddRoutingRule}
                  onUpdateRule={handleUpdateRoutingRule}
                  onDeleteRule={handleDeleteRoutingRule}
                />
              )}
            </div>
          )}

          {/* Actions for existing links */}
          {isEditing && (
            <div className="flex gap-2 pt-2 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => window.open(`/bio/analytics?link=${link?.id}`, '_blank')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Performance
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={handleDeleteLink}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </form>

        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Link'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
