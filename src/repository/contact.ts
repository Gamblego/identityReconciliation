import { QueryResult } from "pg";
import { Constants } from "../helper/used-constants.js";
import { ContactType } from "../interface/common.js";
import { connection } from "./db.js";

export class Contact {
  constructor() { }

  async getAll() {
    console.log('get all contacts');
    const result = await connection.query("SELECT * FROM contacts")
    return result.rows;
  }

  async create(contact: ContactType) {
    console.log("create contact request: ", JSON.stringify(contact));
    const query = {
      text: "INSERT INTO contacts (linkPrecedence, createdAt, updatedAt, email, phoneNumber, linkedId) VALUES ($1,$2,$3,$4,$5,$6)",
      values: [contact.linkPrecedence!, contact.createdAt!, contact.updatedAt!, contact.email!, contact.phoneNumber!, contact.linkedId]
    }
    let newContact = await connection.query(query);
    console.log("created contact: ", { ...contact, id: newContact.rows[0].id });
    return { ...contact, id: newContact.rows[0].id };
  };

  async findById(id: Number) {
    let result = await connection.query("SELECT * FROM contacts WHERE id = $1", [id]);

    if (result.rows.length) {
      console.log("found contact: ", result.rows[0]);
      return result.rows[0];
    }
  };

  // get all primary and secondary contacts connected to the query
  async getAllByEmailOrPhoneNumber(email?: String, phoneNumber?: String) {

    const whereClause = !email ? `c2.phoneNumber = '${phoneNumber}'` :
      !phoneNumber ? `c2.email = '${email}'` :
        `(c2.phoneNumber = '${phoneNumber}' OR c2.email = '${email}')`

    let query = 'SELECT * FROM contacts c1 WHERE EXISTS (SELECT * FROM contacts c2 \
      WHERE (c1.id = c2.id OR c1.id = c2.linkedId OR c1.linkedId = c2.linkedId OR c1.linkedId = c2.id) \
      AND ' + whereClause + ')';

    let result = await connection.query(query);

    console.log("contacts: ", JSON.stringify(result.rows));
    return result.rows;
  };

  async updateAllByLinkedId(parentId: Number, childId: Number) {
    // we have to update all contacts of any contact, 
    // so the primary id and all secondary ids linked to it 
    let result = await connection.query(
      "UPDATE contacts SET linkedId = $1, updatedAt = $2, linkPrecedence = $3 WHERE id = $4 OR linkedId = $5",
      [parentId, new Date(), Constants.SECONDARY, childId, childId]);

    if (result.rowCount == 0) {
      return false;
    }

    console.log("rows affected: ", result.rowCount);
    return true;
  };

}
