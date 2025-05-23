const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Blog post title is required'],
        trim: true,
        maxlength: [150, 'Title cannot be more than 150 characters']
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    summary: {
        type: String,
        trim: true,
        maxlength: [300, 'Summary cannot be more than 300 characters']
    },
    content: {
        type: String,
        required: [true, 'Blog post content is required']
    },
    featuredImageUrl: {
        type: String,
        trim: true
    },
    author: {
        type: String,
        required: false
    },
    tags: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    youtubeLink: {
        type: String,
        trim: true,
        default: ''
    },
    spotifyLink: {
        type: String,
        trim: true,
        default: ''
    },
    order: { // <<< ADD THIS FIELD
        type: Number,
        default: 0 // Lower numbers can appear first
    },
    publishedAt: {
        type: Date
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

BlogPostSchema.pre('save', function(next) {
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    if ((this.isNew || this.isModified('title')) && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '');
    } else if (this.isModified('slug')) {
         this.slug = this.slug
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '');
    }
    next();
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);