import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AlertCircle, Check, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { createAutomation, updateAutomation } from '@/lib/automations'
import type { AutomationCreate, AutomationUpdate } from '@/types'
import { Topbar } from './Topbar'
import { OutlineRail } from './OutlineRail'
import type { OutlineSection } from './OutlineRail'
import { InlineTitle } from './InlineTitle'
import { FormSection } from './FormSection'
import { PostPickerField } from './PostPickerField'
import { TriggerStepField } from './TriggerStepField'
import { MessageStepField } from './MessageStepField'
import { MessagePreviewPanel } from './MessagePreviewPanel'
import { MobilePreviewSheet } from './MobilePreviewSheet'
import { useAutomationForm } from './useAutomationForm'
import type { AutomationFormInitial } from './useAutomationForm'

type Mode = 'create' | 'edit'
type Device = 'phone' | 'desktop'

interface AutomationFormPageProps {
  mode: Mode
  instagramAccountId: string
  instagramUsername?: string
  initial?: AutomationFormInitial
  automationId?: string
  /**
   * For edit mode: when true, the post picker is shown read-only since
   * Instagram doesn't allow changing the target post after creation.
   */
  postLocked?: boolean
}

const SECTIONS: { id: 'post' | 'trigger' | 'message' | 'reply'; title: string; optional?: boolean }[] = [
  { id: 'post', title: 'Post' },
  { id: 'trigger', title: 'Trigger' },
  { id: 'message', title: 'Message' },
  { id: 'reply', title: 'Comment reply', optional: true },
]

export function AutomationFormPage({
  mode,
  instagramAccountId,
  instagramUsername,
  initial,
  automationId,
  postLocked,
}: AutomationFormPageProps) {
  const navigate = useNavigate()
  const form = useAutomationForm(initial)
  const [isSaving, setIsSaving] = useState(false)
  const [device, setDevice] = useState<Device>('phone')
  const [previewSheet, setPreviewSheet] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('post')
  const [generalError, setGeneralError] = useState<string | null>(null)

  const sectionsWithState: OutlineSection[] = useMemo(
    () =>
      SECTIONS.map((s) => ({
        id: s.id,
        title: s.title,
        optional: s.optional,
        complete: form.completion[s.id],
      })),
    [form.completion],
  )

  const requiredCount = sectionsWithState.filter((s) => !s.optional).length
  const requiredComplete = sectionsWithState.filter((s) => !s.optional && s.complete).length

  // Scroll-spy
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-100px 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  const jumpTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleCancel = () => {
    navigate('/dashboard')
  }

  const handleSave = async () => {
    setGeneralError(null)
    if (!form.validate()) {
      const first = SECTIONS.find((s) => !s.optional && !form.completion[s.id])
      if (first) jumpTo(first.id)
      return
    }
    if (!form.selectedPost) return

    setIsSaving(true)
    try {
      if (mode === 'create') {
        const body: AutomationCreate = {
          instagram_account_id: instagramAccountId,
          name: form.name.trim(),
          post_id: form.selectedPost.id,
          trigger_type: form.triggerType,
          keywords: form.triggerType === 'keyword' ? form.keywords : undefined,
          message_type: form.messageType,
          dm_message_template: form.dmText.trim(),
          carousel_elements:
            form.messageType === 'carousel' ? form.carouselElements : undefined,
          button_template: form.messageType === 'button' ? form.buttonTemplate : undefined,
          comment_reply_enabled: form.commentReplyEnabled,
          comment_reply_template: form.commentReplyEnabled
            ? form.commentReplyText.trim()
            : null,
        }
        await createAutomation(body)
        toast.success('Automation created')
      } else if (mode === 'edit' && automationId) {
        const body: AutomationUpdate = {
          name: form.name.trim(),
          trigger_type: form.triggerType,
          keywords: form.triggerType === 'keyword' ? form.keywords : undefined,
          message_type: form.messageType,
          dm_message_template: form.dmText.trim(),
          carousel_elements:
            form.messageType === 'carousel' ? form.carouselElements : undefined,
          button_template: form.messageType === 'button' ? form.buttonTemplate : null,
          comment_reply_enabled: form.commentReplyEnabled,
          comment_reply_template: form.commentReplyEnabled
            ? form.commentReplyText.trim()
            : null,
        }
        await updateAutomation(automationId, body)
        toast.success('Automation saved')
      }
      navigate('/dashboard')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save automation'
      setGeneralError(message)
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  const previewProps = {
    device,
    onDeviceChange: setDevice,
    messageType: form.messageType,
    message: form.dmText,
    cards: form.carouselElements,
    template: form.buttonTemplate,
    username: instagramUsername,
  }

  return (
    <div className="min-h-screen pb-12">
      <Topbar
        mode={mode}
        onCancel={handleCancel}
        onSave={handleSave}
        canSave={form.allValid && !isSaving}
        isSaving={isSaving}
        validity={{ complete: requiredComplete, total: requiredCount }}
        onPreviewClick={() => setPreviewSheet(true)}
      />

      <div className="py-6 sm:py-8">
        {/* Title row */}
        <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
              {mode === 'create' ? 'New automation · Draft' : 'Editing automation'}
            </p>
            <InlineTitle
              value={form.name}
              onChange={form.setName}
              placeholder="Untitled automation"
            />
            <p className="mt-1 text-sm text-muted-foreground">
              Auto-DM commenters when they engage with one of your Instagram posts. Click the
              title to rename.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium"
              style={{
                background: 'transparent',
                color: 'var(--muted-foreground)',
                border: '1px solid var(--border)',
              }}
            >
              {requiredComplete}/{requiredCount} steps done
            </span>
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
              style={
                form.allValid
                  ? {
                      background: 'color-mix(in oklab, var(--primary) 18%, transparent)',
                      color: 'var(--primary)',
                    }
                  : {
                      background: 'var(--muted)',
                      color: 'var(--muted-foreground)',
                    }
              }
            >
              {form.allValid ? (
                <>
                  <Check className="h-3 w-3" strokeWidth={3} /> Ready
                </>
              ) : (
                'In progress'
              )}
            </span>
          </div>
        </div>

        {generalError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{generalError}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          {/* Left rail: outline */}
          <aside className="col-span-12 lg:col-span-2">
            <OutlineRail
              sections={sectionsWithState}
              active={activeSection}
              onJump={jumpTo}
            />
          </aside>

          {/* Center: form */}
          <main className="col-span-12 lg:col-span-6 space-y-5">
            <FormSection
              id="post"
              step={1}
              title="Pick the Instagram post"
              description="The automation listens for comments on this single post."
              complete={form.completion.post}
            >
              {postLocked && form.selectedPost ? (
                <div
                  className="p-3 rounded-lg flex items-start gap-3"
                  style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      Post #{form.selectedPost.id}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Post cannot be changed after the automation is created.
                    </p>
                  </div>
                </div>
              ) : (
                <PostPickerField
                  value={form.selectedPost}
                  onChange={(p) => {
                    form.setSelectedPost(p)
                    form.clearError('post')
                  }}
                  hasError={!!form.errors.post}
                />
              )}
              {form.errors.post && (
                <p className="mt-2 text-xs text-destructive">{form.errors.post}</p>
              )}
            </FormSection>

            <FormSection
              id="trigger"
              step={2}
              title="When should it fire?"
              description="Decide which comments should trigger the DM."
              complete={form.completion.trigger}
            >
              <TriggerStepField
                trigger={form.triggerType}
                onTrigger={form.setTriggerType}
                keywords={form.keywords}
                onKeywords={form.setKeywords}
                errors={form.errors}
                onClearError={form.clearError}
              />
            </FormSection>

            <FormSection
              id="message"
              step={3}
              title="What gets sent?"
              description="Pick a format and write your DM. The right rail updates as you type."
              complete={form.completion.message}
            >
              <MessageStepField
                messageType={form.messageType}
                onMessageType={form.setMessageType}
                dmText={form.dmText}
                onDmText={(s) => {
                  form.setDmText(s)
                  if (form.errors.dm_message_template) form.clearError('dm_message_template')
                }}
                carousel={form.carouselElements}
                onCarousel={form.setCarouselElements}
                buttonTpl={form.buttonTemplate}
                onButtonTpl={form.setButtonTemplate}
                errors={form.errors}
              />
            </FormSection>

            <FormSection
              id="reply"
              step={4}
              title="Public comment reply"
              description="Optionally also post a public reply on the comment so it's visible to everyone."
              complete={form.completion.reply}
              optional
            >
              <div
                className="flex items-center justify-between gap-4 p-3 rounded-lg"
                style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Reply publicly to the comment
                  </p>
                  <p className="text-xs mt-0.5 text-muted-foreground">
                    Helps avoid Instagram's "DM not delivered" issue with first-time commenters.
                  </p>
                </div>
                <Switch
                  checked={form.commentReplyEnabled}
                  onCheckedChange={form.setCommentReplyEnabled}
                />
              </div>

              {form.commentReplyEnabled && (
                <div className="mt-4">
                  <div className="flex items-end justify-between mb-2">
                    <label
                      htmlFor="reply-text"
                      className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Public reply
                    </label>
                    <span className="text-[10px] tabular-nums text-muted-foreground">
                      {form.commentReplyText.length} / 300
                    </span>
                  </div>
                  <textarea
                    id="reply-text"
                    placeholder="Just sent it to your DMs! 💌"
                    value={form.commentReplyText}
                    onChange={(e) => {
                      form.setCommentReplyText(e.target.value)
                      if (form.errors.comment_reply_template)
                        form.clearError('comment_reply_template')
                    }}
                    maxLength={300}
                    rows={3}
                    className="w-full px-3 py-2 rounded-md text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
                    style={{
                      background: 'var(--input)',
                      color: 'var(--foreground)',
                      border: form.errors.comment_reply_template
                        ? '1px solid var(--destructive)'
                        : '1px solid var(--border)',
                    }}
                  />
                  {form.errors.comment_reply_template && (
                    <p className="mt-1.5 text-xs text-destructive">
                      {form.errors.comment_reply_template}
                    </p>
                  )}
                </div>
              )}
            </FormSection>

            {/* Footer card */}
            <div
              className="rounded-xl p-5 flex items-center justify-between gap-3 flex-wrap"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {form.allValid ? (
                  <>
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ background: 'var(--accent)' }}
                    />
                    All set — ready to{' '}
                    {mode === 'create' ? 'launch' : 'save'}.
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    {requiredCount - requiredComplete}{' '}
                    step{requiredCount - requiredComplete === 1 ? '' : 's'} left to complete.
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={!form.allValid || isSaving}
                >
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
          </main>

          {/* Right rail: preview */}
          <aside className="col-span-12 lg:col-span-4 hidden lg:block">
            <div className="sticky top-20">
              <MessagePreviewPanel {...previewProps} />
            </div>
          </aside>
        </div>
      </div>

      <MobilePreviewSheet open={previewSheet} onClose={() => setPreviewSheet(false)}>
        <MessagePreviewPanel {...previewProps} />
      </MobilePreviewSheet>
    </div>
  )
}
