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
import { Plus, X } from 'lucide-react'
import type { ButtonTemplate, ButtonTemplateButton } from '@/types'

interface ButtonTemplateEditorProps {
  template: ButtonTemplate
  onChange: (t: ButtonTemplate) => void
  errors: Record<string, string>
}

function emptyButton(): ButtonTemplateButton {
  return { type: 'web_url', title: '', url: '' }
}

export function ButtonTemplateEditor({ template, onChange, errors }: ButtonTemplateEditorProps) {
  const updateText = (text: string) => {
    onChange({ ...template, text })
  }

  const updateButton = (index: number, patch: Partial<ButtonTemplateButton>) => {
    const buttons = template.buttons.map((b, i) => (i === index ? { ...b, ...patch } : b))
    onChange({ ...template, buttons })
  }

  const changeType = (index: number, type: 'web_url' | 'postback') => {
    // Swap the variant field when toggling type so stale values don't ship.
    const patch: Partial<ButtonTemplateButton> =
      type === 'web_url'
        ? { type, payload: undefined, url: template.buttons[index].url ?? '' }
        : { type, url: undefined, payload: template.buttons[index].payload ?? '' }
    updateButton(index, patch)
  }

  const addButton = () => {
    if (template.buttons.length >= 3) return
    onChange({ ...template, buttons: [...template.buttons, emptyButton()] })
  }

  const removeButton = (index: number) => {
    onChange({
      ...template,
      buttons: template.buttons.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Message body</Label>
        <Textarea
          placeholder="What should the DM say?"
          value={template.text}
          onChange={e => updateText(e.target.value)}
          maxLength={640}
          rows={3}
          className={errors.button_text ? 'border-destructive' : ''}
        />
        <div className="flex justify-between">
          {errors.button_text ? (
            <p className="text-sm text-destructive">{errors.button_text}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-muted-foreground">{template.text.length}/640</span>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Buttons ({template.buttons.length}/3)</Label>
        {template.buttons.map((btn, i) => {
          const isUrl = btn.type === 'web_url'
          return (
            <div key={i} className="space-y-2 p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Button {i + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeButton(i)}
                  disabled={template.buttons.length <= 1}
                  className="h-7 w-7"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Type</Label>
                  <Select
                    value={btn.type}
                    onValueChange={(v: 'web_url' | 'postback') => changeType(i, v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web_url">Web URL</SelectItem>
                      <SelectItem value="postback">Postback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Title</Label>
                  <Input
                    placeholder="Visit"
                    value={btn.title}
                    onChange={e => updateButton(i, { title: e.target.value })}
                    maxLength={20}
                    className={errors[`button_${i}_title`] ? 'border-destructive' : ''}
                  />
                  {errors[`button_${i}_title`] && (
                    <p className="text-xs text-destructive">{errors[`button_${i}_title`]}</p>
                  )}
                </div>
              </div>

              {isUrl ? (
                <div className="space-y-1">
                  <Label className="text-xs">URL (https://…)</Label>
                  <Input
                    placeholder="https://example.com"
                    value={btn.url ?? ''}
                    onChange={e => updateButton(i, { url: e.target.value })}
                    className={errors[`button_${i}_url`] ? 'border-destructive' : ''}
                  />
                  {errors[`button_${i}_url`] && (
                    <p className="text-xs text-destructive">{errors[`button_${i}_url`]}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  <Label className="text-xs">Payload</Label>
                  <Input
                    placeholder="YOUR_POSTBACK_PAYLOAD"
                    value={btn.payload ?? ''}
                    onChange={e => updateButton(i, { payload: e.target.value })}
                    className={errors[`button_${i}_payload`] ? 'border-destructive' : ''}
                  />
                  {errors[`button_${i}_payload`] && (
                    <p className="text-xs text-destructive">{errors[`button_${i}_payload`]}</p>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {template.buttons.length < 3 && (
          <Button type="button" variant="outline" onClick={addButton} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add button
          </Button>
        )}

        {errors.button_template && (
          <p className="text-sm text-destructive">{errors.button_template}</p>
        )}
      </div>
    </div>
  )
}
