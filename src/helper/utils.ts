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

export function validatePhoneNumber(phoneNumber: string): boolean {
    // Remove all non-digit characters from the phone number
    const cleanedNumber = phoneNumber.replace(/[^\d]/g, '');

    // Check if the cleaned number consists only of digits
    if (!/^\d+$/.test(cleanedNumber)) {
        return false;
    }

    // Check if the cleaned number is of a valid length
    if (cleanedNumber.length < 10 || cleanedNumber.length > 11) {
        return false;
    }
    return true;
}

export function validateEmail(email: string): boolean {
    // Regular expression pattern for basic email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Test the email against the pattern
    return emailPattern.test(email);
}
