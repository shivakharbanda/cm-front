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
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Mail, Calendar, Trash2 } from 'lucide-react'
import { createBioCard, updateBioCard } from '@/lib/bio'
import type { BioCard, BioCardCreate } from '@/types/bio'

interface CardConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pageId: string
  card?: BioCard | null
  onSuccess: (card: BioCard) => void
  onDelete?: (cardId: string) => void
}

const COLOR_PRESETS = [
  '#B8963A', // Primary ochre
  '#7D9B76', // Sage
  '#C48B8B', // Dusty rose
  '#5B7C99', // Steel blue
  '#9B7CB8', // Lavender
  '#1A1B1E', // Dark
]

export function CardConfigDialog({
  open,
  onOpenChange,
  pageId,
  card,
  onSuccess,
  onDelete,
}: CardConfigDialogProps) {
  const isEditing = !!card

  const [formData, setFormData] = useState({
    badge_text: '',
    headline: '',
    description: '',
    background_color: '#B8963A',
    background_image_url: '',
    cta_text: 'Get Access',
    destination_url: '',
    success_message: 'Thanks! Check your email.',
    requires_email: true,
    enable_scheduling: false,
    visible_from: '',
    visible_until: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open && card) {
      setFormData({
        badge_text: card.badge_text || '',
        headline: card.headline,
        description: card.description || '',
        background_color: card.background_color,
        background_image_url: card.background_image_url || '',
        cta_text: card.cta_text,
        destination_url: card.destination_url,
        success_message: card.success_message || 'Thanks! Check your email.',
        requires_email: card.requires_email,
        enable_scheduling: !!(card.visible_from || card.visible_until),
        visible_from: card.visible_from ? card.visible_from.split('T')[0] : '',
        visible_until: card.visible_until ? card.visible_until.split('T')[0] : '',
      })
    } else if (open) {
      resetForm()
    }
  }, [open, card])

  const resetForm = () => {
    setFormData({
      badge_text: '',
      headline: '',
      description: '',
      background_color: '#B8963A',
      background_image_url: '',
      cta_text: 'Get Access',
      destination_url: '',
      success_message: 'Thanks! Check your email.',
      requires_email: true,
      enable_scheduling: false,
      visible_from: '',
      visible_until: '',
    })
    setErrors({})
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.headline.trim()) {
      newErrors.headline = 'Headline is required'
    }

    if (!formData.cta_text.trim()) {
      newErrors.cta_text = 'Button text is required'
    }

    if (!formData.destination_url.trim()) {
      newErrors.destination_url = 'Destination URL is required'
    } else {
      try {
        new URL(formData.destination_url)
      } catch {
        newErrors.destination_url = 'Please enter a valid URL'
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
      const data: BioCardCreate = {
        badge_text: formData.badge_text.trim() || null,
        headline: formData.headline.trim(),
        description: formData.description.trim() || null,
        background_color: formData.background_color,
        background_image_url: formData.background_image_url.trim() || null,
        cta_text: formData.cta_text.trim(),
        destination_url: formData.destination_url.trim(),
        success_message: formData.success_message.trim() || null,
        requires_email: formData.requires_email,
        visible_from:
          formData.enable_scheduling && formData.visible_from
            ? new Date(formData.visible_from).toISOString()
            : null,
        visible_until:
          formData.enable_scheduling && formData.visible_until
            ? new Date(formData.visible_until).toISOString()
            : null,
      }

      let savedCard: BioCard
      if (isEditing && card) {
        savedCard = await updateBioCard(pageId, card.id, data)
      } else {
        savedCard = await createBioCard(pageId, data)
      }

      onSuccess(savedCard)
      handleClose()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save card'
      setErrors({ general: message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCard = () => {
    if (!card || !onDelete) return
    if (confirm('Are you sure you want to delete this card?')) {
      onDelete(card.id)
      handleClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Card' : 'Add Lead Capture Card'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update your lead capture card details.'
              : 'Create a card to collect email leads.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 py-2">
          {errors.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* Preview */}
          <div
            className="rounded-lg p-4 text-white relative overflow-hidden"
            style={{ backgroundColor: formData.background_color }}
          >
            {formData.background_image_url && (
              <img
                src={formData.background_image_url}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
            )}
            <div className="relative z-10">
              {formData.badge_text && (
                <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded mb-2 inline-block">
                  {formData.badge_text}
                </span>
              )}
              <h3 className="font-bold text-lg">
                {formData.headline || 'Your Headline Here'}
              </h3>
              {formData.description && (
                <p className="text-sm opacity-90 mt-1">{formData.description}</p>
              )}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex-1 h-9 bg-white/20 rounded-md flex items-center px-3">
                  <Mail className="h-4 w-4 opacity-60" />
                  <span className="text-sm opacity-60 ml-2">your@email.com</span>
                </div>
                <Button size="sm" className="bg-white text-black hover:bg-white/90">
                  {formData.cta_text || 'Get Access'}
                </Button>
              </div>
            </div>
          </div>

          {/* Badge Text */}
          <div className="space-y-2">
            <Label htmlFor="badge_text">Badge Text (optional)</Label>
            <Input
              id="badge_text"
              name="badge_text"
              placeholder="FREE GUIDE"
              value={formData.badge_text}
              onChange={handleInputChange}
            />
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <Label htmlFor="headline">Headline</Label>
            <Input
              id="headline"
              name="headline"
              placeholder="Get my free productivity guide"
              value={formData.headline}
              onChange={handleInputChange}
              className={errors.headline ? 'border-destructive' : ''}
            />
            {errors.headline && (
              <p className="text-sm text-destructive">{errors.headline}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Short description of what they'll get..."
              value={formData.description}
              onChange={handleInputChange}
              rows={2}
            />
          </div>

          {/* Background Color */}
          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex gap-2">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    formData.background_color === color
                      ? 'border-foreground scale-110'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, background_color: color }))
                  }
                />
              ))}
              <Input
                type="color"
                value={formData.background_color}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, background_color: e.target.value }))
                }
                className="w-8 h-8 p-0 border-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Background Image */}
          <div className="space-y-2">
            <Label htmlFor="background_image_url">Background Image URL (optional)</Label>
            <Input
              id="background_image_url"
              name="background_image_url"
              placeholder="https://example.com/image.jpg"
              value={formData.background_image_url}
              onChange={handleInputChange}
            />
          </div>

          {/* CTA Text */}
          <div className="space-y-2">
            <Label htmlFor="cta_text">Button Text</Label>
            <Input
              id="cta_text"
              name="cta_text"
              placeholder="Get Access"
              value={formData.cta_text}
              onChange={handleInputChange}
              className={errors.cta_text ? 'border-destructive' : ''}
            />
            {errors.cta_text && (
              <p className="text-sm text-destructive">{errors.cta_text}</p>
            )}
          </div>

          {/* Destination URL */}
          <div className="space-y-2">
            <Label htmlFor="destination_url">Destination URL</Label>
            <Input
              id="destination_url"
              name="destination_url"
              placeholder="https://example.com/download"
              value={formData.destination_url}
              onChange={handleInputChange}
              className={errors.destination_url ? 'border-destructive' : ''}
            />
            {errors.destination_url && (
              <p className="text-sm text-destructive">{errors.destination_url}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Where to redirect users after they submit their email
            </p>
          </div>

          {/* Email Requirement */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="space-y-0.5">
              <Label>Require Email</Label>
              <p className="text-xs text-muted-foreground">
                Collect email before showing content
              </p>
            </div>
            <Switch
              checked={formData.requires_email}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, requires_email: checked }))
              }
            />
          </div>

          {/* Success Message */}
          {formData.requires_email && (
            <div className="space-y-2">
              <Label htmlFor="success_message">Success Message</Label>
              <Input
                id="success_message"
                name="success_message"
                placeholder="Thanks! Check your email."
                value={formData.success_message}
                onChange={handleInputChange}
              />
            </div>
          )}

          {/* Scheduling */}
          <div className="space-y-3 pt-2 border-t">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule Card
                </Label>
                <p className="text-xs text-muted-foreground">
                  Only show this card during specific dates
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

          {/* Delete Button for existing cards */}
          {isEditing && onDelete && (
            <div className="pt-2 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-destructive hover:text-destructive"
                onClick={handleDeleteCard}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Card
              </Button>
            </div>
          )}
        </form>

        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Card'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
