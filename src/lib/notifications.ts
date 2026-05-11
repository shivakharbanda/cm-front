import { fetcher } from './api'

export interface NotificationSubscriptionData {
    email: string
    notification_type: string
    label: string
}

export async function subscribeForNotification(data: NotificationSubscriptionData): Promise<void> {
    await fetcher('/api/v1/notification-subscriptions', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}
