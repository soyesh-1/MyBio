const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Your User model

// @route   POST /api/auth/register
// @desc    Register a new admin user (for initial setup - you might want to remove or protect this later)
// @access  Public (for now, for simplicity of creating the first admin)
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Simple validation
        if (!username || !password) {
            return res.status(400).json({ msg: 'Please provide username and password' });
        }
        if (password.length < 6) {
            return res.status(400).json({ msg: 'Password must be at least 6 characters' });
        }

        user = new User({
            username,
            password // Password will be hashed by the pre-save hook in User.js model
        });

        await user.save();

        // For registration, you might not want to send a token immediately,
        // or you might. For simplicity, we'll just send a success message.
        res.status(201).json({ msg: 'Admin user registered successfully' });

    } catch (err) {
        console.error('Error during registration:', err.message);
        res.status(500).send('Server Error');
    }
});


// @route   POST /api/auth/login
// @desc    Authenticate admin user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials (user not found)' });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials (password incorrect)' });
        }

        // User matched, create JWT payload
        const payload = {
            user: {
                id: user.id, // User ID from MongoDB
                username: user.username,
                isAdmin: user.isAdmin // You can include other non-sensitive info
            }
        };

        // Sign the token
        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Your secret key from .env
            { expiresIn: '5h' }, // Token expiration (e.g., 5 hours)
            (err, token) => {
                if (err) throw err;
                res.json({ token }); // Send token to client
            }
        );

    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;