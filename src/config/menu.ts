import {
    LayoutDashboard,
    Instagram,
    Settings,
    Link2,
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
        title: 'Link in Bio',
        url: '/bio',
        icon: Link2
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
