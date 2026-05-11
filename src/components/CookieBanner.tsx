import CookieConsent from 'react-cookie-consent'

declare global {
    interface Window {
        gtag: (...args: unknown[]) => void
    }
}

const COOKIE_NAME = 'creatormodo_cookie_consent'

function grantConsent() {
    window.gtag?.('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
    })
}

function denyConsent() {
    window.gtag?.('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
    })
}

export function CookieBanner() {
    return (
        <CookieConsent
            cookieName={COOKIE_NAME}
            onAccept={grantConsent}
            onDecline={denyConsent}
            enableDeclineButton
            disableStyles
            containerClasses="fixed bottom-0 left-0 right-0 z-50 border-t bg-card text-card-foreground px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-lg"
            contentClasses="text-[13px] text-muted-foreground max-w-[680px]"
            buttonClasses="h-8 px-4 rounded-md text-[13px] font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
            declineButtonClasses="h-8 px-4 rounded-md text-[13px] font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
            buttonText="Accept"
            declineButtonText="Decline"
            buttonWrapperClasses="flex items-center gap-2 shrink-0"
        >
            We use cookies to understand how CreatorModo is used. No ads, just analytics.{' '}
            <a href="/cookies" className="underline hover:text-foreground transition-colors">
                Learn more
            </a>
        </CookieConsent>
    )
}
