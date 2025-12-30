import express from 'express';
import Chat from '../models/Chat.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
    })
      .populate('participants', 'username email avatar isOnline')
      .populate('messages.sender', 'username avatar')
      .sort({ lastMessage: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot chat with yourself' });
    }

    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, userId] },
    })
      .populate('participants', 'username email avatar isOnline')
      .populate('messages.sender', 'username avatar');

    if (!chat) {
      chat = new Chat({
        participants: [req.user._id, userId],
        messages: [],
      });
      await chat.save();
      await chat.populate('participants', 'username email avatar isOnline');
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:chatId/messages', authenticate, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    chat.messages.push({
      sender: req.user._id,
      text: text.trim(),
    });

    chat.lastMessage = new Date();
    await chat.save();

    await chat.populate('participants', 'username email avatar isOnline');
    await chat.populate('messages.sender', 'username avatar');

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:chatId/messages/:messageId/read', authenticate, async (req, res) => {
  try {
    const { chatId, messageId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const message = chat.messages.id(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      message.read = true;
      await chat.save();
    }

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

