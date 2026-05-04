import { useEffect, useMemo, useState } from 'react'
import type {
  Automation,
  ButtonTemplate,
  CarouselElement,
  InstagramPost,
  MessageType,
  TriggerType,
} from '@/types'

export interface AutomationFormInitial {
  selectedPost: InstagramPost | null
  name: string
  triggerType: TriggerType
  keywords: string[]
  messageType: MessageType
  dmText: string
  carouselElements: CarouselElement[]
  buttonTemplate: ButtonTemplate
  commentReplyEnabled: boolean
  commentReplyText: string
}

export const emptyButtonTemplate = (): ButtonTemplate => ({
  text: '',
  buttons: [{ type: 'web_url', title: '', url: '' }],
})

export const emptyCarousel = (): CarouselElement[] => [
  {
    title: '',
    subtitle: '',
    image_url: '',
    buttons: [{ type: 'web_url', url: '', title: '' }],
  },
]

const blank = (): AutomationFormInitial => ({
  selectedPost: null,
  name: '',
  triggerType: 'all_comments',
  keywords: [],
  messageType: 'text',
  dmText: '',
  carouselElements: emptyCarousel(),
  buttonTemplate: emptyButtonTemplate(),
  commentReplyEnabled: false,
  commentReplyText: '',
})

export function automationToInitial(
  automation: Automation,
  postShim?: InstagramPost,
): AutomationFormInitial {
  return {
    selectedPost:
      postShim ??
      ({
        id: automation.post_id,
        caption: '',
        media_type: 'IMAGE',
        timestamp: automation.created_at,
        permalink: '',
      } as InstagramPost),
    name: automation.name,
    triggerType: automation.trigger_type,
    keywords: automation.keywords ?? [],
    messageType: automation.message_type ?? 'text',
    dmText: automation.dm_message_template ?? '',
    carouselElements:
      automation.carousel_elements && automation.carousel_elements.length > 0
        ? automation.carousel_elements
        : emptyCarousel(),
    buttonTemplate:
      automation.button_template && automation.button_template.buttons.length > 0
        ? automation.button_template
        : emptyButtonTemplate(),
    commentReplyEnabled: automation.comment_reply_enabled,
    commentReplyText: automation.comment_reply_template ?? '',
  }
}

export function useAutomationForm(initial?: AutomationFormInitial) {
  const seed = initial ?? blank()
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(seed.selectedPost)
  const [name, setName] = useState(seed.name)
  const [triggerType, setTriggerType] = useState<TriggerType>(seed.triggerType)
  const [keywords, setKeywords] = useState<string[]>(seed.keywords)
  const [messageType, setMessageType] = useState<MessageType>(seed.messageType)
  const [dmText, setDmText] = useState(seed.dmText)
  const [carouselElements, setCarouselElements] = useState<CarouselElement[]>(
    seed.carouselElements,
  )
  const [buttonTemplate, setButtonTemplate] = useState<ButtonTemplate>(seed.buttonTemplate)
  const [commentReplyEnabled, setCommentReplyEnabled] = useState(seed.commentReplyEnabled)
  const [commentReplyText, setCommentReplyText] = useState(seed.commentReplyText)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Auto-name from caption when picking a post (only if name is empty/default)
  useEffect(() => {
    if (
      selectedPost &&
      (!name.trim() || name === 'Untitled automation' || name === '')
    ) {
      const caption = selectedPost.caption?.trim()
      const auto = caption
        ? caption.length > 40
          ? caption.slice(0, 40) + '…'
          : caption
        : `Automation for ${selectedPost.id}`
      setName(auto)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPost?.id])

  const completion = useMemo(() => {
    const messageComplete =
      messageType === 'text'
        ? !!dmText.trim()
        : messageType === 'carousel'
        ? carouselElements.length > 0 &&
          carouselElements.every(
            (c) =>
              c.title.trim() &&
              c.buttons.length > 0 &&
              c.buttons.every((b) => b.title.trim() && b.url.trim()),
          )
        : !!buttonTemplate.text.trim() &&
          buttonTemplate.buttons.length >= 1 &&
          buttonTemplate.buttons.length <= 3 &&
          buttonTemplate.buttons.every((b) => {
            if (!b.title.trim()) return false
            if (b.type === 'web_url') return !!(b.url ?? '').trim()
            return !!(b.payload ?? '').trim()
          })

    return {
      post: !!selectedPost,
      trigger: triggerType === 'all_comments' || keywords.length > 0,
      message: messageComplete,
      reply: !commentReplyEnabled || !!commentReplyText.trim(),
    }
  }, [
    selectedPost,
    triggerType,
    keywords,
    messageType,
    dmText,
    carouselElements,
    buttonTemplate,
    commentReplyEnabled,
    commentReplyText,
  ])

  const allValid =
    completion.post && completion.trigger && completion.message && completion.reply

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = 'Name is required'

    if (!selectedPost) newErrors.post = 'Please select a post'

    if (messageType === 'text') {
      if (!dmText.trim()) newErrors.dm_message_template = 'DM message is required'
    } else if (messageType === 'carousel') {
      if (carouselElements.length === 0) {
        newErrors.carousel_elements = 'At least one card is required'
      }
      carouselElements.forEach((card, i) => {
        if (!card.title.trim()) newErrors[`card_${i}_title`] = 'Title is required'
        if (card.buttons.length === 0) {
          newErrors[`card_${i}_buttons`] = 'At least one button is required'
        }
        card.buttons.forEach((btn, bi) => {
          if (!btn.title.trim()) {
            newErrors[`card_${i}_btn_${bi}_title`] = 'Button title is required'
          }
          if (!btn.url.trim()) {
            newErrors[`card_${i}_btn_${bi}_url`] = 'Button URL is required'
          }
        })
      })
    } else if (messageType === 'button') {
      if (!buttonTemplate.text.trim()) {
        newErrors.button_text = 'Message body is required'
      } else if (buttonTemplate.text.length > 640) {
        newErrors.button_text = 'Message body must be 640 characters or fewer'
      }
      if (buttonTemplate.buttons.length < 1 || buttonTemplate.buttons.length > 3) {
        newErrors.button_template = 'Add between 1 and 3 buttons'
      }
      buttonTemplate.buttons.forEach((btn, i) => {
        if (!btn.title.trim()) {
          newErrors[`button_${i}_title`] = 'Button title is required'
        } else if (btn.title.length > 20) {
          newErrors[`button_${i}_title`] = 'Max 20 characters'
        }
        if (btn.type === 'web_url') {
          const url = (btn.url ?? '').trim()
          if (!url) {
            newErrors[`button_${i}_url`] = 'URL is required'
          } else if (!url.startsWith('https://')) {
            newErrors[`button_${i}_url`] = 'URL must start with https://'
          }
        } else if (btn.type === 'postback') {
          if (!(btn.payload ?? '').trim()) {
            newErrors[`button_${i}_payload`] = 'Payload is required'
          }
        }
      })
    }

    if (triggerType === 'keyword' && keywords.length === 0) {
      newErrors.keywords = 'At least one keyword is required'
    }

    if (commentReplyEnabled && !commentReplyText.trim()) {
      newErrors.comment_reply_template = 'Comment reply message is required when enabled'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const clearError = (field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  return {
    // state
    selectedPost,
    setSelectedPost,
    name,
    setName,
    triggerType,
    setTriggerType,
    keywords,
    setKeywords,
    messageType,
    setMessageType,
    dmText,
    setDmText,
    carouselElements,
    setCarouselElements,
    buttonTemplate,
    setButtonTemplate,
    commentReplyEnabled,
    setCommentReplyEnabled,
    commentReplyText,
    setCommentReplyText,
    // validation
    errors,
    setErrors,
    validate,
    clearError,
    // derived
    completion,
    allValid,
  }
}
