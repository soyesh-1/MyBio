const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET all projects (no change needed here for new fields)
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ order: 1, createdAt: -1 });
        res.json(projects);
    } catch (err) {
        console.error('Error in GET /api/projects:', err.message);
        res.status(500).send('Server Error');
    }
});

// POST a new project (handles new fields)
router.post('/', protect, adminOnly, async (req, res) => {
    // Destructure new fields from req.body
    const { title, description, imageUrl, tags, liveLink, githubLink, spotifyLink, youtubeLink, order } = req.body;
    try {
        if (!title || !description) {
            return res.status(400).json({ msg: 'Please include a title and description' });
        }
        const newProject = new Project({
            title, description, imageUrl,
            tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : [],
            liveLink, githubLink,
            spotifyLink, // <<< Add to new Project instance
            youtubeLink, // <<< Add to new Project instance
            order
        });
        const project = await newProject.save();
        res.status(201).json(project);
    } catch (err) {
        console.error('Error in POST /api/projects:', err.message);
        res.status(500).send('Server Error');
    }
});

// GET a single project by ID (no change needed here for new fields)
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }
        res.json(project);
    } catch (err) {
        console.error(`Error in GET /api/projects/${req.params.id}:`, err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Project not found (invalid ID format)' });
        }
        res.status(500).send('Server Error');
    }
});

// PUT (Update) a project by ID (handles new fields)
router.put('/:id', protect, adminOnly, async (req, res) => {
    // Destructure new fields from req.body
    const { title, description, imageUrl, tags, liveLink, githubLink, spotifyLink, youtubeLink, order } = req.body;
    
    const projectFields = {};
    if (title !== undefined) projectFields.title = title;
    if (description !== undefined) projectFields.description = description;
    if (imageUrl !== undefined) projectFields.imageUrl = imageUrl;
    if (tags !== undefined) {
        projectFields.tags = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : []);
    }
    if (liveLink !== undefined) projectFields.liveLink = liveLink;
    if (githubLink !== undefined) projectFields.githubLink = githubLink;
    if (spotifyLink !== undefined) projectFields.spotifyLink = spotifyLink; // <<< Add to projectFields
    if (youtubeLink !== undefined) projectFields.youtubeLink = youtubeLink; // <<< Add to projectFields
    if (order !== undefined) projectFields.order = order;

    try {
        let project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }
        project = await Project.findByIdAndUpdate(
            req.params.id,
            { $set: projectFields },
            { new: true, runValidators: true }
        );
        res.json(project);
    } catch (err) {
        console.error(`Error in PUT /api/projects/${req.params.id}:`, err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Project not found (invalid ID format)' });
        }
        res.status(500).send('Server Error');
    }
});

// DELETE a project by ID (no change needed here for new fields)
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }
        await Project.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Project removed successfully' });
    } catch (err) {
        console.error(`Error in DELETE /api/projects/${req.params.id}:`, err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Project not found (invalid ID format)' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;