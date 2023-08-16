import mysql from "mysql";
import { config } from "../constant/db-config";

export const connection = mysql.createPool({
  host: config.HOST,
  user: config.USER,
  password: config.PASSWORD,
  database: config.DB
});

