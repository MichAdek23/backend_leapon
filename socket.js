import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from './models/User.js';

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  // Middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  // Handle connections
  io.on('connection', (socket) => {
    console.log('User connected:', socket.user.name);

    // Join user's personal room
    socket.join(socket.user._id.toString());

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.user.name);
    });
  });

  return io;
};

export default setupSocket; 