require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const PORT = process.env.PORT || 5000; // ✅ FIX HERE

const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');
const videoRoutes = require('./routes/videoRoutes');
const advertisementRoutes = require('./routes/advertisementRoutes');
const publicRoutes = require('./routes/publicEventRoutes');

const app = express();

// CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
connectDB();



// Auth and core routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/events', eventRoutes);
app.use('/api/user', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/stories', require('./routes/storyRoutes'));
app.use('/api/advertisements', advertisementRoutes);
app.use('/api/events', publicRoutes);


// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/videos', express.static(path.join(__dirname, 'videos')));
app.use('/stories', express.static(path.join(__dirname, 'stories')));
app.use('/ads', express.static(path.join(__dirname, 'ads')));


// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Server start
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
