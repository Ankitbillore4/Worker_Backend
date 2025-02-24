const Worker = require('../models/Worker');

// ✅ Get all workers
exports.getWorkers = async (req, res) => {
    try {
        const workers = await Worker.find();
        res.status(200).json(workers);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// ✅ Get a single worker by ID
exports.getWorkerById = async (req, res) => {
    try {
        const worker = await Worker.findById(req.params.id);
        if (!worker) return res.status(404).json({ message: 'Worker not found' });
        res.status(200).json(worker);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// ✅ Create a new worker
exports.createWorker = async (req, res) => {
    try {
        const { name, phone, skill, location, experience } = req.body;
        const worker = new Worker({ name, phone, skill, location, experience });
        await worker.save();
        res.status(201).json(worker);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// ✅ Update an existing worker
exports.updateWorker = async (req, res) => {
    try {
        const worker = await Worker.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!worker) return res.status(404).json({ message: 'Worker not found' });
        res.status(200).json(worker);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// ✅ Delete a worker
exports.deleteWorker = async (req, res) => {
    try {
        const worker = await Worker.findByIdAndDelete(req.params.id);
        if (!worker) return res.status(404).json({ message: 'Worker not found' });
        res.status(200).json({ message: 'Worker deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
