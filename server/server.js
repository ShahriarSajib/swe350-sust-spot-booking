const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const availabilityRoutes = require('./routes/availabilityCalenderRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const path = require('path');
const cors = require('cors');

dotenv.config();
const app = express();

// Enable CORS for all origins
app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));
console.log(process.env.DB_NAME);
  

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/users', userRoutes);
app.use('/api/spots', require('./routes/spotRoutes'));
app.use('/api/availability', availabilityRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));