import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/app-layout'
import NotMatch from './pages/NotMatch'
import Dashboard from './pages/Dashboard'
import RegistrationForm from './pages/RegistrationForm'
import LoginForm from './pages/LoginForm'
import InstagramCallback from './pages/InstagramCallback'
import BioEditorPage from './pages/bio/BioEditorPage'
import BioAnalyticsPage from './pages/bio/BioAnalyticsPage'
import BioSettingsPage from './pages/bio/BioSettingsPage'
import PublicBioPage from './pages/PublicBioPage'
import AutomationAnalyticsPage from './pages/AutomationAnalyticsPage'

export default function Router() {
    return (
        <Routes>
            {/* Public bio page (no auth required, no layout) */}
            <Route path="bio/:slug" element={<PublicBioPage />} />

            {/* Authenticated routes with app layout */}
            <Route element={<AppLayout />}>
                <Route path="" element={<Dashboard />} />
                <Route path="login" element={<LoginForm />} />
                <Route path="register" element={<RegistrationForm />} />
                <Route path="auth/instagram/callback" element={<InstagramCallback />} />

                {/* Automation routes */}
                <Route path="automations/:id/analytics" element={<AutomationAnalyticsPage />} />

                {/* Bio routes */}
                <Route path="bio" element={<BioEditorPage />} />
                <Route path="bio/analytics" element={<BioAnalyticsPage />} />
                <Route path="bio/settings" element={<BioSettingsPage />} />

                <Route path="*" element={<NotMatch />} />
            </Route>
        </Routes>
    )
}
