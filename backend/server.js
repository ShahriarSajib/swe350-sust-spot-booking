require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');

// Routes
const userRoutes = require('./routes/userRoutes');
const spotRoutes = require('./routes/spotRoutes');
const availabilityRoutes = require('./routes/availabilityCalenderRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const eventRoutes = require('./routes/eventRoutes');
const adminRoutes = require('./routes/adminRoutes');
const blogRoutes = require('./routes/blogRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const notificationRoutes = require("./routes/notificationRoutes");
const adminNotificationRoutes = require("./routes/adminNotificationRoutes");
const approverRoutes = require("./routes/approverRoutes");

// DB (now env is already loaded)
require('./config/db');

const app = express();

// ================= MIDDLEWARE =================

const allowedOrigins = [
  process.env.CLIENT_URL,           // Set this in Render dashboard env vars
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // Allow any vercel.app subdomain (covers all your Vercel preview URLs too)
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    // Allow explicitly listed origins
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS not allowed for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
}));

// Body parser
app.use(express.json());

// Static files
app.use("/uploads", express.static("uploads"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ================= ROUTES =================

app.use('/api/users', userRoutes);
app.use('/api/spots', spotRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/recommendations', recommendationRoutes);
//admin
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin/notifications", adminNotificationRoutes);
app.use("/api/approver", approverRoutes);
// ================= 404 HANDLER =================

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

// ================= GLOBAL ERROR HANDLER =================

app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  res.status(500).json({
    message: err.message || 'Server Error'
  });
});

// ================= SERVER START =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

