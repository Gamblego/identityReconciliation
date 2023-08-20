/**
* @swagger
* components:
*   schemas:
*     ContactType:
*       type: object
*       properties:
*         email:
*           type: string
*         phoneNumber:
*           type: string
*         linkedId:
*           type: integer
*         linkedPrecedence:
*           type: string
*           enum:
*             - primary
*             - secondary
*         createdAt:
*           type: string
*           format: date-time
*         updatedAt:
*           type: string
*           format: date-time
*         deletedAt:
*           type: string
*           format: date-time
*/
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