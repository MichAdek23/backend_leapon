import express from 'express';
import { upload } from '../config/cloudinary.js';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Upload profile picture
router.post('/profile-picture', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Update user's profile picture in database
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: req.file.path },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      imageUrl: req.file.path,
      message: 'Profile picture uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ 
      message: error.message || 'Error uploading profile picture',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Upload session image
router.post('/session-image', auth, upload.single('sessionImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({ 
      imageUrl: req.file.path,
      message: 'Session image uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading session image:', error);
    res.status(500).json({ 
      message: error.message || 'Error uploading session image',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

export default router; 