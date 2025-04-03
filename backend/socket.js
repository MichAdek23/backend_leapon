import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Conversation from './models/Conversation.js';

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      // origin: 'http://localhost:5173',
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

    // Handle typing status
    socket.on('typing', async (data) => {
      const { conversationId, isTyping } = data;
      
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.isParticipant(socket.user._id)) {
          return;
        }

        const recipient = conversation.participants.find(
          p => p.toString() !== socket.user._id.toString()
        );

        if (recipient) {
          io.to(recipient.toString()).emit('userTyping', {
            conversationId,
            userId: socket.user._id,
            userName: socket.user.name,
            isTyping
          });
        }
      } catch (err) {
        console.error('Error handling typing status:', err);
      }
    });

    // Handle message read status
    socket.on('messageRead', async (data) => {
      const { messageId, conversationId } = data;
      
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.isParticipant(socket.user._id)) {
          return;
        }

        const sender = conversation.participants.find(
          p => p.toString() !== socket.user._id.toString()
        );

        if (sender) {
          io.to(sender.toString()).emit('messageRead', {
            messageId,
            conversationId
          });
        }
      } catch (err) {
        console.error('Error handling message read status:', err);
      }
    });

    // Handle online status
    socket.on('setOnlineStatus', async (status) => {
      try {
        await User.findByIdAndUpdate(socket.user._id, { isOnline: status });
        
        // Get user's conversations
        const conversations = await Conversation.find({
          participants: socket.user._id
        });

        // Notify conversation participants
        conversations.forEach(conversation => {
          conversation.participants.forEach(participant => {
            if (participant.toString() !== socket.user._id.toString()) {
              io.to(participant.toString()).emit('userStatusChanged', {
                userId: socket.user._id,
                userName: socket.user.name,
                isOnline: status
              });
            }
          });
        });
      } catch (err) {
        console.error('Error handling online status:', err);
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.user._id);
      
      try {
        // Set user as offline
        await User.findByIdAndUpdate(socket.user._id, { isOnline: false });
        
        // Get user's conversations
        const conversations = await Conversation.find({
          participants: socket.user._id
        });

        // Notify conversation participants
        conversations.forEach(conversation => {
          conversation.participants.forEach(participant => {
            if (participant.toString() !== socket.user._id.toString()) {
              io.to(participant.toString()).emit('userStatusChanged', {
                userId: socket.user._id,
                userName: socket.user.name,
                isOnline: false
              });
            }
          });
        });
      } catch (err) {
        console.error('Error handling disconnection:', err);
      }
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