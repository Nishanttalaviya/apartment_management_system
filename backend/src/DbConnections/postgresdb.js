const { Pool } = require("pg");
require("dotenv").config();

const connectionObj = () => {
  const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "apartment_management",
    password: process.env.DB_PASSWORD || "RS1510pj*&",
    port: process.env.DB_PORT,
    max: process.env.DB_MAX,
  });

  // Test the connection
  pool
    .connect()
    .then((client) => {
      console.log("✅ Database connection successful!");
      client.release(); // release the client back to the pool
    })
    .catch((err) => {
      console.error("❌ Database connection failed:", err.message);
    });

  return pool;
};

module.exports = {
  connectionObj,
};
