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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { X, Plus, AlertCircle } from 'lucide-react'
import { updateAutomation } from '@/lib/automations'
import type { Automation, TriggerType } from '@/types'

interface EditAutomationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  automation: Automation
  onSuccess: (automation: Automation) => void
}

export function EditAutomationDialog({
  open,
  onOpenChange,
  automation,
  onSuccess,
}: EditAutomationDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    trigger_type: 'all_comments' as TriggerType,
    dm_message_template: '',
    comment_reply_enabled: false,
    comment_reply_template: '',
  })
  const [keywords, setKeywords] = useState<string[]>([])
  const [keywordInput, setKeywordInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  // Initialize form with automation data when dialog opens
  useEffect(() => {
    if (open && automation) {
      setFormData({
        name: automation.name,
        trigger_type: automation.trigger_type,
        dm_message_template: automation.dm_message_template,
        comment_reply_enabled: automation.comment_reply_enabled,
        comment_reply_template: automation.comment_reply_template || '',
      })
      setKeywords(automation.keywords || [])
      setKeywordInput('')
      setErrors({})
    }
  }, [open, automation])

  const handleClose = () => {
    setErrors({})
    onOpenChange(false)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim().toLowerCase()
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords(prev => [...prev, trimmed])
      setKeywordInput('')
      if (errors.keywords) {
        setErrors(prev => ({ ...prev, keywords: '' }))
      }
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(prev => prev.filter(k => k !== keyword))
  }

  const handleKeywordInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddKeyword()
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.dm_message_template.trim()) {
      newErrors.dm_message_template = 'DM message is required'
    }

    if (formData.trigger_type === 'keyword' && keywords.length === 0) {
      newErrors.keywords = 'At least one keyword is required'
    }

    if (formData.comment_reply_enabled && !formData.comment_reply_template.trim()) {
      newErrors.comment_reply_template = 'Comment reply message is required when enabled'
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
      const updated = await updateAutomation(automation.id, {
        name: formData.name.trim(),
        trigger_type: formData.trigger_type,
        keywords: formData.trigger_type === 'keyword' ? keywords : undefined,
        dm_message_template: formData.dm_message_template.trim(),
        comment_reply_enabled: formData.comment_reply_enabled,
        comment_reply_template: formData.comment_reply_enabled
          ? formData.comment_reply_template.trim()
          : null,
      })

      onSuccess(updated)
      handleClose()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update automation'
      setErrors({ general: message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Automation</DialogTitle>
          <DialogDescription>
            Modify the settings for this automation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4">
          {errors.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* Post Info (read-only) */}
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Post ID: <span className="font-mono">{automation.post_id}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Post cannot be changed after creation
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Automation Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Product Launch DM"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="trigger_type">Trigger Type</Label>
            <Select
              value={formData.trigger_type}
              onValueChange={(value: TriggerType) =>
                setFormData(prev => ({ ...prev, trigger_type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select trigger type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_comments">All Comments</SelectItem>
                <SelectItem value="keyword">Keyword Match</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {formData.trigger_type === 'all_comments'
                ? 'Send DM to everyone who comments on this post'
                : 'Send DM only when comment contains specific keywords'}
            </p>
          </div>

          {formData.trigger_type === 'keyword' && (
            <div className="space-y-2">
              <Label>Keywords</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a keyword"
                  value={keywordInput}
                  onChange={e => setKeywordInput(e.target.value)}
                  onKeyDown={handleKeywordInputKeyDown}
                  className={errors.keywords ? 'border-destructive' : ''}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddKeyword}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {keywords.map(keyword => (
                    <Badge key={keyword} variant="secondary" className="gap-1">
                      {keyword}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(keyword)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              {errors.keywords && (
                <p className="text-sm text-destructive">{errors.keywords}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="dm_message_template">DM Message</Label>
            <Textarea
              id="dm_message_template"
              name="dm_message_template"
              placeholder="Enter the message to send..."
              value={formData.dm_message_template}
              onChange={handleInputChange}
              rows={4}
              className={errors.dm_message_template ? 'border-destructive' : ''}
            />
            {errors.dm_message_template && (
              <p className="text-sm text-destructive">{errors.dm_message_template}</p>
            )}
          </div>

          {/* Comment Reply Section */}
          <div className="space-y-3 pt-2 border-t">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="comment_reply_enabled">Reply to comment publicly</Label>
                <p className="text-xs text-muted-foreground">
                  Also post a public reply to the comment
                </p>
              </div>
              <Switch
                id="comment_reply_enabled"
                checked={formData.comment_reply_enabled}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, comment_reply_enabled: checked }))
                }
              />
            </div>

            {formData.comment_reply_enabled && (
              <div className="space-y-2">
                <Label htmlFor="comment_reply_template">Comment Reply Message</Label>
                <Textarea
                  id="comment_reply_template"
                  name="comment_reply_template"
                  placeholder="Enter the public reply message..."
                  value={formData.comment_reply_template}
                  onChange={handleInputChange}
                  rows={3}
                  className={errors.comment_reply_template ? 'border-destructive' : ''}
                />
                {errors.comment_reply_template && (
                  <p className="text-sm text-destructive">{errors.comment_reply_template}</p>
                )}
              </div>
            )}
          </div>
        </form>

        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
