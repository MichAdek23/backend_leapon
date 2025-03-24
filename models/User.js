import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['student', 'mentor']
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
    type: String
  },
  // Student specific fields
  department: {
    type: String
  },
  yearOfStudy: {
    type: String
  },
  // Common fields
  overview: {
    type: String
  },
  interests: [{
    type: String
  }],
  linkedIn: {
    type: String
  },
  twitter: {
    type: String
  },
  instagram: {
    type: String
  },
  website: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
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