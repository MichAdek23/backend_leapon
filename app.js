const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const userRoutes = require('./routes/users');
const sessionRoutes = require('./routes/sessions');
const messageRoutes = require('./routes/messages');
const conversationRoutes = require('./routes/conversations');
const resourceRoutes = require('./routes/resources');
const progressRoutes = require('./routes/progress');
const uploadRoutes = require('./routes/upload');

// Routes
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 