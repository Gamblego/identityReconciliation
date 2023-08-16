export type ContactType = {
    id: Number
    phoneNumber?: String
    email?: String
    linkedId?: Number // the ID of another Contact linked to this one
    linkPrecedence: "secondary" | "primary" // "primary" if it's the first Contact in the link
    createdAt: Date
    updatedAt: Date
    deletedAt?: Date
}

export type APIRequest = {
    email?: String
    phoneNumber?: Number
}

export type Response = {
    contact: {
        primaryContatctId: Number,
        emails: String[], // first element being email of primary contact 
        phoneNumbers: String[], // first element being phoneNumber of primary contact
        secondaryContactIds: Number[] // Array of all Contact IDs that are "secondary" to the primary contact
    }

}