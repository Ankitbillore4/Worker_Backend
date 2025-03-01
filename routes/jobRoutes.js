const express = require('express');
const { createJob, getJobs } = require('../controllers/jobController');
const protect = require("../middlewares/authMiddleware"); // No destructuring

const router = express.Router();

// ✅ Route to create a new job (Protected for Users & Contractors)
router.post('/create', protect, async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: "Title and Description are required" });
        }

        // ✅ Only Contractors can create jobs
        if (req.user.role !== "contractor") {
            return res.status(403).json({ message: "Access denied. Only contractors can create jobs." });
        }

        await createJob(req, res);
    } catch (error) {
        console.error("Error in job creation:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Route to fetch all jobs (Public)
router.get('/list', async (req, res) => {
    try {
        await getJobs(req, res);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
