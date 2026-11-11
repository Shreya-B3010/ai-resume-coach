const { randomUUID } = require("node:crypto");
const { query } = require("../config/db");

async function createUser({ name, email, password }) {
  const id = randomUUID();
  await query(
    `INSERT INTO users (id, name, email, password)
     VALUES (?, ?, ?, ?)`,
    [id, name, email, password]
  );

  return { id, name, email };
}

async function findUserByEmail(email) {
  const [rows] = await query(
    "SELECT id, name, email, password FROM users WHERE email = ?",
    [email]
  );

  return rows[0] || null;
}

async function findUserById(id) {
  const [rows] = await query(
    "SELECT id, name, email FROM users WHERE id = ?",
    [id]
  );

  return rows[0] || null;
}

module.exports = { createUser, findUserByEmail, findUserById };
