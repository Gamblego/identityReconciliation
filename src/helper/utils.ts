import { APIResponse, ContactType } from "../interface/common";
import { Constants } from "./used-constants";

export const convertContactToResponse = (contacts: ContactType[], primaryId: Number) => {
    let primaryContact = contacts.find(contact => contact.id! == primaryId);

    let result: APIResponse = {
        contact: {
            primaryContactId: primaryContact?.id!,
            emails: [primaryContact?.email!],
            phoneNumbers: [primaryContact?.phoneNumber!],
            secondaryContactIds: []
        }
    };

    contacts.forEach(contact => {
        if (contact.id! != primaryId) {
            result.contact.secondaryContactIds.push(contact.id!);
            if (contact.email && result.contact.emails.indexOf(contact.email) == -1) {
                result.contact.emails.push(contact.email!);
            }
    
            if (contact.phoneNumber && result.contact.phoneNumbers.indexOf(contact.phoneNumber) == -1) {
                result.contact.phoneNumbers.push(contact.phoneNumber!);
            }
        }
    });

    return result;
};