import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, ExternalLink, Zap, Pencil, Trash2 } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { BioLink } from '@/types/bio'

interface BioLinkCardProps {
  link: BioLink
  onToggle: (id: string, active: boolean) => void
  onEdit: (link: BioLink) => void
  onDelete: (id: string) => void
}

export function BioLinkCard({ link, onToggle, onEdit, onDelete }: BioLinkCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `link-${link.id}` })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const truncateUrl = (url: string, maxLength: number = 40) => {
    try {
      const urlObj = new URL(url)
      const display = urlObj.hostname + urlObj.pathname
      return display.length > maxLength ? display.substring(0, maxLength) + '...' : display
    } catch {
      return url.length > maxLength ? url.substring(0, maxLength) + '...' : url
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 bg-card border rounded-lg transition-all ${
        isDragging ? 'opacity-50 shadow-lg scale-[1.02]' : 'opacity-100'
      } ${!link.is_active ? 'opacity-60' : ''}`}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </button>

      {/* Thumbnail */}
      {link.thumbnail_url ? (
        <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-muted">
          <img
            src={link.thumbnail_url}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-md flex-shrink-0 bg-muted flex items-center justify-center">
          <ExternalLink className="h-5 w-5 text-muted-foreground" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium truncate">{link.title}</h3>
          {link.link_type === 'smart' && (
            <Badge variant="secondary" className="flex items-center gap-1 text-xs">
              <Zap className="h-3 w-3" />
              Smart
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {truncateUrl(link.url)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(link)}
          className="h-8 w-8"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(link.id)}
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Switch
          checked={link.is_active}
          onCheckedChange={(checked) => onToggle(link.id, checked)}
          aria-label={link.is_active ? 'Deactivate link' : 'Activate link'}
        />
      </div>
    </div>
  )
}
