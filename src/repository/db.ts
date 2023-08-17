import mysql from "mysql2/promise";
import { config } from "../helper/db-config";

export const connection: mysql.Pool = mysql.createPool({
  host: config.HOST,
  user: config.USER,
  password: config.PASSWORD,
  database: config.DB
});