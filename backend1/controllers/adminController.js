const pool = require('../config/db');

// 1. Add a new user (admin/user/owner)
const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashed = await require('bcrypt').hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashed, address, role]
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. Dashboard data
const getDashboardStats = async (req, res) => {
  try {
    const [[userCount]] = await pool.query('SELECT COUNT(*) AS totalUsers FROM users');
    const [[storeCount]] = await pool.query('SELECT COUNT(*) AS totalStores FROM stores');
    const [[ratingCount]] = await pool.query('SELECT COUNT(*) AS totalRatings FROM ratings');

    res.json({
      totalUsers: userCount.totalUsers,
      totalStores: storeCount.totalStores,
      totalRatings: ratingCount.totalRatings,
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createUser,
  getDashboardStats,
};
