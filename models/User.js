const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    bio: { type: String, default: '' },
    profilePic: { type: String, default: '' },
    location: { type: String, default: '' },
    dateOfBirth: { type: Date, default: null },
    privacySettings: { type: String, enum: ['public', 'private'], default: 'public' },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);