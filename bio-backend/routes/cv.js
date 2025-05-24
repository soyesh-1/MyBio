const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // File system module
const Cv = require('../models/Cv'); // Your Cv model
const { protect, adminOnly } = require('../middleware/authMiddleware'); // Auth middleware

// --- Multer Configuration for File Uploads ---
// Ensure the upload directory exists
const cvUploadDir = path.join(__dirname, '../uploads/cv'); // Path relative to this routes file
if (!fs.existsSync(cvUploadDir)) {
    fs.mkdirSync(cvUploadDir, { recursive: true });
}

// Configure storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, cvUploadDir); // Save files to 'uploads/cv/'
    },
    filename: function (req, file, cb) {
        // Create a unique filename: fieldname-timestamp.extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to accept only PDFs (example)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Not a PDF file! Only PDF files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // Limit file size to 5MB (example)
    },
    fileFilter: fileFilter
});
// --- End Multer Configuration ---


// @route   POST /api/cv/upload
// @desc    Upload or replace the CV
// @access  Private (Admin only)
router.post('/upload', protect, adminOnly, upload.single('cvFile'), async (req, res) => {
    // 'cvFile' is the name of the field in the form-data that contains the file

    if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded. Please select a PDF file.' });
    }

    try {
        // Since we usually have only one CV, we can remove any existing CV entry
        // and then create a new one. Or update if exists.
        // For simplicity, let's remove old and add new.

        // Find and delete any existing CVs (and their files from the server)
        const existingCvs = await Cv.find();
        for (const oldCv of existingCvs) {
            const oldFilePath = path.join(__dirname, '..', oldCv.filePath); // Construct full path
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath); // Delete old file from server
            }
            await Cv.findByIdAndDelete(oldCv._id); // Delete old entry from DB
        }

        // Create new CV entry
        const newCv = new Cv({
            fileName: req.file.filename,
            originalName: req.file.originalname,
            filePath: `uploads/cv/${req.file.filename}`, // Store relative path for serving
            mimeType: req.file.mimetype,
            size: req.file.size
        });

        await newCv.save();
        res.status(201).json({
            msg: 'CV uploaded successfully',
            cv: newCv
        });

    } catch (error) {
        console.error('Error uploading CV:', error);
        // If it's a multer error (e.g., file too large, wrong type)
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ msg: error.message });
        } else if (error.message.startsWith('Not a PDF file!')) {
             return res.status(400).json({ msg: error.message });
        }
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/cv
// @desc    Get current CV information (e.g., file path to download)
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Find the most recently uploaded CV (or the only one if we enforce a single entry)
        const cv = await Cv.findOne().sort({ uploadedAt: -1 }); // Get the latest one

        if (!cv) {
            return res.status(404).json({ msg: 'No CV found' });
        }
        // Send back info needed to construct the download link on the frontend
        res.json({
            fileName: cv.originalName,
            filePath: cv.filePath, // e.g., 'uploads/cv/cvFile-1629407386705-123456789.pdf'
            uploadedAt: cv.uploadedAt
        });
    } catch (error) {
        console.error('Error fetching CV:', error);
        res.status(500).send('Server Error');
    }
});

// (Optional) @route DELETE /api/cv
// @desc    Delete the current CV
// @access  Private (Admin only)
router.delete('/', protect, adminOnly, async (req, res) => {
    try {
        const cv = await Cv.findOne().sort({ uploadedAt: -1 });
        if (!cv) {
            return res.status(404).json({ msg: 'No CV to delete' });
        }

        const filePathOnServer = path.join(__dirname, '..', cv.filePath);
        if (fs.existsSync(filePathOnServer)) {
            fs.unlinkSync(filePathOnServer); // Delete file from server
        }

        await Cv.findByIdAndDelete(cv._id); // Delete entry from DB

        res.json({ msg: 'CV deleted successfully' });
    } catch (error) {
        console.error('Error deleting CV:', error);
        res.status(500).send('Server Error');
    }
});


module.exports = router;