export type ContactType = {
    id?: number
    phoneNumber?: string | null
    email?: string | null
    linkedId?: number | null // the ID of another Contact linked to this one
    linkPrecedence?: "secondary" | "primary" // "primary" if it's the first Contact in the link
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}

export type APIRequest = {
    email?: string
    phoneNumber?: string
}

export type APIResponse = {
    contact: {
        primaryContactId: number,
        emails: string[], // first element being email of primary contact 
        phoneNumbers: string[], // first element being phoneNumber of primary contact
        secondaryContactIds: number[] // Array of all Contact IDs that are "secondary" to the primary contact
    }

}