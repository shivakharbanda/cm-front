import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Mail, Users, Pencil, Trash2 } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { BioCard } from '@/types/bio'

interface BioLeadCardProps {
  card: BioCard
  onToggle: (id: string, active: boolean) => void
  onEdit: (card: BioCard) => void
  onDelete: (id: string) => void
  leadCount?: number
}

export function BioLeadCard({ card, onToggle, onEdit, onDelete, leadCount = 0 }: BioLeadCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `card-${card.id}` })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-3 p-4 bg-card border rounded-lg transition-all ${
        isDragging ? 'opacity-50 shadow-lg scale-[1.02]' : 'opacity-100'
      } ${!card.is_active ? 'opacity-60' : ''}`}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded touch-none mt-1"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </button>

      {/* Card Preview */}
      <div
        className="w-20 h-20 rounded-lg flex-shrink-0 flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: card.background_color || '#B8963A' }}
      >
        {card.background_image_url ? (
          <img
            src={card.background_image_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <Mail className="h-8 w-8 text-white/80" />
        )}
        {card.badge_text && (
          <span className="absolute top-1 left-1 text-[10px] font-medium text-white bg-black/40 px-1.5 py-0.5 rounded">
            {card.badge_text}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            <Mail className="h-3 w-3" />
            Email Gate
          </Badge>
        </div>
        <h3 className="font-medium line-clamp-1">{card.headline}</h3>
        {card.description && (
          <p className="text-sm text-muted-foreground line-clamp-1">{card.description}</p>
        )}
        <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          <span>{leadCount} {leadCount === 1 ? 'lead' : 'leads'}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(card)}
          className="h-8 w-8"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(card.id)}
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Switch
          checked={card.is_active}
          onCheckedChange={(checked) => onToggle(card.id, checked)}
          aria-label={card.is_active ? 'Deactivate card' : 'Activate card'}
        />
      </div>
    </div>
  )
}
