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
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { X, Plus, AlertCircle, ChevronLeft, Check, Image, Video, Layers } from 'lucide-react'
import { createAutomation } from '@/lib/automations'
import { getInstagramPosts } from '@/lib/instagram'
import { CarouselCardEditor } from '@/components/CarouselCardEditor'
import { CarouselPreview } from '@/components/CarouselPreview'
import type { Automation, TriggerType, MessageType, CarouselElement, InstagramPost } from '@/types'

interface CreateAutomationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  instagramAccountId: string
  instagramUsername?: string
  onSuccess: (automation: Automation) => void
}

type Step = 'select-post' | 'configure'

export function CreateAutomationDialog({
  open,
  onOpenChange,
  instagramAccountId,
  instagramUsername,
  onSuccess,
}: CreateAutomationDialogProps) {
  const [step, setStep] = useState<Step>('select-post')
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [postsError, setPostsError] = useState<string | null>(null)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null)

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

  // Fetch posts when dialog opens
  useEffect(() => {
    if (open && posts.length === 0) {
      fetchPosts()
    }
  }, [open])

  const fetchPosts = async (cursor?: string) => {
    setLoadingPosts(true)
    setPostsError(null)
    try {
      const response = await getInstagramPosts(cursor)
      if (cursor) {
        setPosts(prev => [...prev, ...response.posts])
      } else {
        setPosts(response.posts)
      }
      setNextCursor(response.next_cursor)
    } catch (err) {
      setPostsError(err instanceof Error ? err.message : 'Failed to load posts')
    } finally {
      setLoadingPosts(false)
    }
  }

  const resetForm = () => {
    setStep('select-post')
    setSelectedPost(null)
    setFormData({
      name: '',
      trigger_type: 'all_comments',
      message_type: 'text',
      dm_message_template: '',
      comment_reply_enabled: false,
      comment_reply_template: '',
    })
    setKeywords([])
    setKeywordInput('')
    setCarouselElements([
      { title: '', subtitle: '', image_url: '', buttons: [{ type: 'web_url', url: '', title: '' }] },
    ])
    setErrors({})
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  const handleSelectPost = (post: InstagramPost) => {
    setSelectedPost(post)
    // Auto-generate a name based on post caption
    const autoName = post.caption
      ? post.caption.substring(0, 30) + (post.caption.length > 30 ? '...' : '')
      : `Automation for ${post.id}`
    setFormData(prev => ({ ...prev, name: autoName }))
    setStep('configure')
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
      // Carousel validation
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

    if (!validateForm() || !selectedPost) return

    setIsLoading(true)
    setErrors({})

    try {
      const automation = await createAutomation({
        instagram_account_id: instagramAccountId,
        name: formData.name.trim(),
        post_id: selectedPost.id,
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

      onSuccess(automation)
      resetForm()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create automation'
      setErrors({ general: message })
    } finally {
      setIsLoading(false)
    }
  }

  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return <Video className="h-4 w-4" />
      case 'CAROUSEL_ALBUM':
        return <Layers className="h-4 w-4" />
      default:
        return <Image className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={`max-h-[85vh] overflow-hidden flex flex-col ${step === 'configure' && formData.message_type === 'carousel' ? 'sm:max-w-[1050px]' : 'sm:max-w-[600px]'}`}>
        <DialogHeader>
          <DialogTitle>
            {step === 'select-post' ? 'Select a Post' : 'Configure Automation'}
          </DialogTitle>
          <DialogDescription>
            {step === 'select-post'
              ? 'Choose which Instagram post to automate DM responses for.'
              : 'Set up automatic DM responses for comments on this post.'}
          </DialogDescription>
        </DialogHeader>

        {step === 'select-post' ? (
          <div className="flex-1 overflow-y-auto">
            {postsError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{postsError}</AlertDescription>
              </Alert>
            )}

            {loadingPosts && posts.length === 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map(i => (
                  <Skeleton key={i} className="aspect-square rounded-lg" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No posts found. Make sure your Instagram account has posts.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {posts.map(post => (
                    <button
                      key={post.id}
                      onClick={() => handleSelectPost(post)}
                      className="relative group rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors focus:outline-none focus:border-primary"
                    >
                      <div className="aspect-square bg-muted">
                        {post.thumbnail_url || post.media_url ? (
                          <img
                            src={post.thumbnail_url || post.media_url}
                            alt={post.caption || 'Instagram post'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {getMediaTypeIcon(post.media_type)}
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                        <div className="flex items-center gap-1 text-white text-xs mb-1">
                          {getMediaTypeIcon(post.media_type)}
                          <span>{post.media_type}</span>
                        </div>
                        {post.caption && (
                          <p className="text-white text-xs line-clamp-2">
                            {post.caption}
                          </p>
                        )}
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="h-3 w-3" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {nextCursor && (
                  <div className="mt-4 text-center">
                    <Button
                      variant="outline"
                      onClick={() => fetchPosts(nextCursor)}
                      disabled={loadingPosts}
                    >
                      {loadingPosts ? 'Loading...' : 'Load More'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className={`flex-1 overflow-hidden ${formData.message_type === 'carousel' ? 'flex gap-6' : ''}`}>
            <form onSubmit={handleSubmit} className={`flex-1 overflow-y-auto space-y-4 ${formData.message_type === 'carousel' ? 'min-w-0' : ''}`}>
              {errors.general && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              {/* Selected Post Preview */}
              {selectedPost && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                    {selectedPost.thumbnail_url || selectedPost.media_url ? (
                      <img
                        src={selectedPost.thumbnail_url || selectedPost.media_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted-foreground/20 flex items-center justify-center">
                        {getMediaTypeIcon(selectedPost.media_type)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {selectedPost.caption || 'No caption'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(selectedPost.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep('select-post')}
                  >
                    Change
                  </Button>
                </div>
              )}

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
        )}

        <DialogFooter className="mt-4">
          {step === 'configure' && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep('select-post')}
              className="mr-auto"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {step === 'configure' && (
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Automation'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
