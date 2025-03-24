import express from 'express';
import auth from '../middleware/auth.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

const router = express.Router();

// @route   GET api/messages
// @desc    Get all messages for the current user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { recipient: req.user.id }]
    })
    .populate('sender', 'name email')
    .populate('recipient', 'name email')
    .sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/messages/:userId
// @desc    Get conversation with a specific user
// @access  Private
router.get('/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user.id }
      ]
    })
    .populate('sender', 'name email')
    .populate('recipient', 'name email')
    .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/messages
// @desc    Send a message
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { recipientId, content } = req.body;

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    const message = new Message({
      sender: req.user.id,
      recipient: recipientId,
      content
    });

    await message.save();

    // Populate sender and recipient details
    await message.populate('sender', 'name email');
    await message.populate('recipient', 'name email');

    // Emit socket event
    req.app.get('io').to(recipientId).emit('newMessage', message);

    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/messages/:messageId/read
// @desc    Mark a message as read
// @access  Private
router.put('/:messageId/read', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if the current user is the recipient
    if (message.recipient.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    message.read = true;
    await message.save();

    // Emit socket event for message read
    req.app.get('io').to(message.sender.toString()).emit('messageRead', message._id);

    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/messages/unread/count
// @desc    Get count of unread messages
// @access  Private
router.get('/unread/count', auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.user.id,
      read: false
    });

    res.json({ count });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router; 