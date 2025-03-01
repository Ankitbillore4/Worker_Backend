const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Contractor = require("../models/Contractor");

const router = express.Router();

// ✅ User or Contractor Register
router.post("/register", async (req, res) => {
    console.log("Incoming Request Body:", req.body); // Debugging ke liye

    const { name, email, password, phone, role, location, experience, isAdmin } = req.body;

    // ✅ Validate required fields
    if (!name || !email || !password || !phone) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if user or contractor already exists
    const userExists = await User.findOne({ email });
    const contractorExists = await Contractor.findOne({ email });

    if (userExists || contractorExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "contractor") {
        // ✅ Register as Contractor
        if (!location || !experience) {
            return res.status(400).json({ message: "Contractor must provide location and experience" });
        }

        const newContractor = new Contractor({
            name,
            email,
            password: hashedPassword,
            phone,
            location,
            experience,
            role: "contractor" // ✅ Ensure the role is always "contractor"
        });

        await newContractor.save();
        return res.status(201).json({ message: "Contractor registered successfully" });
    } else {
        // ✅ Register as Normal User
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            role: "user", // ✅ Ensure the role is always "user"
            isAdmin: isAdmin || false
        });

        await newUser.save();
        return res.status(201).json({ message: "User registered successfully" });
    }
});

// ✅ User or Contractor Login
router.post("/login", async (req, res) => {
    console.log("Incoming Request Body:", req.body); // Debugging ke liye

    const { email, password } = req.body;

    // ✅ Validate fields
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if User or Contractor exists
    let user = await User.findOne({ email });
    let contractor = await Contractor.findOne({ email });

    if (!user && !contractor) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Identify the correct user type
    const account = user || contractor;
    
    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Generate JWT Token
    const token = jwt.sign(
        { id: account._id, role: account.role, isAdmin: account.isAdmin || false },
        "your_secret_key",
        { expiresIn: "1h" }
    );

    res.json({ token, role: account.role, message: "Login successful" });
});

module.exports = router;
