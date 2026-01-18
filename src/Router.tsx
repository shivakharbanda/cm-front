import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/app-layout'
import NotMatch from './pages/NotMatch'
import Dashboard from './pages/Dashboard'
import RegistrationForm from './pages/RegistrationForm'
import LoginForm from './pages/LoginForm'
import InstagramCallback from './pages/InstagramCallback'

export default function Router() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="" element={<Dashboard />} />
                <Route path='login' element={<LoginForm />} />
                <Route path="register" element={<RegistrationForm />} />
                <Route path="auth/instagram/callback" element={<InstagramCallback />} />
                <Route path="*" element={<NotMatch />} />
            </Route>
        </Routes>
    )
}
