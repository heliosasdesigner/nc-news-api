const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({ path: `${__dirname}/../.env.${ENV}` });
const config = {};
const db = new Pool(config);

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("No PGDATABASE or or DATABASE_URL configured");
} else {
  console.log(`Connected to ${process.env.PGDATABASE}`);
}

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

db.config = config;

module.exports = db;
