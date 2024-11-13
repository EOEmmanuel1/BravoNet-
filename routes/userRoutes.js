const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Profile update route
router.put('/update-profile', authMiddleware, userController.updateProfile);

// Upload profile picture route
router.post('/upload-profile-pic', authMiddleware, upload.single('profilePic'), userController.uploadProfilePic);

module.exports = router;
