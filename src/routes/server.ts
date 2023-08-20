import { createPool, Pool} from 'mysql2'

let pool: Pool;

export const init = () => {
    try {
        
      pool = createPool({
        connectionLimit: 10,
        host: "localhost",
        user: 'root',
        password: 'GarimaVerma',
        database: 'contactsdb'
      });
  
      console.debug('MySql Adapter Pool generated successfully');
    } catch (error) {
      console.error('[mysql.connector][init][Error]: ', error);
      throw new Error('failed to initialized pool');
    }
  }

  export const execute = (query: string, params: string[] | Object): Promise<any> => {
    try {
      if (!pool) throw new Error('Pool was not created. Ensure pool is created when running the app.');
  
      return new Promise<any>((resolve, reject) => {
        pool.query(query, params, (error, results) => {
          if (error) reject(error);
          else resolve(results);
        });
      });
  
    } catch (error) {
      console.error('[mysql.connector][execute][Error]: ', error);
      throw new Error('failed to execute MySQL query');
    }
  }
  