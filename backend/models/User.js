const { pool } = require("../config/db");

async function createUser({ name, email, password }) {
  const result = await pool.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email`,
    [name, email, password]
  );

  return result.rows[0];
}

async function findUserByEmail(email) {
  const result = await pool.query(
    "SELECT id, name, email, password FROM users WHERE email = $1",
    [email]
  );

  return result.rows[0] || null;
}

async function findUserById(id) {
  const result = await pool.query(
    "SELECT id, name, email FROM users WHERE id = $1",
    [id]
  );

  return result.rows[0] || null;
}

module.exports = { createUser, findUserByEmail, findUserById };
