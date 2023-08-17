import { convertContactToResponse, validateEmail, validatePhoneNumber } from "../helper/utils";
import { APIRequest, ContactType } from "../interface/common";
import { Contact } from "../repository/contact";

export const identifyContact = async (req: APIRequest) => {
   /*
       find the unique set of primary ids present after query
       3 cases possible:
           1. no contacts present - new primary entry
           2. 1 primary id present - new secondary entry
           3. 2 primary ids present - check basis createdAt and 
           convert one of the primary with newest contacts to secondary

       more than 2 primary ids not possible
   */

   // validations: email and phone number and atleast 1 should be present
   try {
      const email = req.email
      const phoneNumber = req.phoneNumber

      if (!email && !phoneNumber) throw new Error('Email and phone number cannot be undefined')

      if (email && !validateEmail(email)) throw new Error('Invalid Email ')

      if (phoneNumber && !validatePhoneNumber(phoneNumber)) throw new Error('Invalid Phone Number')

      console.log("Incoming request: ", JSON.stringify(req));
      const contactRepository = new Contact()

      // contains all contacts whose data match and their primary contacts
      let existingContacts: any =
         await contactRepository.getAllByEmailOrPhoneNumber(req.email, req.phoneNumber);
      let primaryId: number;

      // case 1: no contact at all
      if (!existingContacts || existingContacts.length === 0) {
         let newContact: ContactType = {
            linkPrecedence: "primary",
            email: req.email || null,
            phoneNumber: req.phoneNumber || null,
            createdAt: new Date(),
            updatedAt: new Date(),
            linkedId: null
         };

         existingContacts = [await contactRepository.create(newContact)];
         primaryId = existingContacts[0].id;
      } else {
         // set of primary contacts                    
         let primaryContacts: ContactType[] =
            existingContacts.filter((contact: any) => contact.linkPrecedence === "primary");
         primaryId = primaryContacts[0].id!;

         if (primaryContacts.length === 1) {
            let phoneNumberExists: boolean = existingContacts.filter((contact: ContactType) => {
               return contact.phoneNumber === req.phoneNumber
            }).length > 0;

            let emailExists: boolean = existingContacts.filter((contact: ContactType) => {
               return contact.email === req.email
            }).length > 0;

            // case 2: new secondary contact
            if (!phoneNumberExists || !emailExists) {
               let newContact: ContactType = {
                  linkPrecedence: "secondary",
                  email: req.email || null,
                  phoneNumber: req.phoneNumber || null,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  linkedId: primaryId
               };

               existingContacts.push(await contactRepository.create(newContact));
            }
         } else {
            // case 3: multiple primary contacts
            let secondaryId = primaryContacts[1].id!;
            if (primaryContacts[0].createdAt! > primaryContacts[1].createdAt!) {
               primaryId = primaryContacts[1].id!;
               secondaryId = primaryContacts[0].id!;
            }

            contactRepository.updateAllByLinkedId(primaryId, secondaryId);

         }
      }

      return convertContactToResponse(existingContacts, primaryId);
   } catch(err){
      throw new Error(`[identifyContact] ${JSON.stringify(err)}`)
   }
}
