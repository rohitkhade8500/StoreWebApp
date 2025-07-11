const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db');

const authenticate = require('../middleware/authMiddleware'); 
const authorizeRole = require('../middleware/roleMiddleware'); 

// POST /api/admin/users - Add a new user (admin only)
router.post('/users', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Basic validation
    if (!name || !email || !password || !address || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address, role]
    );

    res.status(201).json({ message: 'User created successfully', userId: result.insertId });
  } catch (error) {
    console.error('Admin add user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new store
router.post('/stores', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const { name, email, address } = req.body;

    if (!name || !email || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const [existing] = await pool.query('SELECT * FROM stores WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Store with this email already exists' });
    }

    const [result] = await pool.query(
      'INSERT INTO stores (name, email, address) VALUES (?, ?, ?)',
      [name, email, address]
    );

    res.status(201).json({ message: 'Store added successfully', storeId: result.insertId });
  } catch (error) {
    console.error('Add store error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET all users with optional filters
router.get('/users', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const { name, email, address, role } = req.query;

    let query = 'SELECT id, name, email, address, role FROM users WHERE 1=1';
    const params = [];

    if (name) {
      query += ' AND name LIKE ?';
      params.push(`%${name}%`);
    }
    if (email) {
      query += ' AND email LIKE ?';
      params.push(`%${email}%`);
    }
    if (address) {
      query += ' AND address LIKE ?';
      params.push(`%${address}%`);
    }
    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Admin fetch users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET all stores with optional filters (and average rating)
router.get('/stores', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const { name, email, address } = req.query;

    let query = `
      SELECT s.id, s.name, s.email, s.address,
        ROUND(AVG(r.rating), 1) AS average_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    const params = [];

    if (name) {
      query += ' AND s.name LIKE ?';
      params.push(`%${name}%`);
    }
    if (email) {
      query += ' AND s.email LIKE ?';
      params.push(`%${email}%`);
    }
    if (address) {
      query += ' AND s.address LIKE ?';
      params.push(`%${address}%`);
    }

    query += ' GROUP BY s.id ORDER BY s.name ASC';

    const [stores] = await pool.query(query, params);
    res.json(stores);
  } catch (error) {
    console.error('Admin fetch stores error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET a single user by ID, include rating if store owner
router.get('/user/:id', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const userId = req.params.id;

    const [users] = await pool.query(
      'SELECT id, name, email, address, role FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    // If user is a store owner, fetch average rating
    if (user.role === 'store_owner') {
      const [ratings] = await pool.query(
        `SELECT ROUND(AVG(r.rating), 1) AS average_rating
         FROM ratings r
         INNER JOIN stores s ON s.id = r.store_id
         WHERE s.email = ?`,
        [user.email]
      );

      user.average_rating = ratings[0].average_rating || 0;
    }

    res.json(user);
  } catch (error) {
    console.error('Admin fetch user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/dashboard - Summary stats for admin
router.get('/dashboard', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) AS totalUsers FROM users');
    const [[{ totalStores }]] = await pool.query('SELECT COUNT(*) AS totalStores FROM stores');
    const [[{ totalRatings }]] = await pool.query('SELECT COUNT(*) AS totalRatings FROM ratings');

    res.json({
      totalUsers,
      totalStores,
      totalRatings,
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
