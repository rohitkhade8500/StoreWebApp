const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authenticate = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleMiddleware');

// POST /api/ratings
router.post('/', authenticate, authorizeRole('user'), async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const user_id = req.user.id;

    if (!store_id || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Valid store_id and rating (1-5) are required' });
    }

    // Check if the rating exists for this user-store pair
    const [existing] = await pool.query(
      'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?',
      [user_id, store_id]
    );

    if (existing.length > 0) {
      // Update rating
      await pool.query(
        'UPDATE ratings SET rating = ?, updated_at = NOW() WHERE user_id = ? AND store_id = ?',
        [rating, user_id, store_id]
      );
      return res.json({ message: 'Rating updated successfully' });
    }

    // Insert new rating
    await pool.query(
      'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
      [user_id, store_id, rating]
    );

    res.status(201).json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
