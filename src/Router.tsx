import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/app-layout'
import NotMatch from './pages/NotMatch'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import CookiesPage from './pages/CookiesPage'
import RegistrationForm from './pages/RegistrationForm'
import LoginForm from './pages/LoginForm'
import InstagramCallback from './pages/InstagramCallback'
import AutomationAnalyticsPage from './pages/AutomationAnalyticsPage'
import CreateAutomationPage from './pages/CreateAutomationPage'
import EditAutomationPage from './pages/EditAutomationPage'
import ForgotPasswordForm from './pages/ForgotPasswordForm'
import ResetPasswordForm from './pages/ResetPasswordForm'
import VerifyEmailPage from './pages/VerifyEmailPage'

export default function Router() {
    return (
        <Routes>
            {/* Bare public routes (no app chrome) */}
            <Route path="" element={<Home />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="cookies" element={<CookiesPage />} />

            {/* Authenticated routes with app layout */}
            <Route element={<AppLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="login" element={<LoginForm />} />
                <Route path="register" element={<RegistrationForm />} />
                <Route path="forgot-password" element={<ForgotPasswordForm />} />
                <Route path="reset-password" element={<ResetPasswordForm />} />
                <Route path="verify-email" element={<VerifyEmailPage />} />
                <Route path="auth/instagram/callback" element={<InstagramCallback />} />

                {/* Automation routes */}
                <Route path="automations/new" element={<CreateAutomationPage />} />
                <Route path="automations/:id/edit" element={<EditAutomationPage />} />
                <Route path="automations/:id/analytics" element={<AutomationAnalyticsPage />} />

                <Route path="*" element={<NotMatch />} />
            </Route>
        </Routes>
    )
}
