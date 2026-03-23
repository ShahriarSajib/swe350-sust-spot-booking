require('dotenv').config({ path: './server/.env' });  

const express = require('express');
const path = require('path');
const cors = require('cors');

// Routes
const userRoutes = require('./routes/userRoutes');
const spotRoutes = require('./routes/spotRoutes');
const availabilityRoutes = require('./routes/availabilityCalenderRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const eventRoutes = require('./routes/eventRoutes');

// DB (now env is already loaded ✅)
require('./config/db');

const app = express();

// ================= MIDDLEWARE =================

// CORS (use env later)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Body parser
app.use(express.json());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ================= ROUTES =================

app.use('/api/users', userRoutes);
app.use('/api/spots', spotRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/events', eventRoutes);

// ================= 404 HANDLER =================

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

// ================= GLOBAL ERROR HANDLER =================

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);

  res.status(500).json({
    message: err.message || 'Server Error'
  });
});

// ================= SERVER START =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});