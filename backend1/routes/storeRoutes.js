const express = require('express');const router = express.Router();
const pool = require('../config/db');
const authenticate = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleMiddleware');

// GET /api/stores - Get all stores with average ratings
router.get('/', authenticate, async (req, res) => {

  try {
    const [rows] = await pool.query(`
      SELECT s.id, s.name, s.address, 
        ROUND(AVG(r.rating), 1) AS average_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
    `);

    res.json(rows);
  } catch (error) {
    console.error('Fetch stores error:', error);
    res.status(500).json({ message: 'Failed to fetch stores' });
  }
});

module.exports = router;
