import express from 'express';
import Session from '../models/Session.js';
import auth from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// @route   POST /api/sessions
// @desc    Create a new session
// @access  Private
router.post('/', auth, [
  body('mentor', 'Mentor ID is required').notEmpty(),
  body('mentee', 'Mentee ID is required').notEmpty(),
  body('date', 'Date is required').notEmpty(),
  body('duration', 'Duration is required').isNumeric(),
  body('topic', 'Topic is required').notEmpty(),
  body('type', 'Type must be one-on-one or group').isIn(['one-on-one', 'group'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { mentor, mentee, date, duration, topic, type, notes } = req.body;

    // Validate that the user is either the mentor or mentee
    if (req.user.id !== mentor && req.user.id !== mentee) {
      return res.status(403).json({ message: 'Not authorized to create this session' });
    }

    const session = new Session({
      mentor,
      mentee,
      date,
      duration,
      topic,
      type,
      notes: notes || '',
      status: 'scheduled'
    });

    await session.save();
    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation Error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({ 
      message: 'Server error while creating session',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/sessions
// @desc    Get all sessions for the current user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [
        { mentor: req.user.id },
        { mentee: req.user.id }
      ]
    })
    .populate('mentor', 'name email')
    .populate('mentee', 'name email')
    .sort({ date: -1 });

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'Server error while fetching sessions' });
  }
});

// @route   GET /api/sessions/:id
// @desc    Get a specific session
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('mentor', 'name email')
      .populate('mentee', 'name email');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is authorized to view this session
    if (session.mentor._id.toString() !== req.user.id && 
        session.mentee._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this session' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ message: 'Server error while fetching session' });
  }
});

// @route   PUT /api/sessions/:id
// @desc    Update a session
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is authorized to update this session
    if (session.mentor.toString() !== req.user.id && 
        session.mentee.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this session' });
    }

    const { date, duration, notes, status, meetingLink } = req.body;

    if (date) session.date = date;
    if (duration) session.duration = duration;
    if (notes) session.notes = notes;
    if (status) session.status = status;
    if (meetingLink) session.meetingLink = meetingLink;

    await session.save();
    res.json(session);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ message: 'Server error while updating session' });
  }
});

// @route   DELETE /api/sessions/:id
// @desc    Delete a session
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is authorized to delete this session
    if (session.mentor.toString() !== req.user.id && 
        session.mentee.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this session' });
    }

    await session.remove();
    res.json({ message: 'Session removed' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ message: 'Server error while deleting session' });
  }
});

// Get all sessions for a mentee
router.get('/mentee', auth, async (req, res) => {
  try {
    const sessions = await Session.find({ mentee: req.user.id })
      .populate('mentor', 'name email profileImage')
      .sort({ date: 1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get upcoming sessions
router.get('/upcoming', auth, async (req, res) => {
  try {
    const sessions = await Session.find({
      mentee: req.user.id,
      date: { $gte: new Date() },
      status: 'scheduled'
    })
      .populate('mentor', 'name email profileImage')
      .sort({ date: 1 })
      .limit(5);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get session by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('mentor', 'name email profileImage')
      .populate('mentee', 'name email profileImage');
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is authorized to view this session
    if (session.mentee.toString() !== req.user.id && session.mentor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update session status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is authorized to update this session
    if (session.mentee.toString() !== req.user.id && session.mentor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    session.status = req.body.status;
    await session.save();

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add feedback to session
router.post('/:id/feedback', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is authorized to add feedback
    if (session.mentee.toString() !== req.user.id && session.mentor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    session.feedback.push({
      user: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment
    });

    await session.save();

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/sessions/pending
// @desc    Get pending sessions for the current user
// @access  Private
router.get('/pending', auth, async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [
        { mentor: req.user.id },
        { mentee: req.user.id }
      ],
      status: 'scheduled',
      date: { $gte: new Date() }
    })
    .populate('mentor', 'name email')
    .populate('mentee', 'name email')
    .sort({ date: 1 });

    res.json(sessions);
  } catch (err) {
    console.error('Error fetching pending sessions:', err);
    res.status(500).json({ message: 'Server error while fetching sessions' });
  }
});

// @route   GET api/sessions/history
// @desc    Get completed sessions for the current user
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [
        { mentor: req.user.id },
        { mentee: req.user.id }
      ],
      status: 'completed'
    })
    .populate('mentor', 'name email')
    .populate('mentee', 'name email')
    .sort({ date: -1 });

    res.json(sessions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/sessions/:id/status
// @desc    Update session status (complete/cancel)
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is authorized to update this session
    if (session.mentor.toString() !== req.user.id && session.mentee.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    session.status = req.body.status;
    await session.save();

    res.json(session);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router; 