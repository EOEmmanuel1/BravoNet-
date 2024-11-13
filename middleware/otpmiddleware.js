const OTP = require('../models/OTP');

const validateOtp = async (req, res, next) => {
    const { email, otp } = req.body;

    try {
        const otpRecord = await OTP.findOne({ email });
        if (!otpRecord) return res.status(400).json({ message: 'OTP not found' });

        if (otp !== otpRecord.otp) return res.status(400).json({ message: 'Invalid OTP' });
        if (new Date() > otpRecord.expiresAt) return res.status(400).json({ message: 'OTP expired' });

        next();
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = validateOtp;
