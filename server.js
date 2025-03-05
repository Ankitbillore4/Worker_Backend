const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');

// Load environment variables from .env file
dotenv.config();
 
// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS

// Enable Morgan logging only in development mode
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// ✅ Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/contractors', require('./routes/contractorRoutes'));
app.use('/api/users', require('./routes/userRoutes')); // ✅ Added User Routes

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(err.status || 500).json({ 
        message: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }) // Show stack trace only in development
    });
});

// ✅ Catch-All Route for Undefined Routes
app.use('*', (req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
