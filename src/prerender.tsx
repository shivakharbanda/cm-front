/**
 * Build-time renderer for public pages that must be readable without JavaScript.
 *
 * Meta's App Review crawler and link-preview scrapers don't execute JS, so the SPA shell
 * (empty #root, homepage og:url) made /privacy look like the homepage. The
 * `prerenderPublicPages` plugin in vite.config.ts loads this module after the client build
 * and writes dist/<path>.html for each route below; vercel.json rewrites to those files.
 * The client bundle never imports this file.
 */
import type { ComponentType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import DataDeletionPage from './pages/DataDeletionPage'

export type PrerenderRoute = {
    path: string
    title: string
    description: string
    Page: ComponentType
}

export const prerenderRoutes: PrerenderRoute[] = [
    {
        path: '/privacy',
        title: 'Privacy Policy',
        description:
            'How CreatorModo collects, uses, shares, stores, and deletes information, including Instagram and Meta Platform Data.',
        Page: PrivacyPage,
    },
    {
        path: '/terms',
        title: 'Terms & Conditions',
        description: 'The terms that govern your use of CreatorModo and its Instagram automation and link-in-bio tools.',
        Page: TermsPage,
    },
    {
        path: '/data-deletion',
        title: 'Data Deletion',
        description: 'How to delete your CreatorModo account and the Instagram data associated with it.',
        Page: DataDeletionPage,
    },
]

export function renderRoute({ path, Page }: PrerenderRoute): string {
    // ThemeProvider and AuthProvider read localStorage during render; Node has none.
    const store = new Map<string, string>()
    const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
    Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: {
            getItem: (key: string) => store.get(key) ?? null,
            setItem: (key: string, value: string) => void store.set(key, value),
            removeItem: (key: string) => void store.delete(key),
        },
    })
    try {
        return renderToStaticMarkup(
            <ThemeProvider>
                <StaticRouter location={path}>
                    <AuthProvider>
                        <Page />
                    </AuthProvider>
                </StaticRouter>
            </ThemeProvider>,
        )
    } finally {
        if (original) Object.defineProperty(globalThis, 'localStorage', original)
        else Reflect.deleteProperty(globalThis, 'localStorage')
    }
}
