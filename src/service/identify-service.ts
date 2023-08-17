import { convertContactToResponse } from "../helper/utils";
import { APIRequest, ContactType } from "../interface/common";
import { Contact } from "../repository/contact";

export const identifyContact = async (req: APIRequest) => {
    /*
        find the unique set of primary ids present after query
        3 cases possible:
            1. no contacts present - new primary entry
            2. 1 primary id present - new secondary entry
            3. 2 primary ids present - check basis createdAt and 
            convert one of the primary contacts to secondary

        more than 2 primary ids not possible
    */

    // validations: email and phone number and atleast 1 should be present

    console.log("incoming request: ", JSON.stringify(req));

    // contains all contacts whose data match and their primary contacts
    let existingContacts: any = 
        await Contact.prototype.getAllByEmailOrPhoneNumber(req.email, req.phoneNumber);
    let primaryId = undefined;

    // case 1: no contact at all
    if (!existingContacts || existingContacts.length == 0) {
        let newContact: ContactType = {
            linkPrecedence: "primary",
            email: req.email || null,
            phoneNumber: req.phoneNumber || null,
            createdAt: new Date(),
            updatedAt: new Date(),
            linkedId: null
        };

        existingContacts = [await Contact.prototype.create(newContact)];
        primaryId = existingContacts[0].id!;
    } else {
        // set of primary contacts                    
        let primaryContacts: ContactType[] = 
            existingContacts.filter((contact: any) => contact.linkPrecedence == "primary");    
        primaryId = primaryContacts[0].id!;
        
        if (primaryContacts.length == 1) {
            let sameContactExists: boolean = existingContacts.filter((contact: any) => {
                return contact.phoneNumber == req.phoneNumber &&
                    contact.email == req.email;
            }).length > 0;

            // case 2: new secondary contact    
            if (!sameContactExists) {
                let newContact: ContactType = {
                    linkPrecedence: "secondary",
                    email: req.email || null,
                    phoneNumber: req.phoneNumber || null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    linkedId: primaryId
                };
    
                existingContacts.push(await Contact.prototype.create(newContact));
            }
        } else {
            // case 3: multiple primary contacts
            let secondaryId = primaryContacts[1].id!;
            if (primaryContacts[0].createdAt! > primaryContacts[1].createdAt!) {
                primaryId = primaryContacts[1].id!;
                secondaryId = primaryContacts[0].id!;
            }

            let updatedSet = Contact.prototype.updateAllByLinkedId(primaryId, secondaryId);
            
         }
    }

    return convertContactToResponse(existingContacts, primaryId);
}
