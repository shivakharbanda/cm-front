import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
	login as authLogin,
	logout as authLogout,
	getCurrentUser,
	sendEmailVerification,
	User
} from "@/lib/auth"
import { ApiError } from "@/lib/api"

const SESSION_HINT_KEY = 'session_hint'

function setSessionHint(email: string | null) {
	if (email) localStorage.setItem(SESSION_HINT_KEY, email)
	else localStorage.removeItem(SESSION_HINT_KEY)
}

type AuthContextType = {
	isAuthenticated: boolean
	loading: boolean
	user: User | null
	login: (email: string, password: string) => Promise<void>
	logout: () => Promise<void>
	resendVerification: () => Promise<void>
	refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const storedEmail = localStorage.getItem(SESSION_HINT_KEY)
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!storedEmail)
	const [loading, setLoading] = useState<boolean>(true)
	const [user, setUser] = useState<User | null>(
		storedEmail ? { email: storedEmail } as User : null
	)
	const navigate = useNavigate()

	// Check auth status on mount
	useEffect(() => {
		const checkAuth = async () => {
			const hadHint = !!localStorage.getItem(SESSION_HINT_KEY)
			try {
				const currentUser = await getCurrentUser()
				setUser(currentUser)
				setIsAuthenticated(true)
				setSessionHint(currentUser.email)
			} catch (err) {
				if (err instanceof ApiError && err.status === 401) {
					// authenticatedFetcher already dispatched auth:session-expired so
					// logout() will handle state reset, hint clear, and redirect.
					// Just show a toast if the user expected to be logged in.
					if (hadHint) {
						toast.error('Your session has expired. Redirecting to login…')
					}
				} else {
					// Network error or 5xx — do not destroy the session
					if (hadHint) {
						toast.warning('Could not verify your session due to a network error.')
					}
				}
			} finally {
				setLoading(false)
			}
		}

		checkAuth()
	}, [])

	const login = async (email: string, password: string) => {
		const loggedInUser = await authLogin(email, password)
		setUser(loggedInUser)
		setIsAuthenticated(true)
		setSessionHint(loggedInUser.email)
	}

	const logout = useCallback(async () => {
		try {
			await authLogout()
		} catch {
			// Ignore errors during logout
		}
		setUser(null)
		setIsAuthenticated(false)
		setSessionHint(null)
		navigate("/login")
	}, [navigate])

	// Handle session expiry dispatched by authenticatedFetcher when refresh token is dead
	useEffect(() => {
		const handler = () => { logout() }
		window.addEventListener('auth:session-expired', handler)
		return () => window.removeEventListener('auth:session-expired', handler)
	}, [logout])

	const resendVerification = useCallback(async () => {
		await sendEmailVerification()
	}, [])

	const refreshUser = useCallback(async () => {
		const u = await getCurrentUser()
		setUser(u)
	}, [])

	const value = useMemo(() => ({
		isAuthenticated,
		loading,
		user,
		login,
		logout,
		resendVerification,
		refreshUser,
	}), [isAuthenticated, loading, user, logout, resendVerification, refreshUser])

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) throw new Error("useAuth must be used within AuthProvider")
	return context
}
