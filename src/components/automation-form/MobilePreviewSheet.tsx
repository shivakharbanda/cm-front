import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface MobilePreviewSheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export function MobilePreviewSheet({ open, onClose, children }: MobilePreviewSheetProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,.5)' }} onClick={onClose} />
      <div
        className="absolute right-0 top-0 bottom-0 w-[min(92vw,420px)] overflow-y-auto p-4"
        style={{ background: 'var(--background)', borderLeft: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold">Preview</p>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[var(--muted)] transition-colors"
            aria-label="Close preview"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
