const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Profile = require('../models/Profile'); // Your new Profile model
const { protect, adminOnly } = require('../middleware/authMiddleware');

// --- Multer Configuration for Headshot Upload ---
const profileUploadDir = path.join(__dirname, '..', 'uploads', 'profile');
if (!fs.existsSync(profileUploadDir)) {
    fs.mkdirSync(profileUploadDir, { recursive: true });
}

const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, profileUploadDir); // Save files to 'uploads/profile/'
    },
    filename: function (req, file, cb) {
        // Consistent filename for the headshot to make it easy to replace
        cb(null, 'headshot' + path.extname(file.originalname));
    }
});

const imageFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) { // Accept common image types
        cb(null, true);
    } else {
        cb(new Error('Not an image file! Please upload JPG, PNG, GIF, or WEBP.'), false);
    }
};

const uploadHeadshot = multer({
    storage: profileStorage,
    limits: { fileSize: 1024 * 1024 * 2 }, // 2MB limit for headshot
    fileFilter: imageFileFilter
});
// --- End Multer Configuration ---


// @route   POST /api/profile/headshot
// @desc    Upload or replace the headshot image
// @access  Private (Admin only)
router.post('/headshot', protect, adminOnly, uploadHeadshot.single('headshotFile'), async (req, res) => {
    // 'headshotFile' is the name of the field in the form-data that contains the image

    if (!req.file) {
        return res.status(400).json({ msg: 'No image file uploaded.' });
    }

    try {
        const imagePath = `uploads/profile/${req.file.filename}`;

        // Find existing profile settings or create new if none exists
        // We'll use findOneAndUpdate with upsert to ensure only one profile document
        let profile = await Profile.findOneAndUpdate(
            {}, // Empty filter to match any/the first document (or create if none)
            { headshotImageUrl: imagePath, lastUpdatedAt: Date.now() },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        
        // If an old image existed and the filename is now different (though we force it to be 'headshot.ext'),
        // you might want to delete the old file from the server.
        // But since we use a consistent name 'headshot.ext', it will overwrite.

        res.status(201).json({
            msg: 'Headshot uploaded successfully',
            profile: profile
        });

    } catch (error) {
        console.error('Error uploading headshot:', error);
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ msg: error.message });
        } else if (error.message.startsWith('Not an image file!')) {
             return res.status(400).json({ msg: error.message });
        }
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/profile/headshot
// @desc    Get current headshot information
// @access  Public
router.get('/headshot', async (req, res) => {
    try {
        const profile = await Profile.findOne(); // Get the single profile document
        if (!profile || !profile.headshotImageUrl) {
            return res.status(404).json({ msg: 'No headshot image found' });
        }
        res.json({
            headshotImageUrl: profile.headshotImageUrl, // e.g., 'uploads/profile/headshot.png'
            lastUpdatedAt: profile.lastUpdatedAt
        });
    } catch (error) {
        console.error('Error fetching headshot:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;