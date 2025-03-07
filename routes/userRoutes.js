const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ensure you have a User model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load .env variables

// ✅ User Registration Route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if all fields are provided
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({ name, email, password: hashedPassword, phone });
        await user.save();

        console.log("New User Registered:", user);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ User Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if both fields are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log("Login Failed: User not found");
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Login Failed: Incorrect password");
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not defined in .env");
            return res.status(500).json({ message: "Internal Server Error" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        console.log("User Logged In:", user.email);
        res.json({ message: "Login successful", token, user });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Update User Route
router.put('/:id', async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const userId = req.params.id;

        // Check if user exists
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user fields
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;

        await user.save();
        res.json({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Delete User Route
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if user exists
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndDelete(userId);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;






// ✅ User Registration Route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if all fields are provided
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({ name, email, password: hashedPassword, phone });
        await user.save();

        console.log("New User Registered:", user);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});