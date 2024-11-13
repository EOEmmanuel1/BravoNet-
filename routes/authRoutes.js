const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateOtp = require('../middleware/otpMiddleware');

// User registration route
router.post('/register', authController.registerUser);

// User login route
router.post('/login', authController.loginUser);

// Verify OTP route
router.post('/verify-otp', validateOtp, authController.verifyOtp);

// Password reset route
router.post('/reset-password', authController.resetPassword);

module.exports = router;