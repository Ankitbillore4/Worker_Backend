const Job = require('../models/Job');

exports.createJob = async (req, res) => {
    try {
        const { title, description, location, budget } = req.body;
        const newJob = new Job({ title, description, location, budget, contractor: req.user.id });
        await newJob.save();
        res.status(201).json({ message: 'Job created successfully', job: newJob });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('contractor', 'name email');
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
