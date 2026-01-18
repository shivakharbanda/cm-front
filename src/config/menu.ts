import {
    LayoutDashboard,
    Instagram,
    Settings,
    LucideIcon
} from 'lucide-react'

type MenuItemType = {
    title: string
    url: string
    external?: string
    icon?: LucideIcon
    items?: MenuItemType[]
}
type MenuType = MenuItemType[]

export const mainMenu: MenuType = [
    {
        title: 'Dashboard',
        url: '/',
        icon: LayoutDashboard
    },
    {
        title: 'Instagram',
        url: '/instagram',
        icon: Instagram
    },
    {
        title: 'Settings',
        url: '/settings',
        icon: Settings
    },
]
