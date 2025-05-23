const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    // We'll use a known ID or ensure only one document for simplicity
    // For example, a field like uniqueIdentifier: { type: String, default: 'mainProfile', unique: true }
    // Or simply always find and update the first document.

    headshotImageUrl: {
        type: String, // Path to the uploaded headshot image on the server
        default: ''   // Default to no image
    },
    lastUpdatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// Ensure 'lastUpdatedAt' is updated on save
ProfileSchema.pre('save', function(next) {
    this.lastUpdatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Profile', ProfileSchema);