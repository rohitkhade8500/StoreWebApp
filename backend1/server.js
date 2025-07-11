const express = require('express');
require('dotenv').config();
const cors = require('cors');

const userRoutes = require('./routes/userRoutes'); 
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const storeRoutes = require('./routes/storeRoutes');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.use('/api/users', userRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/stores', storeRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
