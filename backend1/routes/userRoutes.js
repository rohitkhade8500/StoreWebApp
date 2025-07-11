const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authenticate = require('../middleware/authMiddleware');


// GET all users
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET /api/users/stores
router.get('/stores', authenticate, async (req, res) => {
  try {
    const [stores] = await pool.query(`
      SELECT 
        s.id, 
        s.name, 
        s.address,
        ROUND(AVG(r.rating), 1) AS average_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
      ORDER BY s.name
    `);
    res.json(stores);
  } catch (error) {
    console.error('User fetch stores error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// POST /api/users/ratings
router.post('/ratings', authenticate, async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const user_id = req.user.id; // from token

    if (!store_id || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    // Check if user has already rated this store
    const [existing] = await pool.query(
      'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?',
      [user_id, store_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'You have already rated this store' });
    }

    // Insert rating
    await pool.query(
      'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
      [user_id, store_id, rating]
    );

    res.status(201).json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// PUT /api/users/ratings
router.put('/ratings', authenticate, async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const user_id = req.user.id;

    if (!store_id || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    // Check if a rating exists
    const [existing] = await pool.query(
      'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?',
      [user_id, store_id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'No existing rating found for this store' });
    }

    // Update rating
    await pool.query(
      'UPDATE ratings SET rating = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND store_id = ?',
      [rating, user_id, store_id]
    );

    res.json({ message: 'Rating updated successfully' });
  } catch (error) {
    console.error('Update rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// routes/userRoutes.js
router.get('/stores', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const [stores] = await pool.query(`
      SELECT 
        s.id,
        s.name,
        s.email,
        s.address,
        ROUND(IFNULL(AVG(r.rating), 0), 1) AS average_rating,
        (
          SELECT rating
          FROM ratings
          WHERE store_id = s.id AND user_id = ?
          LIMIT 1
        ) AS user_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
    `, [userId]);

    res.json(stores);
  } catch (error) {
    console.error('Fetch stores error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
