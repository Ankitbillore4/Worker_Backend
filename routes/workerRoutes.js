const express = require("express");
const router = express.Router();
const Worker = require("../models/Worker");

// ✅ Add Worker Route
router.post("/", async (req, res) => {
    console.log("Incoming Request Body:", req.body);

    const { name, phone, skill, location, experience } = req.body;
    console.log("Experience Type:", typeof experience);

    if (!name || !phone || !skill || !location || !experience) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newWorker = new Worker({ name, phone, skill, location, experience });
        await newWorker.save();
        res.status(201).json({ message: "Worker added successfully", worker: newWorker });
    } catch (error) {
        console.error("Error saving worker:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Get All Workers Route
router.get("/", async (req, res) => {
    try {
        const workers = await Worker.find();
        res.status(200).json(workers);
    } catch (error) {
        console.error("Error fetching workers:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Get Worker by ID Route (FIXED)
router.get("/:id", async (req, res) => {
    try {
        const worker = await Worker.findById(req.params.id);
        if (!worker) {
            return res.status(404).json({ message: "Worker not found" });
        }
        res.status(200).json(worker);
    } catch (error) {
        console.error("Error fetching worker:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Update Worker Route (by ID)
router.put("/:id", async (req, res) => {
    try {
        const updatedWorker = await Worker.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!updatedWorker) {
            return res.status(404).json({ message: "Worker not found" });
        }

        res.status(200).json({ message: "Worker updated successfully", worker: updatedWorker });
    } catch (error) {
        console.error("Error updating worker:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Delete Worker Route (by ID)
router.delete("/:id", async (req, res) => {
    try {
        const deletedWorker = await Worker.findByIdAndDelete(req.params.id);

        if (!deletedWorker) {
            return res.status(404).json({ message: "Worker not found" });
        }

        res.status(200).json({ message: "Worker deleted successfully" });
    } catch (error) {
        console.error("Error deleting worker:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
