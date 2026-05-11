import { fetcher } from './api'

export interface ContactFormData {
    name: string
    email: string
    subject?: string
    message: string
}

export interface ContactSubmissionResponse {
    id: number
    name: string
    email: string
    subject: string | null
    message: string
    created_at: string
}

export async function submitContactForm(data: ContactFormData): Promise<ContactSubmissionResponse> {
    return fetcher<ContactSubmissionResponse>('/api/v1/contact-submissions', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}
