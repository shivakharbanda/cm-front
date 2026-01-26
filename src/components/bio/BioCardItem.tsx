import { useState } from 'react'
import { Mail, Loader2, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { BioCard, PublicCard, CardSubmitResponse } from '@/types/bio'

type CardData = BioCard | PublicCard

interface BioCardItemProps {
  card: CardData
  preview?: boolean
  onSubmit?: (email: string) => Promise<CardSubmitResponse>
}

export function BioCardItem({ card, preview = false, onSubmit }: BioCardItemProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (preview || !onSubmit) return

    setError(null)

    if (!email.trim()) {
      setError('Please enter your email')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    try {
      const result = await onSubmit(email)
      if (result.success) {
        setSuccess(true)
        setSuccessMessage(result.message)
        if (result.redirect_url) {
          setTimeout(() => {
            window.location.href = result.redirect_url!
          }, 1500)
        }
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDirectClick = async () => {
    if (preview || !onSubmit) return

    setIsLoading(true)
    try {
      const result = await onSubmit('')
      if (result.redirect_url) {
        window.location.href = result.redirect_url
      }
    } catch (err) {
      console.error('Failed to submit:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Success state (only for non-preview)
  if (success && !preview) {
    return (
      <div
        className="relative rounded-2xl p-6 text-white overflow-hidden"
        style={{ backgroundColor: card.background_color }}
      >
        {card.background_image_url && (
          <img
            src={card.background_image_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        )}
        <div className="relative z-10 flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-white" />
          </div>
          <p className="font-semibold text-lg">{successMessage}</p>
        </div>
      </div>
    )
  }

  // Check if card requires email
  const requiresEmail = 'requires_email' in card ? card.requires_email : true

  return (
    <div
      className="relative rounded-2xl p-5 text-white overflow-hidden"
      style={{ backgroundColor: card.background_color }}
    >
      {/* Background Image */}
      {card.background_image_url && (
        <img
          src={card.background_image_url}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
      )}

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10">
        {/* Badge */}
        {card.badge_text && (
          <span className="inline-block text-xs font-bold tracking-wide uppercase bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full mb-3">
            {card.badge_text}
          </span>
        )}

        {/* Headline */}
        <h3 className="font-bold text-xl leading-tight mb-1">
          {card.headline}
        </h3>

        {/* Description */}
        {card.description && (
          <p className="text-sm text-white/90 mb-4">
            {card.description}
          </p>
        )}

        {/* Form / Button */}
        {requiresEmail ? (
          preview ? (
            // Preview mode: show static form mockup
            <div className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  disabled
                  className="pl-10 bg-white/15 border-white/20 text-white placeholder:text-white/50 cursor-default"
                />
              </div>
              <Button
                disabled
                className="w-full bg-white text-black font-semibold cursor-default"
              >
                {card.cta_text}
              </Button>
            </div>
          ) : (
            // Live mode: interactive form
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError(null)
                  }}
                  className="pl-10 bg-white/15 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-white bg-red-500/30 px-3 py-2 rounded-lg">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black hover:bg-white/90 font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  card.cta_text
                )}
              </Button>
            </form>
          )
        ) : (
          // No email required - just a CTA button
          <Button
            onClick={preview ? undefined : handleDirectClick}
            disabled={isLoading || preview}
            className={`w-full bg-white text-black font-semibold ${!preview ? 'hover:bg-white/90' : 'cursor-default'}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              card.cta_text
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
