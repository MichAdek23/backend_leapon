const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST api/payments/verify
// @desc    Verify payment and update user status
// @access  Private
router.post('/verify', auth, async (req, res) => {
  try {
    const { reference } = req.body;
    
    // Find payment record
    const payment = await Payment.findOne({ reference });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Update payment status
    payment.status = 'completed';
    await payment.save();

    // Update user's payment status
    const user = await User.findById(req.user.id);
    user.paymentCompleted = true;
    await user.save();

    res.json({ message: 'Payment verified successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/payments/history
// @desc    Get user's payment history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .sort({ paymentDate: -1 });
    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 