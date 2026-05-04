import { Plus, X } from 'lucide-react'
import type { ButtonTemplate, ButtonTemplateButton } from '@/types'

const MAX_BUTTONS = 3
const BODY_LIMIT = 640

interface ButtonTemplateInlineEditorProps {
  template: ButtonTemplate
  onChange: (t: ButtonTemplate) => void
  errors: Record<string, string>
}

export function ButtonTemplateInlineEditor({
  template,
  onChange,
  errors,
}: ButtonTemplateInlineEditorProps) {
  const updateText = (text: string) => onChange({ ...template, text })

  const updateBtn = (i: number, patch: Partial<ButtonTemplateButton>) =>
    onChange({
      ...template,
      buttons: template.buttons.map((b, bi) => (bi === i ? { ...b, ...patch } : b)),
    })

  const addBtn = () => {
    if (template.buttons.length >= MAX_BUTTONS) return
    onChange({
      ...template,
      buttons: [...template.buttons, { type: 'web_url', title: '', url: '' }],
    })
  }

  const removeBtn = (i: number) => {
    if (template.buttons.length <= 1) return
    onChange({ ...template, buttons: template.buttons.filter((_, x) => x !== i) })
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-end justify-between mb-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Message body
          </label>
          <span className="text-[10px] tabular-nums text-muted-foreground">
            {template.text.length} / {BODY_LIMIT}
          </span>
        </div>
        <textarea
          placeholder="Enter the message that goes above the buttons..."
          value={template.text}
          onChange={(e) => updateText(e.target.value)}
          maxLength={BODY_LIMIT}
          rows={4}
          className="w-full px-3 py-2 rounded-md text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
          style={{
            background: 'var(--input)',
            color: 'var(--foreground)',
            border: errors.button_text
              ? '1px solid var(--destructive)'
              : '1px solid var(--border)',
          }}
        />
        {errors.button_text && (
          <p className="mt-1.5 text-xs text-destructive">{errors.button_text}</p>
        )}
      </div>

      <div>
        <label className="block mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Buttons · {template.buttons.length} of {MAX_BUTTONS}
        </label>
        <div className="space-y-2">
          {template.buttons.map((btn, i) => (
            <div
              key={i}
              className="rounded-lg p-3 space-y-2"
              style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-2">
                <select
                  value={btn.type}
                  onChange={(e) =>
                    updateBtn(i, { type: e.target.value as ButtonTemplateButton['type'] })
                  }
                  className="h-8 px-2 rounded-md text-xs w-32 focus:outline-none focus:ring-2 focus:ring-ring"
                  style={{
                    background: 'var(--input)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <option value="web_url">URL</option>
                  <option value="postback">Postback</option>
                </select>
                <input
                  placeholder="Button label"
                  value={btn.title}
                  onChange={(e) => updateBtn(i, { title: e.target.value })}
                  maxLength={20}
                  className="flex-1 h-8 px-2 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  style={{
                    background: 'var(--input)',
                    color: 'var(--foreground)',
                    border: errors[`button_${i}_title`]
                      ? '1px solid var(--destructive)'
                      : '1px solid var(--border)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeBtn(i)}
                  disabled={template.buttons.length <= 1}
                  className="p-1.5 rounded hover:bg-[var(--card)] disabled:opacity-30 transition-colors"
                  aria-label="Remove button"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <input
                placeholder={btn.type === 'web_url' ? 'https://example.com' : 'PAYLOAD_KEY'}
                value={btn.type === 'web_url' ? btn.url || '' : btn.payload || ''}
                onChange={(e) =>
                  updateBtn(
                    i,
                    btn.type === 'web_url'
                      ? { url: e.target.value }
                      : { payload: e.target.value },
                  )
                }
                className="w-full h-8 px-2 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                style={{
                  background: 'var(--input)',
                  color: 'var(--foreground)',
                  border:
                    errors[`button_${i}_url`] || errors[`button_${i}_payload`]
                      ? '1px solid var(--destructive)'
                      : '1px solid var(--border)',
                }}
              />
              {(errors[`button_${i}_title`] ||
                errors[`button_${i}_url`] ||
                errors[`button_${i}_payload`]) && (
                <p className="text-[11px] text-destructive">
                  {errors[`button_${i}_title`] ||
                    errors[`button_${i}_url`] ||
                    errors[`button_${i}_payload`]}
                </p>
              )}
            </div>
          ))}
          {template.buttons.length < MAX_BUTTONS && (
            <button
              type="button"
              onClick={addBtn}
              className="w-full h-9 rounded-md text-xs font-medium inline-flex items-center justify-center gap-1 hover:bg-[var(--muted)] transition-colors"
              style={{ border: '1px dashed var(--border)', color: 'var(--muted-foreground)' }}
            >
              <Plus className="h-3 w-3" /> Add button
            </button>
          )}
          {errors.button_template && (
            <p className="text-xs text-destructive">{errors.button_template}</p>
          )}
        </div>
      </div>
    </div>
  )
}
