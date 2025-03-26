import express from 'express';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';
import paystack from '../services/paystack.js';

const router = express.Router();

// @route   POST api/payment/initialize
// @desc    Initialize Paystack payment
// @access  Private
router.post('/initialize', auth, async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.user.id;

    console.log('Payment initialization request:', { userId, email });

    // Get user from database
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate unique reference
    const reference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log('Initializing Paystack transaction:', { email, reference });

    // Initialize transaction with Paystack
    const response = await paystack.initializeTransaction(
      email,
      500, // Amount in Naira
      reference
    );

    // Create payment record
    const payment = new Payment({
      user: userId,
      amount: 500,
      reference: response.data.reference,
      status: 'pending',
      paymentMethod: 'paystack'
    });
    await payment.save();

    // Store reference in user document
    user.paymentReference = reference;
    await user.save();

    console.log('Payment initialized successfully:', { reference });

    res.json({
      authorizationUrl: response.data.authorization_url,
      reference: response.data.reference
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({ 
      message: 'Failed to initialize payment',
      error: error.message 
    });
  }
});

// @route   POST api/payment/verify
// @desc    Verify payment and update user status
// @access  Private
router.post('/verify', auth, async (req, res) => {
  try {
    const { reference } = req.body;
    const userId = req.user.id;

    // Get user from database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get payment record
    const payment = await Payment.findOne({ reference });
    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }

    // Verify transaction with Paystack
    const response = await paystack.verifyTransaction(reference);

    if (response.data.status === 'success') {
      // Update payment status
      payment.status = 'completed';
      payment.paymentDate = new Date();
      await payment.save();

      // Update user payment status
      user.paymentCompleted = true;
      user.paymentReference = null;
      await user.save();

      res.json({ 
        message: 'Payment verified successfully',
        paymentCompleted: true 
      });
    } else {
      payment.status = 'failed';
      await payment.save();
      
      res.status(400).json({ 
        message: 'Payment verification failed',
        status: response.data.status 
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      message: 'Failed to verify payment',
      error: error.message 
    });
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