import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Chat from './models/Chat.js';
import todoRoutes from './routes/todos.js';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chats.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/chats', chatRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

const connectedUsers = new Map();

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new Error('User not found'));
    }

    socket.userId = user._id.toString();
    socket.username = user.username;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', async (socket) => {
  const userId = socket.userId;
  connectedUsers.set(userId, socket.id);

  await User.findByIdAndUpdate(userId, {
    isOnline: true,
    lastSeen: new Date(),
  });

  socket.broadcast.emit('user-online', { userId });

  socket.on('join-chat', (chatId) => {
    socket.join(`chat-${chatId}`);
  });

  socket.on('send-message', async (data) => {
    try {
      const { chatId, text } = data;
      const chat = await Chat.findById(chatId);

      if (!chat) {
        return;
      }

      const participantIds = chat.participants.map(p => p.toString());
      if (!participantIds.includes(userId)) {
        return;
      }

      chat.messages.push({
        sender: userId,
        text: text.trim(),
      });

      chat.lastMessage = new Date();
      await chat.save();

      await chat.populate('participants', 'username email avatar isOnline');
      await chat.populate('messages.sender', 'username avatar');

      io.to(`chat-${chatId}`).emit('new-message', {
        chat: chat,
        message: chat.messages[chat.messages.length - 1],
      });
    } catch (error) {
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('typing', (data) => {
    socket.to(`chat-${data.chatId}`).emit('typing', {
      userId,
      username: socket.username,
      isTyping: data.isTyping,
    });
  });

  socket.on('disconnect', async () => {
    connectedUsers.delete(userId);
    await User.findByIdAndUpdate(userId, {
      isOnline: false,
      lastSeen: new Date(),
    });
    socket.broadcast.emit('user-offline', { userId });
  });
});

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-todos')
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(() => {
    process.exit(1);
  });

