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
import { CarouselCardEditor } from '@/components/CarouselCardEditor'
import { CarouselPreview } from '@/components/CarouselPreview'
import type { Automation, TriggerType, MessageType, CarouselElement } from '@/types'

interface EditAutomationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  automation: Automation
  instagramUsername?: string
  onSuccess: (automation: Automation) => void
}

export function EditAutomationDialog({
  open,
  onOpenChange,
  automation,
  instagramUsername,
  onSuccess,
}: EditAutomationDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    trigger_type: 'all_comments' as TriggerType,
    message_type: 'text' as MessageType,
    dm_message_template: '',
    comment_reply_enabled: false,
    comment_reply_template: '',
  })
  const [keywords, setKeywords] = useState<string[]>([])
  const [keywordInput, setKeywordInput] = useState('')
  const [carouselElements, setCarouselElements] = useState<CarouselElement[]>([
    { title: '', subtitle: '', image_url: '', buttons: [{ type: 'web_url', url: '', title: '' }] },
  ])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  // Initialize form with automation data when dialog opens
  useEffect(() => {
    if (open && automation) {
      setFormData({
        name: automation.name,
        trigger_type: automation.trigger_type,
        message_type: automation.message_type || 'text',
        dm_message_template: automation.dm_message_template || '',
        comment_reply_enabled: automation.comment_reply_enabled,
        comment_reply_template: automation.comment_reply_template || '',
      })
      setKeywords(automation.keywords || [])
      setKeywordInput('')
      setCarouselElements(
        automation.carousel_elements && automation.carousel_elements.length > 0
          ? automation.carousel_elements
          : [{ title: '', subtitle: '', image_url: '', buttons: [{ type: 'web_url', url: '', title: '' }] }]
      )
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

    if (formData.message_type === 'text') {
      if (!formData.dm_message_template.trim()) {
        newErrors.dm_message_template = 'DM message is required'
      }
    } else {
      if (carouselElements.length === 0) {
        newErrors.carousel_elements = 'At least one card is required'
      }
      carouselElements.forEach((card, i) => {
        if (!card.title.trim()) {
          newErrors[`card_${i}_title`] = 'Title is required'
        }
        if (card.buttons.length === 0) {
          newErrors[`card_${i}_buttons`] = 'At least one button is required'
        }
        card.buttons.forEach((btn, bi) => {
          if (!btn.title.trim()) {
            newErrors[`card_${i}_btn_${bi}_title`] = 'Button title is required'
          }
          if (!btn.url.trim()) {
            newErrors[`card_${i}_btn_${bi}_url`] = 'Button URL is required'
          }
        })
      })
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
        message_type: formData.message_type,
        dm_message_template: formData.dm_message_template.trim(),
        carousel_elements: formData.message_type === 'carousel' ? carouselElements : undefined,
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
      <DialogContent className={`max-h-[85vh] overflow-hidden flex flex-col ${formData.message_type === 'carousel' ? 'sm:max-w-[1050px]' : 'sm:max-w-[600px]'}`}>
        <DialogHeader>
          <DialogTitle>Edit Automation</DialogTitle>
          <DialogDescription>
            Modify the settings for this automation.
          </DialogDescription>
        </DialogHeader>

        <div className={`flex-1 overflow-hidden ${formData.message_type === 'carousel' ? 'flex gap-6' : ''}`}>
          <form onSubmit={handleSubmit} className={`flex-1 overflow-y-auto space-y-4 ${formData.message_type === 'carousel' ? 'min-w-0' : ''}`}>
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
              <Label htmlFor="message_type">Message Type</Label>
              <Select
                value={formData.message_type}
                onValueChange={(value: MessageType) =>
                  setFormData(prev => ({ ...prev, message_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select message type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Message</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {formData.message_type === 'text'
                  ? 'Send a plain text DM to the commenter'
                  : 'Send a carousel of cards with images and buttons'}
              </p>
            </div>

            {formData.message_type === 'text' ? (
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
            ) : (
              <div className="space-y-2">
                <Label>Carousel Cards</Label>
                <CarouselCardEditor
                  cards={carouselElements}
                  onChange={setCarouselElements}
                  errors={errors}
                />
              </div>
            )}

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

          {/* Side-by-side preview panel for carousel mode */}
          {formData.message_type === 'carousel' && (
            <div className="hidden sm:flex w-[340px] flex-shrink-0 flex-col">
              <CarouselPreview
                message={formData.dm_message_template}
                cards={carouselElements}
                username={instagramUsername}
              />
            </div>
          )}
        </div>

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
