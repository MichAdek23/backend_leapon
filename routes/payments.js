import express from 'express';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import paystack from '../services/paystack.js';

const router = express.Router();

// @route   POST api/payments/initialize
// @desc    Initialize Paystack payment
// @access  Private
router.post('/initialize', auth, async (req, res) => {
  try {
    const { email } = req.body;
    const reference = new Date().getTime().toString();
    
    // Initialize Paystack transaction
    const paystackResponse = await paystack.initializeTransaction(
      email,
      500, // Amount in Naira
      reference
    );

    if (!paystackResponse.status) {
      return res.status(400).json({ message: 'Failed to initialize payment' });
    }

    // Create payment record
    const payment = new Payment({
      user: req.user.id,
      amount: 500,
      reference,
      paymentMethod: 'paystack',
      status: 'pending'
    });

    await payment.save();

    res.json({
      authorizationUrl: paystackResponse.data.authorization_url,
      reference
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/payments/verify/:reference
// @desc    Verify payment and update user status
// @access  Private
router.get('/verify/:reference', auth, async (req, res) => {
  try {
    const { reference } = req.params;
    
    // Find payment record
    const payment = await Payment.findOne({ reference });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Verify with Paystack
    const paystackResponse = await paystack.verifyTransaction(reference);
    
    if (!paystackResponse.status || paystackResponse.data.status !== 'success') {
      payment.status = 'failed';
      await payment.save();
      return res.status(400).json({ message: 'Payment verification failed' });
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

export default router; 