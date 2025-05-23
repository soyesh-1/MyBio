const mongoose = require('mongoose');

const CvSchema = new mongoose.Schema({
    fileName: { // The name we give the file on the server (could be unique)
        type: String,
        required: true
    },
    originalName: { // The original name of the file uploaded by the user
        type: String,
        required: true
    },
    filePath: { // The path where the file is stored on the server
        type: String,
        required: true
    },
    mimeType: { // e.g., application/pdf
        type: String,
        required: true
    },
    size: { // File size in bytes
        type: Number,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
    // We'll assume only one CV document in this collection, or the latest one.
    // For simplicity, when a new CV is uploaded, we can replace the old document.
});

// To ensure there's only ever one CV document (the latest one),
// we can use a fixed ID or always update/replace the first found document.
// For now, we'll handle this logic in the route.

module.exports = mongoose.model('Cv', CvSchema);