import { Constants } from "../helper/used-constants.js";
import { ContactType } from "../interface/common.js";
import { connection } from "./db.js";

export class Contact {
  constructor() { }

  async getAll() {
    console.log('get all contacts');
    const [result] = await connection.execute("SELECT * FROM contacts")
    return result;
  }

  async create(contact: ContactType) {
    console.log("create contact request: ", JSON.stringify(contact));
    let [newContact]: any[] =
      await connection.execute("INSERT INTO contacts " +
        "(linkPrecedence, createdAt, updatedAt, email, phoneNumber, linkedId) VALUES (?,?,?,?,?,?)",
        [contact.linkPrecedence!, contact.createdAt!, contact.updatedAt!, contact.email!, contact.phoneNumber!, contact.linkedId]);

    console.log("created contact: ", { ...contact, id: newContact.insertId });
    return { ...contact, id: newContact.insertId };
  };

  async findById(id: Number) {
    let result: any = await connection.execute("SELECT * FROM contacts WHERE id = ?", [id]);

    if (result.length) {
      console.log("found contact: ", result[0]);
      return result[0];
    }
  };

  // get all primary and secondary contacts connected to the query
  async getAllByEmailOrPhoneNumber(email?: String, phoneNumber?: String) {

    const whereClause = !email ? `c2.phoneNumber = '${phoneNumber}'` :
      !phoneNumber ? `c2.email = '${email}'` :
        `(c2.phoneNumber = '${phoneNumber}' OR c2.email = '${email}')`

    let query = 'SELECT * FROM contacts c1 WHERE EXISTS (SELECT * FROM contacts c2 WHERE (c1.id = c2.id OR c1.id = c2.linkedId OR c1.linkedId = c2.linkedId OR c1.linkedId = c2.id) AND ' + whereClause + ')';

    let [result] = await connection.execute(query);

    console.log("contacts: ", JSON.stringify(result));
    return result;
  };

  async updateAllByLinkedId(parentId: Number, childId: Number) {
    // we have to update all contacts of any contact, 
    // so the primary id and all secondary ids linked to it 
    let [result]: any[] = await connection.query(
      "UPDATE contacts SET linkedId = ?, updatedAt = ?, linkPrecedence = ? WHERE id = ? OR linkedId = ?",
      [parentId, new Date(), Constants.SECONDARY, childId, childId]);

    if (result.affectedRows == 0) {
      return false;
    }

    console.log("rows affected: ", result.affectedRows);
    return true;
  };

}

