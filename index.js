const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());  // For parsing JSON bodies
app.use(morgan('dev'));   // For logging requests
app.use(cors());          // Enable cross-origin requests

// Routes
app.get('/', (req, res) => {
    res.send("Welcome to Bravonet. Powered by Team Bravo")
})
app.use('/api/auth', authRoutes); // Authentication-related routes
app.use('/api/users', userRoutes); // User-related routes

// Error handling middleware (catch-all)
app.use(errorMiddleware);

// Start the server
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
// Connect to MongoDB
mongoose.connect(process.env.DB_URI)
    .then(() => {
        console.log('Database connected');

    })

    .catch((error) => {
        console.error('Database connection error:', error);
    });
