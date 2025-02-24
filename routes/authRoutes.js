const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// ✅ User Register
router.post("/register", async (req, res) => {
    const { name, email, password, isAdmin } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, isAdmin });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
});

// ✅ User Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Generate JWT Token
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, "your_secret_key", { expiresIn: "1h" });

    res.json({ token });
});

module.exports = router;
