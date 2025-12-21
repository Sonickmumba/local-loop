const pool = require('../config/db');

const getUsers = async () => {
  const results = await pool.query('SELECT * FROM users order by id asc');
  return results.rows;
};

const getUserById = async (id) => {
  const results = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return results.rows[0];
};

const createUser = async (name, email) => {
  const results = await pool.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id',
    [name, email]
  );
  return results.rows[0].id;
};

const updateUser = async (id, name, email) => {
  const results = await pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
    [name, email, id]
  );
  return results.rows[0];
};

const deleteUser = async (id) => {
  const results = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  return results.rows[0];
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};