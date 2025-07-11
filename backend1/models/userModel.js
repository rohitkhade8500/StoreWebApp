const pool = require('../config/db')

const findUserByEmail = async (email) => {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  )
  return rows[0]
}

const createUser = async (name, email, password, address, role) => {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
    [name, email, password, address, role]
  )
  return { id: result.insertId, name, email, role }
}

module.exports = {
  findUserByEmail,
  createUser,
}
