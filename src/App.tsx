import { BrowserRouter, HashRouter } from 'react-router'
import { Toaster } from 'sonner'
import { ThemeProvider } from './contexts/ThemeContext'
import Router from './Router'
import { AuthProvider } from './contexts/AuthContext'
import { CookieBanner } from './components/CookieBanner'

const AppRouter = import.meta.env.VITE_USE_HASH_ROUTE === 'true' ? HashRouter : BrowserRouter

export default function App() {
    return (
        <ThemeProvider>
            <AppRouter>
                <AuthProvider>
                    <Router />
                    <Toaster richColors closeButton position="bottom-center" />
                    <CookieBanner />
                </AuthProvider>
            </AppRouter>
        </ThemeProvider>
    )
}
