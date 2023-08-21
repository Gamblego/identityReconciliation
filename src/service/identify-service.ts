import { convertContactToResponse, validateEmail, validatePhoneNumber } from "../helper/utils";
import { APIRequest, ContactType } from "../interface/common";
import { Contact } from "../repository/contact";

export const identifyContact = async (req: APIRequest) => {
  /*
      find the unique set of primary ids present after query
      3 cases possible:
          1. no contacts present - new primary entry
          2. 1 primary id present - new secondary entry
          3. 2 primary ids present - check basis created_at and 
          convert one of the primary with newest contacts to secondary
 
      more than 2 primary ids not possible
  */
  try {
    const { email, phoneNumber } = req;


    if (!email && !phoneNumber) throw new Error('Email and phone number cannot be undefined')

    if (email && !validateEmail(email)) throw new Error('Invalid Email ')

    if (phoneNumber && !validatePhoneNumber(phoneNumber)) throw new Error('Invalid Phone Number')

    console.log("Incoming request: ", JSON.stringify(req));
    const contactRepository = new Contact()

    // contains all contacts whose data match and their primary contacts
    let existingContacts: any = await contactRepository.getAllByEmailOrPhoneNumber(email, phoneNumber);
    let primaryId: number;

    // case 1: no contact at all
    if (!existingContacts || existingContacts.length === 0) {
      let newContact: ContactType = {
        link_precedence: "primary",
        email: email || null,
        phone_number: phoneNumber || null,
        created_at: new Date(),
        updated_at: new Date(),
        linked_id: null
      };
      existingContacts = [await contactRepository.create(newContact)];
      console.log('check1')
      primaryId = existingContacts[0].id;
    } else {
      // set of primary contacts                    
      let primaryContacts: ContactType[] = existingContacts.filter((contact: any) => contact.link_precedence === "primary");
      primaryId = primaryContacts[0].id!;

      if (primaryContacts.length === 1) {
        let phoneNumberExists: boolean = existingContacts.some((contact: ContactType) => {
          return contact.phone_number === phoneNumber
        });

        let emailExists: boolean = existingContacts.some((contact: ContactType) => {
          return contact.email === email
        });

        // case 2: new secondary contact
        if (!phoneNumberExists || !emailExists) {
          let newContact: ContactType = {
            link_precedence: "secondary",
            email: email || null,
            phone_number: phoneNumber || null,
            created_at: new Date(),
            updated_at: new Date(),
            linked_id: primaryId
          };

          existingContacts.push(await contactRepository.create(newContact));
        }
      } else {
        // case 3: multiple primary contacts
        let secondaryId = primaryContacts[1].id!;
        if (primaryContacts[0].created_at! > primaryContacts[1].created_at!) {
          primaryId = primaryContacts[1].id!;
          secondaryId = primaryContacts[0].id!;
        }

        await contactRepository.updateAllByLinkedId(primaryId, secondaryId);

      }
    }

    return convertContactToResponse(existingContacts, primaryId);
  } catch (err) {
    throw new Error(`[identifyContact] ${JSON.stringify(err)}`)
  }
}

export const getTable = async () => {
  try {
    const contactRepository = new Contact()
    return await contactRepository.getAll()
  } catch (err) {
    throw new Error(`[getTable] ${JSON.stringify(err)}`)
  }
}