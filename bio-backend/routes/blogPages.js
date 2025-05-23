const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost'); // Make sure this path is correct
const { protect, adminOnly } = require('../middleware/authMiddleware'); // Make sure this path is correct

// --- Public Routes ---

// GET /api/blog/public (Get all PUBLISHED blog posts, sorted by order, then date)
router.get('/public', async (req, res) => {
    try {
        const posts = await BlogPost.find({ status: 'published' })
            .sort({ order: 1, publishedAt: -1, createdAt: -1 }); // <<< UPDATED SORT
        res.json(posts);
    } catch (err) {
        console.error('Error fetching published blog posts:', err.message);
        res.status(500).send('Server Error');
    }
});

// GET /api/blog/public/:slug (Get a single PUBLISHED blog post by slug)
router.get('/public/:slug', async (req, res) => {
    try {
        const post = await BlogPost.findOne({ slug: req.params.slug, status: 'published' });
        if (!post) {
            return res.status(404).json({ msg: 'Blog post not found or not published' });
        }
        res.json(post);
    } catch (err) {
        console.error(`Error fetching blog post by slug ${req.params.slug}:`, err.message);
        res.status(500).send('Server Error');
    }
});


// --- Admin Routes (Protected) ---

// POST /api/blog (Create a new blog post - include order)
router.post('/', protect, adminOnly, async (req, res) => {
    // Destructure order from req.body
    const { title, slug, summary, content, featuredImageUrl, tags, status, youtubeLink, spotifyLink, order } = req.body;
    try {
        if (!title || !content) {
            return res.status(400).json({ msg: 'Please include at least a title and content' });
        }
        let postSlug = slug;
        if (!postSlug && title) {
            postSlug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        }
        if (!postSlug) {
            return res.status(400).json({ msg: 'Slug is required or could not be generated from title.' });
        }
        const existingPost = await BlogPost.findOne({ slug: postSlug });
        if (existingPost) {
            return res.status(400).json({ msg: 'Slug already exists. Please use a unique slug.' });
        }

        const newPost = new BlogPost({
            title, slug: postSlug, summary, content, featuredImageUrl,
            tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : [],
            status: status || 'draft',
            author: req.user.username,
            youtubeLink, spotifyLink,
            order // <<< Pass the order field
        });

        const post = await newPost.save();
        res.status(201).json(post);
    } catch (err) {
        console.error('Error creating blog post:', err.message);
        if (err.code === 11000 && err.keyPattern && err.keyPattern.slug) {
             return res.status(400).json({ msg: 'Slug already exists. Please use a unique slug.' });
        }
        res.status(500).send('Server Error');
    }
});

// GET /api/blog/all (Admin - Get all posts, sorted by order, then date)
router.get('/all', protect, adminOnly, async (req, res) => {
    try {
        const posts = await BlogPost.find().sort({ order: 1, createdAt: -1 }); // <<< UPDATED SORT
        res.json(posts);
    } catch (err) {
        console.error('Error fetching all blog posts for admin:', err.message);
        res.status(500).send('Server Error');
    }
});

// GET /api/blog/:id (Admin - Get single post by ID)
router.get('/:id', protect, adminOnly, async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Blog post not found' });
        }
        res.json(post);
    } catch (err) {
        console.error(`Error fetching blog post by ID ${req.params.id}:`, err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Blog post not found (invalid ID format)' });
        }
        res.status(500).send('Server Error');
    }
});


// PUT /api/blog/:id (Update a blog post - include order)
router.put('/:id', protect, adminOnly, async (req, res) => {
    // Destructure order from req.body
    const { title, slug, summary, content, featuredImageUrl, tags, status, youtubeLink, spotifyLink, order } = req.body;

    const postFields = {};
    if (title !== undefined) postFields.title = title;
    if (slug !== undefined) postFields.slug = slug.toLowerCase().replace(/\s+/g, '-');
    if (summary !== undefined) postFields.summary = summary;
    if (content !== undefined) postFields.content = content;
    if (featuredImageUrl !== undefined) postFields.featuredImageUrl = featuredImageUrl;
    if (tags !== undefined) {
        postFields.tags = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : []);
    }
    if (status !== undefined) postFields.status = status;
    if (youtubeLink !== undefined) postFields.youtubeLink = youtubeLink;
    if (spotifyLink !== undefined) postFields.spotifyLink = spotifyLink;
    if (order !== undefined) postFields.order = order; // <<< Add order to postFields

    // ... (publishedAt logic as before) ...
    if (status === 'published') {
        const existingPostForDateCheck = await BlogPost.findById(req.params.id);
        if (existingPostForDateCheck && !existingPostForDateCheck.publishedAt) {
             postFields.publishedAt = new Date();
        } else if (existingPostForDateCheck && existingPostForDateCheck.status !== 'published') {
            postFields.publishedAt = new Date();
        }
    }
    
    try {
        // ... (find post and slug uniqueness check as before) ...
        let post = await BlogPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Blog post not found' });
        }
        if (postFields.slug && postFields.slug !== post.slug) {
            const existingPostWithNewSlug = await BlogPost.findOne({ slug: postFields.slug, _id: { $ne: req.params.id } });
            if (existingPostWithNewSlug) {
                return res.status(400).json({ msg: 'New slug already exists. Please use a unique slug.' });
            }
        }

        post = await BlogPost.findByIdAndUpdate(
            req.params.id,
            { $set: postFields },
            { new: true, runValidators: true }
        );
        res.json(post);
    } catch (err) {
        console.error(`Error updating blog post ${req.params.id}:`, err.message);
        if (err.code === 11000 && err.keyPattern && err.keyPattern.slug) {
             return res.status(400).json({ msg: 'Slug already exists. Please use a unique slug.' });
        }
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Blog post not found (invalid ID format)' });
        }
        res.status(500).send('Server Error');
    }
});

// DELETE /api/blog/:id (Delete a blog post)
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Blog post not found' });
        }
        await BlogPost.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Blog post removed successfully' });
    } catch (err) {
        console.error(`Error deleting blog post ${req.params.id}:`, err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Blog post not found (invalid ID format)' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;