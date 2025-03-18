import dotenv from "dotenv";
dotenv.config();

import mysql from "mysql2";
import { promisify } from "util";

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

const query = promisify(db.query).bind(db);

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    console.error("Error details:", err);
    process.exit(1);
  } else {
    console.log("Database connected successfully.");
  }
});

export default query;
