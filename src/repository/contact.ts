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
    let newContact = await connection.query("INSERT INTO contacts " +
        "(link_precedence, created_at, updated_at, email, phone_number, linked_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
        [contact.link_precedence!, contact.created_at!, contact.updated_at!, contact.email!, contact.phone_number!, contact.linked_id]);
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
  async getAllByEmailOrPhoneNumber(email?: String, phone_number?: String) {

    const whereClause = !email ? `c2.phone_number = '${phone_number}'` :
      !phone_number ? `c2.email = '${email}'` :
        `(c2.phone_number = '${phone_number}' OR c2.email = '${email}')`

    let query = 'SELECT * FROM contacts c1 WHERE EXISTS (SELECT * FROM contacts c2 \
      WHERE (c1.id = c2.id OR c1.id = c2.linked_id OR c1.linked_id = c2.linked_id OR c1.linked_id = c2.id) \
      AND ' + whereClause + ')';

    let result = await connection.query(query);

    console.log("contacts: ", JSON.stringify(result.rows));
    return result.rows;
  };

  async updateAllByLinkedId(parentId: Number, childId: Number) {
    // we have to update all contacts of any contact, 
    // so the primary id and all secondary ids linked to it 
    let result = await connection.query(
      "UPDATE contacts SET linked_id = $1, updated_at = $2, link_precedence = $3 WHERE id = $4 OR linked_id = $5",
      [parentId, new Date(), Constants.SECONDARY, childId, childId]);

    if (result.rowCount == 0) {
      return false;
    }

    console.log("rows affected: ", result.rowCount);
    return true;
  };

}
