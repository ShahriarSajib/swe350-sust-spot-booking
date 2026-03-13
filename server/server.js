const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');

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

  

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/users', userRoutes);
app.use('/api/spots', require('./routes/spotRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));