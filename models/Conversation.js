import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  unreadCounts: {
    type: Map,
    of: Number,
    default: new Map()
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'blocked'],
    default: 'active'
  },
  metadata: {
    title: String,
    description: String,
    avatar: String,
    isGroup: {
      type: Boolean,
      default: false
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
});

// Indexes for faster queries
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageAt: -1 });
conversationSchema.index({ status: 1 });

// Method to get unread count for a user
conversationSchema.methods.getUnreadCount = function(userId) {
  return this.unreadCounts.get(userId.toString()) || 0;
};

// Method to increment unread count
conversationSchema.methods.incrementUnreadCount = async function(userId) {
  const currentCount = this.getUnreadCount(userId);
  this.unreadCounts.set(userId.toString(), currentCount + 1);
  await this.save();
};

// Method to reset unread count
conversationSchema.methods.resetUnreadCount = async function(userId) {
  this.unreadCounts.set(userId.toString(), 0);
  await this.save();
};

// Method to update last message
conversationSchema.methods.updateLastMessage = async function(messageId) {
  this.lastMessage = messageId;
  this.lastMessageAt = new Date();
  await this.save();
};

// Method to check if user is participant
conversationSchema.methods.isParticipant = function(userId) {
  return this.participants.some(p => p.toString() === userId.toString());
};

// Method to archive conversation
conversationSchema.methods.archive = async function() {
  this.status = 'archived';
  await this.save();
};

// Method to block conversation
conversationSchema.methods.block = async function() {
  this.status = 'blocked';
  await this.save();
};

// Method to unblock conversation
conversationSchema.methods.unblock = async function() {
  this.status = 'active';
  await this.save();
};

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation; 