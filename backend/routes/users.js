import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { auth } from '../middleware/auth.js';
import crypto from 'crypto';
import Session from '../models/Session.js';
import Message from '../models/Message.js';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { sendVerificationEmail } from '../services/emailService.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads', 'profiles');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads', 'profiles'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 12 * 1024 * 1024 // 12MB limit
  },
  fileFilter: fileFilter
});

// @route   POST api/users/register
// @desc    Register a user (Step 1: Basic Info)
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        emailVerified: user.emailVerified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Error registering user',
      error: error.message 
    });
  }
});

// @route   PUT api/users/complete-profile
// @desc    Complete user profile (Step 2: Role-specific details)
// @access  Private
router.put('/complete-profile', auth, [
  body('department').if(body('role').equals('student')).notEmpty(),
  body('yearOfStudy').if(body('role').equals('student')).notEmpty(),
  body('expertise').if(body('role').equals('mentor')).isArray(),
  body('experience').if(body('role').equals('mentor')).notEmpty(),
  body('bio').optional(),
  body('overview').optional(),
  body('profilePicture').optional(),
  body('gender').optional(),
  body('social').optional(),
  body('interests').optional()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields based on role
    if (user.role === 'student') {
      user.department = req.body.department;
      user.yearOfStudy = req.body.yearOfStudy;
    } else if (user.role === 'mentor') {
      user.expertise = req.body.expertise;
      user.experience = req.body.experience;
    }

    // Update common profile fields
    user.profilePicture = req.body.profilePicture || user.profilePicture;
    user.gender = req.body.gender || user.gender;
    user.bio = req.body.bio || user.bio;
    user.overview = req.body.overview || user.overview;
    user.interests = req.body.interests || user.interests;

    // Update social media links
    if (req.body.social) {
      user.social = {
        linkedIn: req.body.social.linkedIn || user.social?.linkedIn || '',
        twitter: req.body.social.twitter || user.social?.twitter || '',
        instagram: req.body.social.instagram || user.social?.instagram || '',
        website: req.body.social.website || user.social?.website || ''
      };
    }

    user.profileCompleted = true;
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = {
      userId: user.id,
      role: user.role,
      profileCompleted: user.profileCompleted,
      paymentCompleted: user.paymentCompleted
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        // Return both token and user object
        res.json({ 
          token,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role || 'mentee', // Default to 'mentee' if role is not set
            profileCompleted: user.profileCompleted,
            paymentCompleted: user.paymentCompleted,
            emailVerified: user.emailVerified
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// @route   GET api/users/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/me
// @desc    Update user profile
// @access  Private
router.put('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fields that can be updated
    const updatableFields = [
      'name', 'fullName', 'firstName', 'lastName',
      'department', 'yearOfStudy', 'expertise', 'experience',
      'overview', 'interests', 'linkedIn', 'twitter',
      'instagram', 'website', 'availability', 'modeOfContact',
      'relationshipStatus'
    ];

    // Update all provided fields
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/users/profile-picture
// @desc    Upload profile picture
// @access  Private
router.post('/profile-picture', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    console.log('Profile picture upload request received:', {
      body: req.body,
      file: req.file,
      user: req.user
    });

    if (req.fileValidationError) {
      return res.status(400).json({ message: req.fileValidationError });
    }

    if (!req.file) {
      console.log('No file received in the request');
      return res.status(400).json({ message: 'Please select an image file to upload' });
    }

    // Get the URL for the uploaded file
    const imageUrl = `/uploads/profiles/${req.file.filename}`;
    console.log('File uploaded successfully:', {
      originalname: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      imageUrl
    });

    // Update user's profile picture URL in database
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    user.profilePicture = imageUrl;
    await user.save();
    console.log('User profile updated with new image:', imageUrl);

    res.json({ imageUrl });
  } catch (err) {
    console.error('Error uploading profile picture:', {
      error: err,
      stack: err.stack,
      code: err.code,
      message: err.message
    });
    
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size cannot exceed 12MB' });
    }

    res.status(500).json({ 
      message: 'Error uploading file', 
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// Request password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // TODO: Send email with reset token
    // For now, we'll just return the token in development
    if (process.env.NODE_ENV === 'development') {
      res.json({ resetToken });
    } else {
      res.json({ message: 'Password reset email sent' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    // Hash token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password has been reset' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Change password
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET api/users/mentors
// @desc    Get all mentors
// @access  Private
router.get('/mentors', auth, async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(mentors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/mentees
// @desc    Get all mentees
// @access  Private
router.get('/mentees', auth, async (req, res) => {
  try {
    const mentees = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(mentees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    // Get total sessions
    const totalSessions = await Session.countDocuments({
      $or: [
        { mentor: req.user.id },
        { mentee: req.user.id }
      ]
    });

    // Get total hours (assuming each session is 1 hour)
    const totalHours = totalSessions;

    // Get total messages
    const totalMessages = await Message.countDocuments({
      $or: [
        { sender: req.user.id },
        { recipient: req.user.id }
      ]
    });

    // Get upcoming sessions
    const upcomingSessions = await Session.countDocuments({
      $or: [
        { mentor: req.user.id },
        { mentee: req.user.id }
      ],
      status: 'scheduled',
      date: { $gte: new Date() }
    });

    res.json({
      totalSessions,
      totalHours,
      totalMessages,
      upcomingSessions
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Verify email route
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Find user with this verification token
    const user = await User.findOne({ 
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid or expired verification token' 
      });
    }

    // Update user's verification status
    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Redirect to frontend with success message
    res.redirect(`${process.env.FRONTEND_URL}/verify-email?status=success`);
  } catch (error) {
    console.error('Email verification error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/verify-email?status=error`);
  }
});

// Resend verification email route
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new verification token
    const verificationToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Update user with new token
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Send new verification email
    await sendVerificationEmail(email, verificationToken);

    res.json({ message: 'Verification email sent successfully' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'Failed to resend verification email' });
  }
});

export default router; 