export const config = {
  HOST: "localhost",
  PORT: 3306,
  USER: "root",
  PASSWORD: "GarimaVerma",
  DB: "contactsdb",
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};