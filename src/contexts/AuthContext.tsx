import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import {
	login as authLogin,
	logout as authLogout,
	getCurrentUser,
	User
} from "@/lib/auth"

type AuthContextType = {
	isAuthenticated: boolean
	loading: boolean
	user: User | null
	login: (email: string, password: string) => Promise<void>
	logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(true)
	const [user, setUser] = useState<User | null>(null)
	const navigate = useNavigate()

	// Check auth status on mount
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const currentUser = await getCurrentUser()
				setUser(currentUser)
				setIsAuthenticated(true)
			} catch {
				// Not authenticated or token expired
				setUser(null)
				setIsAuthenticated(false)
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
	}

	const logout = useCallback(async () => {
		try {
			await authLogout()
		} catch {
			// Ignore errors during logout
		}
		setUser(null)
		setIsAuthenticated(false)
		navigate("/login")
	}, [navigate])

	const value = useMemo(() => ({
		isAuthenticated,
		loading,
		user,
		login,
		logout,
	}), [isAuthenticated, loading, user, logout])

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) throw new Error("useAuth must be used within AuthProvider")
	return context
}
