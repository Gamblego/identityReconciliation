import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING
});

// export const initiateConnection = () => {
//   pool.connect(async () => {
//     await pool.query("DROP TABLE IF EXISTS contacts")
//     await pool.query("CREATE TABLE IF NOT EXISTS contacts (\
//     id SERIAL PRIMARY KEY, \
//     phone_number VARCHAR(50), \
//     email VARCHAR(50), \
//     linked_id INT, \
//     link_precedence VARCHAR(50) NOT NULL, \
//     created_at DATE NOT NULL, \
//     updated_at DATE NOT NULL, \
//     deleted_at DATE)")
//   });
// }

export const connection = pool;