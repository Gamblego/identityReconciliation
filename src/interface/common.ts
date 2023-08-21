/**
* @swagger
* components:
*   schemas:
*     ContactType:
*       type: object
*       properties:
*         email:
*           type: string
*         phone_number:
*           type: string
*         linked_id:
*           type: integer
*         linked_precedence:
*           type: string
*           enum:
*             - primary
*             - secondary
*         created_at:
*           type: string
*           format: date-time
*         update_at:
*           type: string
*           format: date-time
*         deleted_at:
*           type: string
*           format: date-time
*/
export type ContactType = {
    id?: number
    phone_number?: string | null
    email?: string | null
    linked_id?: number | null // the ID of another Contact linked to this one
    link_precedence?: "secondary" | "primary" // "primary" if it's the first Contact in the link
    created_at?: Date
    updated_at?: Date
    deleted_at?: Date
}

/**
* @swagger
* components:
*   schemas:
*     APIRequest:
*       type: object
*       properties:
*         email:
*           type: string
*         phoneNumber:
*           type: string
*/

export type APIRequest = {
    email?: string
    phoneNumber?: string
}

/**
* @swagger
* components:
*   schemas:
*     APIResponse:
*       type: object
*       properties:
*         primaryId:
*           type: integer
*         emails:
*           type: array
*           items:
*             type: string
*         phoneNumbers:
*           type: array
*           items:
*             type: string
*         secondaryContactIds:
*           type: array
*           items:
*             type: integer
*/

export type APIResponse = {
    contact: {
        primaryContactId: number,
        emails: string[], // first element being email of primary contact 
        phoneNumbers: string[], // first element being phoneNumber of primary contact
        secondaryContactIds: number[] // Array of all Contact IDs that are "secondary" to the primary contact
    }

}