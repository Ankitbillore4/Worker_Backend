const express = require("express");
const router = express.Router();
const Contractor = require("../models/Contractor");
const protect = require("../middlewares/authMiddleware");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Contractor Register Route (Public)
router.post("/register", async (req, res) => {
    console.log("Incoming Request Body:", req.body);

    const { name, email, password, phone, location, experience } = req.body;

    if (!name || !email || !password || !phone || !location || !experience) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if contractor already exists
        let contractor = await Contractor.findOne({ email });
        if (contractor) {
            return res.status(400).json({ message: "Contractor already exists" });
        }

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new contractor
        contractor = new Contractor({
            name,
            email,
            password: hashedPassword,
            phone,
            location,
            experience
        });

        await contractor.save();

        // Generate JWT token
        const token = jwt.sign({ id: contractor._id, role: "contractor" }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({ message: "Contractor registered successfully", Contractor, token });
    } catch (error) {
        console.error("Error registering contractor:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Contractor Login Route (Public)
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Find contractor by email
        const contractor = await Contractor.findOne({ email });
        if (!contractor) {
            return res.status(400).json({ message: "Invalid Email or Password err" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, contractor.password);
        // const isMatch = await contractor.comparePassword(password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Email or Password pp" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: contractor._id, role: "contractor" }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).cookie("token", token).json({ message: "Login successful", contractor, token });
    } catch (error) {
        console.error("Error logging in contractor:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// ✅ Get All Contractors Route (Public)
router.get("/", async (req, res) => {
    try {
        const contractors = await Contractor.find();
        res.status(200).json(contractors);
    } catch (error) {
        console.error("Error fetching contractors:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Get Contractor by ID Route (Public)
router.get("/:id", async (req, res) => {
    try {
        const contractor = await Contractor.findById(req.params.id);
        if (!contractor) {
            return res.status(404).json({ message: "Contractor not found" });
        }
        res.status(200).json(contractor);
    } catch (error) {
        console.error("Error fetching contractor:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Update Contractor Route (Protected: Only Contractor or Admin)
router.put("/:id", protect, async (req, res) => {
    try {
        const contractor = await Contractor.findById(req.params.id);
        if (!contractor) {
            return res.status(404).json({ message: "Contractor not found" });
        }

        if (req.user.id !== contractor._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Only the contractor or admin can update details." });
        }

        const updatedContractor = await Contractor.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.status(200).json({ message: "Contractor updated successfully", contractor: updatedContractor });
    } catch (error) {
        console.error("Error updating contractor:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Delete Contractor Route (Protected: Only Admin)
router.delete("/:id", protect, async (req, res) => {
    try {
        const contractor = await Contractor.findById(req.params.id);
        if (!contractor) {
            return res.status(404).json({ message: "Contractor not found" });
        }

        if (req.user.id !== contractor._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Only the contractor or admin can update details." });
        } 
 
        await Contractor.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Contractor deleted successfully" });
    } catch (error) {
        console.error("Error deleting contractor:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// ✅ Search Contractors based on filters
router.get('/search', async (req, res) => {
    try {
        const { location, experience, minCharges, maxCharges } = req.query;

        let query = {};

        if (location) query.location = { $regex: new RegExp(location, 'i') };
        if (experience) query.experience = { $gte: Number(experience) };
        if (minCharges && maxCharges) {
            query.meetingCharges = { $gte: Number(minCharges), $lte: Number(maxCharges) };
        } else if (minCharges) {
            query.meetingCharges = { $gte: Number(minCharges) };
        } else if (maxCharges) {
            query.meetingCharges = { $lte: Number(maxCharges) };
        }

        const contractors = await Contractor.find(query);
        res.json({ success: true, contractors });
    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router;
 