const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { sendEmail } = require('../config/mailer');

// User Registration
exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user to DB
        const newUser = new User({
            firstName,
            lastName,
            email,
            phoneNumber,
            password: hashedPassword
        });

        // Generate OTP and send via email
        const otp = crypto.randomInt(100000, 999999).toString();
        await sendEmail(email, otp);
        const otpRecord = new OTP({
            email,
            otp,
            expiresAt: new Date(Date.now() + 60 * 60000) // OTP expires in 10 minutes
        });
        await otpRecord.save();

        await newUser.save();
        res.status(201).json({ message: 'User registered. Check your email for OTP.' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const otpRecord = await OTP.findOne({ email });
        if (!otpRecord) return res.status(400).json({ message: 'OTP not found' });
        if (otpRecord.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
        if (new Date() > otpRecord.expiresAt) return res.status(400).json({ message: 'OTP expired' });

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Password Reset
exports.resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
