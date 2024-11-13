const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// Update User Profile
exports.updateProfile = async (req, res) => {
    const { bio, location, dateOfBirth, privacySettings } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.bio = bio || user.bio;
        user.location = location || user.location;
        user.dateOfBirth = dateOfBirth || user.dateOfBirth;
        user.privacySettings = privacySettings || user.privacySettings;

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Upload Profile Picture
exports.uploadProfilePic = (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(404).json({ message: 'User not found' });

        const filePath = path.join(__dirname, '../uploads', req.file.filename);
        user.profilePic = filePath;
        user.save();

        res.status(200).json({ message: 'Profile picture uploaded successfully', filePath });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

