import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
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
    enum: ['mentor', 'mentee', 'admin']
  },
  mentorshipStatus: {
    type: String,
    enum: ['available', 'unavailable', 'busy'],
    default: 'available'
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  modeOfContact: {
    type: String,
    enum: ['email', 'phone', 'both']
  },
  availability: {
    type: String
  },
  bio: {
    type: String
  },
  overview: {
    type: String
  },
  profilePicture: {
    type: String
  },
  social: {
    twitter: String,
    facebook: String,
    whatsapp: String,
    instagram: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  paymentCompleted: {
    type: Boolean,
    default: false
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