import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import messageRoutes from './routes/messages.js';
import sessionRoutes from './routes/sessions.js';
import profileRoutes from './routes/profile.js';
import resourcesRouter from './routes/resources.js';
import progressRouter from './routes/progress.js';
import conversationsRouter from './routes/conversations.js';
import http from 'http';
import setupSocket from './socket.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = setupSocket(server);
app.set('io', io); // Make io accessible to routes

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/image', express.static(path.join(__dirname, 'public', 'image')));

// Create uploads directory if it doesn't exist
try {
  await fs.mkdir(path.join(__dirname, 'uploads', 'profiles'), { recursive: true });
  await fs.mkdir(path.join(__dirname, 'public', 'image', 'mentors'), { recursive: true });
} catch (err) {
  console.error('Error creating directories:', err);
}

// Database connection
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://Michadek23:Michadek23@leap-on.6hskc.mongodb.net/?retryWrites=true&w=majority&appName=Leap-ON', {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 10,
      minPoolSize: 5,
      retryWrites: true,
      w: 'majority',
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 10000,
      retryReads: true,
      autoIndex: true,
      autoCreate: true
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
      console.error('MongoDB connection error stack:', err.stack);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
      setTimeout(connectDB, 5000);
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected');
    });

  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.error('MongoDB connection error stack:', err.stack);
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Leap-ON Mentorship Program API' });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/mentor', profileRoutes);
app.use('/api/resources', resourcesRouter);
app.use('/api/progress', progressRouter);
app.use('/api/conversations', conversationsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: err.message
  });
  next();
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 