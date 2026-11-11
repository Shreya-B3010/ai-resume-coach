const mysql = require("mysql2/promise");
const DATABASE_UNAVAILABLE_CODES = new Set([
  "DATABASE_UNAVAILABLE",
  "ECONNREFUSED",
  "ECONNRESET",
  "EHOSTUNREACH",
  "ENETUNREACH",
  "ENOTFOUND",
  "EAI_AGAIN",
  "ETIMEDOUT",
  "PROTOCOL_CONNECTION_LOST",
  "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR",
  "ER_CON_COUNT_ERROR",
  "ER_TOO_MANY_USER_CONNECTIONS",
]);

const pool = process.env.MYSQL_HOST &&
  process.env.MYSQL_USER &&
  process.env.MYSQL_DATABASE
    ? mysql.createPool({
        host: process.env.MYSQL_HOST,
        port: Number(process.env.MYSQL_PORT || 3306),
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD || "",
        database: process.env.MYSQL_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        connectTimeout: 10000,
      })
    : null;

pool?.on("error", (error) => {
  console.error("MySQL pool error:", error.message);
});

async function query(text, values = []) {
  if (!pool) {
    const error = new Error(
      "MYSQL_HOST, MYSQL_USER, and MYSQL_DATABASE must be configured."
    );
    error.code = "DATABASE_UNAVAILABLE";
    throw error;
  }

  return pool.execute(text, values);
}

function isDatabaseUnavailable(error) {
  return (
    DATABASE_UNAVAILABLE_CODES.has(error?.code) ||
    error?.sqlState?.startsWith("08") === true
  );
}

const connectDB = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id CHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(320) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
  `);
  console.log("MySQL connected.");
};

const checkDB = async () => {
  await query("SELECT 1 FROM users LIMIT 0");
};

module.exports = {
  checkDB,
  connectDB,
  isDatabaseUnavailable,
  query,
};