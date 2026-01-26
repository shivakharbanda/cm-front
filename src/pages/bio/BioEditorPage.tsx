import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  Plus,
  Share2,
  Eye,
  AlertCircle,
  Loader2,
  Link2,
  Mail,
  ExternalLink,
  Settings,
} from 'lucide-react'
import {
  getBioPages,
  createBioPage,
  getPageItems,
  reorderPageItems,
  updateBioLink,
  updateBioCard,
  deleteBioLink,
  deleteBioCard,
  publishBioPage,
  unpublishBioPage,
} from '@/lib/bio'
import type { BioPage, PageItem, BioLink, BioCard, ReorderItem } from '@/types/bio'
import {
  BioLinkCard,
  BioLeadCard,
  LinkConfigDialog,
  CardConfigDialog,
  BioPreview,
  BioBottomNav,
} from '@/components/bio'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function BioEditorPage() {
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()

  const [bioPage, setBioPage] = useState<BioPage | null>(null)
  const [items, setItems] = useState<PageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Dialog states
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [showCardDialog, setShowCardDialog] = useState(false)
  const [editingLink, setEditingLink] = useState<BioLink | null>(null)
  const [editingCard, setEditingCard] = useState<BioCard | null>(null)

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || authLoading) return

    setLoading(true)
    setError(null)

    try {
      const pages = await getBioPages()
      let page = pages[0]  // User can only have one

      // Auto-create bio page if none exists
      if (!page) {
        page = await createBioPage()
      }

      setBioPage(page)

      const pageItems = await getPageItems(page.id)
      setItems(pageItems.sort((a, b) => a.position - b.position))
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id || !bioPage) return

    const oldIndex = items.findIndex(
      (item) => `${item.type}-${item.item_id}` === active.id
    )
    const newIndex = items.findIndex(
      (item) => `${item.type}-${item.item_id}` === over.id
    )

    if (oldIndex === -1 || newIndex === -1) return

    // Optimistic update
    const newItems = [...items]
    const [removed] = newItems.splice(oldIndex, 1)
    newItems.splice(newIndex, 0, removed)

    // Update positions
    const reorderedItems = newItems.map((item, index) => ({
      ...item,
      position: index,
    }))
    setItems(reorderedItems)

    // Persist to server
    try {
      const reorderData: ReorderItem[] = reorderedItems.map((item) => ({
        type: item.type,
        item_id: item.item_id,
        position: item.position,
      }))
      await reorderPageItems(bioPage.id, reorderData)
    } catch (err) {
      // Revert on error
      setError(err instanceof Error ? err.message : 'Failed to reorder items')
      fetchData()
    }
  }

  const handleToggleLink = async (linkId: string, active: boolean) => {
    if (!bioPage) return
    try {
      await updateBioLink(bioPage.id, linkId, { is_active: active })
      setItems((prev) =>
        prev.map((item) =>
          item.type === 'link' && item.item_id === linkId
            ? { ...item, data: { ...item.data, is_active: active } as BioLink }
            : item
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update link')
    }
  }

  const handleToggleCard = async (cardId: string, active: boolean) => {
    if (!bioPage) return
    try {
      await updateBioCard(bioPage.id, cardId, { is_active: active })
      setItems((prev) =>
        prev.map((item) =>
          item.type === 'card' && item.item_id === cardId
            ? { ...item, data: { ...item.data, is_active: active } as BioCard }
            : item
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update card')
    }
  }

  const handleDeleteLink = async (linkId: string) => {
    if (!bioPage || !confirm('Are you sure you want to delete this link?')) return
    try {
      await deleteBioLink(bioPage.id, linkId)
      setItems((prev) => prev.filter((item) => !(item.type === 'link' && item.item_id === linkId)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete link')
    }
  }

  const handleDeleteCard = async (cardId: string) => {
    if (!bioPage || !confirm('Are you sure you want to delete this card?')) return
    try {
      await deleteBioCard(bioPage.id, cardId)
      setItems((prev) => prev.filter((item) => !(item.type === 'card' && item.item_id === cardId)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete card')
    }
  }

  const handleLinkSuccess = (link: BioLink) => {
    if (editingLink) {
      // Update existing
      setItems((prev) =>
        prev.map((item) =>
          item.type === 'link' && item.item_id === link.id
            ? { ...item, data: link }
            : item
        )
      )
    } else {
      // Add new
      const newItem: PageItem = {
        type: 'link',
        item_id: link.id,
        position: items.length,
        data: link,
      }
      setItems((prev) => [...prev, newItem])
    }
    setEditingLink(null)
    setShowLinkDialog(false)
  }

  const handleCardSuccess = (card: BioCard) => {
    if (editingCard) {
      // Update existing
      setItems((prev) =>
        prev.map((item) =>
          item.type === 'card' && item.item_id === card.id
            ? { ...item, data: card }
            : item
        )
      )
    } else {
      // Add new
      const newItem: PageItem = {
        type: 'card',
        item_id: card.id,
        position: items.length,
        data: card,
      }
      setItems((prev) => [...prev, newItem])
    }
    setEditingCard(null)
    setShowCardDialog(false)
  }

  const handlePublishToggle = async () => {
    if (!bioPage) return
    setActionLoading(true)
    try {
      const updated = bioPage.is_published
        ? await unpublishBioPage(bioPage.id)
        : await publishBioPage(bioPage.id)
      setBioPage(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update publish status')
    } finally {
      setActionLoading(false)
    }
  }

  const handleShare = () => {
    if (!bioPage) return
    const url = `${window.location.origin}/bio/${bioPage.slug}`
    navigator.clipboard.writeText(url)
    // You could add a toast notification here
  }

  if (authLoading || !isAuthenticated) {
    return null
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Main Editor Panel */}
      <div className="flex-1 pb-20 lg:pb-6">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={bioPage?.profile_image_url || undefined} />
                <AvatarFallback>
                  {bioPage?.display_name?.charAt(0) || 'B'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-semibold">
                  {bioPage?.display_name || 'Bio Page'}
                </h1>
                {bioPage && (
                  <p className="text-sm text-muted-foreground">/bio/{bioPage.slug}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/bio/settings">
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Status Bar */}
          {bioPage && (
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Badge variant={bioPage.is_published ? 'default' : 'secondary'}>
                  {bioPage.is_published ? 'Published' : 'Draft'}
                </Badge>
                {bioPage.is_published && (
                  <a
                    href={`/bio/${bioPage.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View Live
                  </a>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePublishToggle}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : bioPage.is_published ? (
                  'Unpublish'
                ) : (
                  'Publish'
                )}
              </Button>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Add New Button */}
          {bioPage && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full" size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Add New
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56">
                <DropdownMenuItem onClick={() => setShowLinkDialog(true)}>
                  <Link2 className="h-4 w-4 mr-2" />
                  Add Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowCardDialog(true)}>
                  <Mail className="h-4 w-4 mr-2" />
                  Add Lead Card
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Items List */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">No links yet</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Add your first link or card to get started
              </p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items.map((item) => `${item.type}-${item.item_id}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {items.map((item) => {
                    if (item.type === 'link') {
                      const link = item.data as BioLink
                      return (
                        <BioLinkCard
                          key={`link-${item.item_id}`}
                          link={link}
                          onToggle={handleToggleLink}
                          onEdit={(l) => {
                            setEditingLink(l)
                            setShowLinkDialog(true)
                          }}
                          onDelete={handleDeleteLink}
                        />
                      )
                    } else {
                      const card = item.data as BioCard
                      return (
                        <BioLeadCard
                          key={`card-${item.item_id}`}
                          card={card}
                          onToggle={handleToggleCard}
                          onEdit={(c) => {
                            setEditingCard(c)
                            setShowCardDialog(true)
                          }}
                          onDelete={handleDeleteCard}
                        />
                      )
                    }
                  })}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* Desktop Preview Panel */}
      <div className="hidden lg:block w-[400px] border-l bg-muted/30 p-6 sticky top-0 h-screen overflow-y-auto">
        <h2 className="font-semibold mb-4 text-center">Preview</h2>
        <BioPreview page={bioPage} items={items} />
      </div>

      {/* Bottom Navigation (mobile only) */}
      <BioBottomNav />

      {/* Dialogs */}
      {bioPage && (
        <>
          <LinkConfigDialog
            open={showLinkDialog}
            onOpenChange={(open) => {
              setShowLinkDialog(open)
              if (!open) setEditingLink(null)
            }}
            pageId={bioPage.id}
            link={editingLink}
            onSuccess={handleLinkSuccess}
            onDelete={handleDeleteLink}
          />
          <CardConfigDialog
            open={showCardDialog}
            onOpenChange={(open) => {
              setShowCardDialog(open)
              if (!open) setEditingCard(null)
            }}
            pageId={bioPage.id}
            card={editingCard}
            onSuccess={handleCardSuccess}
            onDelete={handleDeleteCard}
          />
        </>
      )}
    </div>
  )
}
