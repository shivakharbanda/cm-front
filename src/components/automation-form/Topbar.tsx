import { ArrowLeft, ChevronRight, Eye, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TopbarProps {
  mode: 'create' | 'edit'
  onCancel: () => void
  onSave: () => void
  canSave: boolean
  isSaving: boolean
  validity: { complete: number; total: number }
  onPreviewClick: () => void
}

export function Topbar({
  mode,
  onCancel,
  onSave,
  canSave,
  isSaving,
  validity,
  onPreviewClick,
}: TopbarProps) {
  return (
    <header
      className="sticky top-0 z-30 -mx-4 md:-mx-8 backdrop-blur-md"
      style={{
        background: 'color-mix(in oklab, var(--background) 86%, transparent)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="px-4 md:px-8 h-14 flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-opacity text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Automations</span>
        </button>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground truncate">
          {mode === 'create' ? 'New automation' : 'Edit automation'}
        </span>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            {validity.complete}/{validity.total} required complete
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onPreviewClick}
            className="lg:hidden"
          >
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={onSave} disabled={!canSave || isSaving} size="sm">
            {isSaving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
            {isSaving
              ? mode === 'create'
                ? 'Creating…'
                : 'Saving…'
              : mode === 'create'
              ? 'Create automation'
              : 'Save changes'}
          </Button>
        </div>
      </div>
    </header>
  )
}
