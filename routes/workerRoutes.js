const express = require("express");
const router = express.Router();
const Worker = require("../models/Worker");

// ✅ Add Worker Route
router.post("/", async (req, res) => {
    console.log("Incoming Request Body:", req.body);
  const { name, phone, skill, location } = req.body;

  if (!name || !phone || !skill || !location) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newWorker = new Worker({ name, phone, skill, location });
    await newWorker.save();
    res.status(201).json({ message: "Worker added successfully", worker: newWorker });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
