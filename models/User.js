import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'mentor'],
    required: true
  },
  profilePicture: {
    type: String,
    default: null,
    get: function(url) {
      if (!url) return null;
      // If it's already a full URL, return it
      if (url.startsWith('http')) return url;
      // If it's a Cloudinary URL, return it
      if (url.includes('cloudinary')) return url;
      // If it's a relative path, construct the full URL
      return `${process.env.API_URL}${url}`;
    },
    set: function(url) {
      // If the URL is already a full URL or Cloudinary URL, store it as is
      if (url && (url.startsWith('http') || url.includes('cloudinary'))) {
        return url;
      }
      // Otherwise, store the relative path
      return url;
    }
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  // Mentor specific fields
  expertise: [{
    type: String
  }],
  experience: {
    type: String,
    required: function() {
      return this.role === 'mentor';
    }
  },
  // Student specific fields
  department: {
    type: String,
    required: function() {
      return this.role === 'student';
    }
  },
  yearOfStudy: {
    type: String,
    required: function() {
      return this.role === 'student';
    }
  },
  // Common fields
  overview: {
    type: String,
    default: ''
  },
  interests: [{
    type: String
  }],
  linkedIn: {
    type: String,
    default: ''
  },
  twitter: {
    type: String,
    default: ''
  },
  instagram: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.updatedAt = Date.now();
});

// Match password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export { userSchema };
export default User; 