const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not configured.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true },
  connectionTimeoutMillis: 10000,
});

const connectDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await pool.query("SELECT 1");
    console.log("Supabase PostgreSQL connected.");
  } catch (error) {
    console.error("Supabase PostgreSQL connection error:", error.message);
    process.exit(1);
  }
};

module.exports = { connectDB, pool };