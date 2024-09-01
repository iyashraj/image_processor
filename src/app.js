const express = require('express');
const connectDB = require('./database/db');
const imageRoutes = require('./routes/imageRoutes');

const app = express();
// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1', imageRoutes);

module.exports = app;