type AppConfigType = {
    name: string
}

export const appConfig: AppConfigType = {
    name: import.meta.env.VITE_APP_NAME ?? "CreatorModo"
}

export const baseUrl = import.meta.env.VITE_BASE_URL ?? ""
