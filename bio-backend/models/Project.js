const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Project description is required'],
        trim: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    tags: {
        type: [String],
        default: []
    },
    liveLink: {
        type: String,
        trim: true
    },
    githubLink: {
        type: String,
        trim: true
    },
    spotifyLink: { // <<< NEW FIELD
        type: String,
        trim: true,
        default: '' // Default to empty string if not provided
    },
    youtubeLink: { // <<< NEW FIELD
        type: String,
        trim: true,
        default: '' // Default to empty string if not provided
    },
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Project', ProjectSchema);