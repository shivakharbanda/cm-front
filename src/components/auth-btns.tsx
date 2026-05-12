import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { usePWAInstall } from '@/hooks/use-pwa-install'
import { Download } from 'lucide-react'

interface AuthButtonsProps {
    variant: 'header' | 'sidebar'
    onItemClick?: () => void // For closing mobile menu when clicked
}

export function AuthButtons({ variant, onItemClick }: AuthButtonsProps) {
    const { isAuthenticated, logout } = useAuth()
    const { isInstallAvailable, promptInstall, isStandalone } = usePWAInstall()

    const handleLogout = async () => {
        await logout()
        onItemClick?.()
    }

    const handleLinkClick = () => {
        onItemClick?.()
    }

    const handleInstall = async (): Promise<void> => {
        await promptInstall()
        onItemClick?.()
    }

    if (variant === 'header') {
        return (
            <div className="flex items-center gap-1">
                {isAuthenticated ? (
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                        Sign out
                    </Button>
                ) : (
                    <>
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/login">Sign in</Link>
                        </Button>
                        <Button size="sm" asChild>
                            <Link to="/register">Sign up</Link>
                        </Button>
                    </>
                )}
            </div>
        )
    }

    // Sidebar variant - completely different structure
    if (isAuthenticated) {
        return (
            <>
                {(isInstallAvailable && !isStandalone) && (
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleInstall}>
                            <Download className="h-4 w-4" />
                            <span>Install App</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                )}
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout}>
                        <span>Sign out</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </>
        )
    }

    return (
        <>
            {(isInstallAvailable && !isStandalone) && (
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleInstall}>
                        <Download className="h-4 w-4" />
                        <span>Install App</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            )}
            <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <Link to="/login" onClick={handleLinkClick}>
                        <span>Sign in</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <Link to="/register" onClick={handleLinkClick}>
                        <span>Sign up</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </>
    )
}