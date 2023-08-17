export type ContactType = {
    id?: Number
    phoneNumber?: String | null
    email?: String | null
    linkedId?: Number | null // the ID of another Contact linked to this one
    linkPrecedence?: "secondary" | "primary" // "primary" if it's the first Contact in the link
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}

export type APIRequest = {
    email?: String
    phoneNumber?: String
}

export type APIResponse = {
    contact: {
        primaryContactId: Number,
        emails: String[], // first element being email of primary contact 
        phoneNumbers: String[], // first element being phoneNumber of primary contact
        secondaryContactIds: Number[] // Array of all Contact IDs that are "secondary" to the primary contact
    }

}