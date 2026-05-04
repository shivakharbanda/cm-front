import { useEffect, useRef, useState } from 'react'
import { Pencil } from 'lucide-react'

interface InlineTitleProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function InlineTitle({ value, onChange, placeholder = 'Untitled automation' }: InlineTitleProps) {
  const [editing, setEditing] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus()
      ref.current.select()
    }
  }, [editing])

  if (editing) {
    return (
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setEditing(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            setEditing(false)
          }
          if (e.key === 'Escape') {
            setEditing(false)
          }
        }}
        className="bg-transparent outline-none border-b text-2xl sm:text-[26px] font-bold tracking-tight w-full text-foreground"
        style={{ borderColor: 'var(--primary)' }}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="text-left flex items-center gap-2 group cursor-text"
    >
      <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-foreground">
        {value || placeholder}
      </h1>
      <Pencil
        className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground"
      />
    </button>
  )
}
