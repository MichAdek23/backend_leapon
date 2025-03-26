import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from './models/User.js';

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
      allowedHeaders: ['Authorization', 'Content-Type']
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // Middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (err) {
      console.error('Socket authentication error:', err);
      next(new Error('Authentication error'));
    }
  });

  // Handle socket connections
  io.on('connection', (socket) => {
    console.log('User connected:', socket.user._id);

    // Join user's room for private messages
    socket.join(socket.user._id.toString());

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.user._id);
    });

    // Handle socket errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  // Store io instance in app for use in routes
  return io;
};

export default initializeSocket; 