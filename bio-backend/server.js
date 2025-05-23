// server.js
require('dotenv').config(); // Load environment variables from .env file

// --- Debugging Lines ---
console.log('--- Dotenv Debug ---');
if (process.env.NODE_ENV !== 'production' && require('dotenv').config().error) {
  console.error('Error loading .env file:', require('dotenv').config().error);
}
const parsedEnv = require('dotenv').config().parsed || {};
console.log('Parsed .env content by dotenv:', parsedEnv);
console.log('--------------------');
console.log('MONGODB_URI from process.env:', process.env.MONGODB_URI);
console.log('PORT from process.env:', process.env.PORT);
console.log('JWT_SECRET from process.env:', process.env.JWT_SECRET);
// --- End Debugging Lines ---

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads/cv', express.static(path.join(__dirname, 'uploads/cv')));

const PORT = process.env.PORT || 5001;
const MONGODB_URI_FROM_ENV = process.env.MONGODB_URI;

if (!MONGODB_URI_FROM_ENV) {
    console.error('FATAL ERROR: MONGODB_URI is not defined in your .env file.');
    console.error('Please ensure your .env file is in the project root and contains MONGODB_URI=your_connection_string');
    process.exit(1);
}

mongoose.connect(MONGODB_URI_FROM_ENV)
.then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
})
.catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error.message);
});

app.get('/', (req, res) => {
    res.send('Hello from the Bio Website Backend!');
});

// --- API Routes ---
const projectRoutes = require('./routes/projects');
const authRoutes = require('./routes/auth');
const cvRoutes = require('./routes/cv');
const blogPostRoutes = require('./routes/blogPages');
const profileRoutes = require('./routes/profile');

app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/blog', blogPostRoutes);
app.use('/api/profile', profileRoutes);

app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});