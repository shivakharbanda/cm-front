import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import {
	login as authLogin,
	clearTokens,
	isAuthenticated as checkAuth,
	getAccessToken
} from "@/lib/auth"

type AuthContextType = {
	isAuthenticated: boolean
	login: (email: string, password: string) => Promise<void>
	logout: () => void
	accessToken: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => checkAuth())
	const navigate = useNavigate()

	useEffect(() => {
		setIsAuthenticated(checkAuth())
	}, [])

	const login = async (email: string, password: string) => {
		await authLogin(email, password)
		setIsAuthenticated(true)
	}

	const logout = useCallback(() => {
		clearTokens()
		setIsAuthenticated(false)
		navigate("/login")
	}, [navigate])

	const value = useMemo(() => ({
		isAuthenticated,
		login,
		logout,
		accessToken: getAccessToken(),
	}), [isAuthenticated, logout])

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) throw new Error("useAuth must be used within AuthProvider")
	return context
}
