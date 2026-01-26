import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  ChevronLeft,
  Save,
  AlertCircle,
  Loader2,
  User,
  Link2,
  Search,
  Image,
  Share2,
  Plus,
  Trash2,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Globe,
  Music2,
} from 'lucide-react'
import { getBioPages, updateBioPage, getSocialLinks, createSocialLink, deleteSocialLink } from '@/lib/bio'
import type { BioPage, BioPageUpdate, SocialLink, SocialLinkInput, SocialPlatform } from '@/types/bio'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BioBottomNav } from '@/components/bio'

export default function BioSettingsPage() {
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()

  const [bioPage, setBioPage] = useState<BioPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Social links state
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [newPlatform, setNewPlatform] = useState<SocialPlatform | ''>('')
  const [newUrl, setNewUrl] = useState('')
  const [socialError, setSocialError] = useState<string | null>(null)
  const [addingSocial, setAddingSocial] = useState(false)

  const ALL_PLATFORMS: { value: SocialPlatform; label: string; icon: React.ElementType }[] = [
    { value: 'instagram', label: 'Instagram', icon: Instagram },
    { value: 'twitter', label: 'Twitter / X', icon: Twitter },
    { value: 'youtube', label: 'YouTube', icon: Youtube },
    { value: 'tiktok', label: 'TikTok', icon: Music2 },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { value: 'website', label: 'Website', icon: Globe },
  ]

  const getAvailablePlatforms = () => {
    const usedPlatforms = socialLinks.map(link => link.platform)
    return ALL_PLATFORMS.filter(p => !usedPlatforms.includes(p.value))
  }

  const getPlatformIcon = (platform: SocialPlatform) => {
    const found = ALL_PLATFORMS.find(p => p.value === platform)
    return found?.icon || Globe
  }

  const getPlatformLabel = (platform: SocialPlatform) => {
    const found = ALL_PLATFORMS.find(p => p.value === platform)
    return found?.label || platform
  }

  const [formData, setFormData] = useState({
    slug: '',
    display_name: '',
    bio_text: '',
    profile_image_url: '',
    seo_title: '',
    seo_description: '',
    og_image_url: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || authLoading) return

    setLoading(true)
    setError(null)

    try {
      const pages = await getBioPages()
      const page = pages[0]  // User can only have one

      if (!page) {
        navigate('/bio')
        return
      }

      setBioPage(page)
      setFormData({
        slug: page.slug,
        display_name: page.display_name || '',
        bio_text: page.bio_text || '',
        profile_image_url: page.profile_image_url || '',
        seo_title: page.seo_title || '',
        seo_description: page.seo_description || '',
        og_image_url: page.og_image_url || '',
      })

      // Fetch social links
      const links = await getSocialLinks(page.id)
      setSocialLinks(links)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, authLoading, navigate])

  const handleAddSocialLink = async () => {
    if (!bioPage || !newPlatform || !newUrl.trim()) return

    setAddingSocial(true)
    setSocialError(null)

    try {
      const link = await createSocialLink(bioPage.id, {
        platform: newPlatform,
        url: newUrl.trim(),
      })
      setSocialLinks(prev => [...prev, link])
      setNewPlatform('')
      setNewUrl('')
    } catch (err) {
      setSocialError(err instanceof Error ? err.message : 'Failed to add social link')
    } finally {
      setAddingSocial(false)
    }
  }

  const handleDeleteSocialLink = async (linkId: string) => {
    if (!bioPage || !confirm('Remove this social link?')) return

    try {
      await deleteSocialLink(bioPage.id, linkId)
      setSocialLinks(prev => prev.filter(link => link.id !== linkId))
    } catch (err) {
      setSocialError(err instanceof Error ? err.message : 'Failed to delete social link')
    }
  }

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    fetchData()
  }, [isAuthenticated, authLoading, navigate, fetchData])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    setSuccess(false)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.slug.trim()) {
      newErrors.slug = 'URL slug is required'
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.slug)) {
      newErrors.slug = 'Only letters, numbers, underscores, and hyphens allowed'
    }

    if (formData.profile_image_url) {
      try {
        new URL(formData.profile_image_url)
      } catch {
        newErrors.profile_image_url = 'Please enter a valid URL'
      }
    }

    if (formData.og_image_url) {
      try {
        new URL(formData.og_image_url)
      } catch {
        newErrors.og_image_url = 'Please enter a valid URL'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Helper to validate URL
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bioPage || !validateForm()) return

    setSaving(true)
    setError(null)
    setSocialError(null)
    setSuccess(false)

    try {
      // Build social links array from existing links
      const linksToSave: SocialLinkInput[] = socialLinks.map(link => ({
        id: link.id,
        platform: link.platform,
        url: link.url,
        is_active: link.is_active,
      }))

      // Validate and add pending new link if filled out
      if (newPlatform && newUrl.trim()) {
        const trimmedUrl = newUrl.trim()
        if (!isValidUrl(trimmedUrl)) {
          // Client-side validation - don't let invalid URL block bio save
          setSocialError('Invalid URL for social link. Please fix or clear it.')
          setSaving(false)
          return
        }
        linksToSave.push({
          platform: newPlatform,
          url: trimmedUrl,
          is_active: true,
        })
      }

      const data: BioPageUpdate = {
        slug: formData.slug.trim(),
        display_name: formData.display_name.trim() || null,
        bio_text: formData.bio_text.trim() || null,
        profile_image_url: formData.profile_image_url.trim() || null,
        seo_title: formData.seo_title.trim() || null,
        seo_description: formData.seo_description.trim() || null,
        og_image_url: formData.og_image_url.trim() || null,
        social_links: linksToSave,
      }

      const updated = await updateBioPage(bioPage.id, data)
      setBioPage(updated)

      // Refresh social links from server to get proper IDs
      const links = await getSocialLinks(bioPage.id)
      setSocialLinks(links)

      // Clear pending new link form
      setNewPlatform('')
      setNewUrl('')

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || !isAuthenticated) {
    return null
  }

  return (
    <div className="pb-20 lg:pb-6">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/bio">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Settings</h1>
          </div>

          <Button onClick={handleSubmit} disabled={saving || loading}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>Settings saved successfully!</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-[200px] rounded-xl" />
            <Skeleton className="h-[200px] rounded-xl" />
            <Skeleton className="h-[200px] rounded-xl" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Section */}
            <section className="p-4 bg-card border rounded-xl space-y-4">
              <h2 className="font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </h2>

              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={formData.profile_image_url || undefined} />
                  <AvatarFallback>
                    {formData.display_name?.charAt(0) || formData.slug.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="profile_image_url">Profile Image URL</Label>
                  <Input
                    id="profile_image_url"
                    name="profile_image_url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.profile_image_url}
                    onChange={handleInputChange}
                    className={errors.profile_image_url ? 'border-destructive' : ''}
                  />
                  {errors.profile_image_url && (
                    <p className="text-sm text-destructive">{errors.profile_image_url}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  name="display_name"
                  placeholder="Your Name"
                  value={formData.display_name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio_text">Bio</Label>
                <Textarea
                  id="bio_text"
                  name="bio_text"
                  placeholder="Tell visitors about yourself..."
                  value={formData.bio_text}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </section>

            {/* Social Links Section */}
            <section className="p-4 bg-card border rounded-xl space-y-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Social Links
              </h2>
              <p className="text-sm text-muted-foreground">
                Add your social media profiles to display on your bio page
              </p>

              {socialError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{socialError}</AlertDescription>
                </Alert>
              )}

              {/* Existing Social Links */}
              {socialLinks.length > 0 && (
                <div className="space-y-2">
                  {socialLinks.map((link) => {
                    const Icon = getPlatformIcon(link.platform)
                    return (
                      <div
                        key={link.id}
                        className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                      >
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{getPlatformLabel(link.platform)}</p>
                          <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteSocialLink(link.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Add New Social Link */}
              {getAvailablePlatforms().length > 0 && (
                <div className="space-y-3 pt-2 border-t">
                  <div className="grid grid-cols-[1fr_2fr] gap-2">
                    <Select
                      value={newPlatform}
                      onValueChange={(value) => setNewPlatform(value as SocialPlatform)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailablePlatforms().map((platform) => {
                          const Icon = platform.icon
                          return (
                            <SelectItem key={platform.value} value={platform.value}>
                              <span className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                {platform.label}
                              </span>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Profile URL (e.g., https://instagram.com/username)"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddSocialLink}
                    disabled={!newPlatform || !newUrl.trim() || addingSocial}
                    className="w-full"
                  >
                    {addingSocial ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Add Social Link
                  </Button>
                </div>
              )}

              {socialLinks.length === 0 && getAvailablePlatforms().length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  All platforms have been added
                </p>
              )}
            </section>

            {/* URL Section */}
            <section className="p-4 bg-card border rounded-xl space-y-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                Page URL
              </h2>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-muted border border-r-0 rounded-l-md text-sm text-muted-foreground">
                    {window.location.origin}/bio/
                  </span>
                  <Input
                    id="slug"
                    name="slug"
                    placeholder="yourname"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className={`rounded-l-none ${errors.slug ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.slug && (
                  <p className="text-sm text-destructive">{errors.slug}</p>
                )}
              </div>
            </section>

            {/* SEO Section */}
            <section className="p-4 bg-card border rounded-xl space-y-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Search className="h-4 w-4" />
                SEO Settings
              </h2>

              <div className="space-y-2">
                <Label htmlFor="seo_title">Page Title</Label>
                <Input
                  id="seo_title"
                  name="seo_title"
                  placeholder="My Bio Page"
                  value={formData.seo_title}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">
                  Displayed in browser tabs and search results
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo_description">Meta Description</Label>
                <Textarea
                  id="seo_description"
                  name="seo_description"
                  placeholder="A brief description of your page..."
                  value={formData.seo_description}
                  onChange={handleInputChange}
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">
                  Shown in search engine results (recommended: 150-160 characters)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="og_image_url" className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Social Share Image
                </Label>
                <Input
                  id="og_image_url"
                  name="og_image_url"
                  placeholder="https://example.com/social-image.jpg"
                  value={formData.og_image_url}
                  onChange={handleInputChange}
                  className={errors.og_image_url ? 'border-destructive' : ''}
                />
                {errors.og_image_url && (
                  <p className="text-sm text-destructive">{errors.og_image_url}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Image shown when sharing on social media (recommended: 1200x630px)
                </p>
              </div>
            </section>
          </form>
        )}
      </div>

      {/* Bottom Navigation (mobile only) */}
      <BioBottomNav />
    </div>
  )
}
