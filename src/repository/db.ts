import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING
});

export const initiateConnection = () => {
  pool.connect(async () => {
    await pool.query("DROP TABLE IF EXISTS contacts")
    await pool.query("CREATE TABLE IF NOT EXISTS contacts (\
    id SERIAL PRIMARY KEY, \
    phoneNumber VARCHAR(50), \
    email VARCHAR(50), \
    linkedId INT, \
    linkPrecedence VARCHAR(50) NOT NULL, \
    createdAt DATE NOT NULL, \
    updatedAt DATE NOT NULL, \
    deletedAt DATE)")
  });
}

export const connection = pool;