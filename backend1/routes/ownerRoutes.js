const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleMiddleware');
const pool = require('../config/db');

// GET /api/owner/dashboard
router.get('/dashboard', authenticate, authorizeRole('owner'), async (req, res) => {

    console.log('Decoded User:', req.user); 
  try {
    const ownerId = req.user.id;

    // Get the store owned by the logged-in user
    const [storeRows] = await pool.query(
      'SELECT id, name FROM stores WHERE owner_id = ?',
      [ownerId]
    );

    if (storeRows.length === 0) {
      return res.status(404).json({ message: 'Store not found for this owner' });
    }

    const store = storeRows[0];

    // Get ratings for the store
    const [ratingsRows] = await pool.query(
      `SELECT r.rating, u.id as userId, u.name as userName
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?`,
      [store.id]
    );

    // Calculate average rating
    const avgRating =
      ratingsRows.length > 0
        ? (ratingsRows.reduce((sum, r) => sum + r.rating, 0) / ratingsRows.length).toFixed(1)
        : null;

    res.json({
      storeName: store.name,
      averageRating: avgRating,
      ratings: ratingsRows,
    });
  } catch (error) {
    console.error('Owner dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/auth/update-password
router.put('/update-password', authenticate, authorizeRole('owner'), async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const [userRows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
  const user = userRows[0];

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, userId]);

  res.json({ message: 'Password updated successfully' });
});


// PUT /api/owner/change-password
router.put('/change-password', authenticate, authorizeRole('owner'), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const ownerId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new passwords are required' });
    }

    const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [ownerId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await require('bcrypt').compare(currentPassword, rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashed = await require('bcrypt').hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, ownerId]);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
